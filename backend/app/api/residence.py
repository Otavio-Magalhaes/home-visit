from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2 import functions as geofunc


from app.core.database.database import get_session
from app.models.Residence import Residence
from app.schemas.residence_schema import ResidenciaCreate, ResidenciaResponse

router = APIRouter(tags=["Residences"])


@router.post("/", response_model=ResidenciaResponse)
def create_residence(
    payload: ResidenciaCreate, 
    db: Session = Depends(get_session)
):

    geo_point = None
    if payload.latitude and payload.longitude:
        geo_point = geofunc.ST_SetSRID(
            geofunc.ST_MakePoint(payload.longitude, payload.latitude),
            4326
        )

    residencia = Residence(
        responsavel_id=payload.responsavel_id,

        cep=payload.cep,
        municipio=payload.municipio,
        uf=payload.uf,
        bairro=payload.bairro,
        tipo_logradouro=payload.tipo_logradouro,
        nome_logradouro=payload.nome_logradouro,
        numero=None if payload.sem_numero else payload.numero,
        sem_numero=payload.sem_numero,
        complemento=payload.complemento,
        ponto_referencia=payload.ponto_referencia,
        microarea=payload.microarea,
        fora_de_area=payload.fora_de_area,

        telefone_residencia=payload.telefone_residencia,
        telefone_contato=payload.telefone_contato,

        tipo_imovel=payload.tipo_imovel,
        situacao_moradia=payload.situacao_moradia,
        tipo_domicilio=payload.tipo_domicilio,

        numero_moradores=payload.numero_moradores,
        numero_comodos=payload.numero_comodos,
        material_paredes=payload.material_paredes,
        revestimento_parede=payload.revestimento_parede,
        tipo_acesso=payload.tipo_acesso,
        disponibilidade_energia=payload.disponibilidade_energia,

        abastecimento_agua=payload.abastecimento_agua,
        tratamento_agua=payload.tratamento_agua,
        escoamento_sanitario=payload.escoamento_sanitario,
        destino_lixo=payload.destino_lixo,

        possui_animais=payload.possui_animais,
        animais_tipos=payload.animais_tipos,
        quantidade_animais=payload.quantidade_animais,

        condicao_posse_terra=payload.condicao_posse_terra,

        geo_location=geo_point,
    )

    db.add(residencia)
    db.commit()
    db.refresh(residencia)

    return residencia



@router.delete("/{residence_id}", status_code=204)
def delete_residence(residence_id: int, db: Session = Depends(get_session)):
    residence = db.query(Residence).filter(Residence.id == residence_id).first()

    if residence is None:
        raise HTTPException(status_code=404, detail="Residence not found")

    db.delete(residence)
    db.commit()

    return


from geoalchemy2 import functions as geofunc
from sqlalchemy import func

@router.get("/nearby", response_model=list[ResidenciaResponse])
def get_residences_nearby(
    lat: float,
    lon: float,
    radius: int = 1000,  # metros
    db: Session = Depends(get_session)
):
    point = geofunc.ST_SetSRID(geofunc.ST_MakePoint(lon, lat), 4326)

    results = (
        db.query(Residence)
        .filter(
            geofunc.ST_DWithin(
                Residence.geo_location,
                point,
                radius
            )
        )
        .order_by(
            geofunc.ST_Distance(Residence.geo_location, point)
        )
        .all()
    )

    return results
