import json
import random
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import create_app
from engines.quest_engine import QuestEngine


class StubLearningEngine:
    def __init__(self, due_ids=None, seen_ids=None, skill_report=None):
        self.due_ids = due_ids or []
        self.seen_ids = seen_ids or []
        self.skill_report = skill_report or {}

    def get_due_sentence_ids(self, user_id):
        return list(self.due_ids)

    def get_seen_sentence_ids(self, user_id):
        return list(self.seen_ids)

    def get_skill_report(self, user_id):
        return dict(self.skill_report)


def build_adaptive_bank():
    return [
        {
            "sentence_id": "A1_ROUTINE_001",
            "level": "A1",
            "scenario": "daily_routine",
            "grammar_focus": ["present_simple"],
        },
        {
            "sentence_id": "A1_ROUTINE_002",
            "level": "A1",
            "scenario": "daily_routine",
            "grammar_focus": ["present_simple"],
        },
        {
            "sentence_id": "A1_ROUTINE_003",
            "level": "A1",
            "scenario": "daily_routine",
            "grammar_focus": ["prepositions"],
        },
        {
            "sentence_id": "A1_ROUTINE_004",
            "level": "A1",
            "scenario": "daily_routine",
            "grammar_focus": ["prepositions"],
        },
    ]


def load_bank_data():
    with open(BASE_DIR / "data" / "sample_sentence_bank.json", encoding="utf-8") as f:
        return json.load(f)


def create_test_client(tmp_path):
    app = create_app(
        sentence_bank=load_bank_data(),
        progress_path=str(tmp_path / "user_progress.json"),
    )
    app.config["TESTING"] = True
    return app.test_client()


def test_build_adaptive_quest_prioritizes_weaker_grammar():
    random.seed(7)
    sentence_bank = build_adaptive_bank()
    learning_engine = StubLearningEngine(
        skill_report={
            "present_simple": {"score": -2, "attempts": 1, "status": "weak"},
            "prepositions": {"score": 5, "attempts": 3, "status": "strong"},
        }
    )
    engine = QuestEngine(sentence_bank, learning_engine, quest_size=1)

    weak_hits = 0
    strong_hits = 0
    for _ in range(200):
        result = engine.build_adaptive_quest("student_001", level="A1", scenario="daily_routine", total=1)
        grammar_focus = result[0]["grammar_focus"]
        if grammar_focus == ["present_simple"]:
            weak_hits += 1
        if grammar_focus == ["prepositions"]:
            strong_hits += 1

    assert weak_hits > strong_hits


def test_adaptive_false_uses_original_quest_behavior(tmp_path):
    client = create_test_client(tmp_path)

    default_response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A1",
            "scenario": "daily_routine",
        },
    )
    explicit_false_response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A1",
            "scenario": "daily_routine",
            "adaptive": "false",
        },
    )

    assert default_response.status_code == 200
    assert explicit_false_response.status_code == 200
    default_items = default_response.get_json()["quest_items"]
    explicit_false_items = explicit_false_response.get_json()["quest_items"]

    assert {item["sentence_id"] for item in explicit_false_items} == {
        item["sentence_id"] for item in default_items
    }
    assert all(item["source"] != "adaptive" for item in default_items)
    assert all(item["source"] != "adaptive" for item in explicit_false_items)
