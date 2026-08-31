import uuid
import enum
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class ContractStatus(str, enum.Enum):
    uploaded = "uploaded"
    processing = "processing"
    extracted = "extracted"
    failed = "failed"

class LifecycleStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    executed = "executed"
    expired = "expired"
    terminated = "terminated"

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum(ContractStatus), default=ContractStatus.uploaded, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- Sub-tab fields ---
    is_starred = Column(Boolean, default=False, nullable=False)
    lifecycle_status = Column(
        Enum(LifecycleStatus),
        default=LifecycleStatus.draft,
        nullable=False,
    )

    # NEW: caches the full parsed text (from text_extraction.py) so downstream
    # steps -- chunking here, and the summarizer in Step 4 -- never need to
    # re-parse the source file from disk.
    raw_text = Column(Text, nullable=True)

    uploader = relationship("User")
    extracted_fields = relationship("ExtractedFields", back_populates="contract", uselist=False, cascade="all, delete-orphan")
        
    # NEW: one contract -> many chunks. cascade delete so removing a contract
    # cleans up its chunks automatically (no orphaned vectors left behind).
    chunks = relationship("Chunk", back_populates="contract", cascade="all, delete-orphan",order_by="Chunk.chunk_index")

    summary = relationship("ContractSummary", back_populates="contract", uselist=False, cascade="all, delete-orphan")

    # `chunks` and `summary` relationships:
    risk_assessment = relationship("RiskAssessment", back_populates="contract", uselist=False, cascade="all, delete-orphan")

    # values: "uploaded" | "generated"
    source = Column(String(20), default="uploaded", nullable=False)

    # IS a one-to-many, so it stays a list
    renewal_obligations = relationship("RenewalObligation", back_populates="contract", cascade="all, delete-orphan")

    approval_instance = relationship("ApprovalInstance", back_populates="contract", uselist=False, cascade="all, delete-orphan")
    versions = relationship("ContractVersion", back_populates="contract", cascade="all, delete-orphan", order_by="ContractVersion.version_number")
