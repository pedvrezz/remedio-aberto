from __future__ import annotations

import csv
import hashlib
import json
import os
import sqlite3
import ssl
import tempfile
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from http.client import HTTPMessage
from pathlib import Path
from typing import BinaryIO, Final
from urllib.parse import urlparse

SOURCE_URL: Final = "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv"
SOURCE_HOST: Final = "dados.anvisa.gov.br"
USER_AGENT: Final = "remedio-aberto/0.1 (+https://github.com/pedvrezz/remedio-aberto)"
MAX_BYTES: Final = 25 * 1024 * 1024
TIMEOUT_SECONDS: Final = 30
MAX_REDIRECTS: Final = 3
EXPECTED_HEADER: Final = (
    "TIPO_PRODUTO",
    "NOME_PRODUTO",
    "DATA_FINALIZACAO_PROCESSO",
    "CATEGORIA_REGULATORIA",
    "NUMERO_REGISTRO_PRODUTO",
    "DATA_VENCIMENTO_REGISTRO",
    "NUMERO_PROCESSO",
    "CLASSE_TERAPEUTICA",
    "EMPRESA_DETENTORA_REGISTRO",
    "SITUACAO_REGISTRO",
    "PRINCIPIO_ATIVO",
)


class IngestionError(RuntimeError):
    pass


class DownloadError(IngestionError):
    pass


class StructuralValidationError(IngestionError):
    pass


@dataclass(frozen=True)
class ArtifactMetadata:
    source_url: str
    final_url: str
    collected_at_utc: str
    status_http: int
    content_type: str | None
    etag: str | None
    last_modified: str | None
    size_bytes: int
    sha256: str
    cache_path: str


@dataclass(frozen=True)
class ImportResult:
    artifact: ArtifactMetadata
    records_processed: int
    records_inserted: int
    already_imported: bool


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self, max_redirects: int = MAX_REDIRECTS) -> None:
        self.max_redirects = max_redirects
        self.redirect_count = 0
        super().__init__()

    def redirect_request(  # type: ignore[override]
        self,
        req: urllib.request.Request,
        fp: BinaryIO,
        code: int,
        msg: str,
        headers: HTTPMessage,
        newurl: str,
    ) -> urllib.request.Request | None:
        self.redirect_count += 1
        if self.redirect_count > self.max_redirects:
            raise DownloadError(f"limite de {self.max_redirects} redirecionamentos excedido")
        parsed = urlparse(newurl)
        if parsed.scheme != "https" or parsed.hostname != SOURCE_HOST:
            raise DownloadError(
                f"redirecionamento rejeitado para host/protocolo inesperado: {newurl}"
            )
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context()
    bundled_ca = (
        Path(__file__).with_name("certs") / "sectigo-public-server-authentication-ca-ov-r36.pem"
    )
    if bundled_ca.exists():
        context.load_verify_locations(cafile=str(bundled_ca))
    return context


def _validate_source_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != SOURCE_HOST:
        raise DownloadError("a URL da fonte deve usar HTTPS e o host oficial dados.anvisa.gov.br")


def fetch_artifact(
    cache_dir: Path,
    *,
    url: str = SOURCE_URL,
    max_bytes: int = MAX_BYTES,
    timeout: int = TIMEOUT_SECONDS,
    opener: urllib.request.OpenerDirector | None = None,
) -> ArtifactMetadata:
    _validate_source_url(url)
    cache_dir.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "text/csv,*/*;q=0.1"}
    )
    active_opener = opener or urllib.request.build_opener(
        urllib.request.HTTPSHandler(context=_ssl_context()), SafeRedirectHandler()
    )
    temporary_path: Path | None = None
    try:
        with active_opener.open(request, timeout=timeout) as response:
            final_url = response.geturl()
            _validate_source_url(final_url)
            status = int(getattr(response, "status", response.getcode()))
            if status != 200:
                raise DownloadError(f"status HTTP inesperado: {status}")
            declared_length = response.headers.get("Content-Length")
            if declared_length is not None and int(declared_length) > max_bytes:
                raise DownloadError(f"arquivo excede limite de {max_bytes} bytes")
            digest = hashlib.sha256()
            size = 0
            fd, temp_name = tempfile.mkstemp(prefix="anvisa-", suffix=".part", dir=cache_dir)
            temporary_path = Path(temp_name)
            with os.fdopen(fd, "wb") as output:
                while chunk := response.read(64 * 1024):
                    size += len(chunk)
                    if size > max_bytes:
                        raise DownloadError(f"arquivo excede limite de {max_bytes} bytes")
                    digest.update(chunk)
                    output.write(chunk)
            sha256 = digest.hexdigest()
            artifact_path = cache_dir / f"{sha256}.csv"
            if artifact_path.exists():
                temporary_path.unlink()
            else:
                temporary_path.replace(artifact_path)
            temporary_path = None
            metadata = ArtifactMetadata(
                source_url=url,
                final_url=final_url,
                collected_at_utc=datetime.now(UTC).isoformat(),
                status_http=status,
                content_type=response.headers.get("Content-Type"),
                etag=response.headers.get("ETag"),
                last_modified=response.headers.get("Last-Modified"),
                size_bytes=size,
                sha256=sha256,
                cache_path=str(artifact_path),
            )
            metadata_path = cache_dir / f"{sha256}.metadata.json"
            if not metadata_path.exists():
                metadata_path.write_text(
                    json.dumps(asdict(metadata), ensure_ascii=False, indent=2) + "\n"
                )
            return metadata
    except (urllib.error.URLError, TimeoutError, ssl.SSLError) as exc:
        raise DownloadError(f"falha segura ao baixar fonte ANVISA: {exc}") from exc
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


def detect_encoding(path: Path) -> str:
    sample = path.read_bytes()[:128_000]
    try:
        sample.decode("utf-8-sig")
        return "utf-8-sig"
    except UnicodeDecodeError:
        try:
            sample.decode("latin-1")
            return "latin-1"
        except UnicodeDecodeError as exc:  # pragma: no cover - latin-1 accepts every byte
            raise StructuralValidationError("encoding não suportado") from exc


def parse_csv(path: Path) -> tuple[str, list[dict[str, str | None]]]:
    encoding = detect_encoding(path)
    rows: list[dict[str, str | None]] = []
    try:
        with path.open("r", encoding=encoding, newline="") as stream:
            reader = csv.reader(stream, delimiter=";", quotechar='"', strict=True)
            header = next(reader, None)
            if tuple(header or ()) != EXPECTED_HEADER:
                raise StructuralValidationError(f"cabeçalho inesperado: {header!r}")
            for line_number, values in enumerate(reader, start=2):
                if len(values) != len(EXPECTED_HEADER):
                    message = (
                        f"linha {line_number} possui {len(values)} colunas; "
                        f"esperado: {len(EXPECTED_HEADER)}"
                    )
                    raise StructuralValidationError(message)
                normalized = {
                    name: (value.strip() if value.strip() else None)
                    for name, value in zip(EXPECTED_HEADER, values, strict=True)
                }
                rows.append(normalized)
    except (csv.Error, UnicodeError) as exc:
        raise StructuralValidationError(f"CSV inválido: {exc}") from exc
    return encoding, rows


def _row_hash(row: dict[str, str | None]) -> str:
    payload = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def initialize_database(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS source_artifacts (
            sha256 TEXT PRIMARY KEY,
            source_url TEXT NOT NULL,
            final_url TEXT NOT NULL,
            collected_at_utc TEXT NOT NULL,
            status_http INTEGER NOT NULL,
            content_type TEXT,
            etag TEXT,
            last_modified TEXT,
            size_bytes INTEGER NOT NULL,
            cache_path TEXT NOT NULL,
            encoding TEXT NOT NULL,
            delimiter TEXT NOT NULL,
            records_count INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS anvisa_medicines (
            artifact_sha256 TEXT NOT NULL REFERENCES source_artifacts(sha256),
            row_hash TEXT NOT NULL,
            tipo_produto TEXT,
            nome_produto TEXT,
            data_finalizacao_processo_raw TEXT,
            categoria_regulatoria TEXT,
            numero_registro_produto TEXT,
            data_vencimento_registro_raw TEXT,
            numero_processo TEXT,
            classe_terapeutica TEXT,
            empresa_detentora_registro TEXT,
            situacao_registro TEXT,
            principio_ativo TEXT,
            PRIMARY KEY (artifact_sha256, row_hash)
        );
        """
    )


def persist_artifact(database_path: Path, artifact: ArtifactMetadata) -> ImportResult:
    encoding, rows = parse_csv(Path(artifact.cache_path))
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    try:
        initialize_database(connection)
        existing = connection.execute(
            "SELECT records_count FROM source_artifacts WHERE sha256 = ?", (artifact.sha256,)
        ).fetchone()
        if existing is not None:
            return ImportResult(artifact, int(existing[0]), 0, True)
        with connection:
            connection.execute(
                """INSERT INTO source_artifacts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    artifact.sha256,
                    artifact.source_url,
                    artifact.final_url,
                    artifact.collected_at_utc,
                    artifact.status_http,
                    artifact.content_type,
                    artifact.etag,
                    artifact.last_modified,
                    artifact.size_bytes,
                    artifact.cache_path,
                    encoding,
                    ";",
                    len(rows),
                ),
            )
            inserted = 0
            for row in rows:
                cursor = connection.execute(
                    """INSERT OR IGNORE INTO anvisa_medicines VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )""",
                    (
                        artifact.sha256,
                        _row_hash(row),
                        *(row[name] for name in EXPECTED_HEADER),
                    ),
                )
                inserted += cursor.rowcount
        return ImportResult(artifact, len(rows), inserted, False)
    finally:
        connection.close()


def fetch_and_persist(cache_dir: Path, database_path: Path) -> ImportResult:
    artifact = fetch_artifact(cache_dir)
    return persist_artifact(database_path, artifact)
