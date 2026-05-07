import json
import random
from pathlib import Path

from flask import Flask, jsonify, render_template, request

from engines.fsi_policy import should_trigger_fsi
from engines.learning_engine import LearningEngine
from engines.quest_engine import QuestEngine
from engines.sentence_engine import SentenceEngine
from stores.attempts_store import AttemptsStore
from stores.coverage_store import CoverageStore
from stores.recommendation_store import RecommendationStore
from stores.users_store import UsersStore


BASE_DIR = Path(__file__).resolve().parent
DEFAULT_BANK_PATHS = [
    BASE_DIR / "data" / "generated" / "shopping_sentence_bank.json",
    BASE_DIR / "data" / "generated" / "food_drink_sentence_bank.json",
    BASE_DIR / "data" / "generated" / "daily_routine_sentence_bank.json",
]
DEFAULT_PROGRESS_PATH = BASE_DIR / "data" / "user_progress.json"
DEFAULT_USERS_PATH = BASE_DIR / "data" / "users.json"
DEFAULT_ATTEMPTS_PATH = BASE_DIR / "data" / "user_sentence_attempts.json"


def load_sentence_bank(bank_path):
    with open(bank_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_default_sentence_bank():
    bank_data = []
    for bank_path in DEFAULT_BANK_PATHS:
        bank_data.extend(load_sentence_bank(bank_path))
    return bank_data


def parse_int_arg(value, default, minimum=None):
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return default
    if minimum is not None and parsed < minimum:
        return default
    return parsed


def parse_float_arg(value, default, minimum=None, maximum=None):
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return default
    if minimum is not None and parsed < minimum:
        return default
    if maximum is not None and parsed > maximum:
        return default
    return parsed


def create_app(
    sentence_bank=None,
    bank_path=None,
    progress_path=None,
    users_path=None,
    attempts_path=None,
    fsi_rng=None,
):
    app = Flask(__name__)

    bank_data = sentence_bank
    if bank_data is None:
        bank_data = load_sentence_bank(bank_path) if bank_path else load_default_sentence_bank()
    learning_engine = LearningEngine(str(progress_path or DEFAULT_PROGRESS_PATH))
    sentence_engine = SentenceEngine(bank_data)
    quest_engine = QuestEngine(bank_data, learning_engine, quest_size=10)
    users_store = UsersStore(users_path or DEFAULT_USERS_PATH)
    attempts_store = AttemptsStore(attempts_path or DEFAULT_ATTEMPTS_PATH, users_store=users_store)
    coverage_store = CoverageStore(bank_data, attempts_store)
    recommendation_store = RecommendationStore(bank_data, attempts_store)

    app.config["sentence_engine"] = sentence_engine
    app.config["learning_engine"] = learning_engine
    app.config["quest_engine"] = quest_engine
    app.config["fsi_rng"] = fsi_rng or random.random
    app.config["users_store"] = users_store
    app.config["attempts_store"] = attempts_store
    app.config["coverage_store"] = coverage_store
    app.config["recommendation_store"] = recommendation_store

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "healthy", "engines": "ready"})

    @app.route("/", methods=["GET"])
    def index():
        return render_template("index.html")

    @app.route("/api/users/login", methods=["POST"])
    def login_user():
        data = request.get_json() or {}
        username = data.get("username")

        try:
            user = app.config["users_store"].login(username)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        return jsonify(user)

    @app.route("/api/users/<user_id>", methods=["GET"])
    def get_user(user_id):
        user = app.config["users_store"].get_user(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user)

    @app.route("/api/users/<user_id>/attempts", methods=["GET"])
    def get_user_attempts(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        attempts = app.config["attempts_store"].get_user_attempts(user_id)
        return jsonify({"attempts": attempts})

    @app.route("/api/users/<user_id>/stats", methods=["GET"])
    def get_user_stats(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        stats = app.config["attempts_store"].get_user_stats(user_id)
        return jsonify(stats)

    @app.route("/api/users/<user_id>/weak-patterns", methods=["GET"])
    def get_user_weak_patterns(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        min_attempts = parse_int_arg(request.args.get("min_attempts"), default=5, minimum=0)
        threshold = parse_float_arg(request.args.get("threshold"), default=0.7, minimum=0, maximum=1)
        weak_patterns = app.config["attempts_store"].get_user_weak_patterns(
            user_id,
            min_attempts=min_attempts,
            threshold=threshold,
        )
        return jsonify(weak_patterns)

    @app.route("/api/users/<user_id>/wrong-attempts", methods=["GET"])
    def get_user_wrong_attempts(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        level = request.args.get("level")
        pattern = request.args.get("pattern")
        limit = parse_int_arg(request.args.get("limit"), default=None, minimum=1)
        wrong_attempts = app.config["attempts_store"].get_user_wrong_attempts(
            user_id,
            level=level,
            pattern=pattern,
            limit=limit,
        )
        return jsonify(wrong_attempts)

    @app.route("/api/users/<user_id>/coverage", methods=["GET"])
    def get_user_coverage(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        coverage = app.config["coverage_store"].get_user_coverage(user_id)
        return jsonify(coverage)

    @app.route("/api/users/<user_id>/next-practice", methods=["GET"])
    def get_user_next_practice(user_id):
        users_store = app.config["users_store"]
        if not users_store.user_exists(user_id):
            return jsonify({"error": "User not found"}), 404

        limit = parse_int_arg(request.args.get("limit"), default=10, minimum=1)
        level = request.args.get("level")
        pattern = request.args.get("pattern")
        recommendation = app.config["recommendation_store"].get_next_practice(
            user_id,
            limit=limit,
            level=level,
            pattern=pattern,
        )
        return jsonify(recommendation)

    @app.route("/api/quest", methods=["GET"])
    def get_quest():
        user_id = request.args.get("user_id", "default_user")
        level = request.args.get("level")
        scenario = request.args.get("scenario")
        adaptive = request.args.get("adaptive", "false").lower() == "true"
        quest_engine = app.config["quest_engine"]
        if adaptive:
            quest_items = quest_engine.build_adaptive_quest(
                user_id,
                level=level,
                scenario=scenario,
            )
        else:
            quest_items = quest_engine.build_quest(
                user_id,
                level=level,
                scenario=scenario,
            )
        return jsonify({"quest_items": quest_items})

    @app.route("/api/question", methods=["GET"])
    def get_question():
        sentence_id = request.args.get("sentence_id")
        task_type = request.args.get("task_type", "original")

        payload = app.config["sentence_engine"].get_question_payload(sentence_id, task_type=task_type)
        if not payload:
            return jsonify({"error": "Question not found"}), 404
        return jsonify(payload)

    @app.route("/api/report/skills", methods=["GET"])
    def get_skill_report():
        user_id = request.args.get("user_id", "default_user")
        skill_report = app.config["learning_engine"].get_skill_report(user_id)
        return jsonify({"skills": skill_report})

    @app.route("/api/answer", methods=["POST"])
    def submit_answer():
        data = request.get_json() or {}
        question_id = data.get("question_id")
        user_chunk_ids = data.get("user_chunk_ids", [])
        user_id = data.get("user_id", "default_user")
        hint_used = bool(data.get("hint_used", False))

        sentence_engine = app.config["sentence_engine"]
        learning_engine = app.config["learning_engine"]
        result = sentence_engine.check_answer(question_id, user_chunk_ids)

        if result["mistake_type"] == "invalid_question_id":
            return jsonify(result), 400

        result["result_type"] = (
            "incorrect" if not result["is_correct"]
            else "assisted_correct" if hint_used
            else "perfect_correct"
        )

        sentence_info = sentence_engine.answer_key.get(question_id)
        sentence_data = sentence_engine.bank.get(sentence_info["sentence_id"], {})
        skill_report = learning_engine.get_skill_report(user_id)
        learning_engine.update_progress(
            user_id,
            sentence_info["sentence_id"],
            result["is_correct"],
            result["mistake_type"],
            hint_used=hint_used,
            grammar_focus=sentence_data.get("grammar_focus", []),
        )

        if should_trigger_fsi(
            result["result_type"],
            sentence_info["task_type"],
            sentence_data.get("grammar_focus", []),
            skill_report,
            rng=app.config["fsi_rng"],
        ):
            fsi_tasks = sentence_data.get("fsi_tasks", [])
            if fsi_tasks:
                result["next_immediate_task"] = {
                    "sentence_id": sentence_info["sentence_id"],
                    "task_type": fsi_tasks[0]["task_type"],
                }

        return jsonify(result)

    @app.route("/api/attempts", methods=["POST"])
    def create_attempt():
        data = request.get_json() or {}

        try:
            attempt = app.config["attempts_store"].create_attempt(
                user_id=data.get("user_id"),
                sentence_id=data.get("sentence_id"),
                level=data.get("level"),
                pattern=data.get("pattern"),
                user_answer=data.get("user_answer"),
                correct_answer=data.get("correct_answer"),
                is_correct=data.get("is_correct"),
            )
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 404

        return jsonify({"success": True, "attempt": attempt})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
