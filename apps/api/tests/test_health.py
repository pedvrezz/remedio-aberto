from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from remedio_aberto.config import Settings
from remedio_aberto.main import create_app


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    settings = Settings(database_url=f"sqlite+aiosqlite:///{tmp_path / 'test.db'}")
    with TestClient(create_app(settings)) as test_client:
        yield test_client


def test_health_reports_service_version(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "Remédio Aberto API",
        "version": "0.1.0",
    }


def test_liveness(client: TestClient) -> None:
    assert client.get("/health/live").json() == {"status": "alive"}


def test_readiness_checks_sqlite(client: TestClient) -> None:
    response = client.get("/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "connected"}


def test_api_root_is_honest_about_sources(client: TestClient) -> None:
    response = client.get("/api/v1")
    assert response.status_code == 200
    assert response.json()["data_sources_integrated"] == []
