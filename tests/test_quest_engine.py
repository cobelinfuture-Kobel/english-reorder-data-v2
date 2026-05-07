import sys
from pathlib import Path
import random


BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from engines.quest_engine import QuestEngine


class StubLearningEngine:
    def __init__(self, due_ids=None, seen_ids=None):
        self.due_ids = due_ids or []
        self.seen_ids = seen_ids or []

    def get_due_sentence_ids(self, user_id):
        return list(self.due_ids)

    def get_seen_sentence_ids(self, user_id):
        return list(self.seen_ids)


def build_bank(*sentence_ids):
    return [
        {
            "sentence_id": sentence_id,
            "grammar_focus": [f"{sentence_id.lower()}_grammar"],
        }
        for sentence_id in sentence_ids
    ]


def test_quest_engine_defaults_to_ten_items():
    engine = QuestEngine([], StubLearningEngine())

    assert engine.quest_size == 10


def test_build_quest_returns_due_items_first(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011")
    learning_engine = StubLearningEngine(
        due_ids=["A2_TRAVEL_011", "A1_ROUTINE_004"],
        seen_ids=["A2_TRAVEL_011", "A1_ROUTINE_004"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=2)

    result = engine.build_quest("student_001")

    assert [item["source"] for item in result] == ["due", "due"]
    assert [item["sentence_id"] for item in result] == ["A1_ROUTINE_004", "A2_TRAVEL_011"]
    assert [item["grammar_focus"] for item in result] == [
        ["a1_routine_004_grammar"],
        ["a2_travel_011_grammar"],
    ]


def test_build_quest_fills_with_new_items_after_due_items(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011")
    learning_engine = StubLearningEngine(
        due_ids=["A1_ROUTINE_004"],
        seen_ids=["A1_ROUTINE_004"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=3)

    result = engine.build_quest("student_001")

    assert result == [
        {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "original",
            "source": "due",
            "grammar_focus": ["a1_routine_004_grammar"],
        },
        {
            "sentence_id": "A1_FOOD_002",
            "task_type": "original",
            "source": "new",
            "grammar_focus": ["a1_food_002_grammar"],
        },
        {
            "sentence_id": "A2_TRAVEL_011",
            "task_type": "original",
            "source": "new",
            "grammar_focus": ["a2_travel_011_grammar"],
        },
    ]


def test_build_quest_uses_fallback_when_no_due_or_new_items(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011")
    learning_engine = StubLearningEngine(
        due_ids=[],
        seen_ids=["A1_FOOD_002", "A1_ROUTINE_004", "A2_TRAVEL_011"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=2)

    result = engine.build_quest("student_001")

    assert result == [
        {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "original",
            "source": "fallback",
            "grammar_focus": ["a1_routine_004_grammar"],
        },
        {
            "sentence_id": "A1_FOOD_002",
            "task_type": "original",
            "source": "fallback",
            "grammar_focus": ["a1_food_002_grammar"],
        },
    ]


def test_build_quest_caps_result_at_quest_size(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011")
    learning_engine = StubLearningEngine(
        due_ids=["A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011"],
        seen_ids=["A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=2)

    result = engine.build_quest("student_001")

    assert result == [
        {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "original",
            "source": "due",
            "grammar_focus": ["a1_routine_004_grammar"],
        },
        {
            "sentence_id": "A1_FOOD_002",
            "task_type": "original",
            "source": "due",
            "grammar_focus": ["a1_food_002_grammar"],
        },
    ]


def test_build_quest_items_have_v11_shape(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004")
    learning_engine = StubLearningEngine(
        due_ids=["A1_ROUTINE_004"],
        seen_ids=["A1_ROUTINE_004"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=1)

    result = engine.build_quest("student_001")

    assert result == [
        {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "original",
            "source": "due",
            "grammar_focus": ["a1_routine_004_grammar"],
        }
    ]


def test_build_quest_marks_due_new_and_fallback_sources(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002", "A2_TRAVEL_011")
    learning_engine = StubLearningEngine(
        due_ids=["A1_ROUTINE_004"],
        seen_ids=["A1_ROUTINE_004", "A2_TRAVEL_011"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=3)

    result = engine.build_quest("student_001")

    assert result == [
        {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "original",
            "source": "due",
            "grammar_focus": ["a1_routine_004_grammar"],
        },
        {
            "sentence_id": "A1_FOOD_002",
            "task_type": "original",
            "source": "new",
            "grammar_focus": ["a1_food_002_grammar"],
        },
        {
            "sentence_id": "A2_TRAVEL_011",
            "task_type": "original",
            "source": "fallback",
            "grammar_focus": ["a2_travel_011_grammar"],
        },
    ]


def test_build_quest_contains_grammar_focus_lists(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank("A1_ROUTINE_004", "A1_FOOD_002")
    learning_engine = StubLearningEngine(
        due_ids=["A1_ROUTINE_004"],
        seen_ids=["A1_ROUTINE_004"],
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=2)

    result = engine.build_quest("student_001")

    assert all("grammar_focus" in item for item in result)
    assert all(isinstance(item["grammar_focus"], list) for item in result)


def test_build_quest_returns_ten_items_when_bank_is_large_enough(monkeypatch):
    monkeypatch.setattr(random, "shuffle", lambda seq: None)
    sentence_bank = build_bank(*[f"A1_ITEM_{index:03d}" for index in range(12)])
    engine = QuestEngine(sentence_bank, StubLearningEngine())

    result = engine.build_quest("student_001")

    assert len(result) == 10
    assert len({item["sentence_id"] for item in result}) == 10


def test_build_quest_shuffles_candidate_order(monkeypatch):
    def reverse_shuffle(seq):
        seq.reverse()

    monkeypatch.setattr(random, "shuffle", reverse_shuffle)
    sentence_bank = build_bank("A1_ITEM_001", "A1_ITEM_002", "A1_ITEM_003", "A1_ITEM_004")
    engine = QuestEngine(sentence_bank, StubLearningEngine(), quest_size=3)

    result = engine.build_quest("student_001")

    assert [item["sentence_id"] for item in result] == [
        "A1_ITEM_004",
        "A1_ITEM_003",
        "A1_ITEM_002",
    ]
