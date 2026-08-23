from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.models.contract_versions import ContractVersion


def ensure_initial_version(db: Session, contract_id) -> ContractVersion:
    """
    Every contract you've created so far (Phases 1-4) has raw_text but
    ZERO rows in contract_versions -- this feature didn't exist yet when
    they were created. Rather than requiring a separate backfill script
    run once, this lazily creates "version 1" from the contract's CURRENT
    raw_text the first time anyone tries to view/diff versions for it.
    Idempotent -- if a version 1 already exists, does nothing.
    """
    existing = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id)
        .order_by(ContractVersion.version_number)
        .first()
    )
    if existing:
        return existing

    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")
    if not contract.raw_text:
        raise ValueError(f"Contract {contract_id} has no raw_text to version")

    version = ContractVersion(
        contract_id=contract_id,
        version_number=1,
        raw_text=contract.raw_text,
        created_by=contract.uploaded_by,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def create_version(db: Session, contract_id, raw_text: str, user_id=None) -> ContractVersion:
    """
    Saves a new version -- e.g. after receiving a redlined/negotiated
    draft back from a counterparty. Auto-increments version_number based
    on the highest existing version for this contract (bootstrapping
    version 1 first if none exist yet).
    """
    ensure_initial_version(db, contract_id)

    latest = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id)
        .order_by(ContractVersion.version_number.desc())
        .first()
    )
    next_number = (latest.version_number + 1) if latest else 1

    version = ContractVersion(
        contract_id=contract_id,
        version_number=next_number,
        raw_text=raw_text,
        created_by=user_id,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def get_versions(db: Session, contract_id) -> list[ContractVersion]:
    ensure_initial_version(db, contract_id)
    return (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id)
        .order_by(ContractVersion.version_number)
        .all()
    )