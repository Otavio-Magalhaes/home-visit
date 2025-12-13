from pydantic import BaseModel
from typing import Optional, List
from app.models.enums import (
    ImovelEnum, SituacaoMoradiaEnum, DomicilioEnum, MaterialParedesEnum,
    AbastecimentoAguaEnum, EscoamentoSanitarioEnum, DestinoLixoEnum,
    SexoEnum, RacaCorEnum, EscolaridadeEnum, SituacaoMercadoEnum,
    PesoSituacaoEnum, TempoSituacaoRuaEnum, TratamentoAguaEnum,
    OrientacaoSexualEnum, IdentidadeGeneroEnum, FrequenciaAlimentacaoEnum
)

class DashboardFilterSchema(BaseModel):
    # ==========================================
    # 1. Âncora Geográfica
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
    
    abastecimento_agua: Optional[AbastecimentoAguaEnum] = None
    escoamento_sanitario: Optional[EscoamentoSanitarioEnum] = None
    destino_lixo: Optional[DestinoLixoEnum] = None
    material_paredes: Optional[MaterialParedesEnum] = None
    disponibilidade_energia: Optional[bool] = None
    tratamento_agua: Optional[TratamentoAguaEnum] = None
    possui_animais: Optional[bool] = None

    # ==========================================
    # 3. Filtros do Morador (Demográfico)
    # ==========================================
    sexo: Optional[SexoEnum] = None
    raca_cor: Optional[RacaCorEnum] = None
    
    idade_minima: Optional[int] = None
    idade_maxima: Optional[int] = None

    frequenta_escola: Optional[bool] = None
    escolaridade: Optional[EscolaridadeEnum] = None
    situacao_mercado: Optional[SituacaoMercadoEnum] = None
    
    possui_deficiencia: Optional[bool] = None
    eh_responsavel_familiar: Optional[bool] = None
    
    # --- NOVOS CAMPOS DO MORADOR QUE FALTAVAM ---
    orientacao_sexual: Optional[OrientacaoSexualEnum] = None
    identidade_genero: Optional[IdentidadeGeneroEnum] = None
    membro_povo_tradicional: Optional[bool] = None
    possui_plano_saude: Optional[bool] = None
    participa_grupos_comunitarios: Optional[bool] = None

    # ==========================================
    # 4. Filtros de Saúde (Risco e Condição)
    # ==========================================
    esta_gestante: Optional[bool] = None
    esta_acamado: Optional[bool] = None
    esta_domiciliado: Optional[bool] = None
    
    tem_hipertensao: Optional[bool] = None
    tem_diabetes: Optional[bool] = None
    tem_doenca_respiratoria: Optional[bool] = None
    tem_doenca_cardiaca: Optional[bool] = None
    tem_problemas_rins: Optional[bool] = None
    tem_hanseniase: Optional[bool] = None
    tem_tuberculose: Optional[bool] = None
    tem_cancer: Optional[bool] = None

    diagnostico_problema_mental: Optional[bool] = None
    usa_alcool: Optional[bool] = None
    usa_outras_drogas: Optional[bool] = None
    esta_fumante: Optional[bool] = None

    em_situacao_rua: Optional[bool] = None
    recebe_beneficio: Optional[bool] = None 

    # --- NOVOS CAMPOS DE SAÚDE QUE FALTAVAM ---
    teve_avc_derrame: Optional[bool] = None
    teve_infarto: Optional[bool] = None
    internacao_ultimos_12_meses: Optional[bool] = None
    usa_plantas_medicinais: Optional[bool] = None
    usa_praticas_integrativas: Optional[bool] = None
    
    # Filtros Invertidos (Sem higiene / Sem familia)
    tem_acesso_higiene_pessoal: Optional[bool] = None
    possui_referencia_familiar: Optional[bool] = None
    
    # Selects de Saúde
    peso_situacao: Optional[PesoSituacaoEnum] = None
    frequencia_alimentacao: Optional[FrequenciaAlimentacaoEnum] = None

    class Config:
      from_attributes = True