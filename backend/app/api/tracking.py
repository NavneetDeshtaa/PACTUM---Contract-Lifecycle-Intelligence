import uuid
from typing import List, Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.contract import Contract
from app.models.renewal_obligation import RenewalObligation
from app.services.Tracking.orchestrator import get_or_create_obligations, mark_complete

# Contract-scoped router: /contracts/{contract_id}/obligations...
router = APIRouter(prefix="/contracts", tags=["tracking"])

# Global obligations router: /obligations...
obligations_router = APIRouter(prefix="/obligations", tags=["obligations"])
upcoming_router = obligations_router  # backward compatibility with main.py


# ──────────────────────────────────────────────────────────────────────────────
# SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class ObligationOut(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    contract_file_name: Optional[str] = None
    item_type: str
    title: str
    description: Optional[str] = None
    due_date: date
    notice_period_days: Optional[int] = None
    is_completed: bool
    generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ObligationCreateIn(BaseModel):
    item_type: str = "obligation"  # "obligation" | "renewal"
    title: str
    description: Optional[str] = None
    due_date: date
    notice_period_days: Optional[int] = None


class ObligationStatsOut(BaseModel):
    total: int
    upcoming: int
    overdue: int
    completed: int
    completion_rate: float


def _enrich_obligation(ob: RenewalObligation) -> ObligationOut:
    return ObligationOut(
        id=ob.id,
        contract_id=ob.contract_id,
        contract_file_name=ob.contract.file_name if ob.contract else None,
        item_type=ob.item_type,
        title=ob.title,
        description=ob.description,
        due_date=ob.due_date,
        notice_period_days=ob.notice_period_days,
        is_completed=ob.is_completed,
        generated_at=ob.generated_at,
    )


# ──────────────────────────────────────────────────────────────────────────────
# GLOBAL OBLIGATIONS ENDPOINTS (/obligations)
# ──────────────────────────────────────────────────────────────────────────────

@obligations_router.get("", response_model=List[ObligationOut])
def list_all_obligations(
    item_type: Optional[str] = None,
    is_completed: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List all obligations across all contracts with contract metadata."""
    query = (
        db.query(RenewalObligation)
        .options(joinedload(RenewalObligation.contract))
    )

    if item_type:
        query = query.filter(RenewalObligation.item_type == item_type)
    if is_completed is not None:
        query = query.filter(RenewalObligation.is_completed == is_completed)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (RenewalObligation.title.ilike(search_pattern)) |
            (RenewalObligation.description.ilike(search_pattern))
        )

    items = query.order_by(RenewalObligation.due_date.asc()).all()
    return [_enrich_obligation(item) for item in items]


@obligations_router.get("/stats", response_model=ObligationStatsOut)
def get_obligation_stats(db: Session = Depends(get_db)):
    """Calculate aggregate summary stats for obligations."""
    today = date.today()
    cutoff_90 = today + timedelta(days=90)

    all_items = db.query(RenewalObligation).all()
    total = len(all_items)
    completed = sum(1 for item in all_items if item.is_completed)
    overdue = sum(
        1 for item in all_items
        if not item.is_completed and item.due_date < today
    )
    upcoming = sum(
        1 for item in all_items
        if not item.is_completed and today <= item.due_date <= cutoff_90
    )
    completion_rate = (completed / total * 100.0) if total > 0 else 0.0

    return ObligationStatsOut(
        total=total,
        upcoming=upcoming,
        overdue=overdue,
        completed=completed,
        completion_rate=round(completion_rate, 1),
    )


@obligations_router.get("/upcoming", response_model=List[ObligationOut])
def list_upcoming_obligations(
    days: int = Query(default=90, ge=1, le=365),
    db: Session = Depends(get_db),
):
    """List obligations due between today and today + days."""
    today = date.today()
    cutoff = today + timedelta(days=days)

    items = (
        db.query(RenewalObligation)
        .options(joinedload(RenewalObligation.contract))
        .filter(
            RenewalObligation.due_date >= today,
            RenewalObligation.due_date <= cutoff,
            RenewalObligation.is_completed == False,
        )
        .order_by(RenewalObligation.due_date.asc())
        .all()
    )
    return [_enrich_obligation(item) for item in items]


@obligations_router.get("/overdue", response_model=List[ObligationOut])
def list_overdue_obligations(db: Session = Depends(get_db)):
    """List uncompleted obligations whose due date has passed."""
    today = date.today()

    items = (
        db.query(RenewalObligation)
        .options(joinedload(RenewalObligation.contract))
        .filter(
            RenewalObligation.due_date < today,
            RenewalObligation.is_completed == False,
        )
        .order_by(RenewalObligation.due_date.asc())
        .all()
    )
    return [_enrich_obligation(item) for item in items]


@obligations_router.get("/completed", response_model=List[ObligationOut])
def list_completed_obligations(db: Session = Depends(get_db)):
    """List fulfilled/completed obligations."""
    items = (
        db.query(RenewalObligation)
        .options(joinedload(RenewalObligation.contract))
        .filter(RenewalObligation.is_completed == True)
        .order_by(RenewalObligation.due_date.desc())
        .all()
    )
    return [_enrich_obligation(item) for item in items]


@obligations_router.patch("/{obligation_id}/toggle", response_model=ObligationOut)
def toggle_obligation_status(
    obligation_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """Toggle is_completed on an obligation."""
    ob = (
        db.query(RenewalObligation)
        .options(joinedload(RenewalObligation.contract))
        .filter(RenewalObligation.id == obligation_id)
        .first()
    )
    if not ob:
        raise HTTPException(status_code=404, detail="Obligation not found")

    ob.is_completed = not ob.is_completed
    db.commit()
    db.refresh(ob)
    return _enrich_obligation(ob)


# ──────────────────────────────────────────────────────────────────────────────
# CONTRACT-SCOPED OBLIGATIONS ENDPOINTS (/contracts/{contract_id}/obligations)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/{contract_id}/obligations", response_model=List[ObligationOut])
def get_contract_obligations(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        items = get_or_create_obligations(db, contract_id)
        # Re-fetch with joined contract to populate file_name
        return [
            _enrich_obligation(item) for item in items
        ]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{contract_id}/obligations", response_model=ObligationOut)
def create_manual_obligation(
    contract_id: uuid.UUID,
    payload: ObligationCreateIn,
    db: Session = Depends(get_db),
):
    """Manually add an obligation to a contract."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    ob = RenewalObligation(
        contract_id=contract_id,
        item_type=payload.item_type,
        title=payload.title,
        description=payload.description or "",
        due_date=payload.due_date,
        notice_period_days=payload.notice_period_days,
        is_completed=False,
        source_text_hash="manual_entry",
    )
    db.add(ob)
    db.commit()
    db.refresh(ob)
    return _enrich_obligation(ob)


@router.post("/{contract_id}/obligations/regenerate", response_model=List[ObligationOut])
def regenerate_contract_obligations(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        items = get_or_create_obligations(db, contract_id, force=True)
        return [_enrich_obligation(item) for item in items]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/{contract_id}/obligations/{obligation_id}/complete", response_model=ObligationOut)
def complete_contract_obligation(
    contract_id: uuid.UUID,
    obligation_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    try:
        ob = mark_complete(db, obligation_id, completed=True)
        return _enrich_obligation(ob)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{contract_id}/obligations/{obligation_id}")
def delete_contract_obligation(
    contract_id: uuid.UUID,
    obligation_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    ob = (
        db.query(RenewalObligation)
        .filter(
            RenewalObligation.id == obligation_id,
            RenewalObligation.contract_id == contract_id,
        )
        .first()
    )
    if not ob:
        raise HTTPException(status_code=404, detail="Obligation not found")

    db.delete(ob)
    db.commit()
    return {"message": "Obligation deleted successfully"}