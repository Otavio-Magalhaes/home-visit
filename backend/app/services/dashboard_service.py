from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, case, distinct, and_
from geoalchemy2 import Geography
from geoalchemy2.elements import WKTElement

from app.models.Residence import Residence
from app.models.Resident import Resident
from app.models.HealthSituation import HealthSituation
from app.schemas.dashboard_schema import DashboardFilterSchema


def _apply_dashboard_filters(db: Session, filters: DashboardFilterSchema):  
    center_point = WKTElement(f'POINT({filters.longitude} {filters.latitude})', srid=4326)

    query = db.query(Resident)\
        .join(Residence, Resident.residence_id == Residence.id)\
        .outerjoin(HealthSituation, Resident.id == HealthSituation.resident_id)

    query = query.filter(
        func.ST_DWithin(
            cast(Residence.geo_location, Geography), 
            cast(center_point, Geography), 
            filters.radius_meters
        )
    )

    if filters.sexo:
        query = query.filter(Resident.sexo == filters.sexo)
    if filters.raca_cor:
        query = query.filter(Resident.raca_cor == filters.raca_cor)
    if filters.escolaridade:
        query = query.filter(Resident.escolaridade == filters.escolaridade)
    if filters.situacao_mercado:
        query = query.filter(Resident.situacao_mercado == filters.situacao_mercado)
    if filters.frequenta_escola is not None:
        query = query.filter(Resident.frequenta_escola == filters.frequenta_escola)
    if filters.possui_deficiencia is not None:
        query = query.filter(Resident.possui_deficiencia == filters.possui_deficiencia)
    if filters.eh_responsavel_familiar is not None:
        query = query.filter(Resident.eh_responsavel_familiar == filters.eh_responsavel_familiar)

    # --- Lógica de Idade ---
    if filters.idade_minima:
        dt_limite = date.today() - timedelta(days=filters.idade_minima * 365.25)
        query = query.filter(Resident.data_nascimento <= dt_limite)
    
    if filters.idade_maxima:
        dt_limite = date.today() - timedelta(days=filters.idade_maxima * 365.25)
        query = query.filter(Resident.data_nascimento >= dt_limite)

    # --- Filtros de RESIDÊNCIA (Residence) ---
    if filters.microarea:
        query = query.filter(Residence.microarea == filters.microarea)
    if filters.tipo_imovel:
        query = query.filter(Residence.tipo_imovel == filters.tipo_imovel)
    if filters.situacao_moradia:
        query = query.filter(Residence.situacao_moradia == filters.situacao_moradia)
    if filters.abastecimento_agua:
        query = query.filter(Residence.abastecimento_agua == filters.abastecimento_agua)
    if filters.escoamento_sanitario:
        query = query.filter(Residence.escoamento_sanitario == filters.escoamento_sanitario)
    if filters.destino_lixo:
        query = query.filter(Residence.destino_lixo == filters.destino_lixo)
    if filters.material_paredes:
        query = query.filter(Residence.material_paredes == filters.material_paredes)
    if filters.disponibilidade_energia is not None:
        query = query.filter(Residence.disponibilidade_energia == filters.disponibilidade_energia)
    if filters.possui_animais is not None:
        query = query.filter(Residence.possui_animais == filters.possui_animais)

    # --- Filtros de SAÚDE (HealthSituation) ---
    if filters.esta_gestante is not None:
        query = query.filter(HealthSituation.esta_gestante == filters.esta_gestante)
    if filters.esta_acamado is not None:
        query = query.filter(HealthSituation.esta_acamado == filters.esta_acamado)
    if filters.esta_domiciliado is not None:
        query = query.filter(HealthSituation.esta_domiciliado == filters.esta_domiciliado)
    
    # Doenças
    if filters.tem_hipertensao is not None:
        query = query.filter(HealthSituation.tem_hipertensao == filters.tem_hipertensao)
    if filters.tem_diabetes is not None:
        query = query.filter(HealthSituation.tem_diabetes == filters.tem_diabetes)
    if filters.tem_doenca_respiratoria is not None:
        query = query.filter(HealthSituation.tem_doenca_respiratoria == filters.tem_doenca_respiratoria)
    if filters.tem_doenca_cardiaca is not None:
        query = query.filter(HealthSituation.tem_doenca_cardiaca == filters.tem_doenca_cardiaca)
    if filters.tem_problemas_rins is not None:
        query = query.filter(HealthSituation.tem_problemas_rins == filters.tem_problemas_rins)
    if filters.tem_hanseniase is not None:
        query = query.filter(HealthSituation.tem_hanseniase == filters.tem_hanseniase)
    if filters.tem_tuberculose is not None:
        query = query.filter(HealthSituation.tem_tuberculose == filters.tem_tuberculose)
    if filters.tem_cancer is not None:
        query = query.filter(HealthSituation.tem_cancer == filters.tem_cancer)

    # Outros riscos
    if filters.diagnostico_problema_mental is not None:
        query = query.filter(HealthSituation.diagnostico_problema_mental == filters.diagnostico_problema_mental)
    if filters.usa_alcool is not None:
        query = query.filter(HealthSituation.usa_alcool == filters.usa_alcool)
    if filters.usa_outras_drogas is not None:
        query = query.filter(HealthSituation.usa_outras_drogas == filters.usa_outras_drogas)
    if filters.esta_fumante is not None:
        query = query.filter(HealthSituation.esta_fumante == filters.esta_fumante)
    if filters.em_situacao_rua is not None:
        query = query.filter(HealthSituation.em_situacao_rua == filters.em_situacao_rua)
    if filters.recebe_beneficio is not None:
        query = query.filter(HealthSituation.recebe_beneficio == filters.recebe_beneficio)

    return query

def get_dashboard_statistics(db: Session, filters: DashboardFilterSchema):
  base_query = _apply_dashboard_filters(db, filters)

  stats = base_query.with_entities(
      func.count(Resident.id).label("total_pessoas"),
      func.count(distinct(Residence.id)).label("total_domicilios"),
      
      func.sum(case((HealthSituation.tem_hipertensao == True, 1), else_=0)).label("qtd_hipertensos"),
      func.sum(case((HealthSituation.tem_diabetes == True, 1), else_=0)).label("qtd_diabeticos"),
      func.sum(case((HealthSituation.esta_gestante == True, 1), else_=0)).label("qtd_gestantes"),
      func.sum(case((HealthSituation.em_situacao_rua == True, 1), else_=0)).label("qtd_situacao_rua"),
      func.sum(case((Resident.possui_deficiencia == True, 1), else_=0)).label("qtd_com_deficiencia"),
  ).first()

  return {
      "filtros_aplicados": filters.dict(exclude_none=True),
      "resultados": {
          "total_pessoas": stats.total_pessoas or 0,
          "total_domicilios": stats.total_domicilios or 0,
          "risco_saude": {
              "hipertensos": stats.qtd_hipertensos or 0,
              "diabeticos": stats.qtd_diabeticos or 0,
              "gestantes": stats.qtd_gestantes or 0,
          },
          "vulnerabilidade": {
              "situacao_rua": stats.qtd_situacao_rua or 0,
              "com_deficiencia": stats.qtd_com_deficiencia or 0
          }
      }
  }

def get_dashboard_map_pins(db: Session, filters: DashboardFilterSchema):
    """
    Retorna a lista de residências para plotar no mapa.
    """
    base_query = _apply_dashboard_filters(db, filters)

    pins = base_query.with_entities(
        Residence.id,
        Residence.latitude, 
        Residence.longitude,
        Residence.nome_logradouro,
        Residence.numero,
        Residence.bairro
    ).group_by(Residence.id).all()

    # 3. Formata para o Frontend
    return [
        {
            "id": str(pin.id), # Converter para string se for UUID
            "lat": pin.latitude,
            "lng": pin.longitude,
            "titulo": f"{pin.nome_logradouro}, {pin.numero} - {pin.bairro}"
        }
        for pin in pins
    ]