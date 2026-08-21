from __future__ import annotations

from pathlib import Path

import pytest
from test_anvisa_medicines import FIXTURE, FakeOpener, FakeResponse

from remedio_aberto.anvisa_medicines import fetch_artifact, persist_artifact
from remedio_aberto.anvisa_quality import analyze_snapshot, write_analysis


def imported_fixture(tmp_path: Path) -> Path:
    payload = FIXTURE.read_bytes()
    artifact = fetch_artifact(
        tmp_path / "cache",
        opener=FakeOpener(FakeResponse(payload)),  # type: ignore[arg-type]
    )
    database = tmp_path / "data.sqlite"
    persist_artifact(database, artifact)
    return database


def test_analysis_is_descriptive_and_reproducible(tmp_path: Path) -> None:
    database = imported_fixture(tmp_path)

    report = analyze_snapshot(database)

    assert report["artifact"]["physical_records"] == 3
    assert report["artifact"]["structural_unique_records"] == 3
    assert report["identifiers"]["numero_registro_produto"] == {
        "present": 2,
        "missing": 1,
        "distinct_present": 2,
        "digit_only": 2,
        "lengths": {9: 2},
    }
    assert report["identifiers"]["co_occurrence"] == {
        "both_present": 2,
        "registration_only": 0,
        "process_only": 0,
        "neither": 1,
    }
    assert report["dates"]["data_finalizacao_processo"]["valid_dd_mm_yyyy"] == 3
    assert report["dates"]["data_vencimento_registro"]["valid_mm_yyyy_compact"] == 3
    assert report["physical_duplicates"] == {
        "groups": 0,
        "additional_occurrences": 0,
        "maximum_multiplicity": 1,
    }
    assert report["domains"]["situacao_registro"]["distinct_present"] == 1
    assert report["interpretation_limits"]


def test_analysis_can_be_selected_by_artifact_and_written_as_json(tmp_path: Path) -> None:
    database = imported_fixture(tmp_path)
    sha256 = analyze_snapshot(database)["artifact"]["sha256"]
    selected = analyze_snapshot(database, sha256)
    output = tmp_path / "report.json"

    written = write_analysis(database, output)

    assert selected == written
    assert output.read_text(encoding="utf-8").endswith("\n")
    assert f'"sha256": "{sha256}"' in output.read_text(encoding="utf-8")


def test_analysis_fails_clearly_without_an_imported_artifact(tmp_path: Path) -> None:
    database = tmp_path / "empty.sqlite"
    database.touch()

    with pytest.raises(Exception, match="source_artifacts"):
        analyze_snapshot(database)
