import json
import re
from collections import Counter, defaultdict
from pathlib import Path


MASTER_GRAMMAR_TAGS = {
    "adjectives",
    "adverb_of_frequency",
    "airport_language",
    "can_request",
    "because_so",
    "comparatives",
    "countable_nouns",
    "daily_activity",
    "demonstratives",
    "direction_language",
    "drink_vocabulary",
    "food_preference",
    "food_vocabulary",
    "future_plan",
    "hotel_vocabulary",
    "like_verb",
    "must",
    "negation",
    "past_simple",
    "plural_nouns",
    "prepositions",
    "present_simple",
    "price_question",
    "pronouns_one",
    "quantity",
    "question_structure",
    "restaurant_language",
    "sequence_words",
    "shopping_actions",
    "shopping_vocabulary",
    "there_is_are",
    "time_expression",
    "too_enough",
    "travel_actions",
    "travel_vocabulary",
    "wh_questions",
}

REQUIRED_FIELDS = [
    "sentence_id",
    "level",
    "scenario",
    "target_sentence",
    "chunks",
    "grammar_focus",
]


def validate_generated_bank(data, min_per_group=3):
    errors = []
    id_counts = Counter()
    target_counts = Counter()
    group_counts = defaultdict(int)

    for index, sentence in enumerate(data):
        label = sentence.get("sentence_id", f"index:{index}")

        missing = [field for field in REQUIRED_FIELDS if field not in sentence]
        if missing:
            errors.append(f"{label}: Missing required fields: {', '.join(missing)}")
            continue

        id_counts[sentence["sentence_id"]] += 1
        target_counts[sentence["target_sentence"]] += 1

        pattern_id = sentence.get("pattern_id")
        if pattern_id:
            group_counts[(pattern_id, sentence["level"])] += 1

        if not sentence["chunks"]:
            errors.append(f"{label}: chunks cannot be empty")
        elif not _chunks_match_target(sentence["chunks"], sentence["target_sentence"]):
            errors.append(f"{label}: chunks do not reconstruct target_sentence")

        grammar_focus = sentence.get("grammar_focus")
        if not grammar_focus:
            errors.append(f"{label}: grammar_focus cannot be empty")
        else:
            for tag in grammar_focus:
                if tag not in MASTER_GRAMMAR_TAGS:
                    errors.append(f"{label}: Invalid grammar tag: {tag}")

        for task_index, task in enumerate(sentence.get("fsi_tasks", []), start=1):
            if not _is_valid_fsi_task(task):
                errors.append(f"{label}: Invalid fsi_task at position {task_index}")

    for sentence_id, count in id_counts.items():
        if count > 1:
            errors.append(f"Duplicate sentence_id: {sentence_id}")

    for target_sentence, count in target_counts.items():
        if count > 1:
            errors.append(f"Duplicate target_sentence: {target_sentence}")

    for group, count in group_counts.items():
        if count < min_per_group:
            pattern_id, level = group
            errors.append(
                f"Group below minimum count ({min_per_group}): {pattern_id} / {level} -> {count}"
            )

    return {
        "is_valid": not errors,
        "errors": errors,
    }


def _normalize_sentence(text):
    normalized = re.sub(r"\s+([?.!,])", r"\1", text.strip())
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.rstrip(".!?").strip().lower()


def _chunks_match_target(chunks, target_sentence):
    chunk_text = " ".join(chunks)
    return _normalize_sentence(chunk_text) == _normalize_sentence(target_sentence)


def _is_valid_fsi_task(task):
    if not isinstance(task, dict):
        return False
    if not task.get("task_type"):
        return False
    if not task.get("target"):
        return False
    chunks = task.get("chunks")
    if not isinstance(chunks, list) or not chunks:
        return False
    return True


def main():
    path = Path(__file__).resolve().parent.parent / "data" / "generated" / "shopping_sentence_bank.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    result = validate_generated_bank(data)

    if result["is_valid"]:
        print("All checks passed")
        return

    print("Errors:")
    for error in result["errors"]:
        print(f"- {error}")


if __name__ == "__main__":
    main()
