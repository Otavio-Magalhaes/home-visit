from pydantic import BaseModel
from typing import Optional, List
from app.models.enums import (
    ImovelEnum, SituacaoMoradiaEnum, DomicilioEnum, MaterialParedesEnum,
    AbastecimentoAguaEnum, EscoamentoSanitarioEnum, DestinoLixoEnum,
    SexoEnum, RacaCorEnum, EscolaridadeEnum, SituacaoMercadoEnum,
    PesoSituacaoEnum, TempoSituacaoRuaEnum
)

class DashboardFilterSchema(BaseModel):
    # ==========================================
    # 1. Âncora Geográfica (Obrigatórios)
    # ==========================================
    latitude: float
    longitude: float
    radius_meters: float = 1000  

    # ==========================================
    # 2. Filtros de Residência (Infraestrutura)
    # ==========================================
    microarea: Optional[str] = None
    tipo_imovel: Optional[ImovelEnum] = None
    situacao_moradia: Optional[SituacaoMoradiaEnum] = None
    
    # Vulnerabilidade Sanitária
    abastecimento_agua: Optional[AbastecimentoAguaEnum] = None
    escoamento_sanitario: Optional[EscoamentoSanitarioEnum] = None
    destino_lixo: Optional[DestinoLixoEnum] = None
    material_paredes: Optional[MaterialParedesEnum] = None
    disponibilidade_energia: Optional[bool] = None
    
    possui_animais: Optional[bool] = None

    # ==========================================
    # 3. Filtros do Morador (Demográfico)
    # ==========================================
    sexo: Optional[SexoEnum] = None
    raca_cor: Optional[RacaCorEnum] = None
    
    # Filtro de Idade (Calculado no Backend vs Data Nascimento)
    idade_minima: Optional[int] = None
    idade_maxima: Optional[int] = None

    # Social e Educação
    frequenta_escola: Optional[bool] = None
    escolaridade: Optional[EscolaridadeEnum] = None
    situacao_mercado: Optional[SituacaoMercadoEnum] = None # Ex: Filtrar Desempregados
    
    possui_deficiencia: Optional[bool] = None
    eh_responsavel_familiar: Optional[bool] = None # Útil para contar "Famílias" em vez de pessoas

    # ==========================================
    # 4. Filtros de Saúde (Risco e Condição)
    # ==========================================
    # Grupos de Risco
    esta_gestante: Optional[bool] = None
    esta_acamado: Optional[bool] = None
    esta_domiciliado: Optional[bool] = None
    
    # Doenças Crônicas (As mais buscadas)
    tem_hipertensao: Optional[bool] = None
    tem_diabetes: Optional[bool] = None
    tem_doenca_respiratoria: Optional[bool] = None
    tem_doenca_cardiaca: Optional[bool] = None
    tem_problemas_rins: Optional[bool] = None
    tem_hanseniase: Optional[bool] = None
    tem_tuberculose: Optional[bool] = None
    tem_cancer: Optional[bool] = None

    # Saúde Mental e Vícios
    diagnostico_problema_mental: Optional[bool] = None
    usa_alcool: Optional[bool] = None
    usa_outras_drogas: Optional[bool] = None
    esta_fumante: Optional[bool] = None

    # Vulnerabilidade Social Extrema
    em_situacao_rua: Optional[bool] = None
    recebe_beneficio: Optional[bool] = None 

    class Config:
      from_attributes = True