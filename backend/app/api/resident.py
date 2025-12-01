
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException

from app.core.database.database import get_session
from app.models import Resident
from app.schemas.resident_schema import ResidentCreate, ResidentResponse, ResidentUpdate
from sqlalchemy.orm import Session

router = APIRouter( tags=["Resident"] )


@router.post("/", response_model=ResidentResponse)
def create_resident(resident_in: ResidentCreate, db: Session = Depends(get_session)):
    resident = Resident(id=str(uuid4()),**resident_in.dict())
    db.add(resident)
    db.commit()
    db.refresh(resident)
    return resident

@router.get("/{resident_id}", response_model=ResidentResponse)
def get_resident(resident_id: str, db: Session = Depends(get_session)):
    resident = db.get(Resident, resident_id)
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    return resident


@router.patch("/{resident_id}", response_model=ResidentResponse)
def update_resident(
    resident_id: str,
    resident_in: ResidentUpdate,
    db: Session = Depends(get_session)
):
    resident = db.get(Resident, resident_id)
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    update_data = resident_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resident, field, value)

    db.add(resident)
    db.commit()
    db.refresh(resident)
    return resident

@router.delete("/{resident_id}")
def delete_resident(resident_id: str, db: Session = Depends(get_session)):
    resident = db.get(Resident, resident_id)
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    db.delete(resident)
    db.commit()
    return {"detail": "Resident deleted successfully"}

@router.get("/", response_model=list[ResidentResponse])
def list_residents( skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session)
):
    residents =  db.query(Resident).offset(skip).limit(limit).all()
    return residents