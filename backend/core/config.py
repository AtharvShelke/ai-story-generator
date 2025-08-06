from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os
import dotenv
dotenv.load_dotenv()

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str)->List[str]:
        return v.split(",") if v else []
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive=True
        extra = "ignore"  # Ignore extra environment variables
        
settings = Settings()