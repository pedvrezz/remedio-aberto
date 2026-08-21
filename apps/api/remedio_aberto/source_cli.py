from __future__ import annotations

import argparse
import json
from dataclasses import asdict
from pathlib import Path

from remedio_aberto.anvisa_medicines import fetch_and_persist, fetch_artifact, parse_csv


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Coleta manual segura da fonte ANVISA de medicamentos"
    )
    parser.add_argument("command", choices=("check", "fetch"))
    parser.add_argument("--cache-dir", type=Path, default=Path("data/cache/anvisa/medicamentos"))
    parser.add_argument("--database", type=Path, default=Path("data/remedio-aberto.sqlite"))
    args = parser.parse_args()

    if args.command == "check":
        artifact = fetch_artifact(args.cache_dir)
        encoding, rows = parse_csv(Path(artifact.cache_path))
        result = {**asdict(artifact), "encoding": encoding, "delimiter": ";", "records": len(rows)}
    else:
        imported = fetch_and_persist(args.cache_dir, args.database)
        result = {
            **asdict(imported.artifact),
            "records_processed": imported.records_processed,
            "records_inserted": imported.records_inserted,
            "already_imported": imported.already_imported,
            "database": str(args.database),
        }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
