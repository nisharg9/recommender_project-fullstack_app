import os

class Settings:
    PROJECT_NAME: str = "NexusTask Full-Stack Web App"
    PROJECT_VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nexustask.db")

settings = Settings()
