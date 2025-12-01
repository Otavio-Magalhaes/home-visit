
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from app.api.deps import get_current_admin_user
from app.core.database.database import get_session
from app.models import User
from app.schemas.user_schema import UserResponse


router = APIRouter(tags=["Users"],)

@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_session)):
    users = db.query(User).all()
    return users


@router.patch("/{user_id}/status", response_model=UserResponse)
def toggle_user_status(
    user_id: int, 
    is_active: bool,
    db: Session = Depends(get_session),
    admin_user: User = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user