from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.database.database import get_session
from app.core.config import settings
from app.models.User import User

# Define que o token vem do header "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/google")

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decodifica o Token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("user_id") # Pegamos o ID que salvamos no login
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 2. Busca o usuário no banco
    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception

    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verifica se o usuário está ATIVO.
    Se is_active == False, bloqueia tudo.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Usuário inativo. Aguarde a aprovação do gestor."
        )
    return current_user

def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Verifica se é ADMIN e ATIVO.
    """
    if current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso restrito a administradores."
        )
    return current_user