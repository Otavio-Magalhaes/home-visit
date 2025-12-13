from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.schemas.healt_situation_schema import HealthSituationCreate
from .user_schema import UserResponse
from .resident_schema import ResidentResponse
from .healt_situation_schema import HealthSituationBase, HealthSituationCreateNested

class VisitBase(BaseModel):
    pass

class VisitCreate(VisitBase):
    resident_id: str
    desfecho: str 
    observacoes: Optional[str] = None
    data_visita: Optional[datetime] = None 

    health_situation: Optional[HealthSituationCreateNested] = None

class VisitResponse(VisitBase):
    id: int
    data_visita: datetime
    health_situation: Optional[HealthSituationBase] = None

    class Config:
        from_attributes = True