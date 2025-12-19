from typing import List
from pydantic import field_validator, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # Database (split config – SAFE)
    DATABASE_HOST: str
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str

    # CORS
    ALLOWED_ORIGINS: str = ""

    # AI
    GEMINI_API_KEY: str

    @property
    def allowed_origins_list(self) -> List[str]:
        """Get allowed origins as a list."""
        if not self.ALLOWED_ORIGINS:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
