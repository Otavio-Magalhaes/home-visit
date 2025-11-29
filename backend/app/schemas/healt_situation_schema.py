from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
from app.models.enums import (
    PesoSituacaoEnum, TempoSituacaoRuaEnum, FrequenciaAlimentacaoEnum
)

class HealthSituationBase(BaseModel):
  # Condições Gerais
    esta_gestante: bool = False
    maternidade_referencia: Optional[str] = None # <--- Importante: = None

    peso_situacao: Optional[PesoSituacaoEnum] = None

    esta_fumante: bool = False
    usa_alcool: bool = False
    usa_outras_drogas: bool = False

    # Doenças / Condições Crônicas
    tem_hipertensao: bool = False
    tem_diabetes: bool = False
    teve_avc_derrame: bool = False
    teve_infarto: bool = False

    # Doença Cardíaca
    tem_doenca_cardiaca: bool = False
    doencas_cardiacas_tipos: Optional[List[str]] = []

    # Problemas nos Rins
    tem_problemas_rins: bool = False
    problemas_rins_tipos: Optional[List[str]] = []

    # Doença Respiratória
    tem_doenca_respiratoria: bool = False
    doenca_respiratoria_tipos: Optional[List[str]] = []

    # Outras Doenças
    tem_hanseniase: bool = False
    tem_tuberculose: bool = False
    tem_cancer: bool = False

    # Internação e Saúde Mental
    internacao_ultimos_12_meses: bool = False
    causa_internacao: Optional[str] = None # <--- = None

    diagnostico_problema_mental: bool = False

    # Mobilidade e Práticas
    esta_acamado: bool = False
    esta_domiciliado: bool = False

    usa_plantas_medicinais: bool = False
    plantas_medicinais_desc: Optional[str] = None

    usa_praticas_integrativas: bool = False

    outras_condicoes_1: Optional[str] = None
    outras_condicoes_2: Optional[str] = None
    outras_condicoes_3: Optional[str] = None

    # Situação de Rua
    em_situacao_rua: bool = False
    tempo_situacao_rua: Optional[TempoSituacaoRuaEnum] = None
    recebe_beneficio: bool = False
    possui_referencia_familiar: bool = False
    visita_familiar_frequente: bool = False
    grau_parentesco_referencia: Optional[str] = None
    acompanhado_outra_instituicao: bool = False
    instituicao_acompanhamento: Optional[str] = None

    # Alimentação
    frequencia_alimentacao: Optional[FrequenciaAlimentacaoEnum] = None
    origem_alimentacao: Optional[List[str]] = []

    # Higiene
    tem_acesso_higiene_pessoal: bool = False
    higiene_pessoal_tipos: Optional[List[str]] = []

class HealthSituationCreateNested(HealthSituationBase):
    pass

class HealthSituationCreate(HealthSituationBase):
  resident_id: str
  visit_id: int

class HealthSituationUpdate(HealthSituationBase):
  pass

class HealthSituationResponse(HealthSituationBase):
  id: int
  created_at: datetime
  updated_at: Optional[datetime]

  class Config:
      orm_mode = True
