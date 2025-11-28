from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.schemas.healt_situation_schema import HealthSituationCreate
from .user_schema import UserResponse
from .resident_schema import ResidentResponse
from .healt_situation_schema import HealthSituationResponse

class VisitBase(BaseModel):
    visit_date: datetime

class VisitCreate(VisitBase):
    user_id: int
    resident_id: str 
    health_situation: Optional[HealthSituationCreate] = None

class VisitResponse(VisitBase):
    id: int
    user: UserResponse
    resident: ResidentResponse
    health_situation: Optional[HealthSituationResponse]

    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
