from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database.database import  get_session
from app.models.Visit import Visit
from app.schemas.visit_schema import VisitCreate, VisitResponse

router = APIRouter( tags=["Visits"])


@router.post("/", response_model=VisitResponse)
def create_visit(data: VisitCreate, db: Session = Depends(get_session)):
    visit = Visit(**data.dict())

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


@router.get("/", response_model=list[VisitResponse])
def list_visits(db: Session = Depends(get_session)):
    return db.query(Visit).all()


@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: int, db: Session = Depends(get_session)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visita não encontrada")

    return visit


@router.delete("/{visit_id}")
def delete_visit(visit_id: int, db: Session = Depends(get_session)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visita não encontrada")

    db.delete(visit)
    db.commit()

    return {"detail": "Visita removida com sucesso"}
