from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database.database import get_session
from app.models.HealthSituation import HealthSituation
from app.models.Resident import Resident
from app.schemas.healt_situation_schema import HealthSituationCreate, HealthSituationResponse, HealthSituationUpdate

router = APIRouter(prefix="/health-situations", tags=["Health Situations"])

@router.post("/", response_model=HealthSituationResponse)
def create_health_situation_manual(data: HealthSituationCreate, db: Session = Depends(get_session)):
    resident = db.query(Resident).filter(Resident.id == data.resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    existing = db.query(HealthSituation).filter(HealthSituation.visit_id == data.visit_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Já existe ficha de saúde para esta visita.")

    health = HealthSituation(**data.dict())
    db.add(health)
    db.commit()
    db.refresh(health)
    return health

@router.get("/latest/{resident_id}", response_model=HealthSituationResponse)
def get_latest_health_situation(resident_id: str, db: Session = Depends(get_session)):
    health = db.query(HealthSituation)\
        .filter(HealthSituation.resident_id == resident_id)\
        .order_by(desc(HealthSituation.id))\
        .first()

    if not health:
        raise HTTPException(status_code=404, detail="Nenhuma ficha de saúde encontrada para este morador")

    return health

@router.get("/visit/{visit_id}", response_model=HealthSituationResponse)
def get_health_by_visit(visit_id: int, db: Session = Depends(get_session)):
    health = db.query(HealthSituation).filter(HealthSituation.visit_id == visit_id).first()
    if not health:
        raise HTTPException(status_code=404, detail="Ficha não encontrada nesta visita")
    return health

@router.put("/{health_id}", response_model=HealthSituationResponse)
def update_health_situation(
    health_id: int,
    data: HealthSituationUpdate,
    db: Session = Depends(get_session),
):
    health = db.query(HealthSituation).filter(HealthSituation.id == health_id).first()

    if not health:
        raise HTTPException(status_code=404, detail="Health situation not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(health, field, value)

    db.commit()
    db.refresh(health)
    return health

@router.delete("/{health_id}")
def delete_health_situation(health_id: int, db: Session = Depends(get_session)):
    health = db.query(HealthSituation).filter(HealthSituation.id == health_id).first()

    if not health:
        raise HTTPException(status_code=404, detail="Health situation not found")

    db.delete(health)
    db.commit()
    return {"detail": "Health situation deleted"}