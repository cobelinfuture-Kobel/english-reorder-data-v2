# Shopping Completion Report

## Status

Shopping sentence generation is complete for the first reviewed version.

Reviewed levels:

- A1
- A1+
- A2
- A2+
- B1

## Final Status by Level

| Level | Status | Notes |
|---|---|---|
| A1 | Passed | Basic shopping sentence frames |
| A1+ | Passed | Added in stock, please, today, for school |
| A2 | Passed | Added size, sale, receipt, cheaper / cheapest |
| A2+ | Passed | Added reasons, comparison, another color, recommendation |
| B1 | Passed | Added return, exchange, refund, damage, warranty, material |

## Key Design Decisions

- `SHOP_PAY` uses `pay with`, not `pay by`.
- `SHOP_TOO` uses semantic paired slots.
- `for school` uses `school_items_single`.
- `A2+ SHOP_TAKE` uses restricted needed items.
- `A2+ SHOP_WANT` uses positive reason pairs.
- `A2+ SHOP_LIKE` uses positive appearance adjectives.
- `B1 SHOP_DAMAGE` uses paired damage-item slots.
- `B1 SHOP_MATERIAL` uses paired material-item slots.
- All shopping expansion uses American English.

## Regression Tests Added

The following checks are covered in `tests/test_generated_bank_quality.py`:

- all `target_sentence` values are unique
- no `pay by`
- no British English terms
- no lowercase sentence starts
- A1 has no advanced structures
- `sentence_id` level prefix matches `level`
- A2+ `SHOP_TAKE` avoids weak needed-it objects
- A1+ / A2 / A2+ `SHOP_TOO` uses approved semantic pairs

## Known Acceptable Narrow Cases

These are acceptable in context:

- `I am looking for this coat for school.`
- `I am looking for this sweater for school.`
- `Can I pay with EasyCard?`
- `Can I pay with iPASS?`

These are acceptable because the current user context may include Taiwan-based learners.

## Future Optional Improvements

- Move Taiwan-local payment methods to a localized payment slot if a fully US-only version is required.
- Convert `A2+ SHOP_LIKE` to paired slots if stricter naturalness is needed.
- Add B1 short dialogue tasks and message-writing tasks later.
