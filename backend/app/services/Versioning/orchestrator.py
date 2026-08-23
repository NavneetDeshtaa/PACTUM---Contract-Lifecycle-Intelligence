from sqlalchemy.orm import Session
from app.models.contract_versions import ContractVersion
from app.services.Versioning.version_service import ensure_initial_version
from app.services.Versioning.diff_engine import compute_diff
from app.services.Versioning.diff_explanation import explain_diff


def compare_versions(db: Session, contract_id, version_a: int, version_b: int) -> dict:
    ensure_initial_version(db, contract_id)

    va = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id, ContractVersion.version_number == version_a)
        .first()
    )
    vb = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id, ContractVersion.version_number == version_b)
        .first()
    )
    if va is None or vb is None:
        raise ValueError("One or both specified versions don't exist for this contract")

    diff_result = compute_diff(va.raw_text, vb.raw_text)
    explanation = explain_diff(diff_result["unified_diff"]) if diff_result["has_changes"] else "No changes between these versions."

    return {
        "version_a": version_a,
        "version_b": version_b,
        "changes": diff_result["changes"],
        "explanation": explanation,
    }