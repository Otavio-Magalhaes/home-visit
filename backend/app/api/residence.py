from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2 import WKTElement, functions as geofunc


from app.api.deps import get_current_active_user
from app.core.database.database import get_session
from app.models import User
from app.models.Residence import Residence
from app.schemas.residence_schema import ResidenciaCreate, ResidenciaResponse

router = APIRouter(tags=["Residences"])


@router.post("/", response_model=ResidenciaResponse)
def create_residence(
    payload: ResidenciaCreate, 
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    geo_point = None
    if payload.latitude is not None and payload.longitude is not None:
        geo_point = WKTElement(f'POINT({payload.longitude} {payload.latitude})', srid=4326)

    residencia = Residence(
        responsavel_id=current_user.id, 
        
        **payload.dict(), 
        
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


@router.get("/", response_model=list[ResidenciaResponse])
def get_all_residences(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user) 
):
    residences = db.query(Residence).offset(skip).limit(limit).all()
    return residences