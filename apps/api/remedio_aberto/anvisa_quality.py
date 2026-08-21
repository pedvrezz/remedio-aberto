from __future__ import annotations

import collections
import hashlib
import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

from remedio_aberto.anvisa_medicines import EXPECTED_HEADER, parse_csv

_DIGITS = re.compile(r"^\d+$")
_FINAL_DATE = re.compile(r"^\d{2}/\d{2}/\d{4}$")
_EXPIRY_MONTH = re.compile(r"^(0[1-9]|1[0-2])\d{4}$")
_EXPIRY_SLASH = re.compile(r"^(0[1-9]|1[0-2])/\d{4}$")
_SQL_COLUMNS = {
    "TIPO_PRODUTO": "tipo_produto",
    "NOME_PRODUTO": "nome_produto",
    "DATA_FINALIZACAO_PROCESSO": "data_finalizacao_processo_raw",
    "CATEGORIA_REGULATORIA": "categoria_regulatoria",
    "NUMERO_REGISTRO_PRODUTO": "numero_registro_produto",
    "DATA_VENCIMENTO_REGISTRO": "data_vencimento_registro_raw",
    "NUMERO_PROCESSO": "numero_processo",
    "CLASSE_TERAPEUTICA": "classe_terapeutica",
    "EMPRESA_DETENTORA_REGISTRO": "empresa_detentora_registro",
    "SITUACAO_REGISTRO": "situacao_registro",
    "PRINCIPIO_ATIVO": "principio_ativo",
}


def _field_stats(values: list[str | None]) -> dict[str, Any]:
    present = [value for value in values if value is not None]
    lengths = collections.Counter(len(value) for value in present)
    return {
        "present": len(present),
        "missing": len(values) - len(present),
        "distinct_present": len(set(present)),
        "digit_only": sum(bool(_DIGITS.fullmatch(value)) for value in present),
        "lengths": dict(sorted(lengths.items())),
    }


def _domain(values: list[str | None]) -> dict[str, Any]:
    counts = collections.Counter(values)
    return {
        "distinct_present": len({value for value in values if value is not None}),
        "values": [
            {"value": value, "count": count}
            for value, count in sorted(
                counts.items(), key=lambda item: (-item[1], item[0] is not None, item[0] or "")
            )
        ],
    }


def _valid_final_date(value: str) -> bool:
    if not _FINAL_DATE.fullmatch(value):
        return False
    try:
        datetime.strptime(value, "%d/%m/%Y")
    except ValueError:
        return False
    return True


def _row_fingerprint(row: dict[str, str | None]) -> str:
    serialized = json.dumps(
        [row[name] for name in EXPECTED_HEADER], ensure_ascii=False, separators=(",", ":")
    )
    return hashlib.sha256(serialized.encode()).hexdigest()


def analyze_snapshot(database_path: Path, artifact_sha256: str | None = None) -> dict[str, Any]:
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    try:
        if artifact_sha256 is None:
            artifact = connection.execute(
                """SELECT * FROM source_artifacts
                   ORDER BY collected_at_utc DESC, sha256 DESC LIMIT 1"""
            ).fetchone()
        else:
            artifact = connection.execute(
                "SELECT * FROM source_artifacts WHERE sha256 = ?", (artifact_sha256,)
            ).fetchone()
        if artifact is None:
            raise ValueError("artefato ANVISA não encontrado no banco local")

        rows = connection.execute(
            "SELECT * FROM anvisa_medicines WHERE artifact_sha256 = ?",
            (artifact["sha256"],),
        ).fetchall()
    finally:
        connection.close()

    cache_path = Path(str(artifact["cache_path"]))
    encoding, physical_rows = parse_csv(cache_path)
    fingerprints = collections.Counter(_row_fingerprint(row) for row in physical_rows)
    duplicate_groups = [count for count in fingerprints.values() if count > 1]

    def column(name: str) -> list[str | None]:
        return [row[name] for row in rows]

    final_dates = [value for value in column("data_finalizacao_processo_raw") if value]
    expiry_dates = [value for value in column("data_vencimento_registro_raw") if value]

    return {
        "artifact": {
            "sha256": artifact["sha256"],
            "source_url": artifact["source_url"],
            "collected_at_utc": artifact["collected_at_utc"],
            "encoding": encoding,
            "physical_records": len(physical_rows),
            "structural_unique_records": len(rows),
        },
        "identifiers": {
            "numero_registro_produto": _field_stats(column("numero_registro_produto")),
            "numero_processo": _field_stats(column("numero_processo")),
            "co_occurrence": {
                "both_present": sum(
                    row["numero_registro_produto"] is not None
                    and row["numero_processo"] is not None
                    for row in rows
                ),
                "registration_only": sum(
                    row["numero_registro_produto"] is not None
                    and row["numero_processo"] is None
                    for row in rows
                ),
                "process_only": sum(
                    row["numero_registro_produto"] is None
                    and row["numero_processo"] is not None
                    for row in rows
                ),
                "neither": sum(
                    row["numero_registro_produto"] is None
                    and row["numero_processo"] is None
                    for row in rows
                ),
            },
        },
        "dates": {
            "data_finalizacao_processo": {
                **_field_stats(column("data_finalizacao_processo_raw")),
                "valid_dd_mm_yyyy": sum(_valid_final_date(value) for value in final_dates),
            },
            "data_vencimento_registro": {
                **_field_stats(column("data_vencimento_registro_raw")),
                "valid_mm_yyyy_compact": sum(
                    bool(_EXPIRY_MONTH.fullmatch(value)) for value in expiry_dates
                ),
                "valid_mm_slash_yyyy": sum(
                    bool(_EXPIRY_SLASH.fullmatch(value)) for value in expiry_dates
                ),
            },
        },
        "domains": {
            name: _domain(column(name))
            for name in (
                "tipo_produto",
                "situacao_registro",
                "categoria_regulatoria",
                "classe_terapeutica",
            )
        },
        "missing": {
            name: sum(value is None for value in column(sql_name))
            for name, sql_name in _SQL_COLUMNS.items()
        },
        "physical_duplicates": {
            "groups": len(duplicate_groups),
            "additional_occurrences": sum(count - 1 for count in duplicate_groups),
            "maximum_multiplicity": max(duplicate_groups, default=1),
        },
        "interpretation_limits": [
            "estatísticas descritivas não definem identidade regulatória",
            "hash de linha é identificador técnico, não número oficial",
            "vencimento sem dia permanece texto bruto e não autoriza inferir uma data",
            "duplicidade estrutural não comprova equivalência regulatória",
        ],
    }


def write_analysis(database_path: Path, output_path: Path) -> dict[str, Any]:
    report = analyze_snapshot(database_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return report
