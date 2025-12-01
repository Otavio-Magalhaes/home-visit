from typing import TYPE_CHECKING
from sqlalchemy import UUID, Column, ForeignKey, String, Boolean, Enum, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.core.database.database import Base
from app.models.Timestamp import TimestampedModel
from app.models.enums import (
    PesoSituacaoEnum, TempoSituacaoRuaEnum, FrequenciaAlimentacaoEnum
)

if TYPE_CHECKING:
    from .Resident import Resident

class HealthSituation(TimestampedModel, Base):
    __tablename__ = 'health_situations'

    id = Column(Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    
    resident_id = Column(String, ForeignKey('residents.id'), unique=False, nullable=False)
    visit_id = Column(Integer, ForeignKey("visits.id"), nullable=False, unique=True)
    
    esta_gestante = Column(Boolean, default=False)
    maternidade_referencia = Column(String, nullable=True)
    
    peso_situacao = Column(Enum(PesoSituacaoEnum), nullable=True)
    
    esta_fumante = Column(Boolean, default=False)
    usa_alcool = Column(Boolean, default=False)
    usa_outras_drogas = Column(Boolean, default=False)
    
    tem_hipertensao = Column(Boolean, default=False)
    tem_diabetes = Column(Boolean, default=False)
    teve_avc_derrame = Column(Boolean, default=False)
    teve_infarto = Column(Boolean, default=False)
    
    tem_doenca_cardiaca = Column(Boolean, default=False)
    doencas_cardiacas_tipos = Column(ARRAY(String), nullable=True)

    tem_problemas_rins = Column(Boolean, default=False)
    problemas_rins_tipos = Column(ARRAY(String), nullable=True)

    tem_doenca_respiratoria = Column(Boolean, default=False)
    doenca_respiratoria_tipos = Column(ARRAY(String), nullable=True)

    tem_hanseniase = Column(Boolean, default=False)
    tem_tuberculose = Column(Boolean, default=False)
    tem_cancer = Column(Boolean, default=False)

    internacao_ultimos_12_meses = Column(Boolean, default=False)
    causa_internacao = Column(String, nullable=True)
    
    diagnostico_problema_mental = Column(Boolean, default=False)

    esta_acamado = Column(Boolean, default=False)
    esta_domiciliado = Column(Boolean, default=False)
    
    usa_plantas_medicinais = Column(Boolean, default=False)
    plantas_medicinais_desc = Column(String, nullable=True)
    
    usa_praticas_integrativas = Column(Boolean, default=False)

    # Outras condições de saúde
    outras_condicoes = Column(ARRAY(String), nullable=True)

    em_situacao_rua = Column(Boolean, default=False)
    
    tempo_situacao_rua = Column(Enum(TempoSituacaoRuaEnum), nullable=True)
    recebe_beneficio = Column(Boolean, default=False)
    possui_referencia_familiar = Column(Boolean, default=False)
    
    visita_familiar_frequente = Column(Boolean, default=False)
    grau_parentesco_referencia = Column(String, nullable=True)

    acompanhado_outra_instituicao = Column(Boolean, default=False)
    instituicao_acompanhamento = Column(String, nullable=True)

    frequencia_alimentacao = Column(Enum(FrequenciaAlimentacaoEnum), nullable=True)
    origem_alimentacao = Column(ARRAY(String), nullable=True)

    tem_acesso_higiene_pessoal = Column(Boolean, default=False)
    higiene_pessoal_tipos = Column(ARRAY(String), nullable=True)

    resident = relationship("Resident", back_populates="health_situation")
    visit = relationship("Visit", back_populates="health_situation")
