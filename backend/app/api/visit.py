from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database.database import  get_session
from app.models.Visit import Visit
from app.schemas.visit_schema import VisitCreate, VisitResponse
from app.services import visit_service

router = APIRouter( tags=["Visits"])

@router.post("/", response_model=VisitResponse)
def create_visit(
    data: VisitCreate, 
    db: Session = Depends(get_session),
    # current_user = Depends(get_current_user) # Descomente quando tiver auth
):
    user_id = 1
    
    return visit_service.create_visit(db, data, user_id)


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
