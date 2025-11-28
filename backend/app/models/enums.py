from enum import Enum

class ImovelEnum(str, Enum):
    DOMICILIO = "domicilio"
    COMERCIO = "comercio"
    TERRENO_BALDIO = "terreno_baldio"
    PONTO_ESTRATEGICO = "ponto_estrategico"
    ESCOLA = "escola"
    CRECHE = "creche"
    ABRIGO = "abrigo"
    ILPI = "ilpi"
    UNIDADE_PRISIONAL = "unidade_prisional"
    MEDIDA_SOCIOEDUCATIVA = "unidade_medida_socioeducativa"
    DELEGACIA = "delegacia"
    ESTABELECIMENTO_RELIGIOSO = "estabelecimento_religioso"
    OUTROS = "outros"


class SituacaoMoradiaEnum(str, Enum):
    PROPRIO = "proprio"
    FINANCIADO = "financiado"
    ALUGADO = "alugado"
    ARRENDADO = "arrendado"
    CEDIDO = "cedido"
    OCUPACAO = "ocupacao"
    SITUACAO_RUA = "situacao_de_rua"
    OUTRA = "outra"


class DomicilioEnum(str, Enum):
    CASA = "casa"
    APARTAMENTO = "apartamento"
    COMODO = "comodo"
    OUTRO = "outro"


class MaterialParedesEnum(str, Enum):
    ALVENARIA = "alvenaria_tijolo"
    TAIPA = "taipa"
    MADEIRA = "madeira_aparelhada"
    MATERIAL_APROVEITADO = "material_aproveitado"
    PALHA = "palha"
    OUTRO = "outro"


class AbastecimentoAguaEnum(str, Enum):
    REDE_ENCANADA = "rede_encanada"
    POCO_NASCENTE = "poco_nascente"
    CISTERNA = "cisterna"
    CARRO_PIPA = "carro_pipa"
    OUTRO = "outro"


class TratamentoAguaEnum(str, Enum):
    FILTRADA = "filtrada"
    FERVIDA = "fervida"
    CLORADA = "clorada"
    MINERAL = "mineral"
    SEM_TRATAMENTO = "sem_tratamento"


class EscoamentoSanitarioEnum(str, Enum):
    REDE = "rede_coletora_pluvial"
    FOSSA_SEPTICA = "fossa_septica"
    FOSSA_RUDIMENTAR = "fossa_rudimentar"
    DIRETO_RIO = "direto_rio_lago_mar"
    CEU_ABERTO = "ceu_aberto"
    OUTRA = "outra"


class DestinoLixoEnum(str, Enum):
    COLETADO = "coletado"
    QUEIMADO_ENTERRADO = "queimado_enterrado"
    CEU_ABERTO = "ceu_aberto"
    OUTRO = "outro"


class PosseTerraEnum(str, Enum):
    PROPRIETARIO = "proprietario"
    PARCEIRO_MEEIRO = "parceiro_meeiro"
    ASSENTADO = "assentado"
    POSSEIRO = "posseiro"
    ARRENDATARIO = "arrendatario"
    COMODATARIO = "comodatario"
    BENEFICIARIO_BANCO_TERRA = "beneficiario_banco_da_terra"
    NAO_SE_APLICA = "nao_se_aplica"

class AcessoEnum(str, Enum):
    RUA_PAVIMENTADA = "rua_pavimentada"
    CHAO_BATIDO = "chao_batido"
    FLUVIAL = "fluvial"
    OUTRO = "outro"


#--- Enums Morador --- #

class SexoEnum(str, Enum):
    MASCULINO = "masculino"
    FEMININO = "feminino"


class RacaCorEnum(str, Enum):
    BRANCA = "branca"
    PRETA = "preta"
    PARDA = "parda"
    AMARELA = "amarela"
    INDIGENA = "indigena"


class NacionalidadeEnum(str, Enum):
    BRASILEIRA = "brasileira"
    NATURALIZADO = "naturalizado"
    ESTRANGEIRO = "estrangeiro"


class GrauParentescoEnum(str, Enum):
    CONJUGE_COMPANHEIRO = "conjuge_companheiro"
    FILHO = "filho"
    ENTEADO = "enteado"
    NETO_BISNETO = "neto_bisneto"
    PAI_MAE = "pai_mae"
    SOGRO = "sogro"
    IRMAO_IRMA = "irmao_irma"
    GENRO_NORA = "genro_nora"
    OUTRO_PARENTE = "outro_parente"
    NAO_PARENTE = "nao_parente"


class EscolaridadeEnum(str, Enum):
    CRECHE = "creche"
    PRE_ESCOLA = "pre_escola"
    ALFABETIZACAO = "alfabetizacao"
    FUNDAMENTAL_1_4 = "fundamental_1_4"
    FUNDAMENTAL_5_8 = "fundamental_5_8"
    FUNDAMENTAL_COMPLETO = "fundamental_completo"
    EJA_INICIAIS = "eja_iniciais"
    EJA_FINAIS = "eja_finais"
    MEDIO = "medio"
    MEDIO_EJA = "medio_eja"
    SUPERIOR = "superior"
    NENHUM = "nenhum"


class SituacaoMercadoEnum(str, Enum):
    EMPREGADOR = "empregador"
    ASSALARIADO_COM_CARTEIRA = "assalariado_com_carteira"
    ASSALARIADO_SEM_CARTEIRA = "assalariado_sem_carteira"
    AUTONOMO_COM_PREVIDENCIA = "autonomo_com_previdencia"
    AUTONOMO_SEM_PREVIDENCIA = "autonomo_sem_previdencia"
    APOSENTADO_PENSIONISTA = "aposentado_pensionista"
    DESEMPREGADO = "desempregado"
    NAO_TRABALHA = "nao_trabalha"
    SERVIDOR_PUBLICO = "servidor_publico"
    OUTRO = "outro"


class OrientacaoSexualEnum(str, Enum):
    HETEROSSEXUAL = "heterossexual"
    GAY = "gay"
    LESBICA = "lesbica"
    BISSEXUAL = "bissexual"
    OUTRO = "outro"


class IdentidadeGeneroEnum(str, Enum):
    HOMEM_TRANSEXUAL = "homem_transexual"
    MULHER_TRANSEXUAL = "mulher_transexual"
    TRAVESTI = "travesti"
    OUTRO = "outro"


# --- form saude --- #
class PesoSituacaoEnum(str, Enum): 
    abaixo_do_peso = "abaixo_do_peso"
    peso_adequado = "peso_adequado"
    acima_do_peso = "acima_do_peso"

class TempoSituacaoRuaEnum(str, Enum):
    menos_6_meses = "menos_6_meses"
    de_6_a_12_meses = "de_6_a_12_meses"
    de_1_a_5_anos = "de_1_a_5_anos"
    mais_5_anos = "mais_5_anos"

class FrequenciaAlimentacaoEnum(str, Enum):
    uma_vez = "uma_vez"
    duas_ou_tres_vezes = "duas_ou_tres_vezes"
    mais_de_tres_vezes = "mais_de_tres_vezes"
