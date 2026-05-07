import json
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import create_app


def load_bank_data():
    with open(BASE_DIR / "data" / "sample_sentence_bank.json", encoding="utf-8") as f:
        return json.load(f)


def create_test_client(tmp_path):
    app = create_app(
        sentence_bank=load_bank_data(),
        progress_path=str(tmp_path / "user_progress.json"),
        users_path=str(tmp_path / "users.json"),
        attempts_path=str(tmp_path / "user_sentence_attempts.json"),
        fsi_rng=lambda: 0.0,
    )
    app.config["TESTING"] = True
    return app.test_client()


def create_default_bank_test_client(tmp_path):
    app = create_app(
        progress_path=str(tmp_path / "user_progress.json"),
        users_path=str(tmp_path / "users.json"),
        attempts_path=str(tmp_path / "user_sentence_attempts.json"),
        fsi_rng=lambda: 0.0,
    )
    app.config["TESTING"] = True
    return app.test_client()


def create_custom_bank_test_client(tmp_path, sentence_bank):
    normalized_bank = []
    for index, sentence in enumerate(sentence_bank, start=1):
        normalized_bank.append(
            {
                "sentence_id": sentence["sentence_id"],
                "level": sentence.get("level", "A1"),
                "pattern": sentence.get("pattern", "UNKNOWN"),
                "scenario": sentence.get("scenario", "shopping"),
                "target_sentence": sentence.get("target_sentence", f"Sentence {index}."),
                "chunks": sentence.get(
                    "chunks",
                    [
                        {"chunk_id": f"{sentence['sentence_id']}_chunk_1", "text": f"Sentence {index}."},
                    ],
                ),
                "translation": sentence.get("translation", f"Translation {index}"),
            }
        )

    app = create_app(
        sentence_bank=normalized_bank,
        progress_path=str(tmp_path / "user_progress.json"),
        users_path=str(tmp_path / "users.json"),
        attempts_path=str(tmp_path / "user_sentence_attempts.json"),
        fsi_rng=lambda: 0.0,
    )
    app.config["TESTING"] = True
    return app.test_client()


def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def create_user(client, username="Tom"):
    return client.post("/api/users/login", json={"username": username}).get_json()


def create_attempt(
    client,
    user_id,
    sentence_id,
    level,
    pattern,
    is_correct,
    user_answer="test answer",
    correct_answer="test answer",
):
    return client.post(
        "/api/attempts",
        json={
            "user_id": user_id,
            "sentence_id": sentence_id,
            "level": level,
            "pattern": pattern,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
        },
    )


def write_attempts_file(tmp_path, attempts):
    attempts_path = tmp_path / "user_sentence_attempts.json"
    with attempts_path.open("w", encoding="utf-8") as f:
        json.dump(attempts, f, indent=4, ensure_ascii=False)


def build_attempt_record(
    attempt_number,
    user_id,
    sentence_id,
    level,
    pattern,
    is_correct,
    created_at,
):
    return {
        "id": f"attempt_{attempt_number:03d}",
        "user_id": user_id,
        "sentence_id": sentence_id,
        "level": level,
        "pattern": pattern,
        "user_answer": f"answer {attempt_number}",
        "correct_answer": f"correct {attempt_number}",
        "is_correct": is_correct,
        "created_at": created_at,
    }


def get_next_practice(client, user_id, query_string=None):
    return client.get(f"/api/users/{user_id}/next-practice", query_string=query_string)


NEXT_PRACTICE_META = {
    "remediate_recent_wrong": {
        "reason_code": "RECENT_ACCURACY_LOW",
        "message": "先複習最近錯題，穩固基礎後再前進。",
    },
    "weak_pattern_not_attempted": {
        "reason_code": "WEAK_PATTERN_NEEDS_REINFORCEMENT",
        "message": "優先補弱句型的新題。",
    },
    "not_attempted": {
        "reason_code": "PROGRESS_NEW_CONTENT",
        "message": "繼續練習還沒做過的新題。",
    },
    "recent_wrong_attempt": {
        "reason_code": "REVIEW_RECENT_WRONG",
        "message": "目前沒有新題建議，先複習最近錯題。",
    },
    "none": {
        "reason_code": "NO_RECOMMENDATION",
        "message": "目前沒有推薦題目。",
    },
}


def build_next_practice_response(
    user_id,
    strategy,
    *,
    is_exhausted,
    limit,
    level=None,
    pattern=None,
    recommendations=None,
):
    return {
        "user_id": user_id,
        "strategy": strategy,
        "reason_code": NEXT_PRACTICE_META[strategy]["reason_code"],
        "is_exhausted": is_exhausted,
        "limit": limit,
        "filters": {"level": level, "pattern": pattern},
        "message": NEXT_PRACTICE_META[strategy]["message"],
        "recommendations": recommendations or [],
    }


def test_health_endpoint_returns_healthy(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "healthy", "engines": "ready"}


def test_user_login_creates_user_and_json_file(tmp_path):
    client = create_test_client(tmp_path)
    users_path = tmp_path / "users.json"

    response = client.post("/api/users/login", json={"username": "Tom"})

    assert response.status_code == 200
    body = response.get_json()
    assert body["id"] == "user_001"
    assert body["username"] == "Tom"
    assert body["role"] == "student"
    assert body["last_login"]
    assert users_path.exists()
    assert read_json(users_path) == [
        {
            "id": "user_001",
            "username": "Tom",
            "last_login": body["last_login"],
            "role": "student",
            "created_at": body["created_at"],
        }
    ]


def test_user_login_updates_last_login_for_existing_username(tmp_path):
    client = create_test_client(tmp_path)

    first_response = client.post("/api/users/login", json={"username": "Tom"})
    first_body = first_response.get_json()

    second_response = client.post("/api/users/login", json={"username": "Tom"})

    assert second_response.status_code == 200
    second_body = second_response.get_json()
    assert second_body["id"] == first_body["id"]
    assert second_body["username"] == "Tom"
    assert second_body["role"] == "student"
    assert second_body["created_at"] == first_body["created_at"]
    assert second_body["last_login"] >= first_body["last_login"]
    assert len(read_json(tmp_path / "users.json")) == 1


def test_get_user_returns_existing_user(tmp_path):
    client = create_test_client(tmp_path)
    created_user = client.post("/api/users/login", json={"username": "Tom"}).get_json()

    response = client.get(f"/api/users/{created_user['id']}")

    assert response.status_code == 200
    assert response.get_json() == created_user


def test_get_user_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_create_attempt_persists_attempt_for_existing_user(tmp_path):
    client = create_test_client(tmp_path)
    user = client.post("/api/users/login", json={"username": "Tom"}).get_json()
    attempts_path = tmp_path / "user_sentence_attempts.json"

    response = client.post(
        "/api/attempts",
        json={
            "user_id": user["id"],
            "sentence_id": "SHOP_PAY_A1_001",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "user_answer": "Can I pay with cash?",
            "correct_answer": "Can I pay with cash?",
            "is_correct": True,
        },
    )

    assert response.status_code == 200
    assert response.get_json()["success"] is True
    assert attempts_path.exists()
    attempts = read_json(attempts_path)
    assert attempts == [
        {
            "id": "attempt_001",
            "user_id": user["id"],
            "sentence_id": "SHOP_PAY_A1_001",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "user_answer": "Can I pay with cash?",
            "correct_answer": "Can I pay with cash?",
            "is_correct": True,
            "created_at": attempts[0]["created_at"],
        }
    ]


def test_create_attempt_rejects_unknown_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.post(
        "/api/attempts",
        json={
            "user_id": "user_999",
            "sentence_id": "SHOP_PAY_A1_001",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "user_answer": "Can I pay with cash?",
            "correct_answer": "Can I pay with cash?",
            "is_correct": True,
        },
    )

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_attempts_returns_descending_created_at(tmp_path):
    client = create_test_client(tmp_path)
    user = client.post("/api/users/login", json={"username": "Tom"}).get_json()

    first_attempt = client.post(
        "/api/attempts",
        json={
            "user_id": user["id"],
            "sentence_id": "SHOP_PAY_A1_001",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "user_answer": "Can I pay with cash?",
            "correct_answer": "Can I pay with cash?",
            "is_correct": True,
        },
    ).get_json()["attempt"]

    second_attempt = client.post(
        "/api/attempts",
        json={
            "user_id": user["id"],
            "sentence_id": "SHOP_PAY_A1_002",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "user_answer": "Can I use a card?",
            "correct_answer": "Can I use a card?",
            "is_correct": False,
        },
    ).get_json()["attempt"]

    response = client.get(f"/api/users/{user['id']}/attempts")

    assert response.status_code == 200
    assert response.get_json() == {"attempts": [second_attempt, first_attempt]}


def test_get_user_attempts_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/attempts")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_stats_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/stats")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_stats_returns_zero_stats_without_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_attempts": 0,
        "correct_attempts": 0,
        "wrong_attempts": 0,
        "accuracy": 0,
        "recent": {
            "last_10": {
                "total_attempts": 0,
                "correct_attempts": 0,
                "wrong_attempts": 0,
                "accuracy": 0,
            },
            "last_20": {
                "total_attempts": 0,
                "correct_attempts": 0,
                "wrong_attempts": 0,
                "accuracy": 0,
            },
        },
        "by_level": {},
        "by_pattern": {},
    }


def test_get_user_stats_calculates_summary_level_and_pattern_breakdowns(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_PAY_A1_001", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "SHOP_PAY_A1_002", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "SHOP_PAY_A1_003", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "SHOP_TOO_A2_001", "A2", "SHOP_TOO", True)
    create_attempt(client, user["id"], "SHOP_TOO_A2_002", "A2", "SHOP_TOO", False)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_attempts": 5,
        "correct_attempts": 3,
        "wrong_attempts": 2,
        "accuracy": 0.6,
        "recent": {
            "last_10": {
                "total_attempts": 5,
                "correct_attempts": 3,
                "wrong_attempts": 2,
                "accuracy": 0.6,
            },
            "last_20": {
                "total_attempts": 5,
                "correct_attempts": 3,
                "wrong_attempts": 2,
                "accuracy": 0.6,
            },
        },
        "by_level": {
            "A1": {
                "total_attempts": 3,
                "correct_attempts": 2,
                "wrong_attempts": 1,
                "accuracy": 2 / 3,
            },
            "A2": {
                "total_attempts": 2,
                "correct_attempts": 1,
                "wrong_attempts": 1,
                "accuracy": 0.5,
            },
        },
        "by_pattern": {
            "SHOP_PAY": {
                "total_attempts": 3,
                "correct_attempts": 2,
                "wrong_attempts": 1,
                "accuracy": 2 / 3,
            },
            "SHOP_TOO": {
                "total_attempts": 2,
                "correct_attempts": 1,
                "wrong_attempts": 1,
                "accuracy": 0.5,
            },
        },
    }


def test_get_user_stats_does_not_include_other_users_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client, "Tom")
    other_user = create_user(client, "Jane")

    create_attempt(client, user["id"], "SHOP_PAY_A1_001", "A1", "SHOP_PAY", True)
    create_attempt(client, other_user["id"], "SHOP_TOO_A2_001", "A2", "SHOP_TOO", False)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_attempts": 1,
        "correct_attempts": 1,
        "wrong_attempts": 0,
        "accuracy": 1.0,
        "recent": {
            "last_10": {
                "total_attempts": 1,
                "correct_attempts": 1,
                "wrong_attempts": 0,
                "accuracy": 1.0,
            },
            "last_20": {
                "total_attempts": 1,
                "correct_attempts": 1,
                "wrong_attempts": 0,
                "accuracy": 1.0,
            },
        },
        "by_level": {
            "A1": {
                "total_attempts": 1,
                "correct_attempts": 1,
                "wrong_attempts": 0,
                "accuracy": 1.0,
            }
        },
        "by_pattern": {
            "SHOP_PAY": {
                "total_attempts": 1,
                "correct_attempts": 1,
                "wrong_attempts": 0,
                "accuracy": 1.0,
            }
        },
    }


def test_get_user_stats_recent_uses_all_attempts_when_fewer_than_ten(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    attempts = []
    for attempt_number in range(1, 6):
        attempts.append(
            build_attempt_record(
                attempt_number=attempt_number,
                user_id=user["id"],
                sentence_id=f"SHOP_PAY_A1_{attempt_number:03d}",
                level="A1",
                pattern="SHOP_PAY",
                is_correct=attempt_number <= 3,
                created_at=f"2026-01-01T00:00:{attempt_number:02d}",
            )
        )
    write_attempts_file(tmp_path, attempts)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json()["recent"] == {
        "last_10": {
            "total_attempts": 5,
            "correct_attempts": 3,
            "wrong_attempts": 2,
            "accuracy": 0.6,
        },
        "last_20": {
            "total_attempts": 5,
            "correct_attempts": 3,
            "wrong_attempts": 2,
            "accuracy": 0.6,
        },
    }


def test_get_user_stats_recent_last_10_and_last_20_use_latest_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    attempts = []
    for attempt_number in range(1, 26):
        attempts.append(
            build_attempt_record(
                attempt_number=attempt_number,
                user_id=user["id"],
                sentence_id=f"SHOP_PAY_A1_{attempt_number:03d}",
                level="A1" if attempt_number <= 12 else "A2",
                pattern="SHOP_PAY" if attempt_number <= 12 else "SHOP_TOO",
                is_correct=attempt_number >= 16,
                created_at=f"2026-01-01T00:00:{attempt_number:02d}",
            )
        )
    write_attempts_file(tmp_path, attempts)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json()["recent"] == {
        "last_10": {
            "total_attempts": 10,
            "correct_attempts": 10,
            "wrong_attempts": 0,
            "accuracy": 1.0,
        },
        "last_20": {
            "total_attempts": 20,
            "correct_attempts": 10,
            "wrong_attempts": 10,
            "accuracy": 0.5,
        },
    }


def test_get_user_stats_recent_does_not_mix_other_users_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client, "Tom")
    other_user = create_user(client, "Jane")

    attempts = []
    for attempt_number in range(1, 9):
        attempts.append(
            build_attempt_record(
                attempt_number=attempt_number,
                user_id=user["id"],
                sentence_id=f"SHOP_PAY_A1_{attempt_number:03d}",
                level="A1",
                pattern="SHOP_PAY",
                is_correct=attempt_number <= 6,
                created_at=f"2026-01-01T00:00:{attempt_number:02d}",
            )
        )
    for attempt_number in range(9, 15):
        attempts.append(
            build_attempt_record(
                attempt_number=attempt_number,
                user_id=other_user["id"],
                sentence_id=f"SHOP_TOO_A2_{attempt_number:03d}",
                level="A2",
                pattern="SHOP_TOO",
                is_correct=False,
                created_at=f"2026-01-01T00:00:{attempt_number:02d}",
            )
        )
    write_attempts_file(tmp_path, attempts)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json()["recent"] == {
        "last_10": {
            "total_attempts": 8,
            "correct_attempts": 6,
            "wrong_attempts": 2,
            "accuracy": 0.75,
        },
        "last_20": {
            "total_attempts": 8,
            "correct_attempts": 6,
            "wrong_attempts": 2,
            "accuracy": 0.75,
        },
    }


def test_get_user_stats_recent_sorts_same_created_at_by_id_desc(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    attempts = []
    for attempt_number in range(1, 13):
        attempts.append(
            build_attempt_record(
                attempt_number=attempt_number,
                user_id=user["id"],
                sentence_id=f"SHOP_PAY_A1_{attempt_number:03d}",
                level="A1",
                pattern="SHOP_PAY",
                is_correct=attempt_number >= 8,
                created_at="2026-01-01T00:00:00",
            )
        )
    write_attempts_file(tmp_path, attempts)

    response = client.get(f"/api/users/{user['id']}/stats")

    assert response.status_code == 200
    assert response.get_json()["recent"]["last_10"] == {
        "total_attempts": 10,
        "correct_attempts": 5,
        "wrong_attempts": 5,
        "accuracy": 0.5,
    }


def test_get_user_weak_patterns_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/weak-patterns")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_weak_patterns_uses_default_filters(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    for attempt_index in range(5):
        create_attempt(
            client,
            user["id"],
            f"SHOP_TOO_A2_{attempt_index:03d}",
            "A2",
            "SHOP_TOO",
            attempt_index == 0,
        )

    for attempt_index in range(5):
        create_attempt(
            client,
            user["id"],
            f"SHOP_PAY_A1_{attempt_index:03d}",
            "A1",
            "SHOP_PAY",
            attempt_index < 4,
        )

    response = client.get(f"/api/users/{user['id']}/weak-patterns")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "min_attempts": 5,
        "threshold": 0.7,
        "weak_patterns": [
            {
                "pattern": "SHOP_TOO",
                "total_attempts": 5,
                "correct_attempts": 1,
                "wrong_attempts": 4,
                "accuracy": 0.2,
            }
        ],
    }


def test_get_user_weak_patterns_accepts_query_string_overrides(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_PAY_A1_001", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "SHOP_PAY_A1_002", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "SHOP_PAY_A1_003", "A1", "SHOP_PAY", False)

    response = client.get(
        f"/api/users/{user['id']}/weak-patterns",
        query_string={"min_attempts": "3", "threshold": "0.8"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "min_attempts": 3,
        "threshold": 0.8,
        "weak_patterns": [
            {
                "pattern": "SHOP_PAY",
                "total_attempts": 3,
                "correct_attempts": 1,
                "wrong_attempts": 2,
                "accuracy": 1 / 3,
            }
        ],
    }


def test_get_user_weak_patterns_excludes_patterns_with_insufficient_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    for attempt_index in range(4):
        create_attempt(
            client,
            user["id"],
            f"SHOP_SMALL_A1_{attempt_index:03d}",
            "A1",
            "SHOP_SMALL",
            False,
        )

    response = client.get(f"/api/users/{user['id']}/weak-patterns")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "min_attempts": 5,
        "threshold": 0.7,
        "weak_patterns": [],
    }


def test_get_user_weak_patterns_sorts_by_accuracy_then_wrong_attempts_desc(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    for attempt_index in range(6):
        create_attempt(
            client,
            user["id"],
            f"SHOP_LOW_A1_{attempt_index:03d}",
            "A1",
            "SHOP_LOW",
            attempt_index == 0,
        )

    for attempt_index in range(8):
        create_attempt(
            client,
            user["id"],
            f"SHOP_TIE_A2_{attempt_index:03d}",
            "A2",
            "SHOP_TIE",
            attempt_index < 2,
        )

    for attempt_index in range(5):
        create_attempt(
            client,
            user["id"],
            f"SHOP_TIE_SMALL_A2_{attempt_index:03d}",
            "A2",
            "SHOP_TIE_SMALL",
            attempt_index < 1,
        )

    response = client.get(
        f"/api/users/{user['id']}/weak-patterns",
        query_string={"min_attempts": "5", "threshold": "0.8"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "min_attempts": 5,
        "threshold": 0.8,
        "weak_patterns": [
            {
                "pattern": "SHOP_LOW",
                "total_attempts": 6,
                "correct_attempts": 1,
                "wrong_attempts": 5,
                "accuracy": 1 / 6,
            },
            {
                "pattern": "SHOP_TIE_SMALL",
                "total_attempts": 5,
                "correct_attempts": 1,
                "wrong_attempts": 4,
                "accuracy": 0.2,
            },
            {
                "pattern": "SHOP_TIE",
                "total_attempts": 8,
                "correct_attempts": 2,
                "wrong_attempts": 6,
                "accuracy": 0.25,
            },
        ],
    }


def test_get_user_weak_patterns_uses_defaults_for_invalid_query_strings(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    for attempt_index in range(5):
        create_attempt(
            client,
            user["id"],
            f"SHOP_TOO_A2_{attempt_index:03d}",
            "A2",
            "SHOP_TOO",
            attempt_index == 0,
        )

    response = client.get(
        f"/api/users/{user['id']}/weak-patterns",
        query_string={"min_attempts": "abc", "threshold": "oops"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "min_attempts": 5,
        "threshold": 0.7,
        "weak_patterns": [
            {
                "pattern": "SHOP_TOO",
                "total_attempts": 5,
                "correct_attempts": 1,
                "wrong_attempts": 4,
                "accuracy": 0.2,
            }
        ],
    }


def test_get_user_wrong_attempts_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/wrong-attempts")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_wrong_attempts_returns_empty_list_without_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    response = client.get(f"/api/users/{user['id']}/wrong-attempts")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 0,
        "wrong_attempts": [],
    }


def test_get_user_wrong_attempts_only_returns_incorrect_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_PAY_A1_001", "A1", "SHOP_PAY", True)
    wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_002",
        "A1",
        "SHOP_TOO",
        False,
        user_answer="This bag is too big",
        correct_answer="This bag is too big.",
    ).get_json()["attempt"]

    response = client.get(f"/api/users/{user['id']}/wrong-attempts")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 1,
        "wrong_attempts": [
            {
                "id": wrong_attempt["id"],
                "sentence_id": "SHOP_TOO_A1_002",
                "level": "A1",
                "pattern": "SHOP_TOO",
                "user_answer": "This bag is too big",
                "correct_answer": "This bag is too big.",
                "created_at": wrong_attempt["created_at"],
            }
        ],
    }


def test_get_user_wrong_attempts_does_not_include_other_users_attempts(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client, "Tom")
    other_user = create_user(client, "Jane")

    own_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_001",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    create_attempt(client, other_user["id"], "SHOP_PAY_A2_001", "A2", "SHOP_PAY", False)

    response = client.get(f"/api/users/{user['id']}/wrong-attempts")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 1,
        "wrong_attempts": [
            {
                "id": own_wrong_attempt["id"],
                "sentence_id": own_wrong_attempt["sentence_id"],
                "level": own_wrong_attempt["level"],
                "pattern": own_wrong_attempt["pattern"],
                "user_answer": own_wrong_attempt["user_answer"],
                "correct_answer": own_wrong_attempt["correct_answer"],
                "created_at": own_wrong_attempt["created_at"],
            }
        ],
    }


def test_get_user_wrong_attempts_returns_descending_created_at(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    first_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_001",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    second_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_PAY_A2_001",
        "A2",
        "SHOP_PAY",
        False,
    ).get_json()["attempt"]

    response = client.get(f"/api/users/{user['id']}/wrong-attempts")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 2,
        "wrong_attempts": [
            {
                "id": second_wrong_attempt["id"],
                "sentence_id": second_wrong_attempt["sentence_id"],
                "level": second_wrong_attempt["level"],
                "pattern": second_wrong_attempt["pattern"],
                "user_answer": second_wrong_attempt["user_answer"],
                "correct_answer": second_wrong_attempt["correct_answer"],
                "created_at": second_wrong_attempt["created_at"],
            },
            {
                "id": first_wrong_attempt["id"],
                "sentence_id": first_wrong_attempt["sentence_id"],
                "level": first_wrong_attempt["level"],
                "pattern": first_wrong_attempt["pattern"],
                "user_answer": first_wrong_attempt["user_answer"],
                "correct_answer": first_wrong_attempt["correct_answer"],
                "created_at": first_wrong_attempt["created_at"],
            },
        ],
    }


def test_get_user_wrong_attempts_supports_level_filter(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_TOO_A1_001", "A1", "SHOP_TOO", False)
    a2_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_PAY_A2_001",
        "A2",
        "SHOP_PAY",
        False,
    ).get_json()["attempt"]

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"level": "A2"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 1,
        "wrong_attempts": [
            {
                "id": a2_wrong_attempt["id"],
                "sentence_id": a2_wrong_attempt["sentence_id"],
                "level": "A2",
                "pattern": "SHOP_PAY",
                "user_answer": a2_wrong_attempt["user_answer"],
                "correct_answer": a2_wrong_attempt["correct_answer"],
                "created_at": a2_wrong_attempt["created_at"],
            }
        ],
    }


def test_get_user_wrong_attempts_supports_pattern_filter(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_PAY_A1_001", "A1", "SHOP_PAY", False)
    pattern_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_002",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"pattern": "SHOP_TOO"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 1,
        "wrong_attempts": [
            {
                "id": pattern_wrong_attempt["id"],
                "sentence_id": pattern_wrong_attempt["sentence_id"],
                "level": pattern_wrong_attempt["level"],
                "pattern": "SHOP_TOO",
                "user_answer": pattern_wrong_attempt["user_answer"],
                "correct_answer": pattern_wrong_attempt["correct_answer"],
                "created_at": pattern_wrong_attempt["created_at"],
            }
        ],
    }


def test_get_user_wrong_attempts_supports_level_and_pattern_filters_together(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    create_attempt(client, user["id"], "SHOP_TOO_A1_001", "A1", "SHOP_TOO", False)
    create_attempt(client, user["id"], "SHOP_PAY_A2_001", "A2", "SHOP_PAY", False)
    filtered_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A2_002",
        "A2",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"level": "A2", "pattern": "SHOP_TOO"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 1,
        "wrong_attempts": [
            {
                "id": filtered_wrong_attempt["id"],
                "sentence_id": filtered_wrong_attempt["sentence_id"],
                "level": "A2",
                "pattern": "SHOP_TOO",
                "user_answer": filtered_wrong_attempt["user_answer"],
                "correct_answer": filtered_wrong_attempt["correct_answer"],
                "created_at": filtered_wrong_attempt["created_at"],
            }
        ],
    }


def test_get_user_wrong_attempts_supports_valid_limit(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    first_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_001",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    second_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_PAY_A1_002",
        "A1",
        "SHOP_PAY",
        False,
    ).get_json()["attempt"]
    third_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_WANT_A2_001",
        "A2",
        "SHOP_WANT",
        False,
    ).get_json()["attempt"]

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"limit": "2"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 3,
        "wrong_attempts": [
            {
                "id": third_wrong_attempt["id"],
                "sentence_id": third_wrong_attempt["sentence_id"],
                "level": third_wrong_attempt["level"],
                "pattern": third_wrong_attempt["pattern"],
                "user_answer": third_wrong_attempt["user_answer"],
                "correct_answer": third_wrong_attempt["correct_answer"],
                "created_at": third_wrong_attempt["created_at"],
            },
            {
                "id": second_wrong_attempt["id"],
                "sentence_id": second_wrong_attempt["sentence_id"],
                "level": second_wrong_attempt["level"],
                "pattern": second_wrong_attempt["pattern"],
                "user_answer": second_wrong_attempt["user_answer"],
                "correct_answer": second_wrong_attempt["correct_answer"],
                "created_at": second_wrong_attempt["created_at"],
            },
        ],
    }


def test_get_user_wrong_attempts_ignores_invalid_limit_without_crashing(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    first_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_001",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    second_wrong_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_PAY_A1_002",
        "A1",
        "SHOP_PAY",
        False,
    ).get_json()["attempt"]

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"limit": "oops"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 2,
        "wrong_attempts": [
            {
                "id": second_wrong_attempt["id"],
                "sentence_id": second_wrong_attempt["sentence_id"],
                "level": second_wrong_attempt["level"],
                "pattern": second_wrong_attempt["pattern"],
                "user_answer": second_wrong_attempt["user_answer"],
                "correct_answer": second_wrong_attempt["correct_answer"],
                "created_at": second_wrong_attempt["created_at"],
            },
            {
                "id": first_wrong_attempt["id"],
                "sentence_id": first_wrong_attempt["sentence_id"],
                "level": first_wrong_attempt["level"],
                "pattern": first_wrong_attempt["pattern"],
                "user_answer": first_wrong_attempt["user_answer"],
                "correct_answer": first_wrong_attempt["correct_answer"],
                "created_at": first_wrong_attempt["created_at"],
            },
        ],
    }


def test_get_user_wrong_attempts_total_is_count_after_filters_before_limit(tmp_path):
    client = create_test_client(tmp_path)
    user = create_user(client)

    first_filtered_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_001",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    second_filtered_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_002",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    third_filtered_attempt = create_attempt(
        client,
        user["id"],
        "SHOP_TOO_A1_003",
        "A1",
        "SHOP_TOO",
        False,
    ).get_json()["attempt"]
    create_attempt(client, user["id"], "SHOP_PAY_A2_001", "A2", "SHOP_PAY", False)

    response = client.get(
        f"/api/users/{user['id']}/wrong-attempts",
        query_string={"pattern": "SHOP_TOO", "limit": "2"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_wrong_attempts": 3,
        "wrong_attempts": [
            {
                "id": third_filtered_attempt["id"],
                "sentence_id": third_filtered_attempt["sentence_id"],
                "level": third_filtered_attempt["level"],
                "pattern": third_filtered_attempt["pattern"],
                "user_answer": third_filtered_attempt["user_answer"],
                "correct_answer": third_filtered_attempt["correct_answer"],
                "created_at": third_filtered_attempt["created_at"],
            },
            {
                "id": second_filtered_attempt["id"],
                "sentence_id": second_filtered_attempt["sentence_id"],
                "level": second_filtered_attempt["level"],
                "pattern": second_filtered_attempt["pattern"],
                "user_answer": second_filtered_attempt["user_answer"],
                "correct_answer": second_filtered_attempt["correct_answer"],
                "created_at": second_filtered_attempt["created_at"],
            },
        ],
    }

    returned_attempt = response.get_json()["wrong_attempts"][0]
    assert set(returned_attempt.keys()) == {
        "id",
        "sentence_id",
        "level",
        "pattern",
        "user_answer",
        "correct_answer",
        "created_at",
    }
    assert "is_correct" not in returned_attempt


def test_get_user_coverage_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/coverage")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_coverage_returns_zero_when_sentence_bank_is_empty(tmp_path):
    client = create_custom_bank_test_client(tmp_path, [])
    user = create_user(client)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_sentences": 0,
        "attempted_sentences": 0,
        "not_attempted_sentences": 0,
        "coverage_rate": 0,
        "by_level": {},
        "by_pattern": {},
    }


def test_get_user_coverage_returns_zero_without_attempts(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json() == {
        "user_id": user["id"],
        "total_sentences": 2,
        "attempted_sentences": 0,
        "not_attempted_sentences": 2,
        "coverage_rate": 0,
        "by_level": {
            "A1": {"total": 1, "attempted": 0, "not_attempted": 1, "coverage_rate": 0},
            "A2": {"total": 1, "attempted": 0, "not_attempted": 1, "coverage_rate": 0},
        },
        "by_pattern": {
            "SHOP_PAY": {"total": 1, "attempted": 0, "not_attempted": 1, "coverage_rate": 0},
            "SHOP_TOO": {"total": 1, "attempted": 0, "not_attempted": 1, "coverage_rate": 0},
        },
    }


def test_get_user_coverage_counts_multiple_attempts_for_same_sentence_once(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "S1", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "S1", "A1", "SHOP_PAY", False)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["attempted_sentences"] == 1
    assert response.get_json()["not_attempted_sentences"] == 1
    assert response.get_json()["coverage_rate"] == 0.5


def test_get_user_coverage_does_not_mix_other_users_attempts(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client, "Tom")
    other_user = create_user(client, "Jane")

    create_attempt(client, other_user["id"], "S1", "A1", "SHOP_PAY", True)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["attempted_sentences"] == 0
    assert response.get_json()["coverage_rate"] == 0


def test_get_user_coverage_ignores_attempts_for_sentence_ids_not_in_bank(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "MISSING", "A1", "SHOP_PAY", True)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["attempted_sentences"] == 0
    assert response.get_json()["coverage_rate"] == 0


def test_get_user_coverage_calculates_by_level_from_sentence_bank_metadata(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "S3", "level": "A2", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "S1", "WRONG_LEVEL", "WRONG_PATTERN", True)
    create_attempt(client, user["id"], "S3", "WRONG_LEVEL", "WRONG_PATTERN", False)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["by_level"] == {
        "A1": {"total": 2, "attempted": 1, "not_attempted": 1, "coverage_rate": 0.5},
        "A2": {"total": 1, "attempted": 1, "not_attempted": 0, "coverage_rate": 1.0},
    }


def test_get_user_coverage_calculates_by_pattern_from_sentence_bank_metadata(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A2", "pattern": "SHOP_PAY"},
        {"sentence_id": "S3", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "S1", "A1", "OLD_PATTERN", True)
    create_attempt(client, user["id"], "S3", "A2", "OLD_PATTERN", True)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["by_pattern"] == {
        "SHOP_PAY": {"total": 2, "attempted": 1, "not_attempted": 1, "coverage_rate": 0.5},
        "SHOP_TOO": {"total": 1, "attempted": 1, "not_attempted": 0, "coverage_rate": 1.0},
    }


def test_get_user_coverage_returns_one_when_all_sentences_attempted(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "S1", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "S2", "A2", "SHOP_TOO", False)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["coverage_rate"] == 1.0
    assert response.get_json()["attempted_sentences"] == 2
    assert response.get_json()["not_attempted_sentences"] == 0


def test_get_user_coverage_returns_partial_rate_for_partially_attempted_bank(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "S3", "level": "A2", "pattern": "SHOP_WANT"},
        {"sentence_id": "S4", "level": "A2", "pattern": "SHOP_WANT"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "S1", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "S3", "A2", "SHOP_WANT", True)

    response = client.get(f"/api/users/{user['id']}/coverage")

    assert response.status_code == 200
    assert response.get_json()["total_sentences"] == 4
    assert response.get_json()["attempted_sentences"] == 2
    assert response.get_json()["not_attempted_sentences"] == 2
    assert response.get_json()["coverage_rate"] == 0.5


def test_get_user_next_practice_returns_404_for_missing_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/users/user_999/next-practice")

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}


def test_get_user_next_practice_returns_none_when_sentence_bank_is_empty(tmp_path):
    client = create_custom_bank_test_client(tmp_path, [])
    user = create_user(client)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "none",
        is_exhausted=True,
        limit=10,
    )


def test_get_user_next_practice_returns_not_attempted_when_user_has_no_attempts(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_TOO_001", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "not_attempted",
        is_exhausted=False,
        limit=10,
        recommendations=[
            {
                "sentence_id": "A1_PAY_001",
                "level": "A1",
                "pattern": "SHOP_PAY",
                "reason": "not_attempted",
            },
            {
                "sentence_id": "A2_TOO_001",
                "level": "A2",
                "pattern": "SHOP_TOO",
                "reason": "not_attempted",
            },
        ],
    )


def test_get_user_next_practice_prefers_unattempted_sentences_in_weak_patterns(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_003", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_004", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_005", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_006", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_002", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_003", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_004", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_005", "A1", "SHOP_PAY", True)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "weak_pattern_not_attempted",
        is_exhausted=False,
        limit=10,
        recommendations=[
            {
                "sentence_id": "A1_PAY_006",
                "level": "A1",
                "pattern": "SHOP_PAY",
                "reason": "weak_pattern_not_attempted",
            }
        ],
    )


def test_get_user_next_practice_sorts_multiple_weak_patterns_by_accuracy_wrong_attempts_and_pattern(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_BAG_001", "level": "A1", "pattern": "SHOP_BAG"},
        {"sentence_id": "A1_BAG_002", "level": "A1", "pattern": "SHOP_BAG"},
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "A1_TOO_002", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "A1_TOO_003", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    for sentence_id, is_correct in [
        ("A1_TOO_001", False),
        ("A1_TOO_001", False),
        ("A1_TOO_001", False),
        ("A1_TOO_002", False),
        ("A1_TOO_002", True),
    ]:
        create_attempt(client, user["id"], sentence_id, "A1", "SHOP_TOO", is_correct)

    for sentence_id, is_correct in [
        ("A1_BAG_001", False),
        ("A1_BAG_001", False),
        ("A1_BAG_001", True),
        ("A1_BAG_002", True),
        ("A1_BAG_002", True),
    ]:
        create_attempt(client, user["id"], sentence_id, "A1", "SHOP_BAG", is_correct)

    for sentence_id, is_correct in [
        ("A1_PAY_001", False),
        ("A1_PAY_001", False),
        ("A1_PAY_001", True),
        ("A1_PAY_002", True),
        ("A1_PAY_002", True),
    ]:
        create_attempt(client, user["id"], sentence_id, "A1", "SHOP_PAY", is_correct)

    response = get_next_practice(client, user["id"], {"limit": "4"})

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "weak_pattern_not_attempted",
        is_exhausted=False,
        limit=4,
        recommendations=[
            {
                "sentence_id": "A1_TOO_003",
                "level": "A1",
                "pattern": "SHOP_TOO",
                "reason": "weak_pattern_not_attempted",
            }
        ],
    )


def test_get_user_next_practice_does_not_fill_weak_pattern_results_with_general_unattempted(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_003", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_004", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_005", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_006", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "A1_TOO_002", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    for sentence_id, is_correct in [
        ("A1_PAY_001", False),
        ("A1_PAY_002", False),
        ("A1_PAY_003", False),
        ("A1_PAY_004", False),
        ("A1_PAY_005", True),
    ]:
        create_attempt(client, user["id"], sentence_id, "A1", "SHOP_PAY", is_correct)

    response = get_next_practice(client, user["id"], {"limit": "3"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "weak_pattern_not_attempted"
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_PAY_006",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "reason": "weak_pattern_not_attempted",
        }
    ]


def test_get_user_next_practice_falls_back_to_general_unattempted_when_weak_pattern_sentences_are_all_attempted(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_003", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_004", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_005", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
        {"sentence_id": "A2_TOO_001", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    for sentence_id, is_correct in [
        ("A1_PAY_001", False),
        ("A1_PAY_002", False),
        ("A1_PAY_003", False),
        ("A1_PAY_004", False),
        ("A1_PAY_005", True),
    ]:
        create_attempt(client, user["id"], sentence_id, "A1", "SHOP_PAY", is_correct)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["reason_code"] == "PROGRESS_NEW_CONTENT"
    assert response.get_json()["message"] == "繼續練習還沒做過的新題。"
    assert response.get_json()["strategy"] == "not_attempted"
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_TOO_001",
            "level": "A1",
            "pattern": "SHOP_TOO",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A2_TOO_001",
            "level": "A2",
            "pattern": "SHOP_TOO",
            "reason": "not_attempted",
        },
    ]


def test_get_user_next_practice_falls_back_to_recent_wrong_attempts_when_all_sentences_attempted(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    latest_wrong = create_attempt(client, user["id"], "A1_TOO_001", "A1", "SHOP_TOO", False).get_json()[
        "attempt"
    ]

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "recent_wrong_attempt",
        is_exhausted=False,
        limit=10,
        recommendations=[
            {
                "sentence_id": "A1_TOO_001",
                "level": "A1",
                "pattern": "SHOP_TOO",
                "reason": "recent_wrong_attempt",
            },
            {
                "sentence_id": "A1_PAY_001",
                "level": "A1",
                "pattern": "SHOP_PAY",
                "reason": "recent_wrong_attempt",
            },
        ],
    )
    assert latest_wrong["sentence_id"] == "A1_TOO_001"


def test_get_user_next_practice_returns_none_when_all_sentences_attempted_and_no_wrong_attempts(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", True)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "none",
        is_exhausted=True,
        limit=10,
    )


def test_get_user_next_practice_respects_valid_limit(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_A_001", "level": "A1", "pattern": "SHOP_A"},
        {"sentence_id": "A1_B_001", "level": "A1", "pattern": "SHOP_B"},
        {"sentence_id": "A2_A_001", "level": "A2", "pattern": "SHOP_A"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"], {"limit": "2"})

    assert response.status_code == 200
    assert response.get_json()["limit"] == 2
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_A_001",
            "level": "A1",
            "pattern": "SHOP_A",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A1_B_001",
            "level": "A1",
            "pattern": "SHOP_B",
            "reason": "not_attempted",
        },
    ]


def test_get_user_next_practice_uses_default_limit_when_limit_is_invalid(tmp_path):
    sentence_bank = [{"sentence_id": f"A1_PAY_{index:03d}", "level": "A1", "pattern": "SHOP_PAY"} for index in range(1, 13)]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"], {"limit": "oops"})

    assert response.status_code == 200
    assert response.get_json()["limit"] == 10
    assert len(response.get_json()["recommendations"]) == 10


def test_get_user_next_practice_applies_level_filter(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_TOO_001", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"], {"level": "A2"})

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "not_attempted",
        is_exhausted=False,
        limit=10,
        level="A2",
        recommendations=[
            {
                "sentence_id": "A2_TOO_001",
                "level": "A2",
                "pattern": "SHOP_TOO",
                "reason": "not_attempted",
            }
        ],
    )


def test_get_user_next_practice_applies_pattern_filter(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_TOO_001", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"], {"pattern": "SHOP_TOO"})

    assert response.status_code == 200
    assert response.get_json()["filters"] == {"level": None, "pattern": "SHOP_TOO"}
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A2_TOO_001",
            "level": "A2",
            "pattern": "SHOP_TOO",
            "reason": "not_attempted",
        }
    ]


def test_get_user_next_practice_applies_level_and_pattern_filters_together(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_PAY_001", "level": "A2", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_TOO_001", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"], {"level": "A2", "pattern": "SHOP_PAY"})

    assert response.status_code == 200
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A2_PAY_001",
            "level": "A2",
            "pattern": "SHOP_PAY",
            "reason": "not_attempted",
        }
    ]


def test_get_user_next_practice_filters_take_priority_over_recommendation_logic(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_003", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_004", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_005", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_002", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_003", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_004", "A1", "SHOP_PAY", False)
    create_attempt(client, user["id"], "A1_PAY_005", "A1", "SHOP_PAY", True)

    response = get_next_practice(client, user["id"], {"level": "A2"})

    assert response.status_code == 200
    assert response.get_json() == build_next_practice_response(
        user["id"],
        "none",
        is_exhausted=True,
        limit=10,
        level="A2",
    )


def test_get_user_next_practice_ignores_other_users_attempts(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client, "Tom")
    other_user = create_user(client, "Jane")

    create_attempt(client, other_user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    create_attempt(client, other_user["id"], "A1_PAY_002", "A1", "SHOP_PAY", False)
    create_attempt(client, other_user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)
    create_attempt(client, other_user["id"], "A1_PAY_002", "A1", "SHOP_PAY", False)
    create_attempt(client, other_user["id"], "A1_PAY_001", "A1", "SHOP_PAY", True)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "not_attempted"
    assert len(response.get_json()["recommendations"]) == 2


def test_get_user_next_practice_counts_multiple_attempts_for_same_sentence_as_attempted_once(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", True)
    create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "not_attempted"
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_PAY_002",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "reason": "not_attempted",
        }
    ]


def test_get_user_next_practice_returns_only_latest_recent_wrong_attempt_per_sentence(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_TOO_001", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    first_wrong = create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False).get_json()[
        "attempt"
    ]
    latest_wrong = create_attempt(client, user["id"], "A1_PAY_001", "A1", "SHOP_PAY", False).get_json()[
        "attempt"
    ]
    create_attempt(client, user["id"], "A1_TOO_001", "A1", "SHOP_TOO", False)

    response = get_next_practice(client, user["id"], {"limit": "5"})

    assert response.status_code == 200
    returned = [item["sentence_id"] for item in response.get_json()["recommendations"]]
    assert returned.count("A1_PAY_001") == 1
    assert latest_wrong["id"] != first_wrong["id"]


def test_get_user_next_practice_uses_sentence_bank_metadata_instead_of_attempt_metadata(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_PAY_001", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_PAY_002", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    for sentence_id in ["A1_PAY_001", "A1_PAY_001", "A1_PAY_001", "A1_PAY_002", "A1_PAY_002"]:
        create_attempt(client, user["id"], sentence_id, "OLD_LEVEL", "OLD_PATTERN", sentence_id == "A1_PAY_002")

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "recent_wrong_attempt"
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_PAY_001",
            "level": "A1",
            "pattern": "SHOP_PAY",
            "reason": "recent_wrong_attempt",
        },
    ]


def test_get_user_next_practice_sorting_is_deterministic(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_B_001", "level": "A1", "pattern": "SHOP_B"},
        {"sentence_id": "A1_A_002", "level": "A1", "pattern": "SHOP_A"},
        {"sentence_id": "A1_A_001", "level": "A1", "pattern": "SHOP_A"},
        {"sentence_id": "A2_A_001", "level": "A2", "pattern": "SHOP_A"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A1_A_001",
            "level": "A1",
            "pattern": "SHOP_A",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A1_A_002",
            "level": "A1",
            "pattern": "SHOP_A",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A1_B_001",
            "level": "A1",
            "pattern": "SHOP_B",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A2_A_001",
            "level": "A2",
            "pattern": "SHOP_A",
            "reason": "not_attempted",
        },
    ]


def test_get_user_next_practice_triggers_remediation_when_recent_accuracy_is_low(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 8)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(
            attempt_number=index,
            user_id=user["id"],
            sentence_id=f"S{index}",
            level="OLD_LEVEL",
            pattern="OLD_PATTERN",
            is_correct=index == 1,
            created_at=f"2026-01-01T00:00:{index:02d}",
        )
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "remediate_recent_wrong"
    assert response.get_json()["reason_code"] == "RECENT_ACCURACY_LOW"
    assert response.get_json()["message"] == "先複習最近錯題，穩固基礎後再前進。"


def test_get_user_next_practice_remediation_returns_at_most_five_recommendations(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 10)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(
            attempt_number=index,
            user_id=user["id"],
            sentence_id=f"S{index}",
            level="A1",
            pattern="SHOP_PAY",
            is_correct=False,
            created_at=f"2026-01-01T00:00:{index:02d}",
        )
        for index in range(1, 9)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"], {"limit": "10"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "remediate_recent_wrong"
    assert response.get_json()["limit"] == 10
    assert len(response.get_json()["recommendations"]) == 5


def test_get_user_next_practice_remediation_respects_smaller_query_limit(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 8)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(
            attempt_number=index,
            user_id=user["id"],
            sentence_id=f"S{index}",
            level="A1",
            pattern="SHOP_PAY",
            is_correct=False,
            created_at=f"2026-01-01T00:00:{index:02d}",
        )
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"], {"limit": "3"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "remediate_recent_wrong"
    assert len(response.get_json()["recommendations"]) == 3


def test_get_user_next_practice_remediation_uses_recent_wrong_attempt_sorting(tmp_path):
    sentence_bank = [
        {"sentence_id": "S1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S2", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S3", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S4", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S5", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "S6", "level": "A1", "pattern": "SHOP_PAY"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(1, user["id"], "S1", "A1", "SHOP_PAY", False, "2026-01-01T00:00:01"),
        build_attempt_record(2, user["id"], "S2", "A1", "SHOP_PAY", True, "2026-01-01T00:00:02"),
        build_attempt_record(3, user["id"], "S3", "A1", "SHOP_PAY", False, "2026-01-01T00:00:03"),
        build_attempt_record(4, user["id"], "S4", "A1", "SHOP_PAY", True, "2026-01-01T00:00:04"),
        build_attempt_record(5, user["id"], "S5", "A1", "SHOP_PAY", False, "2026-01-01T00:00:05"),
        build_attempt_record(6, user["id"], "S6", "A1", "SHOP_PAY", False, "2026-01-01T00:00:06"),
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert [item["sentence_id"] for item in response.get_json()["recommendations"]] == [
        "S6",
        "S5",
        "S3",
        "S1",
    ]


def test_get_user_next_practice_remediation_deduplicates_by_sentence_id(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 6)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(1, user["id"], "S1", "A1", "SHOP_PAY", False, "2026-01-01T00:00:01"),
        build_attempt_record(2, user["id"], "S1", "A1", "SHOP_PAY", False, "2026-01-01T00:00:06"),
        build_attempt_record(3, user["id"], "S2", "A1", "SHOP_PAY", False, "2026-01-01T00:00:02"),
        build_attempt_record(4, user["id"], "S3", "A1", "SHOP_PAY", False, "2026-01-01T00:00:03"),
        build_attempt_record(5, user["id"], "S4", "A1", "SHOP_PAY", False, "2026-01-01T00:00:04"),
        build_attempt_record(6, user["id"], "S5", "A1", "SHOP_PAY", False, "2026-01-01T00:00:05"),
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    returned = [item["sentence_id"] for item in response.get_json()["recommendations"]]
    assert returned.count("S1") == 1
    assert returned[0] == "S1"


def test_get_user_next_practice_remediation_uses_sentence_bank_metadata(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 7)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(
            attempt_number=index,
            user_id=user["id"],
            sentence_id=f"S{index}",
            level="OLD_LEVEL",
            pattern="OLD_PATTERN",
            is_correct=False,
            created_at=f"2026-01-01T00:00:{index:02d}",
        )
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["recommendations"][0] == {
        "sentence_id": "S6",
        "level": "A1",
        "pattern": "SHOP_PAY",
        "reason": "recent_accuracy_low",
    }


def test_get_user_next_practice_does_not_trigger_remediation_when_total_attempts_is_five_or_less(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 7)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(
            attempt_number=index,
            user_id=user["id"],
            sentence_id=f"S{index}",
            level="A1",
            pattern="SHOP_PAY",
            is_correct=False,
            created_at=f"2026-01-01T00:00:{index:02d}",
        )
        for index in range(1, 6)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "weak_pattern_not_attempted"
    assert response.get_json()["strategy"] != "remediate_recent_wrong"


def test_get_user_next_practice_uses_weak_pattern_when_recent_accuracy_is_not_low(tmp_path):
    sentence_bank = [
        {"sentence_id": f"S{index}", "level": "A1", "pattern": "SHOP_PAY"}
        for index in range(1, 8)
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(1, user["id"], "S1", "A1", "SHOP_PAY", False, "2026-01-01T00:00:01"),
        build_attempt_record(2, user["id"], "S2", "A1", "SHOP_PAY", False, "2026-01-01T00:00:02"),
        build_attempt_record(3, user["id"], "S3", "A1", "SHOP_PAY", False, "2026-01-01T00:00:03"),
        build_attempt_record(4, user["id"], "S4", "A1", "SHOP_PAY", True, "2026-01-01T00:00:04"),
        build_attempt_record(5, user["id"], "S5", "A1", "SHOP_PAY", True, "2026-01-01T00:00:05"),
        build_attempt_record(6, user["id"], "S6", "A1", "SHOP_PAY", True, "2026-01-01T00:00:06"),
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"])

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "weak_pattern_not_attempted"
    assert response.get_json()["reason_code"] == "WEAK_PATTERN_NEEDS_REINFORCEMENT"


def test_get_user_next_practice_remediation_respects_level_filter(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_2", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_3", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_4", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_5", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_6", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_1", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(index, user["id"], f"A1_{index}", "A1", "SHOP_PAY", False, f"2026-01-01T00:00:{index:02d}")
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"], {"level": "A1"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "remediate_recent_wrong"
    assert all(item["level"] == "A1" for item in response.get_json()["recommendations"])


def test_get_user_next_practice_remediation_respects_pattern_filter(tmp_path):
    sentence_bank = [
        {"sentence_id": "P1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "P2", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "P3", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "P4", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "P5", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "P6", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "T1", "level": "A1", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(index, user["id"], f"P{index}", "A1", "SHOP_PAY", False, f"2026-01-01T00:00:{index:02d}")
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"], {"pattern": "SHOP_PAY"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "remediate_recent_wrong"
    assert all(item["pattern"] == "SHOP_PAY" for item in response.get_json()["recommendations"])


def test_get_user_next_practice_remediation_falls_back_after_filter(tmp_path):
    sentence_bank = [
        {"sentence_id": "A1_1", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_2", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_3", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_4", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_5", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A1_6", "level": "A1", "pattern": "SHOP_PAY"},
        {"sentence_id": "A2_1", "level": "A2", "pattern": "SHOP_TOO"},
        {"sentence_id": "A2_2", "level": "A2", "pattern": "SHOP_TOO"},
    ]
    client = create_custom_bank_test_client(tmp_path, sentence_bank)
    user = create_user(client)

    attempts = [
        build_attempt_record(index, user["id"], f"A1_{index}", "A1", "SHOP_PAY", False, f"2026-01-01T00:00:{index:02d}")
        for index in range(1, 7)
    ]
    write_attempts_file(tmp_path, attempts)

    response = get_next_practice(client, user["id"], {"level": "A2"})

    assert response.status_code == 200
    assert response.get_json()["strategy"] == "not_attempted"
    assert response.get_json()["reason_code"] == "PROGRESS_NEW_CONTENT"
    assert response.get_json()["recommendations"] == [
        {
            "sentence_id": "A2_1",
            "level": "A2",
            "pattern": "SHOP_TOO",
            "reason": "not_attempted",
        },
        {
            "sentence_id": "A2_2",
            "level": "A2",
            "pattern": "SHOP_TOO",
            "reason": "not_attempted",
        },
    ]


def test_game_js_uses_next_practice_message_when_available():
    js_path = BASE_DIR / "static" / "js" / "game.js"

    script = js_path.read_text(encoding="utf-8")

    assert "data.message ||" in script


def test_game_js_uses_remediation_specific_status_copy():
    js_path = BASE_DIR / "static" / "js" / "game.js"

    script = js_path.read_text(encoding="utf-8")

    assert 'data.reason_code === "RECENT_ACCURACY_LOW"' in script
    assert 'data.strategy === "remediate_recent_wrong"' in script
    assert "偵測到近期錯誤較多，建議先完成錯題修復，再開啟新挑戰。" in script


def test_index_page_renders_game_shell(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="game-container"' in html
    assert 'id="status-bar"' in html
    assert 'id="hearts"' in html
    assert 'id="progress-fill"' in html
    assert 'id="score-display"' in html
    assert 'id="fsi-instruction"' in html
    assert 'id="drop-zone"' in html
    assert 'id="pool-zone"' in html
    assert 'id="summary-view"' in html
    assert 'id="mastered-topics"' in html
    assert 'id="bonus-score-note"' in html
    assert 'id="resilience-badge"' in html
    assert 'id="coach-feedback"' in html
    assert 'id="coach-title"' in html
    assert 'id="coach-steps"' in html
    assert 'id="game-over-view"' in html
    assert 'id="coach-feedback-over"' in html
    assert 'id="coach-title-over"' in html
    assert 'id="coach-steps-over"' in html
    assert 'id="mistake-list"' in html
    assert 'id="review-btn"' in html
    assert 'id="replay-voice-btn"' in html
    assert 'id="skill-report-panel"' in html
    assert 'id="weak-skills"' in html
    assert 'id="developing-skills"' in html
    assert 'id="strong-skills"' in html
    assert 'static/js/game.js' in html


def test_index_page_renders_scenario_picker(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="launcher-view"' in html
    assert 'id="level-picker"' in html
    assert "Choose Level" in html
    assert "A1+" in html
    assert "A2+" in html
    assert 'id="game-play-area"' in html
    assert "Daily Routine" in html
    assert "Food & Drink" in html
    assert "Shopping" in html
    assert "Travel & Holiday" in html


def test_index_page_renders_username_login_view(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="login-view"' in html
    assert 'id="username-input"' in html
    assert 'id="login-btn"' in html
    assert 'id="login-error"' in html


def test_index_page_renders_next_practice_panel(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="next-practice-panel"' in html


def test_index_page_renders_learning_summary_panel(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="learning-summary-panel"' in html


def test_index_page_renders_summary_total_attempts(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="summary-total-attempts"' in html


def test_index_page_renders_summary_accuracy(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="summary-accuracy"' in html


def test_index_page_renders_summary_coverage(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="summary-coverage"' in html


def test_index_page_renders_summary_recent_accuracy(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="summary-recent-accuracy"' in html


def test_game_js_formats_summary_coverage_with_one_decimal_place():
    js_path = BASE_DIR / "static" / "js" / "game.js"

    script = js_path.read_text(encoding="utf-8")

    assert "formatPercent(data.coverage_rate ?? 0, 1)" in script


def test_index_page_renders_summary_not_attempted(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="summary-not-attempted"' in html


def test_index_page_renders_weak_patterns_list(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="weak-patterns-list"' in html


def test_index_page_renders_next_practice_status(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="next-practice-status"' in html


def test_index_page_renders_next_practice_list(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="next-practice-list"' in html


def test_index_page_renders_demo_ready_shell(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/?demo=true&level=A1&scenario=shopping&user_id=demo_user")

    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert 'id="launcher-view"' in html
    assert 'id="game-play-area"' in html
    assert 'id="replay-voice-btn"' in html


def test_quest_endpoint_returns_quest_items(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/quest", query_string={"user_id": "student_001"})

    assert response.status_code == 200
    body = response.get_json()
    assert "quest_items" in body
    assert body["quest_items"]
    first_item = body["quest_items"][0]
    assert first_item["sentence_id"].startswith("A")
    assert first_item["task_type"] == "original"
    assert first_item["source"] == "new"
    assert isinstance(first_item["grammar_focus"], list)


def test_quest_endpoint_returns_grammar_focus_lists(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/quest", query_string={"user_id": "student_001"})

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert all("grammar_focus" in item for item in items)
    assert all(isinstance(item["grammar_focus"], list) for item in items)


def test_quest_endpoint_filters_by_scenario(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A1",
            "scenario": "food_drink",
        },
    )

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert items
    assert all(item["sentence_id"].startswith("A1_FOOD_") for item in items)


def test_quest_endpoint_filters_by_level(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A2",
        },
    )

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert items
    assert all(item["sentence_id"].startswith("A2_") for item in items)


def test_quest_endpoint_filters_by_level_and_scenario(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A2",
            "scenario": "travel_holiday",
        },
    )

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert items
    assert all(item["sentence_id"].startswith("A2_TRAVEL_") for item in items)


def test_create_app_defaults_to_generated_shopping_bank(tmp_path):
    client = create_default_bank_test_client(tmp_path)

    response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A1",
            "scenario": "shopping",
        },
    )

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert items
    assert len(items) == 10
    assert all("_SHOPPING_" in item["sentence_id"] for item in items)


def test_create_app_defaults_to_generated_food_drink_bank(tmp_path):
    client = create_default_bank_test_client(tmp_path)

    response = client.get(
        "/api/quest",
        query_string={
            "user_id": "student_001",
            "level": "A1",
            "scenario": "food_drink",
        },
    )

    assert response.status_code == 200
    items = response.get_json()["quest_items"]
    assert items
    assert len(items) == 10
    assert all("_FOOD_" in item["sentence_id"] for item in items)


def test_question_endpoint_returns_question_payload(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body["question_id"]
    assert body["sentence_id"] == "A1_ROUTINE_004"
    assert body["task_type"] == "original"
    assert body["audio_hint_text"] == "I usually drink milk for breakfast."
    assert body["shuffled_chunks"]


def test_skill_report_endpoint_returns_report_for_existing_user(tmp_path):
    client = create_test_client(tmp_path)
    learning_engine = client.application.config["learning_engine"]

    learning_engine.update_progress(
        "student_001",
        "A1_ROUTINE_004",
        True,
        grammar_focus=["present_simple"],
    )
    learning_engine.update_progress(
        "student_001",
        "A1_SHOP_001",
        False,
        mistake_type="word_order_error",
        grammar_focus=["question_structure"],
    )

    response = client.get("/api/report/skills", query_string={"user_id": "student_001"})

    assert response.status_code == 200
    assert response.get_json() == {
        "skills": {
            "present_simple": {
                "score": 2.0,
                "attempts": 1,
                "status": "developing",
            },
            "question_structure": {
                "score": -2.0,
                "attempts": 1,
                "status": "weak",
            },
        }
    }


def test_skill_report_endpoint_returns_empty_dict_for_unknown_user(tmp_path):
    client = create_test_client(tmp_path)

    response = client.get("/api/report/skills", query_string={"user_id": "ghost_user"})

    assert response.status_code == 200
    assert response.get_json() == {"skills": {}}


def test_skill_report_endpoint_updates_after_answer_submission(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    question_response = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    )
    question_payload = question_response.get_json()
    answer_key = app.config["sentence_engine"].answer_key[question_payload["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": answer_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200

    report_response = client.get("/api/report/skills", query_string={"user_id": "student_001"})

    assert report_response.status_code == 200
    assert report_response.get_json() == {
        "skills": {
            "present_simple": {
                "score": 2.0,
                "attempts": 1,
                "status": "developing",
            },
            "adverb_of_frequency": {
                "score": 2.0,
                "attempts": 1,
                "status": "developing",
            },
        }
    }


def test_answer_endpoint_validates_and_updates_progress(tmp_path):
    client = create_test_client(tmp_path)

    question_response = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    )
    question_payload = question_response.get_json()
    correct_ids = [
        chunk["chunk_id"]
        for chunk in sorted(question_payload["shuffled_chunks"], key=lambda chunk: chunk["text"])
    ]

    app = client.application
    answer_key = app.config["sentence_engine"].answer_key[question_payload["question_id"]]
    correct_ids = answer_key["correct_ids"]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": correct_ids,
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200
    body = answer_response.get_json()
    assert body["is_correct"] is True
    assert body["mistake_type"] is None
    assert body["result_type"] == "perfect_correct"

    progress = app.config["learning_engine"].progress["student_001"]["A1_ROUTINE_004"]
    assert progress["attempt_count"] == 1
    assert progress["correct_count"] == 1
    assert progress["last_result"] == "perfect_correct"


def test_answer_endpoint_rejects_invalid_question_id_without_updating_progress(tmp_path):
    client = create_test_client(tmp_path)

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": "missing-question-id",
            "user_chunk_ids": [],
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 400
    assert answer_response.get_json() == {
        "is_correct": False,
        "mistake_type": "invalid_question_id",
    }
    assert client.application.config["learning_engine"].progress == {}


def test_answer_endpoint_returns_fsi_followup_after_correct_original_answer(tmp_path):
    client = create_test_client(tmp_path)

    question_response = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    )
    question_payload = question_response.get_json()
    answer_key = client.application.config["sentence_engine"].answer_key[question_payload["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": answer_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json() == {
        "is_correct": True,
        "mistake_type": None,
        "result_type": "perfect_correct",
        "next_immediate_task": {
            "sentence_id": "A1_ROUTINE_004",
            "task_type": "question",
        },
    }


def test_answer_endpoint_does_not_return_fsi_followup_after_wrong_answer(tmp_path):
    client = create_test_client(tmp_path)

    question_response = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    )
    question_payload = question_response.get_json()
    answer_key = client.application.config["sentence_engine"].answer_key[question_payload["question_id"]]
    wrong_ids = list(reversed(answer_key["correct_ids"]))

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": wrong_ids,
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json() == {
        "is_correct": False,
        "mistake_type": "word_order_error",
        "result_type": "incorrect",
    }


def test_answer_endpoint_triggers_fsi_for_weak_grammar(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    warmup_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    warmup_key = app.config["sentence_engine"].answer_key[warmup_question["question_id"]]

    client.post(
        "/api/answer",
        json={
            "question_id": warmup_question["question_id"],
            "user_chunk_ids": list(reversed(warmup_key["correct_ids"])),
            "user_id": "student_001",
        },
    )

    followup_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    followup_key = app.config["sentence_engine"].answer_key[followup_question["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": followup_question["question_id"],
            "user_chunk_ids": followup_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json()["next_immediate_task"] == {
        "sentence_id": "A1_ROUTINE_004",
        "task_type": "question",
    }


def test_answer_endpoint_does_not_trigger_fsi_for_assisted_correct(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    question_payload = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    answer_key = app.config["sentence_engine"].answer_key[question_payload["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": answer_key["correct_ids"],
            "user_id": "student_001",
            "hint_used": True,
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json() == {
        "is_correct": True,
        "mistake_type": None,
        "result_type": "assisted_correct",
    }


def test_answer_endpoint_does_not_trigger_fsi_for_non_original_task(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    question_payload = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "question"},
    ).get_json()
    answer_key = app.config["sentence_engine"].answer_key[question_payload["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": question_payload["question_id"],
            "user_chunk_ids": answer_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json() == {
        "is_correct": True,
        "mistake_type": None,
        "result_type": "perfect_correct",
    }


def test_answer_endpoint_tracks_multiple_attempts_for_same_user(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    first_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    first_key = app.config["sentence_engine"].answer_key[first_question["question_id"]]
    wrong_ids = list(reversed(first_key["correct_ids"]))

    first_answer = client.post(
        "/api/answer",
        json={
            "question_id": first_question["question_id"],
            "user_chunk_ids": wrong_ids,
            "user_id": "student_001",
        },
    )

    assert first_answer.status_code == 200
    assert first_answer.get_json()["is_correct"] is False

    second_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    second_key = app.config["sentence_engine"].answer_key[second_question["question_id"]]

    second_answer = client.post(
        "/api/answer",
        json={
            "question_id": second_question["question_id"],
            "user_chunk_ids": second_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    assert second_answer.status_code == 200
    assert second_answer.get_json()["is_correct"] is True
    assert second_answer.get_json()["result_type"] == "perfect_correct"

    progress = app.config["learning_engine"].progress["student_001"]["A1_ROUTINE_004"]
    assert progress["attempt_count"] == 2
    assert progress["correct_count"] == 1
    assert progress["mistake_count"] == 1
    assert progress["last_result"] == "perfect_correct"


def test_answer_endpoint_marks_assisted_correct_and_keeps_srs_level(tmp_path):
    client = create_test_client(tmp_path)
    app = client.application

    first_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    first_key = app.config["sentence_engine"].answer_key[first_question["question_id"]]

    client.post(
        "/api/answer",
        json={
            "question_id": first_question["question_id"],
            "user_chunk_ids": first_key["correct_ids"],
            "user_id": "student_001",
        },
    )

    second_question = client.get(
        "/api/question",
        query_string={"sentence_id": "A1_ROUTINE_004", "task_type": "original"},
    ).get_json()
    second_key = app.config["sentence_engine"].answer_key[second_question["question_id"]]

    answer_response = client.post(
        "/api/answer",
        json={
            "question_id": second_question["question_id"],
            "user_chunk_ids": second_key["correct_ids"],
            "user_id": "student_001",
            "hint_used": True,
        },
    )

    assert answer_response.status_code == 200
    assert answer_response.get_json()["result_type"] == "assisted_correct"

    progress = app.config["learning_engine"].progress["student_001"]["A1_ROUTINE_004"]
    assert progress["srs_level"] == 1
    assert progress["last_result"] == "assisted_correct"
    assert progress["last_hint_used"] is True
