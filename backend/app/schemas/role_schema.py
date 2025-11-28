from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class RoleBase(BaseModel):
  name: str
  description: Optional[str] = None

class RoleCreate(RoleBase):
  pass

class RoleResponse(RoleBase):
  id: int
  name: str
  created_at: datetime
  updated_at: datetime

  class Config:
    orm_mode = True