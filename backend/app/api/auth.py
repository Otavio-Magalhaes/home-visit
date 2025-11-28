from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database.database import get_session
from app.services.auth_service import AuthService
from app.schemas.auth_schema import GoogleLoginRequest, TokenResponse

router = APIRouter( tags=["Auth"] )

@router.post("/google", response_model=TokenResponse)
def google_login(
    login_data: GoogleLoginRequest, 
    db: Session = Depends(get_session)
):
    """
    Recebe o token do Google, valida se é @soulasalle.com.br 
    e retorna o JWT da aplicação.
    """

    service = AuthService(db)
    return service.authenticate_google(login_data.credential)