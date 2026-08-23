from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.approval_workflows import ApprovalWorkflow
from app.models.approval_instances import ApprovalInstance
from app.models.approval_actions import ApprovalAction


def submit_for_approval(db: Session, contract_id, workflow_id) -> ApprovalInstance:
    """
    Starts (or restarts) an approval process for a contract. Because
    ApprovalInstance is 1:1 with Contract (unique contract_id), a
    resubmission after rejection REUSES the same row rather than creating
    a new one -- current_stage_index and status reset to the beginning,
    but every past ApprovalAction stays attached and visible in history.
    This means a contract's full approval history (across multiple
    submit/reject/resubmit cycles) is always fully auditable.
    """
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")

    workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == workflow_id, ApprovalWorkflow.active == True).first()  # noqa: E712
    if workflow is None:
        raise ValueError(f"Workflow {workflow_id} not found or inactive")

    existing = db.query(ApprovalInstance).filter(ApprovalInstance.contract_id == contract_id).first()

    if existing:
        if existing.status == "in_progress":
            raise ValueError("This contract already has an approval in progress")
        # Resubmitting after a prior approval/rejection -- reset in place.
        existing.workflow_id = workflow.id
        existing.current_stage_index = 0
        existing.status = "in_progress"
        existing.started_at = datetime.now(timezone.utc)
        existing.completed_at = None
        db.commit()
        db.refresh(existing)
        return existing

    instance = ApprovalInstance(
        contract_id=contract_id,
        workflow_id=workflow.id,
        current_stage_index=0,
        status="in_progress",
    )
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return instance


def _get_active_instance(db: Session, contract_id) -> ApprovalInstance:
    instance = db.query(ApprovalInstance).filter(ApprovalInstance.contract_id == contract_id).first()
    if instance is None:
        raise ValueError(f"No approval process found for contract {contract_id}")
    if instance.status != "in_progress":
        raise ValueError(f"Approval is already {instance.status} -- cannot act on it further")
    return instance


def approve_current_stage(db: Session, contract_id, actor_id, comment: str | None = None) -> ApprovalInstance:
    """
    Approves the CURRENT stage only -- one action always moves the
    process exactly one stage forward, never skips ahead. If this was the
    final stage, the whole instance flips to "approved" and completed_at
    is set; otherwise it just advances current_stage_index by one and
    stays "in_progress" for the next stage's approver.
    """
    instance = _get_active_instance(db, contract_id)
    workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == instance.workflow_id).first()
    stages = workflow.stages

    current_stage_name = stages[instance.current_stage_index]

    db.add(ApprovalAction(
        approval_instance_id=instance.id,
        stage_name=current_stage_name,
        action="approved",
        actor_id=actor_id,
        comment=comment,
    ))

    instance.current_stage_index += 1
    if instance.current_stage_index >= len(stages):
        instance.status = "approved"
        instance.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(instance)
    return instance


def reject_current_stage(db: Session, contract_id, actor_id, comment: str | None = None) -> ApprovalInstance:
    """
    Rejects at the current stage -- immediately ends the process (status
    'rejected'), regardless of how many stages remained. A rejection
    doesn't advance current_stage_index; it stops everything right where
    it was rejected, which is what makes the audit trail meaningful
    ("rejected at Legal stage", not "rejected at some unclear point").
    """
    instance = _get_active_instance(db, contract_id)
    workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == instance.workflow_id).first()
    current_stage_name = workflow.stages[instance.current_stage_index]

    db.add(ApprovalAction(
        approval_instance_id=instance.id,
        stage_name=current_stage_name,
        action="rejected",
        actor_id=actor_id,
        comment=comment,
    ))

    instance.status = "rejected"
    instance.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(instance)
    return instance


def get_approval_status(db: Session, contract_id) -> dict:
    """
    Returns the full picture: the instance, its workflow's stage list (so
    a UI can render a progress bar), the current stage's name, and the
    complete ordered action history.
    """
    instance = db.query(ApprovalInstance).filter(ApprovalInstance.contract_id == contract_id).first()
    if instance is None:
        raise ValueError(f"No approval process found for contract {contract_id}")

    workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == instance.workflow_id).first()
    stages = workflow.stages

    current_stage_name = (
        stages[instance.current_stage_index]
        if instance.status == "in_progress" and instance.current_stage_index < len(stages)
        else None
    )

    return {
        "instance": instance,
        "stages": stages,
        "current_stage_name": current_stage_name,
    }