# Food & Drink Completion Report

## Status

Food & Drink sentence generation is complete for the first reviewed version.

Reviewed levels:

- A1
- A1+
- A2
- A2+
- B1

Current version:

```text
food_drink v1.1
```

## Final Status by Level

| Level | Status | Notes |
|---|---|---|
| A1 | Passed | Want / like / have / price / choice / measure / state / food problem |
| A1+ | Passed | Eat / drink / polite requests / stock / meal context / snack / to go |
| A2 | Passed | Ordering / requests / any-have / no ice / less sugar / restroom / where item |
| A2+ | Passed | Reason clauses / recommendation / ingredients / substitution / preference |
| B1 | Passed | Reservation / table / allergy / ingredient detail / problem / replacement / check / split / pay separately |

## Key Design Decisions

- All food & drink content uses American English.
- `FOOD_TOO` uses semantic paired slots for food-problem compatibility.
- `FOOD_SUBSTITUTE` uses approved substitution pairs.
- `FOOD_PROBLEM` uses approved restaurant problem pairs.
- `FOOD_WHERE_ITEM` uses paired `is/are` table-item combinations.
- Drink-measure patterns are restricted to natural cup / glass combinations.
- Eat / drink intent patterns use separate food vs. drink slots.
- Narrow patterns use pattern-specific counts instead of defaulting to 30.

## Regression Tests Added

The following checks are covered in `tests/test_generated_bank_quality.py`:

- all `target_sentence` values are unique
- `sentence_id` level prefix matches `level`
- no British English food / restaurant terms
- no lowercase sentence starts
- A1 does not contain advanced food / restaurant structures
- no eat / drink mismatch targets
- no bad measure pairs
- `FOOD_TOO` uses approved food problem pairs
- `FOOD_SUBSTITUTE` uses approved substitution pairs
- `FOOD_PROBLEM` uses approved restaurant problem pairs
- `FOOD_WHERE_ITEM` uses approved `is/are` table-item pairs
- no bad allergy phrases

## Known Acceptable Narrow Cases

These are acceptable in the current reviewed version:

- `I want this water because it is cold.`
- `What do you recommend for a child?`
- `What do you recommend for something healthy?`

These are a little more workbook-like than spontaneous conversation, but they remain natural enough for controlled practice.

## Future Optional Improvements

- Convert some A2+ reason patterns to even tighter paired semantic sets if stricter naturalness is needed.
- Add short dialogue generation for restaurant interactions after sentence-bank stability is preserved.
- Add localized food / drink variants only if regional scenario support becomes necessary.
