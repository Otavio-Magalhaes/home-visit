from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime, timedelta
from jose import jwt

from app.core.config import settings
from app.models import User, Role
from app.schemas.auth_schema import TokenResponse


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate_google(self, token: str) -> TokenResponse:
        try:
            id_info = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            email = id_info.get("email")
            name = id_info.get("name")

            
            dev_emails = ["otaviomag1@gmail.com", "aqiresf30@gmail.com"]

            is_institutional = email.endswith("@soulasalle.com.br")
            is_developer = email in dev_emails

            if not (is_institutional or is_developer):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Acesso restrito. Utilize seu e-mail institucional (@soulasalle.com.br)."
                )

            user = self.db.query(User).filter(User.email == email).first()

            if not user:
                role_name = "admin" if is_developer else "student"
                
                default_role = self.db.query(Role).filter(Role.name == role_name).first()
                
                if not default_role:
                    default_role = Role(name=role_name)
                    self.db.add(default_role)
                    self.db.commit()

                user = User(
                    email=email,
                    username=email.split("@")[0], 
                    is_active=False,
                    role=default_role  
                )
                
                self.db.add(user)
                self.db.commit()
                self.db.refresh(user)

            access_token = self._create_access_token(data={"sub": user.email, "user_id": user.id})
            
            return TokenResponse(access_token=access_token, token_type="bearer")

        except ValueError as e:
            print(f"ERRO GOOGLE: {e}") 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token do Google inválido ou expirado."
            )

    def _create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt