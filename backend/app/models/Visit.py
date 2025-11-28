from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database.database import Base
from app.models.Timestamp import TimestampedModel

class Visit(TimestampedModel, Base):
    __tablename__ = 'visits'

    id = Column(Integer, primary_key=True, index=True)
    visit_date = Column(DateTime, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    resident_id = Column(String, ForeignKey('residents.id'), nullable=False)

    user = relationship("User", back_populates="visits")
    resident = relationship("Resident", back_populates="visits")
    
    health_situation = relationship(
        "HealthSituation",
        back_populates="visit",
        uselist=False
    )