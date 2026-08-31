from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.contract import Contract, ContractStatus, LifecycleStatus
from app.models.extracted_fields import ExtractedFields
from app.models.user import User
from app.schemas.contract import ContractOut, LifecycleUpdateIn
from app.api.deps import get_current_user
from app.core.storage import save_file
from app.services.Documents.text_extraction import extract_contract_text
from app.services.Documents.contract_fieds_extraction import extract_contract_fields

router = APIRouter(prefix="/contracts", tags=["contracts"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}

# ──────────────────────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────────────────────

def _base_query(db: Session):
    """Return a query pre-loaded with extracted_fields."""
    return (
        db.query(Contract)
        .options(joinedload(Contract.extracted_fields))
    )


# ──────────────────────────────────────────────────────────────────────────────
# UPLOAD
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/upload", response_model=ContractOut)
async def upload_contract(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and Word files are allowed")

    file_bytes = await file.read()
    file_path = save_file(file_bytes, file.filename)

    contract = Contract(
        file_name=file.filename,
        file_path=file_path,
        uploaded_by=current_user.id,
        status=ContractStatus.uploaded,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    # --- Run extraction synchronously ---
    contract.status = ContractStatus.processing
    db.commit()

    try:
        contract_text = extract_contract_text(file_path)

        if not contract_text or len(contract_text) < 20:
            raise ValueError("No extractable text found in document")

        contract.raw_text = contract_text

        extracted_data = extract_contract_fields(contract.raw_text)

        extracted_fields = ExtractedFields(
            contract_id=contract.id,
            parties=extracted_data.get("parties"),
            effective_date=extracted_data.get("effective_date"),
            expiry_date=extracted_data.get("expiry_date"),
            value=extracted_data.get("value"),
            currency=extracted_data.get("currency"),
            governing_law=extracted_data.get("governing_law"),
            renewal_terms=extracted_data.get("renewal_terms"),
            key_clauses=extracted_data.get("key_clauses"),
        )
        db.add(extracted_fields)
        contract.status = ContractStatus.extracted

    except Exception as e:
        contract.status = ContractStatus.failed
        print(f"Extraction failed for contract {contract.id}: {e}")

    db.commit()
    db.refresh(contract)

    return contract


# ──────────────────────────────────────────────────────────────────────────────
# LIST — ALL CONTRACTS
# ──────────────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _base_query(db)
        .order_by(Contract.uploaded_at.desc())
        .all()
    )


# ──────────────────────────────────────────────────────────────────────────────
# STARRED CONTRACTS
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/starred", response_model=List[ContractOut])
def list_starred_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Contracts the user has explicitly starred."""
    return (
        _base_query(db)
        .filter(Contract.is_starred == True)
        .order_by(Contract.uploaded_at.desc())
        .all()
    )


@router.patch("/{contract_id}/star", response_model=ContractOut)
def toggle_star(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle the starred status of a contract."""
    contract = (
        _base_query(db)
        .filter(Contract.id == contract_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract.is_starred = not contract.is_starred
    db.commit()
    db.refresh(contract)
    return contract


# ──────────────────────────────────────────────────────────────────────────────
# ACTIVE CONTRACTS  (effective_date ≤ today ≤ expiry_date)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/active", response_model=List[ContractOut])
def list_active_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Contracts currently in force: effective_date ≤ today ≤ expiry_date."""
    today = date.today()
    return (
        _base_query(db)
        .join(ExtractedFields, Contract.id == ExtractedFields.contract_id)
        .filter(
            ExtractedFields.effective_date <= today,
            ExtractedFields.expiry_date >= today,
        )
        .order_by(ExtractedFields.expiry_date.asc())
        .all()
    )


# ──────────────────────────────────────────────────────────────────────────────
# UPCOMING DEADLINES  (expiring in next 90 days)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/upcoming", response_model=List[ContractOut])
def list_upcoming_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Contracts whose expiry_date falls within the next 90 days."""
    today = date.today()
    cutoff = today + timedelta(days=90)
    return (
        _base_query(db)
        .join(ExtractedFields, Contract.id == ExtractedFields.contract_id)
        .filter(
            ExtractedFields.expiry_date >= today,
            ExtractedFields.expiry_date <= cutoff,
        )
        .order_by(ExtractedFields.expiry_date.asc())
        .all()
    )


# ──────────────────────────────────────────────────────────────────────────────
# EXECUTED CONTRACTS
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/executed", response_model=List[ContractOut])
def list_executed_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Contracts that have been fully executed/signed."""
    return (
        _base_query(db)
        .filter(Contract.lifecycle_status == LifecycleStatus.executed)
        .order_by(Contract.uploaded_at.desc())
        .all()
    )


# ──────────────────────────────────────────────────────────────────────────────
# UPDATE LIFECYCLE STATUS
# ──────────────────────────────────────────────────────────────────────────────

@router.patch("/{contract_id}/lifecycle", response_model=ContractOut)
def update_lifecycle(
    contract_id: str,
    body: LifecycleUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Set the lifecycle stage of a contract (draft → active → executed → ...)."""
    contract = (
        _base_query(db)
        .filter(Contract.id == contract_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract.lifecycle_status = body.lifecycle_status
    db.commit()
    db.refresh(contract)
    return contract


# ──────────────────────────────────────────────────────────────────────────────
# GET SINGLE CONTRACT  (keep last so static paths above win)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/{contract_id}", response_model=ContractOut)
def get_contract(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = (
        _base_query(db)
        .filter(Contract.id == contract_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract