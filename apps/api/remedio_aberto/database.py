from collections.abc import AsyncIterator
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from remedio_aberto.config import Settings


class Database:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.engine: AsyncEngine = create_async_engine(settings.database_url)

    async def start(self) -> None:
        database_path = self.settings.database_url.removeprefix("sqlite+aiosqlite:///")
        Path(database_path).parent.mkdir(parents=True, exist_ok=True)
        async with self.engine.begin() as connection:
            await connection.execute(text("PRAGMA journal_mode=WAL"))

    async def ready(self) -> bool:
        try:
            async with self.engine.connect() as connection:
                await connection.execute(text("SELECT 1"))
            return True
        except Exception:
            return False

    async def close(self) -> None:
        await self.engine.dispose()


async def database_lifespan(database: Database) -> AsyncIterator[None]:
    await database.start()
    try:
        yield
    finally:
        await database.close()
