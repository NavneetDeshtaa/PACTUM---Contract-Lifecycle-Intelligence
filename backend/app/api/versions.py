import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.Versioning.version_service import create_version, get_versions
from app.services.Versioning.orchestrator import compare_versions

router = APIRouter(prefix="/contracts", tags=["versions"])


class CreateVersionRequest(BaseModel):
    raw_text: str


class VersionResponse(BaseModel):
    id: uuid.UUID
    version_number: int
    created_at: str
    preview: str

    class Config:
        from_attributes = True


class DiffChange(BaseModel):
    type: str
    old_text: str
    new_text: str


class CompareResponse(BaseModel):
    version_a: int
    version_b: int
    changes: List[DiffChange]
    explanation: str


@router.get("/{contract_id}/versions", response_model=List[VersionResponse])
def list_versions(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        versions = get_versions(db, contract_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return [
        VersionResponse(
            id=v.id, version_number=v.version_number,
            created_at=v.created_at.isoformat(), preview=v.raw_text[:150],
        )
        for v in versions
    ]


@router.post("/{contract_id}/versions", response_model=VersionResponse)
def add_version(
    contract_id: uuid.UUID, request: CreateVersionRequest,
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
):
    try:
        v = create_version(db, contract_id, request.raw_text, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return VersionResponse(
        id=v.id, version_number=v.version_number,
        created_at=v.created_at.isoformat(), preview=v.raw_text[:150],
    )


@router.get("/{contract_id}/versions/compare", response_model=CompareResponse)
def compare(contract_id: uuid.UUID, from_version: int, to_version: int, db: Session = Depends(get_db)):
    try:
        result = compare_versions(db, contract_id, from_version, to_version)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return result