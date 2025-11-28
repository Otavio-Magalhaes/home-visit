from typing import TYPE_CHECKING
import enum
from sqlalchemy import (
    Column, Date, Boolean, Enum, String, ForeignKey, Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.core.database.database import Base
from app.models.Timestamp import TimestampedModel

from app.models.enums import (
    SexoEnum, RacaCorEnum, NacionalidadeEnum, GrauParentescoEnum,
    EscolaridadeEnum, SituacaoMercadoEnum,
    OrientacaoSexualEnum, IdentidadeGeneroEnum
)

if TYPE_CHECKING:
    from .Residence import Residence
    from .Visit import Visit


class Resident(TimestampedModel, Base):
    __tablename__ = "residents"

    # Identificador
    id = Column(String, primary_key=True, index=True)
    residence_id = Column(
        Integer,
        ForeignKey("residence.id", ondelete="CASCADE"),
        nullable=False
    )

    # Identificação
    cns = Column(String, nullable=True)
    cpf = Column(String, unique=True, nullable=True)
    nome_completo = Column(String, nullable=False)
    nome_social = Column(String, nullable=True)
    data_nascimento = Column(Date, nullable=False)
    sexo = Column(Enum(SexoEnum), nullable=False)
    raca_cor = Column(Enum(RacaCorEnum), nullable=False)
    etnia = Column(String, nullable=True)
    nis_pis_pasep = Column(String, nullable=True)

    # Filiação
    nome_mae = Column(String, nullable=True)
    mae_desconhecida = Column(Boolean, default=False)
    nome_pai = Column(String, nullable=True)
    pai_desconhecido = Column(Boolean, default=False)

    # Nacionalidade
    nacionalidade = Column(Enum(NacionalidadeEnum), nullable=False)
    pais_nascimento = Column(String, nullable=True)
    dt_naturalizacao = Column(Date, nullable=True)
    portaria_naturalizacao = Column(String, nullable=True)
    municipio_nascimento = Column(String, nullable=True)

    # Contato
    telefone_celular = Column(String, nullable=True)
    email = Column(String, nullable=True)

    # Responsabilidade familiar
    eh_responsavel_familiar = Column(Boolean, default=False)
    cns_cpf_responsavel = Column(String, nullable=True)
    relacao_parentesco = Column(Enum(GrauParentescoEnum), nullable=True)

    # Sociodemográfico
    ocupacao = Column(String, nullable=True)
    frequenta_escola = Column(Boolean, default=False)
    escolaridade = Column(Enum(EscolaridadeEnum), nullable=True)
    situacao_mercado = Column(Enum(SituacaoMercadoEnum), nullable=True)

    # Crianças 0–9 anos (múltipla escolha)
    responsavel_crianca = Column(ARRAY(String), nullable=True)

    frequenta_cuidador = Column(Boolean, default=False)
    participa_grupos_comunitarios = Column(Boolean, default=False)
    possui_plano_saude = Column(Boolean, default=False)

    membro_povo_tradicional = Column(Boolean, default=False)
    povo_tradicional_desc = Column(String, nullable=True)

    # Identidade e deficiência
    orientacao_sexual = Column(Enum(OrientacaoSexualEnum), nullable=True)
    identidade_genero = Column(Enum(IdentidadeGeneroEnum), nullable=True)

    possui_deficiencia = Column(Boolean, default=False)
    deficiencias_tipo = Column(ARRAY(String), nullable=True)

    # Saída do cadastro
    saida_cadastro = Column(Boolean, default=False)
    motivo_saida = Column(String, nullable=True)
    data_obito = Column(Date, nullable=True)
    numero_do = Column(String, nullable=True)

    # Relationships
    residence = relationship("Residence", back_populates="residents")
    visits = relationship("Visit", back_populates="resident", cascade="all, delete-orphan")
    health_situation = relationship("HealthSituation", back_populates="resident", uselist=False)