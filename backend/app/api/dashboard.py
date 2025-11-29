from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Imports do seu projeto
from app.core.database.database import get_session
from app.schemas.dashboard_schema import DashboardFilterSchema
from app.services import dashboard_service

router = APIRouter(  tags=["Dashboard"])

@router.post("/stats")
def get_stats(
    filters: DashboardFilterSchema,
    db: Session = Depends(get_session)
):
    """
    Retorna estatísticas consolidadas (cards com totais) baseadas nos filtros e raio.
    """
    try:
        return dashboard_service.get_dashboard_statistics(db, filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar dados: {str(e)}")

@router.post("/map")
def get_map_pins(
    filters: DashboardFilterSchema,
    db: Session = Depends(get_session)
):
    """
    Retorna a lista de coordenadas (pinos) das residências encontradas para plotar no mapa.
    """
    try:
        return dashboard_service.get_dashboard_map_pins(db, filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar pontos do mapa: {str(e)}")