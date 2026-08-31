from datetime import date
from collections import Counter
from sqlalchemy import func, case
from sqlalchemy.orm import Session, joinedload

from app.models.contract import Contract
from app.models.extracted_fields import ExtractedFields
from app.models.risk_assessment import RiskAssessment
from app.models.approval_instances import ApprovalInstance
from app.models.renewal_obligation import RenewalObligation


# ──────────────────────────────────────────────────────────────────────────────
# OVERVIEW METRICS
# ──────────────────────────────────────────────────────────────────────────────

def get_portfolio_metrics(db: Session) -> dict:
    """Calculate executive high-level portfolio metrics."""
    total_contracts = db.query(func.count(Contract.id)).scalar() or 0
    total_value = (
        db.query(func.sum(ExtractedFields.value))
        .filter(ExtractedFields.value.isnot(None))
        .scalar()
        or 0.0
    )
    val_count = (
        db.query(func.count(ExtractedFields.id))
        .filter(ExtractedFields.value.isnot(None))
        .scalar()
        or 0
    )
    avg_value = round(float(total_value) / val_count, 2) if val_count > 0 else 0.0

    today = date.today()
    active_contracts = (
        db.query(func.count(Contract.id))
        .join(ExtractedFields, Contract.id == ExtractedFields.contract_id)
        .filter(
            ExtractedFields.effective_date <= today,
            ExtractedFields.expiry_date >= today,
        )
        .scalar()
        or 0
    )

    in_flight_reviews = (
        db.query(func.count(ApprovalInstance.id))
        .filter(ApprovalInstance.status == "in_progress")
        .scalar()
        or 0
    )

    open_obligations = (
        db.query(func.count(RenewalObligation.id))
        .filter(RenewalObligation.is_completed == False)  # noqa: E712
        .scalar()
        or 0
    )

    high_risk_count = (
        db.query(func.count(RiskAssessment.id))
        .filter(RiskAssessment.risk_level == "high")
        .scalar()
        or 0
    )

    return {
        "total_contracts": total_contracts,
        "total_value": float(total_value),
        "average_value": avg_value,
        "active_contracts": active_contracts,
        "in_flight_reviews": in_flight_reviews,
        "open_obligations": open_obligations,
        "high_risk_count": high_risk_count,
    }


def get_status_breakdown(db: Session) -> list[dict]:
    """Contract count grouped by status (uploaded/processing/extracted/failed)."""
    rows = (
        db.query(Contract.status, func.count(Contract.id))
        .group_by(Contract.status)
        .all()
    )
    return [{"status": str(status).replace("ContractStatus.", ""), "count": count} for status, count in rows]


def get_volume_over_time(db: Session) -> list[dict]:
    """Contracts uploaded per month, all-time, sorted chronologically."""
    month = func.to_char(Contract.uploaded_at, "YYYY-MM").label("month")
    rows = (
        db.query(month, func.count(Contract.id))
        .group_by(month)
        .order_by(month)
        .all()
    )
    return [{"month": m or "Unknown", "count": c} for m, c in rows]


def get_expiry_timeline(db: Session) -> list[dict]:
    """Contracts expiring per month, forward-looking from today onward."""
    month = func.to_char(ExtractedFields.expiry_date, "YYYY-MM").label("month")
    rows = (
        db.query(month, func.count(ExtractedFields.id))
        .filter(ExtractedFields.expiry_date >= date.today())
        .group_by(month)
        .order_by(month)
        .all()
    )
    return [{"month": m, "count": c} for m, c in rows if m]


def get_value_distribution(db: Session) -> list[dict]:
    """Buckets contract value into commercial brackets."""
    bucket = case(
        (ExtractedFields.value < 10_000, "< 10K"),
        (ExtractedFields.value < 50_000, "10K - 50K"),
        (ExtractedFields.value < 100_000, "50K - 100K"),
        (ExtractedFields.value < 500_000, "100K - 500K"),
        else_="500K+",
    ).label("bucket")

    rows = (
        db.query(bucket, func.count(ExtractedFields.id))
        .filter(ExtractedFields.value.isnot(None))
        .group_by(bucket)
        .all()
    )
    return [{"bucket": b, "count": c} for b, c in rows]


def get_risk_distribution(db: Session) -> list[dict]:
    """Risk level breakdown including not_analyzed category."""
    total_contracts = db.query(func.count(Contract.id)).scalar() or 0
    rows = (
        db.query(RiskAssessment.risk_level, func.count(RiskAssessment.id))
        .group_by(RiskAssessment.risk_level)
        .all()
    )
    result = [{"level": level, "count": count} for level, count in rows]
    analyzed_count = sum(r["count"] for r in result)
    not_analyzed = total_contracts - analyzed_count
    if not_analyzed > 0:
        result.append({"level": "not_analyzed", "count": not_analyzed})
    return result


# ──────────────────────────────────────────────────────────────────────────────
# CONTRACT COMMERCIAL & METADATA ANALYTICS
# ──────────────────────────────────────────────────────────────────────────────

def get_lifecycle_breakdown(db: Session) -> list[dict]:
    """Breakdown of contracts across lifecycle stages (draft, active, executed, expired, terminated)."""
    rows = (
        db.query(Contract.lifecycle_status, func.count(Contract.id))
        .group_by(Contract.lifecycle_status)
        .all()
    )
    return [{"stage": str(stage).replace("LifecycleStatus.", ""), "count": count} for stage, count in rows]


def get_governing_law_breakdown(db: Session) -> list[dict]:
    """Distribution of governing laws across portfolio."""
    rows = (
        db.query(ExtractedFields.governing_law, func.count(ExtractedFields.id))
        .filter(ExtractedFields.governing_law.isnot(None))
        .group_by(ExtractedFields.governing_law)
        .order_by(func.count(ExtractedFields.id).desc())
        .limit(8)
        .all()
    )
    return [{"law": law or "Unspecified", "count": count} for law, count in rows]


def get_top_contracts_by_value(db: Session, limit: int = 5) -> list[dict]:
    """Top largest contracts ranked by commercial value."""
    contracts = (
        db.query(Contract)
        .options(joinedload(Contract.extracted_fields))
        .join(ExtractedFields, Contract.id == ExtractedFields.contract_id)
        .filter(ExtractedFields.value.isnot(None))
        .order_by(ExtractedFields.value.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": str(c.id),
            "file_name": c.file_name,
            "value": float(c.extracted_fields.value) if c.extracted_fields and c.extracted_fields.value else 0.0,
            "currency": c.extracted_fields.currency or "USD" if c.extracted_fields else "USD",
            "governing_law": c.extracted_fields.governing_law if c.extracted_fields else None,
            "expiry_date": str(c.extracted_fields.expiry_date) if c.extracted_fields and c.extracted_fields.expiry_date else None,
        }
        for c in contracts
    ]


def get_top_counterparties(db: Session, limit: int = 6) -> list[dict]:
    """Analyze all extracted parties to rank the most frequent counterparties."""
    all_fields = db.query(ExtractedFields.parties).filter(ExtractedFields.parties.isnot(None)).all()
    counter = Counter()
    for (parties_list,) in all_fields:
        if isinstance(parties_list, list):
            for party in parties_list:
                clean_name = str(party).strip()
                if clean_name and len(clean_name) > 1 and clean_name.lower() not in ["our company", "the company", "provider", "client"]:
                    counter[clean_name] += 1

    return [{"party": name, "count": count} for name, count in counter.most_common(limit)]


# ──────────────────────────────────────────────────────────────────────────────
# RISK & COMPLIANCE ANALYTICS
# ──────────────────────────────────────────────────────────────────────────────

def get_risk_analytics_summary(db: Session) -> dict:
    """Detailed risk metrics, flagged clause frequency, missing clause frequency, and high risk watchlist."""
    assessments = (
        db.query(RiskAssessment)
        .options(joinedload(RiskAssessment.contract))
        .all()
    )

    if not assessments:
        return {
            "average_risk_score": 0,
            "compliance_health_score": 100,
            "risk_distribution": get_risk_distribution(db),
            "top_flagged_clauses": [],
            "top_missing_clauses": [],
            "high_risk_watchlist": [],
        }

    scores = [a.risk_score for a in assessments if a.risk_score is not None]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    compliance_score = max(0, min(100, round(100 - avg_score)))

    flagged_counter = Counter()
    missing_counter = Counter()

    for a in assessments:
        if a.flagged_clauses and isinstance(a.flagged_clauses, list):
            for item in a.flagged_clauses:
                if isinstance(item, dict) and item.get("clause"):
                    flagged_counter[item["clause"]] += 1
                elif isinstance(item, str):
                    flagged_counter[item] += 1

        if a.missing_clauses and isinstance(a.missing_clauses, list):
            for item in a.missing_clauses:
                if isinstance(item, dict) and item.get("clause"):
                    missing_counter[item["clause"]] += 1
                elif isinstance(item, str):
                    missing_counter[item] += 1

    top_flagged = [
        {"clause": clause, "occurrences": count}
        for clause, count in flagged_counter.most_common(6)
    ]
    top_missing = [
        {"clause": clause, "occurrences": count}
        for clause, count in missing_counter.most_common(6)
    ]

    # High risk contracts sorted by highest risk score
    high_risk = (
        db.query(RiskAssessment)
        .options(joinedload(RiskAssessment.contract))
        .filter(RiskAssessment.risk_level.in_(["high", "medium"]))
        .order_by(RiskAssessment.risk_score.desc())
        .limit(10)
        .all()
    )

    watchlist = [
        {
            "contract_id": str(r.contract_id),
            "file_name": r.contract.file_name if r.contract else "Unknown Contract",
            "risk_score": r.risk_score,
            "risk_level": r.risk_level,
            "flagged_count": len(r.flagged_clauses) if r.flagged_clauses else 0,
            "missing_count": len(r.missing_clauses) if r.missing_clauses else 0,
            "explanation": r.explanation[:160] + "..." if r.explanation and len(r.explanation) > 160 else r.explanation,
        }
        for r in high_risk
        if r.contract
    ]

    return {
        "average_risk_score": avg_score,
        "compliance_health_score": compliance_score,
        "risk_distribution": get_risk_distribution(db),
        "top_flagged_clauses": top_flagged,
        "top_missing_clauses": top_missing,
        "high_risk_watchlist": watchlist,
    }