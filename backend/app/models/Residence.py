from geoalchemy2.shape import to_shape
from sqlalchemy.orm import relationship
from app.core.database.database import Base
# from app.models.Timestamp import TimestampedModel # Descomente se for usar

from sqlalchemy import (
    Column, ForeignKey, String, Integer, Boolean, Enum
)
from sqlalchemy.dialects.postgresql import ARRAY
from geoalchemy2 import Geometry
from app.models.enums import (
    AbastecimentoAguaEnum, AcessoEnum, DestinoLixoEnum, DomicilioEnum, 
    EscoamentoSanitarioEnum, ImovelEnum, MaterialParedesEnum, PosseTerraEnum, 
    SituacaoMoradiaEnum, TratamentoAguaEnum
)
# Certifique-se que o import do User está correto no seu projeto
# from.User import User 
from sqlalchemy.ext.hybrid import hybrid_property


class Residence(Base):
    __tablename__ = "residence"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    responsavel_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )
    cep = Column(String(8), nullable=False)
    municipio = Column(String, nullable=False)
    uf = Column(String(2), nullable=False)
    bairro = Column(String, nullable=False)
    tipo_logradouro = Column(String, nullable=False)
    nome_logradouro = Column(String, nullable=False)
    numero = Column(String, nullable=False)
    sem_numero = Column(Boolean, default=False)
    complemento = Column(String, nullable=True)
    ponto_referencia = Column(String, nullable=True)
    microarea = Column(String, nullable=False)
    fora_de_area = Column(Boolean, default=False)

    telefone_residencia = Column(String, nullable=True)
    telefone_contato = Column(String, nullable=True)

    tipo_imovel = Column(Enum(ImovelEnum), nullable=False)
    situacao_moradia = Column(Enum(SituacaoMoradiaEnum), nullable=False)
    tipo_domicilio = Column(Enum(DomicilioEnum), nullable=False)

    numero_moradores = Column(Integer, nullable=False)
    numero_comodos = Column(Integer, nullable=False)
    material_paredes = Column(Enum(MaterialParedesEnum), nullable=False)
    revestimento_parede = Column(Boolean, nullable=False)
    tipo_acesso = Column(Enum(AcessoEnum), nullable=False)
    disponibilidade_energia = Column(Boolean, nullable=False)

    abastecimento_agua = Column(Enum(AbastecimentoAguaEnum), nullable=False)
    tratamento_agua = Column(Enum(TratamentoAguaEnum), nullable=False)
    escoamento_sanitario = Column(Enum(EscoamentoSanitarioEnum), nullable=False)
    destino_lixo = Column(Enum(DestinoLixoEnum), nullable=False)

    possui_animais = Column(Boolean, nullable=False)
    animais_tipos = Column(ARRAY(String), nullable=True)
    quantidade_animais = Column(Integer, nullable=True)

    condicao_posse_terra = Column(Enum(PosseTerraEnum), nullable=True)

    # Relacionamentos
    responsavel = relationship("User", back_populates="residencias")

    residents = relationship(
        "Resident",
        back_populates="residence",
        cascade="all, delete-orphan"
    )

    geo_location = Column(Geometry("POINT", srid=4326), nullable=True)


    @hybrid_property
    def latitude(self):
        if self.geo_location is not None:
            if isinstance(self.geo_location, str):
                return 0 
            point = to_shape(self.geo_location)
            return point.y
        return None

    @latitude.setter
    def latitude(self, value):
        current_long = self.longitude if self.longitude is not None else 0
        self.geo_location = f'SRID=4326;POINT({current_long} {value})'

    @hybrid_property
    def longitude(self):
        if self.geo_location is not None:
            if isinstance(self.geo_location, str):
                return 0
            point = to_shape(self.geo_location)
            return point.x
        return None

    @longitude.setter
    def longitude(self, value):
        current_lat = self.latitude if self.latitude is not None else 0
        self.geo_location = f'SRID=4326;POINT({value} {current_lat})'