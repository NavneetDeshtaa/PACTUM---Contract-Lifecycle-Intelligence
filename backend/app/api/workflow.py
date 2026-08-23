import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.approval_workflows import ApprovalWorkflow
from app.services.Workflow.engine import (
    submit_for_approval, approve_current_stage, reject_current_stage, get_approval_status,
)

router = APIRouter(prefix="/contracts", tags=["workflow"])

# Separate top-level path -- avoids the recurring /contracts/{contract_id}
# collision issue.
workflows_router = APIRouter(prefix="/workflows", tags=["workflow"])


class WorkflowResponse(BaseModel):
    id: uuid.UUID
    name: str
    contract_type: Optional[str] = None
    stages: List[str]

    class Config:
        from_attributes = True


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


@workflows_router.get("", response_model=List[WorkflowResponse])
def list_workflows(db: Session = Depends(get_db)):
    return db.query(ApprovalWorkflow).filter(ApprovalWorkflow.active == True).all()  # noqa: E712


@router.post("/{contract_id}/approval/submit", response_model=ApprovalStatusResponse)
def submit(contract_id: uuid.UUID, request: SubmitRequest, db: Session = Depends(get_db)):
    try:
        submit_for_approval(db, contract_id, request.workflow_id)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{contract_id}/approval/approve", response_model=ApprovalStatusResponse)
def approve(
    contract_id: uuid.UUID, request: ActionRequest,
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
):
    try:
        approve_current_stage(db, contract_id, current_user.id, request.comment)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{contract_id}/approval/reject", response_model=ApprovalStatusResponse)
def reject(
    contract_id: uuid.UUID, request: ActionRequest,
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
):
    try:
        reject_current_stage(db, contract_id, current_user.id, request.comment)
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{contract_id}/approval", response_model=ApprovalStatusResponse)
def get_status(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return _to_status_response(get_approval_status(db, contract_id))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))