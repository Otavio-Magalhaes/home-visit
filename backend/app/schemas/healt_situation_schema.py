from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
from app.models.enums import (
    PesoSituacaoEnum, TempoSituacaoRuaEnum, FrequenciaAlimentacaoEnum
)

class HealthSituationBase(BaseModel):
    resident_id: str
    visit_id: int

    # Condições Gerais
    esta_gestante: Optional[bool] = False
    maternidade_referencia: Optional[str]

    peso_situacao: Optional[PesoSituacaoEnum]

    esta_fumante: Optional[bool] = False
    usa_alcool: Optional[bool] = False
    usa_outras_drogas: Optional[bool] = False

    # Doenças / Condições Crônicas
    tem_hipertensao: Optional[bool] = False
    tem_diabetes: Optional[bool] = False
    teve_avc_derrame: Optional[bool] = False
    teve_infarto: Optional[bool] = False

    # Doença Cardíaca
    tem_doenca_cardiaca: Optional[bool] = False
    doencas_cardiacas_tipos: Optional[List[str]] = []

    # Problemas nos Rins
    tem_problemas_rins: Optional[bool] = False
    problemas_rins_tipos: Optional[List[str]] = []

    # Doença Respiratória
    tem_doenca_respiratoria: Optional[bool] = False
    doenca_respiratoria_tipos: Optional[List[str]] = []

    # Outras Doenças
    tem_hanseniase: Optional[bool] = False
    tem_tuberculose: Optional[bool] = False
    tem_cancer: Optional[bool] = False

    # Internação e Saúde Mental
    internacao_ultimos_12_meses: Optional[bool] = False
    causa_internacao: Optional[str]

    diagnostico_problema_mental: Optional[bool] = False

    # Mobilidade e Práticas
    esta_acamado: Optional[bool] = False
    esta_domiciliado: Optional[bool] = False

    usa_plantas_medicinais: Optional[bool] = False
    plantas_medicinais_desc: Optional[str]

    usa_praticas_integrativas: Optional[bool] = False

    outras_condicoes_1: Optional[str]
    outras_condicoes_2: Optional[str]
    outras_condicoes_3: Optional[str]

    # Situação de Rua
    em_situacao_rua: Optional[bool] = False
    tempo_situacao_rua: Optional[TempoSituacaoRuaEnum]
    recebe_beneficio: Optional[bool] = False
    possui_referencia_familiar: Optional[bool] = False
    visita_familiar_frequente: Optional[bool] = False
    grau_parentesco_referencia: Optional[str]
    acompanhado_outra_instituicao: Optional[bool] = False
    instituicao_acompanhamento: Optional[str]

    # Alimentação
    frequencia_alimentacao: Optional[FrequenciaAlimentacaoEnum]
    origem_alimentacao: Optional[List[str]] = []

    # Higiene
    tem_acesso_higiene_pessoal: Optional[bool] = False
    higiene_pessoal_tipos: Optional[List[str]] = []

class HealthSituationCreate(HealthSituationBase):
  pass

class HealthSituationUpdate(HealthSituationBase):
  pass

class HealthSituationResponse(HealthSituationBase):
  id: int
  created_at: datetime
  updated_at: Optional[datetime]

  class Config:
      orm_mode = True
