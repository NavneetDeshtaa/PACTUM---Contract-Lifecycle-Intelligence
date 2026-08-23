"""
Creates version 1 for every existing contract that doesn't have any
version history yet -- same idea as the Phase 2 chunk embedding backfill.
Not strictly required (ensure_initial_version does this lazily on first
access), but useful to run once so every contract has clean version
history without waiting for someone to view it first.

Usage (from your backend folder):
    python -m scripts.backfill_initial_versions
"""
from app.database import SessionLocal
from app.models.contract import Contract
from app.services.Versioning.version_service import ensure_initial_version


def run():
    db = SessionLocal()
    try:
        contracts = db.query(Contract).all()
        print(f"Found {len(contracts)} contract(s) total.")

        created, skipped = 0, 0
        for contract in contracts:
            if not contract.raw_text:
                skipped += 1
                continue
            existing_count = len(contract.versions)
            if existing_count > 0:
                skipped += 1
                continue
            ensure_initial_version(db, contract.id)
            created += 1

        print(f"Done. Created: {created}, Skipped: {skipped}.")
    finally:
        db.close()


if __name__ == "__main__":
    run()