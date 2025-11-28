from typing import TYPE_CHECKING, List
from sqlalchemy import Column, Integer, String

from app.core.database.database import Base
from sqlalchemy.orm import relationship


if TYPE_CHECKING:
    from app.models.User import User


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    users: List["User"] = relationship(back_populates="role")