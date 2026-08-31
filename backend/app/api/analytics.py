from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Analytics.aggregations import (
    get_portfolio_metrics,
    get_status_breakdown,
    get_volume_over_time,
    get_expiry_timeline,
    get_value_distribution,
    get_risk_distribution,
    get_lifecycle_breakdown,
    get_governing_law_breakdown,
    get_top_contracts_by_value,
    get_top_counterparties,
    get_risk_analytics_summary,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


# ──────────────────────────────────────────────────────────────────────────────
# SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class StatusCount(BaseModel):
    status: str
    count: int


class MonthCount(BaseModel):
    month: str
    count: int


class BucketCount(BaseModel):
    bucket: str
    count: int


class RiskLevelCount(BaseModel):
    level: str
    count: int


class LifecycleCount(BaseModel):
    stage: str
    count: int


class GoverningLawCount(BaseModel):
    law: str
    count: int


class TopContractItem(BaseModel):
    id: str
    file_name: str
    value: float
    currency: str
    governing_law: Optional[str] = None
    expiry_date: Optional[str] = None


class CounterpartyItem(BaseModel):
    party: str
    count: int


class ClauseFrequencyItem(BaseModel):
    clause: str
    occurrences: int


class HighRiskWatchlistItem(BaseModel):
    contract_id: str
    file_name: str
    risk_score: int
    risk_level: str
    flagged_count: int
    missing_count: int
    explanation: Optional[str] = None


class PortfolioOverviewMetrics(BaseModel):
    total_contracts: int
    total_value: float
    average_value: float
    active_contracts: int
    in_flight_reviews: int
    open_obligations: int
    high_risk_count: int


class AnalyticsSummary(BaseModel):
    total_contracts: int
    metrics: PortfolioOverviewMetrics
    status_breakdown: List[StatusCount]
    volume_over_time: List[MonthCount]
    expiry_timeline: List[MonthCount]
    value_distribution: List[BucketCount]
    risk_distribution: List[RiskLevelCount]


class ContractAnalyticsResponse(BaseModel):
    total_contracts: int
    total_value: float
    average_value: float
    lifecycle_breakdown: List[LifecycleCount]
    governing_law_breakdown: List[GoverningLawCount]
    value_distribution: List[BucketCount]
    top_contracts: List[TopContractItem]
    top_counterparties: List[CounterpartyItem]


class RiskAnalyticsResponse(BaseModel):
    average_risk_score: float
    compliance_health_score: int
    risk_distribution: List[RiskLevelCount]
    top_flagged_clauses: List[ClauseFrequencyItem]
    top_missing_clauses: List[ClauseFrequencyItem]
    high_risk_watchlist: List[HighRiskWatchlistItem]


# ──────────────────────────────────────────────────────────────────────────────
# ENDPOINTS
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    """Executive portfolio overview with interactive charts and KPI metrics."""
    metrics = get_portfolio_metrics(db)
    status_breakdown = get_status_breakdown(db)

    return AnalyticsSummary(
        total_contracts=metrics["total_contracts"],
        metrics=PortfolioOverviewMetrics(**metrics),
        status_breakdown=status_breakdown,
        volume_over_time=get_volume_over_time(db),
        expiry_timeline=get_expiry_timeline(db),
        value_distribution=get_value_distribution(db),
        risk_distribution=get_risk_distribution(db),
    )


@router.get("/contracts", response_model=ContractAnalyticsResponse)
def get_contract_analytics(db: Session = Depends(get_db)):
    """Contract commercial intelligence, lifecycle distribution, and high-value rankings."""
    metrics = get_portfolio_metrics(db)

    return ContractAnalyticsResponse(
        total_contracts=metrics["total_contracts"],
        total_value=metrics["total_value"],
        average_value=metrics["average_value"],
        lifecycle_breakdown=get_lifecycle_breakdown(db),
        governing_law_breakdown=get_governing_law_breakdown(db),
        value_distribution=get_value_distribution(db),
        top_contracts=get_top_contracts_by_value(db, limit=5),
        top_counterparties=get_top_counterparties(db, limit=6),
    )


@router.get("/risk", response_model=RiskAnalyticsResponse)
def get_risk_analytics(db: Session = Depends(get_db)):
    """Enterprise risk distribution, clause deviation hotspots, and risk watchlist."""
    return get_risk_analytics_summary(db)