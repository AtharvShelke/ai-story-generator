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

    # JWT Authentication
    SECRET_KEY: str = "dfa60565fad8bdac7a99a7cc651c4e383c6af55324a4fb2c99147bc536c6e431" # Generated secure key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week

    @property
    def allowed_origins_list(self) -> List[str]:
        """Get allowed origins as a list."""
        if not self.ALLOWED_ORIGINS:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def DATABASE_URL(self) -> str:
        """Construct the database URL from parts."""
        return f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}?sslmode=require"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
