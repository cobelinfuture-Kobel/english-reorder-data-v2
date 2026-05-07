# Food & Drink Future Expansion Notes

## Status

Food & Drink v1.1 is complete and reviewed for:

- A1
- A1+
- A2
- A2+
- B1

The current version should be treated as stable.

Food & Drink v1.1 includes:

- basic food and drink wants
- likes and simple requests
- countable / uncountable food distinction
- drink measure phrases
- hungry / thirsty / full states
- eat / drink distinction
- polite requests
- breakfast / lunch / dinner / snack contexts
- to-go requests
- menu / check / utensil requests
- no ice / less sugar customization
- restroom and table item location questions
- reason clauses
- ingredient questions
- substitution patterns
- preference comparisons
- reservations
- table requests
- allergy statements
- ingredient detail questions
- restaurant problem descriptions
- replacement requests
- check / split check / pay separately

## Stable Rules from Food & Drink v1.1

The following rules are considered stable and should be preserved unless there is a strong semantic reason to redesign them:

- American English is the default.
- Use `check`, not `bill`.
- Use `to go` / `takeout`, not `takeaway`.
- Use `soda`, not `fizzy drink`.
- Use `fries`, not `chips`.
- Use `restroom`, not `toilet`.
- Countable and uncountable food items are separated.
- Eat and drink patterns use separate slots.
- Drink measure phrases use paired slots.
- Food problem patterns use paired semantic slots.
- Substitution patterns use paired slots.
- Restaurant problem patterns use paired slots.
- Allergy patterns use restricted allergy slots.
- Ingredient patterns use restricted ingredient slots.
- `FOOD_WHERE_ITEM_A2` uses paired `is/are` slots.
- Narrow functional patterns are allowed to have low counts.

## Deferred Phase 2 / v2 Ideas

The following ideas are intentionally deferred to a future Food & Drink v2 or a cross-scenario abstraction pass.

They are useful, but they are not required for Food & Drink v1.1.

### 1. Steak Doneness Patterns

Possible future patterns:

```text
How would you like your steak?
I'd like my steak medium.
I'd like my burger well-done.
```

Possible doneness values:

```text
rare
medium
well-done
```

Design note:

Do not add `rare / medium / well-done` to a general food adjective slot.

These terms require restricted or paired slots because they only work naturally with specific meat items.

Possible future paired slot:

```json
"meat_doneness_pairs": [
  {"item": "my steak", "doneness": "medium"},
  {"item": "my steak", "doneness": "well-done"},
  {"item": "my burger", "doneness": "well-done"}
]
```

Avoid bad outputs:

```text
This soup is rare.
This bread is medium.
This salad is well-done.
```

### 2. Budget Questions

Possible future patterns:

```text
Do you have anything under $20?
Do you have a lunch special under $15?
Is there anything cheaper?
```

Design note:

Budget patterns should use restricted price ranges and restaurant-appropriate items.

Do not freely combine all food items with arbitrary prices.

### 3. Check Mistake Patterns

Possible future patterns:

```text
I think there is a mistake on the check.
This item is not mine.
We did not order this.
Could you check this again, please?
```

Design note:

These patterns should probably be B1 or B1+.

They may require a future `check_problem_pairs` or `check_issue_phrases` slot.

### 4. More Realistic B1 Order Items

Current B1 order patterns are acceptable for cafeteria, bakery, diner, or casual restaurant contexts.

Possible future improvement:

```text
I'd like to order the chicken sandwich.
I'd like to order the soup of the day.
I'd like to order the lunch special.
I'd like to order the fish entree.
```

Possible future slot:

```json
"restaurant_order_items": [
  {"text": "the chicken sandwich"},
  {"text": "the soup of the day"},
  {"text": "the lunch special"},
  {"text": "the fish entree"},
  {"text": "the house salad"},
  {"text": "the breakfast plate"}
]
```

This should replace or supplement overly simple B1 items such as:

```text
I'd like to order an apple.
I'd like to order an egg.
I'd like to order a cookie.
```

These simple items are not wrong, but they are more like cafeteria or breakfast counter language.

### 5. Short Restaurant Dialogues

Possible future dialogue task:

```text
Server: Hi. Are you ready to order?
Customer: Yes. I'd like the chicken sandwich, please.
Server: Would you like fries or salad with that?
Customer: Salad, please.
Server: Anything to drink?
Customer: Water, please.
```

Design note:

B1 should eventually move beyond single-sentence substitution drills into short dialogues.

This may require a separate dialogue bank rather than the existing sentence bank.

### 6. B1 Writing / Message Tasks

Possible future task:

```text
You had a problem at a restaurant.
Write a message to the restaurant.
Say:
- what you ordered
- what was wrong
- what you want the restaurant to do
```

Possible sample answer:

```text
Hello,
I ordered the chicken sandwich yesterday, but the chicken was undercooked.
Could I get a refund or a replacement?
Thank you.
```

Design note:

Writing tasks should be separate from the sentence bank.

### 7. Expanded Payment Patterns

Current v1.1 includes:

```text
Could we get the check, please?
Can we split the check?
Can we pay separately?
```

Possible future additions:

```text
Can I pay with a credit card?
Can I leave the tip on the card?
Can we pay half in cash and half by card?
```

Design note:

Restaurant payment patterns should remain American English.

Use:

```text
check
tip
card
cash
pay separately
split the check
```

Avoid:

```text
bill
service charge
till
```

### 8. More Natural Reason Clauses

Current A2+ reason clauses are acceptable for substitution drills.

Possible future improvement:

```text
I want some water because I am thirsty.
I want some soup because I am cold.
I like this salad because it tastes fresh.
I do not want this hamburger because it is too greasy.
```

Design note:

This may require new paired slots or new templates.

Do not freely combine food items with reasons.

### 9. Pronoun-Aware Plural Reason Clauses

Possible future patterns:

```text
I like these cookies because they are sweet.
I want these fries because they are hot.
```

Design note:

This requires pronoun-aware paired slots.

Possible future slot:

```json
"food_reason_pairs_with_pronoun": [
  {
    "item": "this salad",
    "pronoun": "it",
    "be": "is",
    "reason": "fresh"
  },
  {
    "item": "these cookies",
    "pronoun": "they",
    "be": "are",
    "reason": "sweet"
  }
]
```

Do not let the generator infer `it is / they are` freely.

### 10. Stronger Restaurant Problem Resolution

Current B1 problem patterns include:

```text
This chicken is undercooked.
This bread is stale.
My order is wrong.
Could I get a replacement, please?
```

Possible future expansion:

```text
Could you replace this, please?
Could I get a new one?
Could I speak to the manager?
Could you take this off the check?
```

Design note:

These should be B1 or B1+.

Use polite complaint language.

## Deferred Vocabulary

The following vocabulary may be useful later, but should not be added broadly without semantic controls:

```text
rare
medium
well-done
over-seasoned
bland
soggy
lukewarm
refill
tip
special
combo meal
lunch special
entree
side dish
```

Use paired or restricted slots where needed.

Examples:

```text
This soup is lukewarm.
This toast is soggy.
This dish is bland.
Can I get a refill?
```

Avoid free recombination:

```text
This water is undercooked.
This fork is soggy.
This salad is well-done.
```

## Implementation Rule

Do not implement these Phase 2 / v2 ideas until:

1. another scenario needs the same abstraction, or
2. Food & Drink v2 explicitly begins.

Every new pattern should include:

* restricted slots or paired slots
* level-specific counts
* generated sentence review
* regression tests

## Status

Deferred.
