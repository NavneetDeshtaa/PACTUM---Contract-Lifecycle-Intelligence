import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.contract_template import ContractTemplate
from app.services.Draft_Generation.orchestrator import create_draft_contract

router = APIRouter(prefix="/contracts", tags=["drafts"])
templates_router = APIRouter(prefix="/templates", tags=["drafts"])


class TemplateResponse(BaseModel):
    id: uuid.UUID
    name: str
    contract_type: str
    description: Optional[str] = None
    clause_outline: List[str]
    generation_instructions: Optional[str] = None

    class Config:
        from_attributes = True


class TemplateCreateIn(BaseModel):
    name: str
    contract_type: str
    description: Optional[str] = None
    clause_outline: List[str]
    generation_instructions: Optional[str] = None


class DraftGenerationRequest(BaseModel):
    template_id: uuid.UUID
    customer_name: str
    our_company_name: str = "Our Company"
    value: Optional[float] = None
    currency: str = "USD"
    duration_months: int = 12
    jurisdiction: str
    additional_instructions: Optional[str] = None


class DraftGenerationResponse(BaseModel):
    id: uuid.UUID
    file_name: str
    status: str
    source: str

    class Config:
        from_attributes = True


@templates_router.get("", response_model=List[TemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    return db.query(ContractTemplate).filter(ContractTemplate.active == True).all()  # noqa: E712


@templates_router.post("", response_model=TemplateResponse)
def create_template(
    payload: TemplateCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Template name is required")
    if not payload.clause_outline or len(payload.clause_outline) == 0:
        raise HTTPException(status_code=400, detail="Clause outline cannot be empty")

    tpl = ContractTemplate(
        name=payload.name.strip(),
        contract_type=payload.contract_type.strip().lower().replace(" ", "_"),
        description=payload.description,
        clause_outline=[c.strip() for c in payload.clause_outline if c.strip()],
        generation_instructions=payload.generation_instructions,
        active=True,
    )
    db.add(tpl)
    db.commit()
    db.refresh(tpl)
    return tpl


@templates_router.delete("/{template_id}")
def delete_template(
    template_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tpl = db.query(ContractTemplate).filter(ContractTemplate.id == template_id).first()
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found")
    tpl.active = False
    db.commit()
    return {"message": "Template deactivated successfully"}


@router.post("/generate", response_model=DraftGenerationResponse)
def generate_draft(
    request: DraftGenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        contract = create_draft_contract(db, request, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return contract