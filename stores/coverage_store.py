from collections import defaultdict


def _safe_rate(done, total):
    if total <= 0:
        return 0
    return done / total


def _get_sentence_id(sentence):
    return sentence.get("sentence_id") or sentence.get("id") or sentence.get("target_id")


def _get_sentence_level(sentence):
    return sentence.get("level") or "UNKNOWN"


def _get_sentence_pattern(sentence):
    return sentence.get("pattern") or sentence.get("pattern_id") or "UNKNOWN"


def _get_attempt_sentence_id(attempt):
    return attempt.get("sentence_id")


def calculate_user_coverage(user_id, sentences, attempts):
    sentence_index = {}

    for sentence in sentences:
        sentence_id = _get_sentence_id(sentence)
        if not sentence_id:
            continue

        sentence_index[sentence_id] = {
            "sentence_id": sentence_id,
            "level": _get_sentence_level(sentence),
            "pattern": _get_sentence_pattern(sentence),
        }

    all_sentence_ids = set(sentence_index.keys())
    attempted_ids = set()

    for attempt in attempts:
        if attempt.get("user_id") != user_id:
            continue

        sentence_id = _get_attempt_sentence_id(attempt)
        if not sentence_id or sentence_id not in all_sentence_ids:
            continue

        attempted_ids.add(sentence_id)

    total_sentences = len(all_sentence_ids)
    attempted_sentences = len(attempted_ids)
    not_attempted_sentences = total_sentences - attempted_sentences

    by_level_raw = defaultdict(lambda: {"total_ids": set(), "attempted_ids": set()})
    by_pattern_raw = defaultdict(lambda: {"total_ids": set(), "attempted_ids": set()})

    for sentence_id, meta in sentence_index.items():
        level = meta["level"]
        pattern = meta["pattern"]

        by_level_raw[level]["total_ids"].add(sentence_id)
        by_pattern_raw[pattern]["total_ids"].add(sentence_id)

        if sentence_id in attempted_ids:
            by_level_raw[level]["attempted_ids"].add(sentence_id)
            by_pattern_raw[pattern]["attempted_ids"].add(sentence_id)

    by_level = {}
    for level, bucket in by_level_raw.items():
        total = len(bucket["total_ids"])
        attempted = len(bucket["attempted_ids"])
        not_attempted = total - attempted
        by_level[level] = {
            "total": total,
            "attempted": attempted,
            "not_attempted": not_attempted,
            "coverage_rate": _safe_rate(attempted, total),
        }

    by_pattern = {}
    for pattern, bucket in by_pattern_raw.items():
        total = len(bucket["total_ids"])
        attempted = len(bucket["attempted_ids"])
        not_attempted = total - attempted
        by_pattern[pattern] = {
            "total": total,
            "attempted": attempted,
            "not_attempted": not_attempted,
            "coverage_rate": _safe_rate(attempted, total),
        }

    return {
        "user_id": user_id,
        "total_sentences": total_sentences,
        "attempted_sentences": attempted_sentences,
        "not_attempted_sentences": not_attempted_sentences,
        "coverage_rate": _safe_rate(attempted_sentences, total_sentences),
        "by_level": dict(sorted(by_level.items())),
        "by_pattern": dict(sorted(by_pattern.items())),
    }


def get_not_attempted_sentence_ids(
    user_id,
    sentences,
    attempts,
    *,
    level=None,
    pattern=None,
    limit=None,
):
    sentence_index = {}

    for sentence in sentences:
        sentence_id = _get_sentence_id(sentence)
        if not sentence_id:
            continue

        sentence_level = _get_sentence_level(sentence)
        sentence_pattern = _get_sentence_pattern(sentence)

        if level is not None and sentence_level != level:
            continue

        if pattern is not None and sentence_pattern != pattern:
            continue

        sentence_index[sentence_id] = {
            "sentence_id": sentence_id,
            "level": sentence_level,
            "pattern": sentence_pattern,
        }

    valid_sentence_ids = set(sentence_index.keys())
    attempted_ids = {
        attempt["sentence_id"]
        for attempt in attempts
        if attempt.get("user_id") == user_id and attempt.get("sentence_id") in valid_sentence_ids
    }

    not_attempted_ids = sorted(valid_sentence_ids - attempted_ids)
    if isinstance(limit, int) and limit > 0:
        return not_attempted_ids[:limit]
    return not_attempted_ids


class CoverageStore:
    def __init__(self, sentences, attempts_store):
        self.sentences = list(sentences)
        self.attempts_store = attempts_store

    def get_user_coverage(self, user_id):
        return calculate_user_coverage(
            user_id,
            self.sentences,
            self.attempts_store.get_all_attempts(),
        )

    def get_not_attempted_sentence_ids(self, user_id, *, level=None, pattern=None, limit=None):
        return get_not_attempted_sentence_ids(
            user_id,
            self.sentences,
            self.attempts_store.get_all_attempts(),
            level=level,
            pattern=pattern,
            limit=limit,
        )
