# Sentence Generation Semantic Guidelines

This document records semantic design rules for generating English sentence banks across CEFR-like levels such as A1, A1+, A2, and A2+.

The goal is not only to generate grammatically correct sentences, but also to avoid semantically unnatural or pedagogically weak sentences.

## 1. Core Principle

Do not assume that a slot can be reused everywhere.

A slot is valid only when the full generated sentence remains natural in the target pattern.

For example, `this gift box` is valid in:

```text
I want this gift box.
How much is this gift box?
Do you have this gift box?
```

But it may be weak or unnatural in:

```text
I am looking for this gift box for school.
```

Therefore, sentence generation must evaluate:

```text
pattern + slot + level + context
```

not slot alone.

---

## 2. Slot Reuse Policy

### 2.1 General slots may be shared by simple patterns

Broad slots such as `priceable_single`, `priceable_plural`, `wearable_items`, and `store_locations` may be shared by simple patterns.

Examples:

```text
I want this notebook.
I like this notebook.
How much is this notebook?
Do you have this notebook?
Where can I find this notebook?
```

These patterns only require the object to be purchasable or findable.

### 2.2 Context-specific patterns must use restricted slots

When a pattern adds a semantic context, do not use a broad slot.

Examples:

```text
I am looking for {object} for school.
I will take {object} for school.
```

These should use:

```text
school_items_single
```

not:

```text
priceable_single
```

Bad examples:

```text
I will take this toy for school.
I will take this gift box for school.
I am looking for this black bag for school.
```

Better examples:

```text
I will take this pencil for school.
I will take this notebook for school.
I will take this school bag for school.
I am looking for this water bottle for school.
```

---

## 3. Use Paired Slots for Semantic Compatibility

Some patterns must not freely combine object and adjective.

### 3.1 Problem

The following structure is grammatically possible but semantically unsafe:

```text
{object} is too {adjective}.
```

If `{object}` and `{adjective}` are selected independently, the generator may produce:

```text
This pencil case is too hot.
This white shirt is too hard.
This pencil is too wide.
This red bag is too cold.
This book is too hot.
```

These are poor teaching examples.

### 3.2 Rule

Use paired slots when two fields must be semantically compatible.

Recommended paired slot:

```json
"too_item_adjective_pairs": [
  {"subject": "This shirt", "object": "this shirt", "adjective": "small"},
  {"subject": "This jacket", "object": "this jacket", "adjective": "big"},
  {"subject": "This school bag", "object": "this school bag", "adjective": "heavy"},
  {"subject": "This dress", "object": "this dress", "adjective": "long"},
  {"subject": "This pen", "object": "this pen", "adjective": "expensive"}
]
```

Good outputs:

```text
This shirt is too small.
I think this school bag is too heavy.
This dress is too long for me.
```

---

## 4. Payment Pattern Rules

### 4.1 Use `pay with`, not `pay by`

Avoid:

```text
Can I pay by cash?
Can I pay by my phone?
Can I pay by this card?
```

Use:

```text
Can I pay with cash?
Can I pay with my phone?
Can I pay with this card?
```

When specifying the object:

```text
Can I pay for this notebook with cash?
Can I pay for this jacket with a credit card?
```

### 4.2 Separate payment methods by verb pattern

Use `pay with` for:

```text
cash
a credit card
a debit card
a gift card
Apple Pay
Google Pay
LINE Pay
mobile pay
EasyCard
iPASS
my phone
this card
that card
```

Use a different pattern for coupons and points:

```text
Can I use a coupon?
Can I use points?
```

Do not force these into:

```text
Can I pay with a coupon?
Can I pay with points?
```

These are understandable but less clean for teaching.

### 4.3 Payment locations must be restricted

Do not use all store locations as payment locations.

Bad examples:

```text
Can I pay with cash at the pants section?
Can I pay with my phone at the entrance?
Can I pay with a credit card at the second floor?
```

Use only:

```text
cashier
checkout counter
front desk
customer service desk
```

Good examples:

```text
Can I pay with cash at the cashier?
Can I pay with a credit card at the checkout counter?
Can I pay with my phone at the front desk?
```

---

## 5. Level Design Rules

### 5.1 A1

A1 should use short, direct, high-frequency sentence frames.

Examples:

```text
I want this pen.
I like this hat.
How much is this cup?
Do you have this notebook?
Can I try on this jacket?
This is too small.
I will take this shirt.
Where is the cashier?
Can I pay with cash?
I am looking for this pencil.
```

Avoid A2+ structures in A1:

```text
because
after the discount
for my friend
before I buy it
in a different color
```

### 5.2 A1+

A1+ may add small extensions such as:

```text
to buy
really
in stock
please
today
for school
```

Examples:

```text
I want to buy this notebook.
I really like this bag.
Do you have this pen in stock?
Can I try on this jacket, please?
I will take this cup today.
I am looking for this pencil for school.
```

If using `for school`, restrict the object to school-related items.

### 5.3 A2

A2 may introduce polite forms and short context phrases.

Examples:

```text
I would like this T-shirt today.
I like this bag best.
Do you still have this pen today?
Could I try on this jacket today?
I think this shirt is too small.
I will take this pencil for school.
Where can I find this notebook in this store?
Can I pay with cash at the cashier?
I am looking for this hat for my sister.
```

A2 still requires tight semantic control for:

```text
too + adjective
for school
payment location
```

### 5.4 A2+

A2+ may introduce reason clauses and more specific shopping questions.

Examples:

```text
I want this jacket because it is warm.
I like this bag because it looks nice.
How much is this coat after the discount?
Do you have this shirt in a different color?
Could I try on this jacket before I buy it?
This school bag is too heavy for me.
```

A2+ must avoid random adjective reasons.

Bad examples:

```text
I want this jacket because it is old.
I want this bag because it is dirty.
I like this key ring because it looks loose.
I like this book because it looks hard.
```

Use positive reason slots or paired reason slots.

---

## 6. Reason Clause Rules

### 6.1 `I want ... because it is ...`

The reason should be positive or useful.

Good reasons:

```text
useful
nice
cute
cool
pretty
warm
big
clean
new
```

Avoid negative or complaint adjectives:

```text
old
dirty
rough
loose
tight
cold
hard
narrow
wide
expensive
```

Good examples:

```text
I want this notebook because it is useful.
I want this jacket because it is warm.
I want this dress because it is pretty.
```

### 6.2 `I like ... because it looks ...`

Use appearance-related adjectives.

Good adjectives:

```text
nice
cute
pretty
cool
clean
new
bright
colorful
simple
fancy
```

Avoid:

```text
loose
rough
hard
cold
dirty
old
expensive
narrow
wide
tight
```

Good examples:

```text
I like this bag because it looks nice.
I like this watch because it looks clean.
I like this T-shirt because it looks cool.
```

---

## 7. Pronoun Agreement

When a pattern contains a pronoun, object number must be controlled.

Bad:

```text
Could I try on these shoes before I buy it?
Could I try on these gloves before I buy it?
```

Options:

1. Restrict object to singular items.

```text
Could I try on this jacket before I buy it?
```

2. Or support pronoun fields in the slot.

```json
{"text": "these shoes", "pronoun": "them"}
```

Then generate:

```text
Could I try on these shoes before I buy them?
```

If pronoun support is not implemented, use singular-only slots.

---

## 8. Color Variation Rules

For patterns such as:

```text
Do you have {object} in a different color?
```

Use colorable objects only.

Good:

```text
this shirt
this T-shirt
this jacket
this coat
this dress
this skirt
this hat
this cap
this bag
this school bag
this pencil case
this notebook
this water bottle
this umbrella
```

Avoid:

```text
this ball
this card
the blue one
this eraser
```

Some are possible in real life, but they are weak teaching examples.

---

## 9. Count Per Pattern

Do not force every pattern to generate 30 sentences.

Some patterns can safely produce 30 examples:

```text
I want ...
I like ...
How much is ...
Do you have ...
Where can I find ...
```

Some patterns should use lower counts because the semantic space is smaller:

```text
payment patterns
too + adjective patterns
for school patterns
reason-clause patterns
```

Recommended examples:

```python
COUNT_BY_PATTERN_LEVEL = {
    ("SHOP_PAY", "A1"): 16,
    ("SHOP_TOO", "A1+"): 18,
    ("SHOP_LOOKING", "A1+"): 15,
    ("SHOP_TOO", "A2"): 18,
    ("SHOP_TAKE", "A2"): 15,
    ("SHOP_PAY", "A2"): 16,
    ("SHOP_WANT", "A2+"): 18,
    ("SHOP_LIKE", "A2+"): 18,
    ("SHOP_TRY", "A2+"): 18,
    ("SHOP_TOO", "A2+"): 18,
    ("SHOP_PAY", "A2+"): 16
}
```

The goal is semantic quality, not uniform sentence count.

---

## 10. Manual Review Checklist

After generating sentence banks, review by level and pattern.

### A1 Checklist

A1 must not contain:

```text
because
after the discount
for my friend
before I buy it
in a different color
```

### A1+ Checklist

A1+ may contain:

```text
to buy
really
in stock
please
today
for school
```

But `for school` should use school-related items only.

### A2 Checklist

Check:

```text
pay with, not pay by
for school uses school_items_single
too + adjective uses paired slot
payment locations are cashier/front desk/checkout counter/customer service desk
```

### A2+ Checklist

Check:

```text
no plural + it mismatch
reason clauses are positive and natural
looks + adjective uses appearance adjectives
before I buy it uses singular objects
too + adjective uses paired slots
```

---

## 11. Automated Test Ideas

Add tests to prevent semantic regression.

Suggested tests:

```python
def test_no_pay_by(sentences):
    assert not any("pay by" in s["target_sentence"] for s in sentences)

def test_a1_has_no_a2plus_structures(sentences):
    forbidden = ["because", "after the discount", "for my friend", "before I buy it", "in a different color"]
    for s in sentences:
        if s["level"] == "A1":
            assert not any(x in s["target_sentence"] for x in forbidden)

def test_no_plural_before_i_buy_it(sentences):
    for s in sentences:
        text = s["target_sentence"]
        assert not ("these " in text and "before I buy it" in text)

def test_no_lowercase_sentence_start(sentences):
    for s in sentences:
        text = s["target_sentence"]
        assert text[0].isupper()

def test_shop_too_uses_approved_pairs(sentences):
    # Optional: verify generated SHOP_TOO sentences come from too_item_adjective_pairs.
    pass
```

---

## 12. Expansion Rule for New Scenarios

When adding a new scenario such as restaurant, travel, school, health, or daily routine, follow this process:

1. Define simple general slots.
2. Define context-specific slots.
3. Identify patterns that need paired slots.
4. Decide count per pattern.
5. Generate sentences.
6. Run automated tests.
7. Manually review every sentence.
8. Only then commit generated data.

Do not expand sentence quantity before semantic constraints are stable.
