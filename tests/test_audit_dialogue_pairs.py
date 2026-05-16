from pathlib import Path

from scripts.audit_dialogue_pairs import (
    REGISTRY_PATH,
    RESPONSE_TEXTS,
    REPORT_PATH,
    build_audit,
    load_registry,
    write_report,
)


def test_build_audit_finds_expected_question_and_response_counts():
    registry = load_registry(REGISTRY_PATH)

    audit = build_audit(registry)

    assert audit["summary"]["total_sentences"] == 68
    assert audit["summary"]["total_questions"] == 18
    assert audit["summary"]["total_responses"] == 2
    assert audit["summary"]["total_valid_pairs"] == 36
    assert audit["summary"]["total_invalid_pairs"] == 0
    assert audit["summary"]["data_problems_found"] == 0
    assert audit["summary"]["structural_notes"] == 2
    assert {response["text"] for response in audit["responses"]} == {
        "Yes, I am.",
        "No, I am not.",
    }
    assert "No, I'm not." in RESPONSE_TEXTS
    assert audit["problems"] == []
    assert len(audit["structural_notes"]) == 2


def test_write_report_outputs_expected_sections(tmp_path: Path):
    registry = load_registry(REGISTRY_PATH)
    audit = build_audit(registry)
    report_path = tmp_path / "dialogue_pair_audit.md"

    write_report(audit, report_path)

    report_text = report_path.read_text(encoding="utf-8")

    assert report_path.exists()
    assert "# Dialogue Pair Audit: 01 Personal Info" in report_text
    assert "## Summary" in report_text
    assert "## Questions Found" in report_text
    assert "## Responses Found" in report_text
    assert "## Pair Matrix" in report_text
    assert "## Problems" in report_text
    assert "## Structural Notes" in report_text
    assert "Are you a student?" in report_text
    assert "Yes, I am." in report_text
    assert "No, I am not." in report_text
    assert "- No data problems found." in report_text
    assert "Question paired with question is structurally invalid and excluded from matrix" in report_text


def test_report_target_matches_expected_path():
    assert REGISTRY_PATH == Path("data/sentence_registry/A1/01_personal_info.json")
    assert REPORT_PATH == Path("reports/dialogue_pair_audit_01_personal_info.md")


def test_personal_info_questions_use_normalized_negative_be_verb_answer():
    registry = load_registry(REGISTRY_PATH)

    questions = [sentence for sentence in registry["sentences"] if sentence["id"] in {
        "A1_01_personal_info_0002",
        "A1_01_personal_info_0005",
        "A1_01_personal_info_0008",
    }]

    assert len(questions) == 3
    assert all(question["expected_answers"]["no"] == "No, I am not." for question in questions)


def test_expected_answer_mismatch_counts_as_data_problem():
    registry = load_registry(REGISTRY_PATH)

    for sentence in registry["sentences"]:
        if sentence["id"] == "A1_01_personal_info_0002":
            sentence["expected_answers"]["no"] = "No, I'm not."
            break

    audit = build_audit(registry)

    assert audit["summary"]["data_problems_found"] == 1
    assert len(audit["problems"]) == 1
    assert "Expected answers not present in response pool" in audit["problems"][0]
    assert audit["summary"]["structural_notes"] == 2
