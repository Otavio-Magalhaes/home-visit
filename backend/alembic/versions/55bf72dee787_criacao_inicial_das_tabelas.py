"""Criacao inicial das tabelas

Revision ID: 55bf72dee787
Revises: 
Create Date: 2025-11-22 19:48:23.250255

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '55bf72dee787'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. CRIAÇÃO DA TABELA FORMS
    op.create_table('forms',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_forms_id'), 'forms', ['id'], unique=False)

    # 2. CRIAÇÃO DA TABELA RESIDENCES (COM GEO)
    op.create_geospatial_table('residences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('number', sa.String(), nullable=False),
        sa.Column('complement', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('state', sa.String(), nullable=False),
        sa.Column('zip_code', sa.String(), nullable=False),
        sa.Column('geo_location', Geometry(geometry_type='POINT', srid=4326, dimension=2, spatial_index=False, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_geospatial_index('idx_residences_geo_location', 'residences', ['geo_location'], unique=False, postgresql_using='gist', postgresql_ops={})
    op.create_index(op.f('ix_residences_id'), 'residences', ['id'], unique=False)

    # 3. CRIAÇÃO DA TABELA ROLE
    op.create_table('role',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # 4. CRIAÇÃO DA TABELA QUESTIONS
    op.create_table('questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(), nullable=False),
        sa.Column('field_type', sa.String(), nullable=False),
        sa.Column('is_required', sa.Boolean(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('form_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['form_id'], ['forms.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_questions_id'), 'questions', ['id'], unique=False)

    # 5. CRIAÇÃO DA TABELA RESIDENTS
    op.create_table('residents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('cpf', sa.String(), nullable=True),
        sa.Column('birth_date', sa.DateTime(), nullable=False),
        sa.Column('sus_card', sa.String(), nullable=True),
        sa.Column('residence_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['residence_id'], ['residences.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('cpf')
    )
    op.create_index(op.f('ix_residents_id'), 'residents', ['id'], unique=False)

    # 6. CRIAÇÃO DA TABELA USERS
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )

    # 7. CRIAÇÃO DA TABELA QUESTION_OPTIONS
    op.create_table('question_options',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(), nullable=False),
        sa.Column('value', sa.String(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_question_options_id'), 'question_options', ['id'], unique=False)

    # 8. CRIAÇÃO DA TABELA USER_ROLE
    op.create_table('user_role',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'role_id')
    )

    # 9. CRIAÇÃO DA TABELA VISITS
    op.create_table('visits',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('visit_date', sa.DateTime(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('resident_id', sa.Integer(), nullable=False),
        sa.Column('form_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['form_id'], ['forms.id'], ),
        sa.ForeignKeyConstraint(['resident_id'], ['residents.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_visits_id'), 'visits', ['id'], unique=False)

    # 10. CRIAÇÃO DA TABELA ANSWERS
    op.create_table('answers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('value', sa.Text(), nullable=False),
        sa.Column('visit_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
        sa.ForeignKeyConstraint(['visit_id'], ['visits.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_answers_id'), 'answers', ['id'], unique=False)

    # *** REMOVIDO: VÁRIOS op.drop_table DE TABELAS POSTGIS ***


def downgrade() -> None:
    """Downgrade schema."""
    
    # *** REMOVIDO: VÁRIOS op.create_table DE TABELAS POSTGIS ***

    # MANTEMOS APENAS O DROP DAS SUAS TABELAS
    op.drop_index(op.f('ix_answers_id'), table_name='answers')
    op.drop_table('answers')
    
    op.drop_index(op.f('ix_visits_id'), table_name='visits')
    op.drop_table('visits')
    
    op.drop_table('user_role')
    
    op.drop_index(op.f('ix_question_options_id'), table_name='question_options')
    op.drop_table('question_options')
    
    op.drop_table('users')
    
    op.drop_index(op.f('ix_residents_id'), table_name='residents')
    op.drop_table('residents')
    
    op.drop_index(op.f('ix_questions_id'), table_name='questions')
    op.drop_table('questions')
    
    op.drop_table('role')
    
    op.drop_index(op.f('ix_residences_id'), table_name='residences')
    op.drop_geospatial_index('idx_residences_geo_location', table_name='residences', postgresql_using='gist', column_name='geo_location')
    op.drop_geospatial_table('residences')
    
    op.drop_index(op.f('ix_forms_id'), table_name='forms')
    op.drop_table('forms')