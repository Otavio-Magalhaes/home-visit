import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from geoalchemy2 import alembic_helpers # <--- IMPORTANTE: Importar helpers do GeoAlchemy2
from alembic.ddl.impl import DefaultImpl

from alembic import context

# -------------------------------------------------------------
# 1. HACK DE PATH (Garante que o Alembic ache a pasta 'app')
# -------------------------------------------------------------
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# -------------------------------------------------------------
# 2. IMPORTS DO SEU PROJETO
# -------------------------------------------------------------
from app.core.database.database import Base
from app.core.config import settings
from app import models

# this is the Alembic Config object
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# -------------------------------------------------------------
# 3. SOBRESCREVER A URL COM A DO SETTINGS (DOCKER)
# -------------------------------------------------------------
# Importante: O Alembic precisa de um driver SÍNCRONO (ex: postgresql://)
# Se seu settings usar 'postgresql+asyncpg://', precisamos converter aqui
db_url = str(settings.DATABASE_URL)
if "+asyncpg" in db_url:
    db_url = db_url.replace("+asyncpg", "") # Remove o driver async para o Alembic rodar

config.set_main_option("sqlalchemy.url", db_url)

# -------------------------------------------------------------
# 4. FILTRO PARA IGNORAR TABELAS DO POSTGIS
# -------------------------------------------------------------
def include_object(object, name, type_, reflected, compare_to):
    # 1. Ignorar tabelas internas do sistema PostGIS
    if type_ == "table" and name in {
        'spatial_ref_sys', 'geometry_columns', 'geography_columns', 
        'raster_columns', 'raster_overviews'
    }:
        return False

    # 2. Ignorar tabelas do TIGER GEOCODER (A causa do seu erro)
    # Lista extraída do seu log de erro
    tiger_tables = {
        'addr', 'addrfeat', 'bg', 'county', 'county_lookup', 'countysub_lookup',
        'cousub', 'direction_lookup', 'edges', 'faces', 'featnames', 
        'geocode_settings', 'geocode_settings_default', 'layer', 
        'loader_lookuptables', 'loader_platform', 'loader_variables', 
        'pagc_gaz', 'pagc_lex', 'pagc_rules', 'place', 'place_lookup', 
        'secondary_unit_lookup', 'state', 'state_lookup', 'street_type_lookup', 
        'tabblock', 'tabblock20', 'topology', 'tract', 'zcta5', 'zip_lookup', 
        'zip_lookup_all', 'zip_lookup_base', 'zip_state', 'zip_state_loc'
    }
    
    if type_ == "table" and name in tiger_tables:
        return False

    # 3. GeoAlchemy helper para lidar com suas tabelas reais
    return alembic_helpers.include_object(object, name, type_, reflected, compare_to)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # --- CONFIGURAÇÃO GEOALCHEMY2 (OFFLINE) ---
        include_object=include_object, # <--- Usa APENAS a sua função customizada
        process_revision_directives=alembic_helpers.writer,
        render_item=alembic_helpers.render_item,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            # --- CONFIGURAÇÃO GEOALCHEMY2 (ONLINE) ---
            include_object=include_object, # <--- Usa APENAS a sua função customizada
            process_revision_directives=alembic_helpers.writer,
            render_item=alembic_helpers.render_item,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()