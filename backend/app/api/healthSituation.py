from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database.database import  get_session

from app.models.HealthSituation import HealthSituation
from app.models.Resident import Resident
from app.schemas.healt_situation_schema import HealthSituationCreate, HealthSituationResponse, HealthSituationUpdate

router = APIRouter( tags=["Health Situations"])


@router.post("/", response_model=HealthSituationResponse)
def create_health_situation(data: HealthSituationCreate, db: Session = Depends(get_session)):
    resident = db.query(Resident).filter(Resident.id == data.resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    existing_for_visit = db.query(HealthSituation).filter(
        HealthSituation.visit_id == data.visit_id
    ).first()

    if existing_for_visit:
        raise HTTPException(
            status_code=400,
            detail="A health situation for this visit already exists."
        )

    health = HealthSituation(**data.dict())
    db.add(health)
    db.commit()
    db.refresh(health)

    return health



@router.get("/{resident_id}", response_model=HealthSituationResponse)
def get_health_situation(resident_id: str, db: Session = Depends(get_session)):
    health = db.query(HealthSituation).filter(
        HealthSituation.resident_id == resident_id
    ).first()

    if not health:
        raise HTTPException(status_code=404, detail="Health situation not found")

    return health


@router.put("/{resident_id}", response_model=HealthSituationResponse)
def update_health_situation(
    resident_id: str,
    data: HealthSituationUpdate,
    db: Session = Depends(get_session),
):
    health = db.query(HealthSituation).filter(
        HealthSituation.resident_id == resident_id
    ).first()

    if not health:
        raise HTTPException(status_code=404, detail="Health situation not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(health, field, value)

    db.commit()
    db.refresh(health)

    return health


@router.delete("/{resident_id}")
def delete_health_situation(resident_id: str, db: Session = Depends(get_session)):
    health = db.query(HealthSituation).filter(
        HealthSituation.resident_id == resident_id
    ).first()

    if not health:
        raise HTTPException(status_code=404, detail="Health situation not found")

    db.delete(health)
    db.commit()

    return {"detail": "Health situation deleted"}
