import json
import os
from datetime import datetime, timedelta


class LearningEngine:
    RESULT_SCORES = {
        "perfect_correct": 2,
        "assisted_correct": 0.5,
        "incorrect": -2,
    }

    SRS_INTERVALS = {
        0: 0,
        1: 1,
        2: 3,
        3: 7,
        4: 14,
    }

    def __init__(self, progress_path="data/user_progress.json", now_fn=None):
        self.progress_path = progress_path
        self.now_fn = now_fn or datetime.now
        self.progress = self._load_progress()

    def _load_progress(self):
        if os.path.exists(self.progress_path):
            with open(self.progress_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def save_progress(self):
        directory = os.path.dirname(self.progress_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        with open(self.progress_path, "w", encoding="utf-8") as f:
            json.dump(self.progress, f, indent=4, ensure_ascii=False)

    def update_progress(
        self,
        user_id,
        sentence_id,
        is_correct,
        mistake_type=None,
        hint_used=False,
        grammar_focus=None,
    ):
        """Update the user's SRS progress for one sentence."""
        if user_id not in self.progress:
            self.progress[user_id] = {}

        user_data = self.progress[user_id]
        existing_stats = user_data.get(sentence_id, {})
        now = self.now_fn()
        grammar_focus = list(grammar_focus or [])
        result_history = list(existing_stats.get("result_history", []))

        current_level = existing_stats.get("srs_level")
        if current_level is None:
            current_level = self._level_from_legacy_interval(existing_stats.get("interval"))

        if not is_correct:
            result_type = "incorrect"
            next_level = 0
            interval_days = self.SRS_INTERVALS[next_level]
        elif hint_used:
            result_type = "assisted_correct"
            next_level = current_level
            interval_days = 1
        else:
            result_type = "perfect_correct"
            next_level = min(current_level + 1, max(self.SRS_INTERVALS))
            interval_days = self.SRS_INTERVALS[next_level]

        result_history.append(
            {
                "result_type": result_type,
                "grammar_focus": grammar_focus,
                "timestamp": now.isoformat(),
            }
        )

        user_data[sentence_id] = {
            "srs_level": next_level,
            "interval_days": interval_days,
            "last_seen": now.isoformat(),
            "next_review": (now + timedelta(days=interval_days)).isoformat(),
            "attempt_count": existing_stats.get("attempt_count", 0) + 1,
            "correct_count": existing_stats.get("correct_count", 0) + (1 if is_correct else 0),
            "mistake_count": existing_stats.get("mistake_count", 0) + (0 if is_correct else 1),
            "last_result": result_type,
            "last_mistake_type": None if is_correct else mistake_type,
            "last_hint_used": hint_used,
            "grammar_focus": grammar_focus,
            "result_history": result_history,
        }
        self.save_progress()

    def get_skill_report(self, user_id):
        """Aggregate grammar skill signals from stored result history."""
        user_data = self.progress.get(user_id, {})
        skill_totals = {}

        for sentence_stats in user_data.values():
            result_history = sentence_stats.get("result_history")
            if not isinstance(result_history, list):
                continue

            for entry in result_history:
                if not isinstance(entry, dict):
                    continue

                result_type = entry.get("result_type")
                grammar_points = self.RESULT_SCORES.get(result_type)
                grammar_focus = entry.get("grammar_focus")

                if grammar_points is None or not isinstance(grammar_focus, list):
                    continue

                for grammar_key in grammar_focus:
                    if not grammar_key:
                        continue

                    stats = skill_totals.setdefault(
                        grammar_key,
                        {"score": 0.0, "attempts": 0},
                    )
                    stats["score"] += grammar_points
                    stats["attempts"] += 1

        return {
            grammar_key: {
                "score": stats["score"],
                "attempts": stats["attempts"],
                "status": self._score_to_status(stats["score"]),
            }
            for grammar_key, stats in skill_totals.items()
        }

    def _level_from_legacy_interval(self, interval_days):
        if interval_days is None:
            return 0

        for level, days in self.SRS_INTERVALS.items():
            if days == interval_days:
                return level
        return 0

    def _score_to_status(self, score):
        if score < 0:
            return "weak"
        if score < 4:
            return "developing"
        return "strong"

    def get_seen_sentence_ids(self, user_id):
        """Return sentence IDs the user has already seen."""
        return list(self.progress.get(user_id, {}).keys())

    def get_due_sentence_ids(self, user_id):
        """Return sentence IDs whose review time has arrived."""
        user_data = self.progress.get(user_id, {})
        now = self.now_fn().isoformat()
        return [
            sentence_id
            for sentence_id, stats in user_data.items()
            if stats["next_review"] <= now
        ]
