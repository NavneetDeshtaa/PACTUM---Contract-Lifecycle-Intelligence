import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.contract import Contract
from app.models.contract_template import ContractTemplate
from app.models.approval_workflows import ApprovalWorkflow
from app.models.approval_instances import ApprovalInstance
from app.services.Workflow.engine import (
    submit_for_approval,
    approve_current_stage,
    reject_current_stage,
    get_approval_status,
)
from app.services.Workflow.advisory_orchestrator import get_approval_advisory

router = APIRouter(prefix="/contracts", tags=["workflow"])
workflows_router = APIRouter(prefix="/workflows", tags=["workflow"])


# ──────────────────────────────────────────────────────────────────────────────
# SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class WorkflowResponse(BaseModel):
    id: uuid.UUID
    name: str
    contract_type: Optional[str] = None
    stages: List[str]
    active: bool = True
    active_instances_count: int = 0

    class Config:
        from_attributes = True


class WorkflowCreateIn(BaseModel):
    name: str
    contract_type: Optional[str] = None
    stages: List[str]


class SubmitRequest(BaseModel):
    workflow_id: uuid.UUID


class ActionRequest(BaseModel):
    comment: Optional[str] = None


class ActionHistoryItem(BaseModel):
    stage_name: str
    action: str
    actor_email: Optional[str] = None
    comment: Optional[str] = None
    created_at: str


class ApprovalStatusResponse(BaseModel):
    status: str
    current_stage_index: int
    current_stage_name: Optional[str] = None
    stages: List[str]
    started_at: str
    completed_at: Optional[str] = None
    actions: List[ActionHistoryItem]


class ActiveWorkflowInstanceOut(BaseModel):
    instance_id: uuid.UUID
    contract_id: uuid.UUID
    contract_file_name: str
    workflow_id: uuid.UUID
    workflow_name: str
    current_stage_index: int
    current_stage_name: Optional[str] = None
    total_stages: int
    stages: List[str]
    status: str  # in_progress | approved | rejected
    started_at: str
    completed_at: Optional[str] = None
    actions: List[ActionHistoryItem]


class WorkflowStatsOut(BaseModel):
    total_workflows: int
    total_templates: int
    active_in_progress: int
    total_approved: int
    total_rejected: int


def _to_status_response(result: dict) -> ApprovalStatusResponse:
    instance = result["instance"]
    return ApprovalStatusResponse(
        status=instance.status,
        current_stage_index=instance.current_stage_index,
        current_stage_name=result["current_stage_name"],
        stages=result["stages"],
        started_at=instance.started_at.isoformat(),
        completed_at=instance.completed_at.isoformat() if instance.completed_at else None,
        actions=[
            ActionHistoryItem(
                stage_name=a.stage_name,
                action=a.action,
                actor_email=getattr(a.actor, "email", None),
                comment=a.comment,
                created_at=a.created_at.isoformat(),
            )
            for a in instance.actions
        ],
    )


# ──────────────────────────────────────────────────────────────────────────────
# GLOBAL WORKFLOW ENDPOINTS (/workflows)
# ──────────────────────────────────────────────────────────────────────────────

@workflows_router.get("", response_model=List[WorkflowResponse])
def list_workflows(db: Session = Depends(get_db)):
    workflows = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.active == True).all()  # noqa: E712
    result = []
    for wf in workflows:
        active_count = (
            db.query(ApprovalInstance)
            .filter(
                ApprovalInstance.workflow_id == wf.id,
                ApprovalInstance.status == "in_progress",
            )
            .count()
        )
        result.append(
            WorkflowResponse(
                id=wf.id,
                name=wf.name,
                contract_type=wf.contract_type,
                stages=wf.stages,
                active=wf.active,
                active_instances_count=active_count,
            )
        )
    return result


@workflows_router.post("", response_model=WorkflowResponse)
def create_workflow(
    payload: WorkflowCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Workflow name is required")
    if not payload.stages or len(payload.stages) == 0:
        raise HTTPException(status_code=400, detail="At least one approval stage is required")

    existing = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.name == payload.name.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="A workflow with this name already exists")

    wf = ApprovalWorkflow(
        name=payload.name.strip(),
        contract_type=payload.contract_type or None,
        stages=[s.strip() for s in payload.stages if s.strip()],
        active=True,
    )
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return WorkflowResponse(
        id=wf.id,
        name=wf.name,
        contract_type=wf.contract_type,
        stages=wf.stages,
        active=wf.active,
        active_instances_count=0,
    )


@workflows_router.delete("/{workflow_id}")
def delete_workflow(
    workflow_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wf = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    wf.active = False
    db.commit()
    return {"message": "Workflow deactivated successfully"}


@workflows_router.get("/stats", response_model=WorkflowStatsOut)
def get_workflow_stats(db: Session = Depends(get_db)):
    total_workflows = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.active == True).count()  # noqa: E712
    total_templates = db.query(ContractTemplate).filter(ContractTemplate.active == True).count()  # noqa: E712
    active_in_progress = db.query(ApprovalInstance).filter(ApprovalInstance.status == "in_progress").count()
    total_approved = db.query(ApprovalInstance).filter(ApprovalInstance.status == "approved").count()
    total_rejected = db.query(ApprovalInstance).filter(ApprovalInstance.status == "rejected").count()

    return WorkflowStatsOut(
        total_workflows=total_workflows,
        total_templates=total_templates,
        active_in_progress=active_in_progress,
        total_approved=total_approved,
        total_rejected=total_rejected,
    )


@workflows_router.get("/instances", response_model=List[ActiveWorkflowInstanceOut])
def list_workflow_instances(
    status: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """List all contract approval instances across the organization."""
    query = (
        db.query(ApprovalInstance)
        .options(
            joinedload(ApprovalInstance.contract),
            joinedload(ApprovalInstance.workflow),
            joinedload(ApprovalInstance.actions).joinedload(User),
        )
    )

    if status and status != "all":
        query = query.filter(ApprovalInstance.status == status)

    instances = query.order_by(ApprovalInstance.started_at.desc()).all()

    result = []
    for inst in instances:
        if not inst.contract or not inst.workflow:
            continue

        stages = inst.workflow.stages or []
        total_stages = len(stages)
        current_stage_name = (
            stages[inst.current_stage_index]
            if 0 <= inst.current_stage_index < total_stages
            else ("Approved" if inst.status == "approved" else "Rejected")
        )

        actions_list = [
            ActionHistoryItem(
                stage_name=a.stage_name,
                action=a.action,
                actor_email=getattr(a.actor, "email", None),
                comment=a.comment,
                created_at=a.created_at.isoformat(),
            )
            for a in inst.actions
        ]

        result.append(
            ActiveWorkflowInstanceOut(
                instance_id=inst.id,
                contract_id=inst.contract_id,
                contract_file_name=inst.contract.file_name,
                workflow_id=inst.workflow_id,
                workflow_name=inst.workflow.name,
                current_stage_index=inst.current_stage_index,
                current_stage_name=current_stage_name,
                total_stages=total_stages,
                stages=stages,
                status=inst.status,
                started_at=inst.started_at.isoformat(),
                completed_at=inst.completed_at.isoformat() if inst.completed_at else None,
                actions=actions_list,
            )
        )
    return result


# ──────────────────────────────────────────────────────────────────────────────
# CONTRACT-SCOPED APPROVAL ENDPOINTS (/contracts/{contract_id}/approval)
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/{contract_id}/approval/submit", response_model=ApprovalStatusResponse)
def submit(contract_id: uuid.UUID, request: SubmitRequest, db: Session = Depends(get_db)):
    try:
        submit_for_approval(db, contract_id, request.workflow_id)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{contract_id}/approval/approve", response_model=ApprovalStatusResponse)
def approve(
    contract_id: uuid.UUID,
    request: ActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        approve_current_stage(db, contract_id, current_user.id, request.comment)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{contract_id}/approval/reject", response_model=ApprovalStatusResponse)
def reject(
    contract_id: uuid.UUID,
    request: ActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        reject_current_stage(db, contract_id, current_user.id, request.comment)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class AdvisoryResponse(BaseModel):
    recommendation: str
    reasoning: str
    current_stage: str


@router.get("/{contract_id}/approval/advisory", response_model=AdvisoryResponse)
def get_advisory(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return get_approval_advisory(db, contract_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{contract_id}/approval", response_model=ApprovalStatusResponse)
def get_status(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))