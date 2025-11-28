from typing import List
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String


from sqlalchemy.orm import relationship

from app.core.database.database import Base
from app.models.Role import Role
from app.models.Timestamp import TimestampedModel
from app.models.Visit import Visit


class User(Base, TimestampedModel):
  __tablename__ = 'users'

  id = Column(Integer, primary_key=True)
  username = Column(String, unique=True, nullable=False)
  email = Column(String, unique=True, nullable=False)
  is_active = Column(Boolean, default=False)
  cns = Column(String, nullable=True)
  cnes = Column(String, nullable=True)
  ine = Column(String, nullable=True)


  role_id = Column(Integer, ForeignKey("role.id"), nullable=True, default=0)

  role = relationship("Role", back_populates="users")
  visits = relationship("Visit", back_populates="user")
  residencias = relationship( "Residence",back_populates="responsavel")

   