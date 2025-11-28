"""fix back_populates

Revision ID: 8ec5723c35d9
Revises: 0fafd8ab8055
Create Date: 2025-11-22 21:57:00.261867

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ec5723c35d9'
down_revision: Union[str, Sequence[str], None] = '0fafd8ab8055'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
