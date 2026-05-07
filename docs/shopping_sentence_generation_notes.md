# Shopping Sentence Generation Notes

## Passed Levels

Shopping sentence banks have been manually reviewed for:

- A1
- A1+
- A2
- A2+

## Key Decisions

- `SHOP_TOO` uses paired semantic slots.
- `SHOP_PAY` uses `pay with`, not `pay by`.
- `SHOP_PAY` location uses only payment-related locations.
- `for school` patterns use `school_items_single`.
- `A2+ SHOP_WANT` uses positive reason pairs.
- `A2+ SHOP_LIKE` uses positive appearance adjectives.
- `A2+ SHOP_TRY` uses singular wearable items to avoid `these ... before I buy it`.
- `A2+ SHOP_HAVE` uses `colorable_items_single`.

## Known Acceptable Narrow Cases

Some sentences are context-dependent but acceptable:

- `I will take this jacket for school.`
- `I am looking for this sweater for school.`
- `Can I pay with EasyCard?`
- `Can I pay with iPASS?`

These are acceptable in Taiwan school and shopping contexts.
