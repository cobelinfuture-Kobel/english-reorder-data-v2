import random


def should_trigger_fsi(result_type, task_type, sentence_grammar_focus, skill_report, rng=None):
    """Decide whether to trigger an FSI follow-up for this answer outcome."""
    if task_type != "original":
        return False

    if result_type != "perfect_correct":
        return False

    grammar_focus = list(sentence_grammar_focus or [])
    if not grammar_focus:
        return _roll(0.5, rng)

    statuses = [
        skill_report.get(grammar_key, {}).get("status", "developing")
        for grammar_key in grammar_focus
    ]

    if any(status == "weak" for status in statuses):
        return True

    if any(status == "developing" for status in statuses):
        return _roll(0.5, rng)

    return _roll(0.2, rng)


def _roll(threshold, rng):
    random_fn = rng or random.random
    return random_fn() < threshold
