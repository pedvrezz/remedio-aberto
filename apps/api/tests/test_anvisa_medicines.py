from __future__ import annotations

import hashlib
import io
import sqlite3
from email.message import Message
from pathlib import Path
from urllib.request import Request

import pytest

from remedio_aberto.anvisa_medicines import (
    DownloadError,
    SafeRedirectHandler,
    StructuralValidationError,
    _validate_source_url,
    fetch_artifact,
    parse_csv,
    persist_artifact,
)

FIXTURE = Path(__file__).parent / "fixtures" / "anvisa_medicamentos_sample.csv"


class FakeResponse:
    status = 200

    def __init__(self, payload: bytes, *, headers: dict[str, str] | None = None) -> None:
        self.stream = io.BytesIO(payload)
        self.headers = Message()
        for name, value in (headers or {}).items():
            self.headers[name] = value

    def __enter__(self) -> FakeResponse:
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def read(self, size: int = -1) -> bytes:
        return self.stream.read(size)

    def geturl(self) -> str:
        return "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv"

    def getcode(self) -> int:
        return self.status


class FakeOpener:
    def __init__(self, response: FakeResponse) -> None:
        self.response = response
        self.requests: list[Request] = []

    def open(self, request: Request, timeout: int) -> FakeResponse:
        self.requests.append(request)
        assert timeout > 0
        return self.response


def test_source_url_and_redirect_policy_reject_untrusted_destinations() -> None:
    with pytest.raises(DownloadError, match="HTTPS"):
        _validate_source_url("http://dados.anvisa.gov.br/file.csv")
    with pytest.raises(DownloadError, match="host oficial"):
        _validate_source_url("https://example.org/file.csv")

    handler = SafeRedirectHandler()
    request = Request("https://dados.anvisa.gov.br/dados/file.csv")
    with pytest.raises(DownloadError, match="host/protocolo inesperado"):
        handler.redirect_request(
            request,
            io.BytesIO(),
            302,
            "Found",
            {},
            "https://example.org/file.csv",
        )


def test_fetch_calculates_checksum_and_metadata_without_network(tmp_path: Path) -> None:
    payload = FIXTURE.read_bytes()
    opener = FakeOpener(
        FakeResponse(
            payload,
            headers={
                "Content-Length": str(len(payload)),
                "Content-Type": "application/octet-stream",
                "ETag": '"fixture"',
                "Last-Modified": "Fri, 21 Aug 2026 10:54:22 GMT",
            },
        )
    )
    artifact = fetch_artifact(tmp_path, opener=opener)  # type: ignore[arg-type]
    assert artifact.sha256 == hashlib.sha256(payload).hexdigest()
    assert artifact.size_bytes == len(payload)
    assert Path(artifact.cache_path).read_bytes() == payload
    assert artifact.etag == '"fixture"'
    user_agent = opener.requests[0].get_header("User-agent")
    assert user_agent is not None
    assert user_agent.startswith("remedio-aberto/")


def test_fetch_rejects_declared_oversize(tmp_path: Path) -> None:
    opener = FakeOpener(FakeResponse(b"small", headers={"Content-Length": "100"}))
    with pytest.raises(DownloadError, match="excede limite"):
        fetch_artifact(tmp_path, max_bytes=10, opener=opener)  # type: ignore[arg-type]
    assert not list(tmp_path.glob("*.part"))


def test_fetch_rejects_streamed_oversize_without_partial_file(tmp_path: Path) -> None:
    opener = FakeOpener(FakeResponse(b"01234567890"))
    with pytest.raises(DownloadError, match="excede limite"):
        fetch_artifact(tmp_path, max_bytes=10, opener=opener)  # type: ignore[arg-type]
    assert not list(tmp_path.iterdir())


def test_repeated_download_does_not_duplicate_artifact(tmp_path: Path) -> None:
    payload = FIXTURE.read_bytes()
    first = fetch_artifact(tmp_path, opener=FakeOpener(FakeResponse(payload)))  # type: ignore[arg-type]
    second = fetch_artifact(tmp_path, opener=FakeOpener(FakeResponse(payload)))  # type: ignore[arg-type]
    assert first.sha256 == second.sha256
    assert len(list(tmp_path.glob("*.csv"))) == 1
    assert len(list(tmp_path.glob("*.metadata.json"))) == 1


def test_parse_observed_semicolon_and_latin1_fixture() -> None:
    encoding, rows = parse_csv(FIXTURE)
    assert encoding == "latin-1"
    assert len(rows) == 3
    assert rows[0]["NUMERO_REGISTRO_PRODUTO"] is None
    assert rows[1]["NOME_PRODUTO"] == "ULTRAPROCT LDO"


def test_unexpected_header_fails(tmp_path: Path) -> None:
    path = tmp_path / "bad.csv"
    path.write_text("A;B\n1;2\n")
    with pytest.raises(StructuralValidationError, match="cabeçalho inesperado"):
        parse_csv(path)


def test_malformed_line_fails(tmp_path: Path) -> None:
    path = tmp_path / "bad.csv"
    header = FIXTURE.read_text(encoding="latin-1").splitlines()[0]
    path.write_text(header + '\n"MEDICAMENTO";"incompleto"\n', encoding="latin-1")
    with pytest.raises(StructuralValidationError, match="possui 2 colunas"):
        parse_csv(path)


def test_persistence_is_idempotent_and_preserves_raw_values(tmp_path: Path) -> None:
    payload = FIXTURE.read_bytes()
    artifact = fetch_artifact(tmp_path / "cache", opener=FakeOpener(FakeResponse(payload)))  # type: ignore[arg-type]
    database = tmp_path / "data.sqlite"
    first = persist_artifact(database, artifact)
    before = database.read_bytes()
    second = persist_artifact(database, artifact)
    assert first.records_processed == 3
    assert first.records_inserted == 3
    assert not first.already_imported
    assert second.records_inserted == 0
    assert second.already_imported
    assert database.read_bytes() == before
    with sqlite3.connect(database) as connection:
        row = connection.execute(
            "SELECT data_finalizacao_processo_raw, data_vencimento_registro_raw "
            "FROM anvisa_medicines WHERE nome_produto = ?",
            ("ULTRAPROCT LDO",),
        ).fetchone()
    assert row == ("15/08/2011", "022025")


def test_invalid_csv_leaves_no_partial_database_state(tmp_path: Path) -> None:
    bad = tmp_path / "bad.csv"
    bad.write_text("A;B\n1;2\n")
    from remedio_aberto.anvisa_medicines import ArtifactMetadata

    artifact = ArtifactMetadata(
        source_url="https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
        final_url="https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
        collected_at_utc="2026-08-21T00:00:00+00:00",
        status_http=200,
        content_type="text/csv",
        etag=None,
        last_modified=None,
        size_bytes=bad.stat().st_size,
        sha256=hashlib.sha256(bad.read_bytes()).hexdigest(),
        cache_path=str(bad),
    )
    database = tmp_path / "data.sqlite"
    with pytest.raises(StructuralValidationError):
        persist_artifact(database, artifact)
    assert not database.exists()
