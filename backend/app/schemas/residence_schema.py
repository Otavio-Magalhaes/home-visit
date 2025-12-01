from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.enums import (
  AbastecimentoAguaEnum,
  AcessoEnum,
  DestinoLixoEnum,
  DomicilioEnum,
  EscoamentoSanitarioEnum,
  ImovelEnum,
  MaterialParedesEnum,
  PosseTerraEnum,
  SituacaoMoradiaEnum,
  TratamentoAguaEnum,
)


class ResidenciaBase(BaseModel):
  # Localização e Endereço
  cep: str = Field(max_length=8)
  municipio: str
  uf: str = Field(max_length=2)
  bairro: str
  tipo_logradouro: str
  nome_logradouro: str
  numero: str
  sem_numero: bool = False
  complemento: Optional[str] = None
  ponto_referencia: Optional[str] = None
  microarea: str
  fora_de_area: bool = False

  # Contato
  telefone_residencia: Optional[str] = None
  telefone_contato: Optional[str] = None

  # Caracterização do Imóvel
  tipo_imovel: ImovelEnum
  situacao_moradia: SituacaoMoradiaEnum
  tipo_domicilio: DomicilioEnum

  # Estrutura Física
  numero_moradores: int
  numero_comodos: int
  material_paredes: MaterialParedesEnum
  revestimento_parede: bool
  tipo_acesso: AcessoEnum
  disponibilidade_energia: bool

  # Saneamento e Água
  abastecimento_agua: AbastecimentoAguaEnum
  tratamento_agua: TratamentoAguaEnum
  escoamento_sanitario: EscoamentoSanitarioEnum
  destino_lixo: DestinoLixoEnum

  # Animais
  possui_animais: bool
  animais_tipos: Optional[List[str]] = None
  quantidade_animais: Optional[int] = None

  # Rural
  condicao_posse_terra: Optional[PosseTerraEnum] = None

  latitude: Optional[float] = None
  longitude: Optional[float] = None



class ResidenciaCreate(ResidenciaBase):
  """Tudo obrigatório que vem do front para criação."""
  pass


class ResidenciaUpdate(BaseModel):
  """Tudo opcional para update."""
  cep: Optional[str] = Field(None, max_length=8)
  municipio: Optional[str] = None
  uf: Optional[str] = Field(None, max_length=2)
  bairro: Optional[str] = None
  tipo_logradouro: Optional[str] = None
  nome_logradouro: Optional[str] = None
  numero: Optional[str] = None
  sem_numero: Optional[bool] = None
  complemento: Optional[str] = None
  ponto_referencia: Optional[str] = None
  microarea: Optional[str] = None
  fora_de_area: Optional[bool] = None

  telefone_residencia: Optional[str] = None
  telefone_contato: Optional[str] = None

  tipo_imovel: Optional[ImovelEnum] = None
  situacao_moradia: Optional[SituacaoMoradiaEnum] = None
  tipo_domicilio: Optional[DomicilioEnum] = None

  numero_moradores: Optional[int] = None
  numero_comodos: Optional[int] = None
  material_paredes: Optional[MaterialParedesEnum] = None
  revestimento_parede: Optional[bool] = None
  tipo_acesso: Optional[AcessoEnum] = None
  disponibilidade_energia: Optional[bool] = None

  abastecimento_agua: Optional[AbastecimentoAguaEnum] = None
  tratamento_agua: Optional[TratamentoAguaEnum] = None
  escoamento_sanitario: Optional[EscoamentoSanitarioEnum] = None
  destino_lixo: Optional[DestinoLixoEnum] = None

  possui_animais: Optional[bool] = None
  animais_tipos: Optional[List[str]] = None
  quantidade_animais: Optional[int] = None

  condicao_posse_terra: Optional[PosseTerraEnum] = None

  latitude: Optional[float] = None
  longitude: Optional[float] = None


class ResidenciaResponse(ResidenciaBase):
  id: int
  latitude: Optional[float] = None
  longitude: Optional[float] = None

  class Config:
    from_attributes = True
