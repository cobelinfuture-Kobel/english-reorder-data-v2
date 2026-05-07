# Shopping Future Expansion Notes

## Status

Shopping v1 is complete and reviewed for:

- A1
- A1+
- A2
- A2+
- B1

The current version should be treated as stable.

Shopping v1 includes:

- basic wants, likes, price, availability, and location questions
- try-on, take, and pay patterns
- paired `too` patterns for semantic compatibility
- school-related shopping restrictions
- size, sale, receipt, and comparison questions
- positive reason clauses and appearance-based like clauses
- another-color and recommendation questions
- returns, exchanges, refunds, damage, warranty, quality, and material questions

## Stable Rules from Shopping v1

The following rules are considered stable and should be preserved unless there is a strong semantic reason to redesign them:

- American English is the default.
- `SHOP_TOO` uses paired semantic slots.
- `SHOP_PAY` uses `pay with`, not `pay by`.
- Payment locations are restricted to payment-related places.
- `for school` uses `school_items_single`.
- A2+ reason clauses use positive reason pairs.
- A2+ appearance clauses use positive appearance adjectives.
- A2+ try-on patterns avoid plural object + `buy it` mismatch.
- `in a different color` uses colorable item restrictions.
- B1 damage patterns use paired damage-item slots.
- B1 material patterns use paired material-item slots.
- Narrow semantic patterns are allowed to have lower counts.

## Deferred Phase 2 / v2 Ideas

The following ideas are intentionally deferred to a future Shopping v2 or a cross-scenario abstraction pass.

They are useful, but they are not required for Shopping v1.

### 1. Pronoun-Aware Plural Reason Clauses

Possible future patterns:

```text
I like these shoes because they are comfortable.
I want these notebooks because they are useful.
I will take these gloves because they are warm.
```

Design note:

Current shopping reason clauses intentionally stay with singular `it is` patterns because plural pronoun agreement needs explicit slot support.

Possible future slot:

```json
"shopping_reason_pairs_with_pronoun": [
  {
    "object": "this jacket",
    "pronoun": "it",
    "be": "is",
    "reason": "warm"
  },
  {
    "object": "these notebooks",
    "pronoun": "they",
    "be": "are",
    "reason": "useful"
  }
]
```

Do not let the generator infer `it is / they are` freely.

Avoid bad outputs:

```text
I want these notebooks because it is useful.
I like these shoes because it is comfortable.
```

### 2. B1 Color Exchange

Possible future patterns:

```text
I'd like to exchange this blue shirt for a black one.
Can I exchange this jacket for the red one?
```

Design note:

This requires restricted colorable items and exchange-compatible targets.

Possible future slot types:

```text
exchange_colorable_items
exchange_color_targets
```

Avoid bad outputs:

```text
I'd like to exchange this notebook for a black one.
Can I exchange this water bottle for the red one?
```

### 3. Found-Damage Pattern

Possible future patterns:

```text
I found a scratch on this phone case.
I found a stain on this shirt.
There is a crack in this water bottle.
```

Design note:

This should not reuse the same slot as direct complaint sentences without control. The wording is different, so the pair format may also need to be different.

Possible future paired slot:

```json
"found_damage_pairs": [
  {"object": "this phone case", "issue": "a scratch"},
  {"object": "this shirt", "issue": "a stain"},
  {"object": "this water bottle", "issue": "a crack"}
]
```

Avoid bad outputs:

```text
I found a zipper on this bag.
I found a stain on this umbrella.
```

### 4. Material Search Pattern

Possible future patterns:

```text
Do you have anything made of cotton?
Do you have a jacket made of wool?
I'm looking for a leather bag.
```

Design note:

Current B1 material patterns only ask about known items. Search patterns need a different abstraction because the material becomes the search key.

Possible future slots:

```text
material_search_items
material_search_pairs
```

Avoid bad outputs:

```text
Do you have anything made of notebook?
I'm looking for a cotton umbrella.
```

### 5. Conditional Exchange

Possible future patterns:

```text
If it doesn't fit, can I exchange it?
If this is too small, can I return it?
What if I need a different size later?
```

Design note:

These are natural B1 or B1+ shopping support questions, but they combine conditionals, pronouns, and store policy language.

Do not add conditionals until the project is ready to support them consistently.

### 6. Equal Comparison

Possible future patterns:

```text
This bag is as nice as that one.
This jacket is as warm as that coat.
This school bag is as useful as that one.
```

Design note:

Equal comparison should use paired or restricted comparison slots. It should not be built by freely combining any item with any adjective.

Avoid bad outputs:

```text
This cup is as expensive as that shirt.
This pen is as pretty as that coat.
```

### 7. More Natural B1 Return and Refund Explanations

Possible future patterns:

```text
I bought this yesterday, but it doesn't fit.
I got this as a gift, but it's too small.
I want to return this because the zipper is broken.
```

Design note:

Current return and refund coverage is functional, but still a bit drill-oriented. A future pass can add more realistic explanation clauses with time and cause.

Possible future slot types:

```text
return_explanation_pairs
refund_reason_pairs
```

### 8. Receipt and Refund Problem Patterns

Possible future patterns:

```text
I lost the receipt. Can I still return it?
I don't have the receipt. Can I get store credit?
Do I need the receipt for an exchange?
```

Design note:

These should stay in B1 or B1+ and use restricted store-policy language.

Do not mix them freely with all items or all return questions.

### 9. Budget and Price Range Patterns

Possible future patterns:

```text
Do you have anything under $20?
I'm looking for a gift under $30.
Do you have a cheaper one?
```

Design note:

Budget patterns need controlled price ranges and plausible shopping categories.

Do not freely combine every item with arbitrary dollar amounts.

### 10. Gift Recommendation Patterns

Possible future patterns:

```text
I'm looking for a gift for my brother.
What do you recommend for a birthday gift?
Do you have any small gifts for a teacher?
```

Design note:

Shopping v1 already has some recommendation groundwork, but future gift recommendation patterns may need tighter slots for age, relationship, event, and budget.

Possible future slots:

```text
gift_context_pairs
gift_budget_pairs
gift_style_pairs
```

### 11. More Realistic Material and Quality Language

Possible future patterns:

```text
Is this jacket waterproof?
Does this bag feel durable?
Is this sweater made of real wool?
```

Design note:

Vocabulary like `waterproof`, `durable`, and `real leather` should not go into broad adjective slots. These should be restricted to compatible item types.

Avoid bad outputs:

```text
Is this notebook waterproof?
Does this pencil case feel wool?
```

### 12. Dialogue Tasks

Possible future dialogue task:

```text
Customer: Hi, I'd like to return this jacket.
Sales clerk: Do you have the receipt?
Customer: Yes, but the zipper is broken.
Sales clerk: Would you like a refund or an exchange?
```

Design note:

B1 shopping should eventually expand beyond isolated sentence drills into short dialogues. That likely belongs in a dialogue bank, not the current sentence bank.

### 13. Writing Tasks

Possible future task:

```text
You bought something from a store, but there is a problem.
Write a message to customer service.
Say:
- what you bought
- what the problem is
- whether you want a refund or an exchange
```

Possible sample answer:

```text
Hello,
I bought this backpack yesterday, but the zipper is broken.
Could I get a refund or an exchange?
Thank you.
```

Design note:

Writing tasks should be separate from the sentence bank and should not be mixed into the same generation pipeline.

## Deferred Vocabulary

The following vocabulary may be useful later, but should not be added broadly without semantic controls:

```text
faded
silk
one size fits all
durable
waterproof
scratch-resistant
store credit
gift receipt
budget
under $20
under $30
```

Use paired or restricted slots where needed.

Examples:

```text
This shirt looks faded.
Is this scarf made of silk?
Does this come in one size fits all?
```

Avoid free recombination:

```text
This notebook is faded.
Is this water bottle made of silk?
Does this pen come in one size fits all?
```

## Implementation Rule

Do not implement these Phase 2 / v2 ideas until:

1. another scenario needs the same abstraction, or
2. Shopping v2 explicitly begins.

Every new pattern should include:

* restricted slots or paired slots
* level-specific counts
* generated sentence review
* regression tests

## Status

Deferred.
