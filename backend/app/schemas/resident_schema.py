from typing import Any, List, Optional
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ValidationInfo, field_validator

from app.models.enums import EscolaridadeEnum, GrauParentescoEnum, IdentidadeGeneroEnum, NacionalidadeEnum, OrientacaoSexualEnum, RacaCorEnum, SexoEnum, SituacaoMercadoEnum
from .residence_schema import ResidenciaResponse



class ResidentBase(BaseModel):
    residence_id: int

    # Identificação
    cns: Optional[str] = None
    cpf: Optional[str] = None
    nome_completo: str
    nome_social: Optional[str] = None
    data_nascimento: date
    sexo: SexoEnum
    raca_cor: RacaCorEnum
    etnia: Optional[str] = None
    nis_pis_pasep: Optional[str] = None

    # Filiação
    nome_mae: Optional[str] = None
    mae_desconhecida: bool = False
    nome_pai: Optional[str] = None
    pai_desconhecido: bool = False

    # Nacionalidade
    nacionalidade: NacionalidadeEnum
    pais_nascimento: Optional[str] = None
    dt_naturalizacao: Optional[date] = None
    portaria_naturalizacao: Optional[str] = None
    municipio_nascimento: Optional[str] = None

    # Contato
    telefone_celular: Optional[str] = None
    email: Optional[EmailStr] = None

    # Responsabilidade familiar
    eh_responsavel_familiar: bool = False
    cns_cpf_responsavel: Optional[str] = None
    relacao_parentesco: Optional[GrauParentescoEnum] = None

    # Sociodemográfico
    ocupacao: Optional[str] = None
    frequenta_escola: bool = False
    escolaridade: Optional[EscolaridadeEnum] = None
    situacao_mercado: Optional[SituacaoMercadoEnum] = None

    # Crianças 0–9 anos
    responsavel_crianca: Optional[List[str]] = None

    frequenta_cuidador: bool = False
    participa_grupos_comunitarios: bool = False
    possui_plano_saude: bool = False

    membro_povo_tradicional: bool = False
    povo_tradicional_desc: Optional[str] = None

    # Identidade e deficiência
    orientacao_sexual: Optional[OrientacaoSexualEnum] = None
    identidade_genero: Optional[IdentidadeGeneroEnum] = None

    possui_deficiencia: bool = False
    deficiencias_tipo: Optional[List[str]] = None

    # Saída do cadastro
    saida_cadastro: bool = False
    motivo_saida: Optional[str] = None
    data_obito: Optional[date] = None
    numero_do: Optional[str] = None

    @field_validator('*', mode='before')
    @classmethod
    def empty_string_to_none(cls, v: Any, info: ValidationInfo) -> Any:
        """
        Transforma strings vazias ('') vindas do React em None
        para não quebrar campos opcionais de Data, Email ou Enum.
        """
        if v == "":
            return None
        return v
    
    
class ResidentCreate(ResidentBase):
    pass



class ResidentUpdate(BaseModel):
    residence_id: Optional[int] = None

    cns: Optional[str] = None
    cpf: Optional[str] = None
    nome_completo: Optional[str] = None
    nome_social: Optional[str] = None
    data_nascimento: Optional[date] = None
    sexo: Optional[SexoEnum] = None
    raca_cor: Optional[RacaCorEnum] = None
    etnia: Optional[str] = None
    nis_pis_pasep: Optional[str] = None

    nome_mae: Optional[str] = None
    mae_desconhecida: Optional[bool] = None
    nome_pai: Optional[str] = None
    pai_desconhecido: Optional[bool] = None

    nacionalidade: Optional[NacionalidadeEnum] = None
    pais_nascimento: Optional[str] = None
    dt_naturalizacao: Optional[date] = None
    portaria_naturalizacao: Optional[str] = None
    municipio_nascimento: Optional[str] = None

    telefone_celular: Optional[str] = None
    email: Optional[EmailStr] = None

    eh_responsavel_familiar: Optional[bool] = None
    cns_cpf_responsavel: Optional[str] = None
    relacao_parentesco: Optional[GrauParentescoEnum] = None

    ocupacao: Optional[str] = None
    frequenta_escola: Optional[bool] = None
    escolaridade: Optional[EscolaridadeEnum] = None
    situacao_mercado: Optional[SituacaoMercadoEnum] = None

    responsavel_crianca: Optional[List[str]] = None
    frequenta_cuidador: Optional[bool] = None
    participa_grupos_comunitarios: Optional[bool] = None
    possui_plano_saude: Optional[bool] = None

    membro_povo_tradicional: Optional[bool] = None
    povo_tradicional_desc: Optional[str] = None

    orientacao_sexual: Optional[OrientacaoSexualEnum] = None
    identidade_genero: Optional[IdentidadeGeneroEnum] = None

    possui_deficiencia: Optional[bool] = None
    deficiencias_tipo: Optional[List[str]] = None

    saida_cadastro: Optional[bool] = None
    motivo_saida: Optional[str] = None
    data_obito: Optional[date] = None
    numero_do: Optional[str] = None




class ResidentResponse(ResidentBase):
    id: str


    class Config:
        from_attributes = True

class Resident(ResidentResponse):
    pass

