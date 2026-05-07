import json
from pathlib import Path

import pytest

from engines.sentence_engine import SentenceEngine


BASE_DIR = Path(__file__).resolve().parents[1]


@pytest.fixture
def bank_data():
    with open(BASE_DIR / "data" / "sample_sentence_bank.json", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def engine(bank_data):
    return SentenceEngine(bank_data)


def test_can_draw_question_payload(engine):
    payload = engine.get_random_question_payload(level="A1")

    assert payload is not None
    assert payload["sentence_id"].startswith("A1_")
    assert payload["task_type"] == "original"
    assert payload["translation"]
    assert payload["audio_hint_text"]
    assert payload["shuffled_chunks"]


def test_shuffled_chunks_have_uuid_ids(engine):
    payload = engine.get_question_payload("A1_ROUTINE_004")

    assert payload is not None

    chunk_ids = [chunk["chunk_id"] for chunk in payload["shuffled_chunks"]]

    assert len(chunk_ids) == len(set(chunk_ids))
    assert all(isinstance(chunk_id, str) and chunk_id for chunk_id in chunk_ids)


def test_correct_answer_passes(engine):
    payload = engine.get_question_payload("A1_ROUTINE_004")

    assert payload is not None

    question_id = payload["question_id"]
    correct_ids = engine.answer_key[question_id]["correct_ids"]

    result = engine.check_answer(question_id, correct_ids)

    assert result == {"is_correct": True, "mistake_type": None}


def test_fsi_question_payload_contains_audio_hint_text(engine):
    payload = engine.get_question_payload("A1_ROUTINE_004", task_type="question")

    assert payload is not None
    assert payload["audio_hint_text"] == "Do you usually drink milk for breakfast?"


def test_wrong_answer_is_caught(engine):
    payload = engine.get_question_payload("A1_ROUTINE_004")

    assert payload is not None

    question_id = payload["question_id"]
    correct_ids = engine.answer_key[question_id]["correct_ids"]
    wrong_ids = list(reversed(correct_ids))

    result = engine.check_answer(question_id, wrong_ids)

    assert result == {
        "is_correct": False,
        "mistake_type": "word_order_error",
    }
