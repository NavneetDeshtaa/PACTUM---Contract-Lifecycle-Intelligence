import uuid
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.contract import ContractStatus


class ExtractedFieldsOut(BaseModel):
    parties: Optional[List[str]] = None
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    value: Optional[float] = None
    currency: Optional[str] = None
    governing_law: Optional[str] = None
    renewal_terms: Optional[str] = None
    key_clauses: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ContractOut(BaseModel):
    id: uuid.UUID
    file_name: str
    status: ContractStatus
    uploaded_at: datetime
    extracted_fields: Optional[ExtractedFieldsOut] = None
    raw_text: Optional[str] = None

    class Config:
        from_attributes = True