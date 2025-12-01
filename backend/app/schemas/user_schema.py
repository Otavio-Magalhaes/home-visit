from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.schemas.role_schema import RoleResponse

class UserBase(BaseModel):
  email: EmailStr
  username: str

class UserCreate(UserBase):
  role_id: int

class UserUpdate(BaseModel):
  is_active: Optional[bool] = None
  cns: Optional[str] = None
  cnes: Optional[str] = None
  ine: Optional[str] = None
class UserResponse(UserBase):
  id: int
  is_active: bool
  role: RoleResponse 
  cns: Optional[str] = None
  cnes: Optional[str] = None
  ine: Optional[str] = None


  class Config:
    from_attributes = True

class UserLogin(BaseModel):
  email: str
  password: str