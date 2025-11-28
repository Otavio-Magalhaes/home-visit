import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

engine = create_engine(str(settings.database_url), echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
   
    __allow_unmapped__ = True

def get_session():
    db = SessionLocal()
    try:
      yield db
    finally:
      db.close()

def create_db_and_tables():
    print("Creating database and tables...")
    Base.metadata.create_all(bind=engine)