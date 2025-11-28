"""fix back_populates

Revision ID: 0fafd8ab8055
Revises: 55bf72dee787
Create Date: 2025-11-22 21:28:53.850644

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0fafd8ab8055'
down_revision: Union[str, Sequence[str], None] = '55bf72dee787'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
