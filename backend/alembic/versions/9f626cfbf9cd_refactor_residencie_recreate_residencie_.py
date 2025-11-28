"""refactor(residencie): recreate residencie model and schemas

Revision ID: 9f626cfbf9cd
Revises: 8ec5723c35d9
Create Date: 2025-11-27 02:16:16.583638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f626cfbf9cd'
down_revision: Union[str, Sequence[str], None] = '8ec5723c35d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
