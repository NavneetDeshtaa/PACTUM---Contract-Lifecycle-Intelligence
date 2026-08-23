from sqlalchemy.orm import Session
from app.models.approval_instances import ApprovalInstance
from app.models.approval_workflows import ApprovalWorkflow
from app.models.risk_assessment import RiskAssessment
from app.services.Workflow.advisory import generate_advisory


def get_approval_advisory(db: Session, contract_id) -> dict:
    """
    Read-only advisory context for whoever's reviewing the contract at
    its CURRENT stage. Deliberately does NOT call get_or_create_risk_assessment
    -- if risk hasn't been analyzed yet, the advisory just says so rather
    than silently triggering an LLM pipeline the reviewer didn't ask for.
    Encourages people to actually run risk analysis explicitly (Phase 3's
    feature) rather than this becoming a hidden backdoor trigger for it.
    """
    instance = db.query(ApprovalInstance).filter(ApprovalInstance.contract_id == contract_id).first()
    if instance is None:
        raise ValueError(f"No approval process found for contract {contract_id}")
    if instance.status != "in_progress":
        raise ValueError("No advisory needed -- this approval is already resolved")

    workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.id == instance.workflow_id).first()
    current_stage = workflow.stages[instance.current_stage_index]

    contract = instance.contract
    fields = contract.extracted_fields
    value = fields.value if fields else None
    currency = fields.currency if fields else None

    risk = db.query(RiskAssessment).filter(RiskAssessment.contract_id == contract_id).first()
    risk_score = risk.risk_score if risk else None
    risk_level = risk.risk_level if risk else "not yet analyzed"
    flagged = [f["clause"] for f in (risk.flagged_clauses or [])] if risk else []
    missing = [m["clause"] for m in (risk.missing_clauses or [])] if risk else []

    advisory = generate_advisory(current_stage, value, currency, risk_score, risk_level, flagged, missing)
    advisory["current_stage"] = current_stage
    return advisory