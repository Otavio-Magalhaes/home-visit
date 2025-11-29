from sqlalchemy.orm import Session
from app.models.Visit import Visit
from app.models.HealthSituation import HealthSituation
from app.schemas.visit_schema import VisitCreate

def create_visit(db: Session, visit_in: VisitCreate, user_id: str):
  health_data = None
  if visit_in.health_situation:
    health_data = visit_in.health_situation.dict(exclude_unset=True)
  
  visit_dict = visit_in.dict(exclude={'health_situation'})
  visit_dict['user_id'] = user_id
  
  new_visit = Visit(**visit_dict)
  db.add(new_visit)
  db.flush() 
  
  if health_data:
    new_health_situation = HealthSituation(
      **health_data,
      visit_id=new_visit.id,       
      resident_id=new_visit.resident_id 
    )
    db.add(new_health_situation)
  
  db.commit()
  db.refresh(new_visit)
  return new_visit