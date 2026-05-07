import json
import sys
from pathlib import Path


def format_error_path(error):
    if not error.absolute_path:
        return "<root>"
    return " -> ".join(str(part) for part in error.absolute_path)


def main():
    try:
        from jsonschema import Draft202012Validator
    except ImportError:
        print("jsonschema is not installed. Install it with: pip install jsonschema")
        sys.exit(1)

    repo_root = Path(__file__).resolve().parent.parent
    schema_path = repo_root / "data" / "schemas" / "sentence_annotation.schema.json"
    registry_root = repo_root / "data" / "sentence_registry"

    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)

    json_files = sorted(registry_root.rglob("*.json"))
    has_errors = False

    for json_file in json_files:
        try:
            data = json.loads(json_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            has_errors = True
            print(f"Validation failed: {json_file}")
            print(f"  Path: line {exc.lineno}, column {exc.colno}")
            print(f"  Message: {exc.msg}")
            continue

        errors = sorted(validator.iter_errors(data), key=lambda error: list(error.absolute_path))
        if not errors:
            continue

        has_errors = True
        print(f"Validation failed: {json_file}")
        for error in errors:
            print(f"  Path: {format_error_path(error)}")
            print(f"  Message: {error.message}")

    if has_errors:
        sys.exit(1)

    print("Sentence registry validation passed.")


if __name__ == "__main__":
    main()
