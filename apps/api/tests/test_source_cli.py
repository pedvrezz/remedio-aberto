from __future__ import annotations

import sys
from pathlib import Path

from remedio_aberto import source_cli
from remedio_aberto.anvisa_medicines import ArtifactMetadata, ImportResult


def artifact(tmp_path: Path) -> ArtifactMetadata:
    path = tmp_path / "artifact.csv"
    path.write_text("fixture")
    return ArtifactMetadata(
        source_url="https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
        final_url="https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
        collected_at_utc="2026-08-21T00:00:00+00:00",
        status_http=200,
        content_type="application/octet-stream",
        etag=None,
        last_modified=None,
        size_bytes=7,
        sha256="a" * 64,
        cache_path=str(path),
    )


def test_check_command_reports_structure(monkeypatch, tmp_path: Path, capsys) -> None:
    item = artifact(tmp_path)
    monkeypatch.setattr(source_cli, "fetch_artifact", lambda _: item)
    monkeypatch.setattr(source_cli, "parse_csv", lambda _: ("latin-1", [{"a": "b"}]))
    monkeypatch.setattr(sys, "argv", ["source_cli", "check", "--cache-dir", str(tmp_path)])
    assert source_cli.main() == 0
    output = capsys.readouterr().out
    assert '"encoding": "latin-1"' in output
    assert '"records": 1' in output


def test_fetch_command_reports_idempotency(monkeypatch, tmp_path: Path, capsys) -> None:
    item = artifact(tmp_path)
    result = ImportResult(item, records_processed=3, records_inserted=0, already_imported=True)
    monkeypatch.setattr(source_cli, "fetch_and_persist", lambda _cache, _database: result)
    monkeypatch.setattr(
        sys,
        "argv",
        ["source_cli", "fetch", "--cache-dir", str(tmp_path), "--database", str(tmp_path / "db")],
    )
    assert source_cli.main() == 0
    output = capsys.readouterr().out
    assert '"already_imported": true' in output
    assert '"records_inserted": 0' in output
