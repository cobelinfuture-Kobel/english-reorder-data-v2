import json
from collections import Counter
from pathlib import Path

from scripts.validate_generated_bank import validate_generated_bank


BASE_DIR = Path(__file__).resolve().parents[1]
BANK_PATHS = [
    BASE_DIR / "data" / "generated" / "shopping_sentence_bank.json",
    BASE_DIR / "data" / "generated" / "food_drink_sentence_bank.json",
    BASE_DIR / "data" / "generated" / "daily_routine_sentence_bank.json",
]


def _load_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def test_all_generated_banks_are_clean():
    for path in BANK_PATHS:
        data = _load_json(path)
        result = validate_generated_bank(data, min_per_group=1)
        assert result["is_valid"] is True, f"{path.name}: {result['errors']}"


def test_each_generated_bank_has_unique_targets():
    for path in BANK_PATHS:
        data = _load_json(path)
        targets = [sentence["target_sentence"] for sentence in data]
        duplicates = [target for target, count in Counter(targets).items() if count > 1]
        assert not duplicates, f"{path.name}: duplicate targets {duplicates}"


def test_generated_sentence_id_level_prefix_matches_level_field():
    for path in BANK_PATHS:
        data = _load_json(path)
        assert data
        assert all(sentence["sentence_id"].startswith(f"{sentence['level']}_") for sentence in data)
