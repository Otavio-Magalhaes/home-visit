from dotenv import load_dotenv
import os

load_dotenv() 

class Settings:

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 
    
    GOOGLE_CLIENT_ID: str = os.getenv('GOOGLE_CLIENT_ID')

    @property
    def database_url(self) -> str:
      return self.DATABASE_URL

settings = Settings()
