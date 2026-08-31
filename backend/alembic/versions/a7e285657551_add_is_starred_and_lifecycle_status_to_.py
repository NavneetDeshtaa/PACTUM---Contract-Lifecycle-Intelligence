"""add_is_starred_and_lifecycle_status_to_contracts

Revision ID: a7e285657551
Revises: 90f36f04def0
Create Date: 2026-08-31 19:37:58.652103

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7e285657551'
down_revision: Union[str, Sequence[str], None] = '90f36f04def0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create the Postgres enum type first
    lifecycle_enum = sa.Enum(
        'draft', 'active', 'executed', 'expired', 'terminated',
        name='lifecyclestatus',
    )
    lifecycle_enum.create(op.get_bind(), checkfirst=True)

    # Add is_starred with a server-level default so existing rows get FALSE
    op.add_column('contracts', sa.Column(
        'is_starred',
        sa.Boolean(),
        nullable=False,
        server_default=sa.false(),
    ))
    # Add lifecycle_status with a server-level default of 'draft'
    op.add_column('contracts', sa.Column(
        'lifecycle_status',
        lifecycle_enum,
        nullable=False,
        server_default='draft',
    ))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('contracts', 'lifecycle_status')
    op.drop_column('contracts', 'is_starred')
    sa.Enum(name='lifecyclestatus').drop(op.get_bind(), checkfirst=True)
