from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database.database import Base
from app.models.Timestamp import TimestampedModel

class Visit(TimestampedModel, Base):
    __tablename__ = 'visits'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    resident_id = Column(String, ForeignKey('residents.id'), nullable=False)
    
    data_visita = Column(DateTime, default=datetime.utcnow)
    desfecho = Column(String, nullable=True) # Ex: "REALIZADA", "RECUSADA", "AUSENTE"
    observacoes = Column(String, nullable=True)

    health_situation = relationship("HealthSituation", back_populates="visit", uselist=False, cascade="all, delete-orphan")
    
    resident = relationship("Resident", back_populates="visits")
    user = relationship("User", back_populates="visits")