import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from engines.fsi_policy import should_trigger_fsi


def test_should_trigger_fsi_returns_true_for_weak_grammar():
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "weak"}},
    ) is True


def test_should_trigger_fsi_uses_developing_probability():
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "developing"}},
        rng=lambda: 0.4,
    ) is True
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "developing"}},
        rng=lambda: 0.6,
    ) is False


def test_should_trigger_fsi_uses_strong_probability():
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "strong"}},
        rng=lambda: 0.1,
    ) is True
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "strong"}},
        rng=lambda: 0.3,
    ) is False


def test_should_trigger_fsi_treats_missing_skill_as_developing():
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {},
        rng=lambda: 0.4,
    ) is True
    assert should_trigger_fsi(
        "perfect_correct",
        "original",
        ["present_simple"],
        {},
        rng=lambda: 0.6,
    ) is False


def test_should_trigger_fsi_rejects_non_perfect_or_non_original():
    assert should_trigger_fsi(
        "assisted_correct",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "weak"}},
    ) is False
    assert should_trigger_fsi(
        "incorrect",
        "original",
        ["present_simple"],
        {"present_simple": {"status": "weak"}},
    ) is False
    assert should_trigger_fsi(
        "perfect_correct",
        "question",
        ["present_simple"],
        {"present_simple": {"status": "weak"}},
    ) is False
