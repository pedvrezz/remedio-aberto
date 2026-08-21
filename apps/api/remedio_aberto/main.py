from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from remedio_aberto.config import Settings, get_settings
from remedio_aberto.database import Database


def create_app(settings: Settings | None = None) -> FastAPI:
    app_settings = settings or get_settings()
    database = Database(app_settings)

    @asynccontextmanager
    async def lifespan(_: FastAPI):  # type: ignore[no-untyped-def]
        await database.start()
        yield
        await database.close()

    app = FastAPI(
        title=app_settings.app_name,
        version=app_settings.app_version,
        description="API informativa para dados públicos oficiais sobre medicamentos.",
        lifespan=lifespan,
    )
    app.state.database = database
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(app_settings.cors_origins),
        allow_methods=["GET"],
        allow_headers=["Accept", "Content-Type"],
    )

    @app.get("/health", tags=["health"])
    async def health() -> dict[str, str]:
        return {
            "status": "healthy",
            "service": app_settings.app_name,
            "version": app_settings.app_version,
        }

    @app.get("/health/live", tags=["health"])
    async def live() -> dict[str, str]:
        return {"status": "alive"}

    @app.get("/health/ready", tags=["health"])
    async def ready() -> JSONResponse:
        if await database.ready():
            return JSONResponse(content={"status": "ready", "database": "connected"})
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "database": "disconnected"},
        )

    @app.get("/api/v1", tags=["api"])
    async def api_root() -> dict[str, Any]:
        return {
            "version": "v1",
            "status": "foundation",
            "data_sources_integrated": [],
            "notice": "Nenhuma fonte foi integrada na Fase 0.",
        }

    return app


app = create_app()
