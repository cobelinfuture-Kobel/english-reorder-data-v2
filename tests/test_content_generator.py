import json
from pathlib import Path

from scripts.generate_sentences import ContentGenerator, generate_scenario_bank
from scripts.validate_generated_bank import validate_generated_bank


BASE_DIR = Path(__file__).resolve().parents[1]
SCENARIOS = ["shopping", "food_drink", "daily_routine"]


def _load_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _load_banks(scenario):
    return (
        _load_json(BASE_DIR / "data" / "pattern_bank" / f"{scenario}_patterns.json"),
        _load_json(BASE_DIR / "data" / "slot_bank" / f"{scenario}_slots.json"),
    )


def test_shopping_content_generator_builds_required_fields():
    pattern_bank, slot_bank = _load_banks("shopping")
    generator = ContentGenerator(
        pattern_bank=pattern_bank,
        slot_bank=slot_bank,
        ensure_unique_targets=True,
        scenario="shopping",
        sentence_prefix="SHOPPING",
    )

    sentences = generator.generate_for_pattern("SHOP_WANT", "A1", count=5)

    assert len(sentences) == 5
    assert all(sentence["sentence_id"].startswith("A1_SHOPPING_SHOP_WANT_") for sentence in sentences)
    assert all(sentence["scenario"] == "shopping" for sentence in sentences)
    assert all(sentence["grammar_focus"] == ["present_simple", "shopping_vocabulary", "demonstratives"] for sentence in sentences)
    assert all(sentence["fsi_tasks"] for sentence in sentences)


def test_each_scenario_bank_generates_and_validates():
    for scenario in SCENARIOS:
        generated_path, count = generate_scenario_bank(BASE_DIR, scenario)
        assert generated_path.exists()
        assert count == 12

        data = _load_json(generated_path)
        result = validate_generated_bank(data, min_per_group=1)
        assert result["is_valid"] is True, result["errors"]


def test_daily_routine_bank_uses_v2_pattern_only():
    data = _load_json(BASE_DIR / "data" / "generated" / "daily_routine_sentence_bank.json")

    assert data
    assert {sentence["pattern_id"] for sentence in data} == {"ROUTINE_DO"}
    assert all(sentence["target_sentence"].endswith("every morning.") for sentence in data)
