from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Remédio Aberto API"
    app_version: str = "0.1.0"
    environment: str = "development"
    database_url: str = f"sqlite+aiosqlite:///{PROJECT_ROOT / 'data' / 'remedio-aberto.db'}"
    cors_origins: tuple[str, ...] = (
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    )

    @field_validator("database_url")
    @classmethod
    def require_local_database(cls, value: str) -> str:
        if not value.startswith("sqlite+aiosqlite:///"):
            raise ValueError("A Fase 0 aceita somente SQLite local")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
