"""python scripts/audit_dialogue_pairs.py"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REGISTRY_PATH = Path("data/sentence_registry/A1/01_personal_info.json")
REPORT_PATH = Path("reports/dialogue_pair_audit_01_personal_info.md")
RESPONSE_TEXTS = {"Yes, I am.", "No, I am not.", "No, I'm not."}


def load_registry(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def is_question(sentence: dict[str, Any]) -> bool:
    text = sentence.get("text", "")
    grammar = sentence.get("grammar", [])
    communicative_function = sentence.get("communicative_function", "")
    return (
        text.endswith("?")
        or "yes_no_question" in grammar
        or communicative_function.startswith("ask")
    )


def is_response(sentence: dict[str, Any]) -> bool:
    text = sentence.get("text", "")
    grammar = sentence.get("grammar", [])
    communicative_function = sentence.get("communicative_function", "")
    return (
        "yes_no_response" in grammar
        or communicative_function == "answer_yes_no"
        or text in RESPONSE_TEXTS
    )


def extract_slot_type(sentence: dict[str, Any]) -> str:
    slots = sentence.get("slots", {})
    if slots:
        return next(iter(slots))
    return "-"


def is_valid_pair(question: dict[str, Any], response: dict[str, Any]) -> tuple[bool, str]:
    if not is_question(question):
        return False, "Left item is not a question."
    if not is_response(response):
        return False, "Right item is not a response."

    grammar = question.get("grammar", [])
    if "be_verb" in grammar and "yes_no_question" in grammar and response.get("text") in RESPONSE_TEXTS:
        return True, "Be-verb yes/no question accepts standard yes/no response."

    return False, "Pair does not match v1 be-verb yes/no response rules."


def build_audit(registry: dict[str, Any]) -> dict[str, Any]:
    sentences = registry["sentences"]
    questions = [sentence for sentence in sentences if is_question(sentence)]
    responses = [sentence for sentence in sentences if is_response(sentence)]

    pair_matrix: list[dict[str, Any]] = []
    valid_pairs = 0
    invalid_pairs = 0

    for question in questions:
        for response in responses:
            valid, reason = is_valid_pair(question, response)
            pair_matrix.append(
                {
                    "question_id": question["id"],
                    "question_text": question["text"],
                    "response_id": response["id"],
                    "response_text": response["text"],
                    "valid": valid,
                    "reason": reason,
                }
            )
            if valid:
                valid_pairs += 1
            else:
                invalid_pairs += 1

    response_usage = {
        response["id"]: sum(
            1 for pair in pair_matrix if pair["response_id"] == response["id"] and pair["valid"]
        )
        for response in responses
    }

    problems: list[str] = []
    structural_notes: list[str] = []
    response_pool = {response["text"] for response in responses}

    for question in questions:
        valid_for_question = [pair for pair in pair_matrix if pair["question_id"] == question["id"] and pair["valid"]]
        if not valid_for_question:
            problems.append(f"Question has no valid responses: `{question['id']}` {question['text']}")

        expected_answers = question.get("expected_answers")
        if expected_answers is None:
            problems.append(f"Missing expected_answers: `{question['id']}` {question['text']}")
            continue

        missing_from_pool = sorted(
            answer for answer in expected_answers.values() if answer not in response_pool
        )
        if missing_from_pool:
            missing_list = ", ".join(f"`{answer}`" for answer in missing_from_pool)
            problems.append(
                f"Expected answers not present in response pool: `{question['id']}` {question['text']} -> {missing_list}"
            )

    for response in responses:
        if response_usage[response["id"]] == 0:
            problems.append(f"Response never used: `{response['id']}` {response['text']}")

    question_pair_count = len(questions) * max(len(questions) - 1, 0)
    response_pair_count = len(responses) * max(len(responses) - 1, 0)
    if question_pair_count:
        structural_notes.append(
            f"Question paired with question is structurally invalid and excluded from matrix: {question_pair_count} possible pairs."
        )
    if response_pair_count:
        structural_notes.append(
            f"Response paired with response is structurally invalid and excluded from matrix: {response_pair_count} possible pairs."
        )

    summary = {
        "total_sentences": len(sentences),
        "total_questions": len(questions),
        "total_responses": len(responses),
        "total_valid_pairs": valid_pairs,
        "total_invalid_pairs": invalid_pairs,
        "data_problems_found": len(problems),
        "structural_notes": len(structural_notes),
    }

    return {
        "summary": summary,
        "questions": questions,
        "responses": responses,
        "pair_matrix": pair_matrix,
        "problems": problems,
        "structural_notes": structural_notes,
    }


def format_summary(audit: dict[str, Any]) -> str:
    summary = audit["summary"]
    return "\n".join(
        [
            "Dialogue Pair Audit Summary",
            f"- total sentences: {summary['total_sentences']}",
            f"- total questions: {summary['total_questions']}",
            f"- total responses: {summary['total_responses']}",
            f"- total valid pairs: {summary['total_valid_pairs']}",
            f"- total invalid pairs: {summary['total_invalid_pairs']}",
            f"- data problems found: {summary['data_problems_found']}",
            f"- structural notes: {summary['structural_notes']}",
        ]
    )


def write_report(audit: dict[str, Any], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    lines: list[str] = [
        "# Dialogue Pair Audit: 01 Personal Info",
        "",
        "## Summary",
        f"- total sentences: {audit['summary']['total_sentences']}",
        f"- total questions: {audit['summary']['total_questions']}",
        f"- total responses: {audit['summary']['total_responses']}",
        f"- total valid pairs: {audit['summary']['total_valid_pairs']}",
        f"- total invalid pairs: {audit['summary']['total_invalid_pairs']}",
        f"- data problems found: {audit['summary']['data_problems_found']}",
        f"- structural notes: {audit['summary']['structural_notes']}",
        "",
        "## Questions Found",
        "| ID | Text | Pattern | Slot Type |",
        "| --- | --- | --- | --- |",
    ]

    for question in audit["questions"]:
        lines.append(
            f"| {question['id']} | {question['text']} | {question.get('pattern', '-') } | {extract_slot_type(question)} |"
        )

    lines.extend(
        [
            "",
            "## Responses Found",
            "| ID | Text |",
            "| --- | --- |",
        ]
    )

    for response in audit["responses"]:
        lines.append(f"| {response['id']} | {response['text']} |")

    lines.extend(
        [
            "",
            "## Pair Matrix",
            "| Question | Response | Valid? | Reason |",
            "| --- | --- | --- | --- |",
        ]
    )

    for pair in audit["pair_matrix"]:
        lines.append(
            f"| {pair['question_text']} | {pair['response_text']} | {'Yes' if pair['valid'] else 'No'} | {pair['reason']} |"
        )

    lines.extend(["", "## Problems"])
    if audit["problems"]:
        lines.extend(f"- {problem}" for problem in audit["problems"])
    else:
        lines.append("- No data problems found.")

    lines.extend(["", "## Structural Notes"])
    if audit["structural_notes"]:
        lines.extend(f"- {note}" for note in audit["structural_notes"])
    else:
        lines.append("- None.")

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    registry = load_registry(REGISTRY_PATH)
    audit = build_audit(registry)
    write_report(audit, REPORT_PATH)
    print(format_summary(audit))
    print(f"Report written to: {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
