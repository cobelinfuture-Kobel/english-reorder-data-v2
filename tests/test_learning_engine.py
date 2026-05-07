import sys
from datetime import datetime, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from engines.learning_engine import LearningEngine


def test_update_progress_stores_v1_srs_fields(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        True,
        grammar_focus=["present_simple"],
    )

    stats = engine.progress["student_001"]["A1_ROUTINE_004"]

    assert stats == {
        "srs_level": 1,
        "interval_days": 1,
        "last_seen": fixed_now.isoformat(),
        "next_review": (fixed_now + timedelta(days=1)).isoformat(),
        "attempt_count": 1,
        "correct_count": 1,
        "mistake_count": 0,
        "last_result": "perfect_correct",
        "last_mistake_type": None,
        "last_hint_used": False,
        "grammar_focus": ["present_simple"],
        "result_history": [
            {
                "result_type": "perfect_correct",
                "grammar_focus": ["present_simple"],
                "timestamp": fixed_now.isoformat(),
            }
        ],
    }


def test_wrong_answer_resets_to_level_zero_and_stores_mistake_type(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress("student_001", "A1_ROUTINE_004", True)
    engine.update_progress("student_001", "A1_ROUTINE_004", True)
    engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        False,
        mistake_type="word_order_error",
    )

    stats = engine.progress["student_001"]["A1_ROUTINE_004"]

    assert stats == {
        "srs_level": 0,
        "interval_days": 0,
        "last_seen": fixed_now.isoformat(),
        "next_review": fixed_now.isoformat(),
        "attempt_count": 3,
        "correct_count": 2,
        "mistake_count": 1,
        "last_result": "incorrect",
        "last_mistake_type": "word_order_error",
        "last_hint_used": False,
        "grammar_focus": [],
        "result_history": [
            {
                "result_type": "perfect_correct",
                "grammar_focus": [],
                "timestamp": fixed_now.isoformat(),
            },
            {
                "result_type": "perfect_correct",
                "grammar_focus": [],
                "timestamp": fixed_now.isoformat(),
            },
            {
                "result_type": "incorrect",
                "grammar_focus": [],
                "timestamp": fixed_now.isoformat(),
            },
        ],
    }


def test_assisted_correct_does_not_increase_srs_level(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress("student_001", "A1_ROUTINE_004", True)
    engine.update_progress("student_001", "A1_ROUTINE_004", True, hint_used=True)

    stats = engine.progress["student_001"]["A1_ROUTINE_004"]

    assert stats == {
        "srs_level": 1,
        "interval_days": 1,
        "last_seen": fixed_now.isoformat(),
        "next_review": (fixed_now + timedelta(days=1)).isoformat(),
        "attempt_count": 2,
        "correct_count": 2,
        "mistake_count": 0,
        "last_result": "assisted_correct",
        "last_mistake_type": None,
        "last_hint_used": True,
        "grammar_focus": [],
        "result_history": [
            {
                "result_type": "perfect_correct",
                "grammar_focus": [],
                "timestamp": fixed_now.isoformat(),
            },
            {
                "result_type": "assisted_correct",
                "grammar_focus": [],
                "timestamp": fixed_now.isoformat(),
            },
        ],
    }


def test_get_due_sentence_ids_uses_injected_time(tmp_path):
    clock = {"now": datetime(2026, 4, 28, 10, 0, 0)}
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: clock["now"],
    )

    engine.update_progress("student_001", "A1_ROUTINE_004", True)

    clock["now"] = datetime(2026, 4, 28, 22, 0, 0)
    assert engine.get_due_sentence_ids("student_001") == []

    clock["now"] = datetime(2026, 4, 29, 10, 0, 0)
    assert engine.get_due_sentence_ids("student_001") == ["A1_ROUTINE_004"]


def test_update_progress_appends_result_history(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        True,
        grammar_focus=["present_simple"],
    )
    engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        False,
        mistake_type="word_order_error",
        grammar_focus=["present_simple", "adverb_of_frequency"],
    )

    history = engine.progress["student_001"]["A1_ROUTINE_004"]["result_history"]

    assert history == [
        {
            "result_type": "perfect_correct",
            "grammar_focus": ["present_simple"],
            "timestamp": fixed_now.isoformat(),
        },
        {
            "result_type": "incorrect",
            "grammar_focus": ["present_simple", "adverb_of_frequency"],
            "timestamp": fixed_now.isoformat(),
        },
    ]


def test_get_skill_report_calculates_scores(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        True,
        grammar_focus=["present_simple"],
    )
    engine.update_progress(
        "student_001",
        "A1_FOOD_002",
        True,
        hint_used=True,
        grammar_focus=["present_simple", "food_vocabulary"],
    )
    engine.update_progress(
        "student_001",
        "A1_SHOP_001",
        False,
        mistake_type="word_order_error",
        grammar_focus=["question_structure"],
    )

    report = engine.get_skill_report("student_001")

    assert report == {
        "present_simple": {
            "score": 2.5,
            "attempts": 2,
            "status": "developing",
        },
        "food_vocabulary": {
            "score": 0.5,
            "attempts": 1,
            "status": "developing",
        },
        "question_structure": {
            "score": -2.0,
            "attempts": 1,
            "status": "weak",
        },
    }


def test_get_skill_report_applies_result_type_weights(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.update_progress("student_001", "S1", True, grammar_focus=["present_simple"])
    engine.update_progress("student_001", "S2", True, hint_used=True, grammar_focus=["present_simple"])
    engine.update_progress(
        "student_001",
        "S3",
        False,
        mistake_type="word_order_error",
        grammar_focus=["present_simple"],
    )

    report = engine.get_skill_report("student_001")

    assert report["present_simple"]["score"] == 0.5
    assert report["present_simple"]["attempts"] == 3


def test_get_skill_report_status_buckets_and_legacy_safety(tmp_path):
    fixed_now = datetime(2026, 4, 28, 10, 0, 0)
    progress_path = tmp_path / "user_progress.json"
    engine = LearningEngine(
        progress_path=str(progress_path),
        now_fn=lambda: fixed_now,
    )

    engine.progress = {
        "student_001": {
            "legacy_sentence": {
                "srs_level": 1,
                "interval_days": 1,
            },
            "weak_sentence": {
                "result_history": [
                    {
                        "result_type": "incorrect",
                        "grammar_focus": ["weak_topic"],
                        "timestamp": fixed_now.isoformat(),
                    }
                ]
            },
            "developing_sentence": {
                "result_history": [
                    {
                        "result_type": "assisted_correct",
                        "grammar_focus": ["developing_topic"],
                        "timestamp": fixed_now.isoformat(),
                    }
                ]
            },
            "strong_sentence": {
                "result_history": [
                    {
                        "result_type": "perfect_correct",
                        "grammar_focus": ["strong_topic"],
                        "timestamp": fixed_now.isoformat(),
                    },
                    {
                        "result_type": "perfect_correct",
                        "grammar_focus": ["strong_topic"],
                        "timestamp": fixed_now.isoformat(),
                    },
                ]
            },
        }
    }

    report = engine.get_skill_report("student_001")

    assert report["weak_topic"]["status"] == "weak"
    assert report["developing_topic"]["status"] == "developing"
    assert report["strong_topic"]["status"] == "strong"
    assert "legacy_sentence" not in report
