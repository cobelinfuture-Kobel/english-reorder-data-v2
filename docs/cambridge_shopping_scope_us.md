# Cambridge Shopping Scope (American English)

This document defines how the shopping scenario can be expanded from Cambridge-style A1 through B1 using American English only.

It is a scope and design reference document. It does not change generator code, slot banks, pattern banks, or generated sentence data by itself.

---

## 1. Language Standard

All shopping content in this project should use American English.

Preferred vocabulary:

- store
- mall
- department store
- drugstore
- checkout counter
- sales tax
- receipt
- refund
- exchange
- warranty

Avoid British-English or mixed-region vocabulary such as:

- shop assistant
- till
- queue
- chemist
- jumper
- trainers
- guarantee

If a concept has both US and UK variants, prefer the US form consistently across:

- templates
- slots
- generated examples
- documentation
- tests

---

## 2. Current Stable Design Rules

The current A1 to A2+ shopping design already established several semantic rules that should remain in place during future expansion.

Keep these rules:

- `SHOP_TOO` uses paired semantic slots.
- `SHOP_PAY` uses `pay with`, not `pay by`.
- Payment locations must be restricted to:
  - `cashier`
  - `checkout counter`
  - `front desk`
  - `customer service desk`
- `for school` patterns use `school_items_single`.
- Reason clauses use positive reasons or paired slots.

These rules should be treated as stable semantic safeguards, not temporary shopping-specific hacks.

---

## 3. Level Expansion Overview

The shopping scenario should expand by level in a controlled way. The target is not just more sentences, but broader communicative coverage with stable semantics.

### A1

A1 should remain short, direct, high-frequency, and concrete.

Typical functions:

- say what you want
- say what you like
- ask the price
- ask if an item is available
- ask to try on an item
- describe a simple problem
- choose an item
- ask where something is
- ask how to pay
- say what you are looking for

Typical examples:

- `I want this pen.`
- `I like this hat.`
- `How much is this cup?`
- `Do you have this notebook?`
- `Can I try on this jacket?`
- `This is too small.`
- `I will take this shirt.`
- `Where is the cashier?`
- `Can I pay with cash?`
- `I am looking for this pencil.`

Scope rule:

- No extended reason clauses.
- No receipt/refund/exchange logic yet.
- No mixed semantic slots.

### A1+

A1+ can add light shopping extensions while staying very controlled.

Typical additions:

- `to buy`
- `really`
- `in stock`
- `please`
- `today`
- `for school`

Typical examples:

- `I want to buy this notebook.`
- `I really like this bag.`
- `Do you have this pen in stock?`
- `Can I try on this jacket, please?`
- `I will take this cup today.`
- `I am looking for this pencil for school.`

Scope rule:

- Context-specific patterns must already use restricted slots.
- `for school` must stay tied to `school_items_single`.

### A2

A2 can expand into polite requests and short contextual shopping interactions.

Typical additions:

- polite forms
- short time expressions
- simple problem descriptions
- payment location questions
- more structured in-store requests

Typical examples:

- `I would like this T-shirt today.`
- `Do you still have this pen today?`
- `Could I try on this jacket today?`
- `I think this shirt is too small.`
- `I will take this pencil for school.`
- `Where can I find this notebook in this store?`
- `Can I pay with cash at the cashier?`

Scope rule:

- A2 still requires semantic controls for:
  - `too + adjective`
  - `for school`
  - payment method + payment location

### A2+

A2+ can expand into short reason clauses and more specific shopping interactions.

Typical additions:

- positive reason clauses
- appearance-based like clauses
- color variation requests
- before-buy questions
- stronger item problem descriptions

Typical examples:

- `I want this jacket because it is warm.`
- `I like this bag because it looks nice.`
- `Do you have this shirt in a different color?`
- `Could I try on this jacket before I buy it?`
- `This school bag is too heavy for me.`

Scope rule:

- Do not use random negative adjectives for buying reasons.
- Do not allow plural-item/pronoun mismatch.
- Do not revert from paired semantic slots to free combination.

### B1

B1 is where shopping content can grow from item-level interaction into practical consumer decisions and problem-solving.

Typical new functions:

- compare options
- ask for recommendations
- explain purchase purpose
- discuss returns and exchanges
- ask about defects or damage
- ask about receipts, refunds, and sales tax
- ask about warranties
- discuss materials, fit, and quality
- talk about gifts and suitability

Typical example directions:

- `Which one would you recommend for work?`
- `Is this on sale, or is this the regular price?`
- `Can I return this if it does not fit?`
- `Do I need the receipt for an exchange?`
- `This bottle is leaking, so I would like a refund.`
- `Does this watch come with a warranty?`
- `Is this jacket made of cotton or polyester?`
- `I am looking for a gift for my brother.`

Scope rule:

- B1 should add broader decision-making language, not random lexical complexity.
- New semantic constraints will still be required for defect, refund, fit, recommendation, and material patterns.

---

## 4. Cambridge-Oriented Shopping Expansion by Level

This section maps likely shopping expansion directions from A1 through B1.

### A1 Scope

Focus on:

- identifying items
- basic wants and likes
- basic price questions
- simple availability
- simple payment
- simple location

Likely pattern families:

- want
- like
- price
- have
- try on
- too
- take
- where
- pay
- looking for

### A1+ Scope

Focus on:

- slightly longer shopping sentences
- polite requests
- item availability in stock
- school-purpose purchases

Likely new refinements:

- mild adverbs
- simple context phrases
- polite markers

### A2 Scope

Focus on:

- structured in-store interactions
- simple opinions and problems
- time-sensitive availability
- payment at specific places
- store navigation

Likely new refinements:

- polite modal variation
- short context extensions
- controlled complaint language

### A2+ Scope

Focus on:

- reason clauses
- appearance-based preferences
- color variants
- pre-purchase actions
- stronger complaint/problem forms

Likely new refinements:

- positive reasons
- paired issue descriptions
- colorable item restrictions
- singular-pronoun control

### B1 Scope

Focus on:

- comparing products
- return and exchange situations
- discussing defects
- asking about warranties
- gift shopping
- material and quality descriptions
- discount and price clarification
- purchase recommendations

Likely new refinements:

- contrast language
- recommendation language
- condition/result language
- customer-service problem resolution

---

## 5. Future Slot Categories

The following slot categories are recommended for future shopping expansion.

These should not be added blindly to every pattern. They should be introduced only where the full sentence remains natural.

### `store_types`

Purpose:

- distinguish shopping places by US usage

Examples:

- `store`
- `mall`
- `department store`
- `drugstore`
- `shoe store`
- `clothing store`
- `gift store`

Possible use:

- `I saw it at the mall.`
- `I bought this at a department store.`

### `size_options`

Purpose:

- support size questions and size comparison

Examples:

- `small`
- `medium`
- `large`
- `extra small`
- `extra large`

Possible use:

- `Do you have this in a larger size?`
- `This one is too small.`

### `clothing_size_items`

Purpose:

- connect size language to wearable items only

Examples:

- `this shirt`
- `this jacket`
- `this dress`
- `these jeans`

Possible use:

- `Do you have this shirt in a medium?`
- `Can I try a larger size?`

### `discount_items`

Purpose:

- support sale and pricing patterns

Examples:

- `this jacket`
- `this coat`
- `this watch`

Possible use:

- `Is this jacket on sale?`
- `How much is this after the discount?`

### `receipt_payment_phrases`

Purpose:

- support checkout and proof-of-purchase language

Examples:

- `a receipt`
- `the receipt`
- `my receipt`
- `the payment confirmation`

Possible use:

- `Can I get a receipt?`
- `Do I need the receipt for a refund?`

### `returnable_items`

Purpose:

- support refund and exchange patterns

Examples:

- `this shirt`
- `this jacket`
- `this water bottle`
- `this bag`

Possible use:

- `Can I return this jacket?`
- `Can I exchange this bag for another one?`

### `damaged_item_pairs`

Purpose:

- pair an item with a natural damage or defect description

Example design:

```json
[
  {"object": "this bottle", "issue": "leaking"},
  {"object": "this shirt", "issue": "torn"},
  {"object": "this watch", "issue": "broken"}
]
```

Possible use:

- `This bottle is leaking.`
- `This shirt is torn, so I want an exchange.`

### `warranty_items`

Purpose:

- support B1 warranty questions

Examples:

- `this watch`
- `this laptop bag`
- `this water bottle`
- `this electronic toothbrush`

Possible use:

- `Does this watch come with a warranty?`
- `How long is the warranty?`

### `recommendation_gift_items`

Purpose:

- support gift-shopping and recommendation patterns

Examples:

- `a gift for my brother`
- `a gift for my teacher`
- `a gift for a friend`

Possible use:

- `What would you recommend as a gift for my brother?`
- `I am looking for a gift for a friend.`

### `material_item_pairs`

Purpose:

- pair items with meaningful material descriptions

Example design:

```json
[
  {"object": "this jacket", "material": "cotton"},
  {"object": "this bag", "material": "leather"},
  {"object": "this sweater", "material": "wool"}
]
```

Possible use:

- `Is this jacket made of cotton?`
- `I prefer a leather bag.`

### `comparison_item_pairs`

Purpose:

- support controlled comparisons at B1

Example design:

```json
[
  {"item_a": "this jacket", "item_b": "that jacket"},
  {"item_a": "this backpack", "item_b": "that backpack"}
]
```

Possible use:

- `Which one is better for school?`
- `This jacket is cheaper than that one.`

---

## 6. Design Rules for Future Cambridge Shopping Expansion

When adding new shopping patterns for Cambridge-style coverage:

1. Use American English only.
2. Do not reuse broad slots when the pattern adds semantic context.
3. Use paired slots when two or more fields must stay semantically compatible.
4. Restrict payment patterns to US-style phrasing and payment-related locations.
5. Keep school-purpose patterns tied to school-appropriate objects.
6. Keep reason clauses positive, useful, or pedagogically clear.
7. Control pronouns whenever number agreement matters.
8. Reduce sentence counts for narrow semantic patterns instead of forcing 30 examples.

---

## 7. Recommended B1 Shopping Themes

For future B1 expansion, the highest-value shopping themes are:

- recommendation
- comparison
- sale and discount clarification
- returns
- exchanges
- damaged items
- receipt questions
- warranty questions
- gift shopping
- materials and quality

These themes are practical, teachable, and compatible with American English shopping contexts.

---

## 8. Summary

The shopping scenario should grow from A1 to B1 by expanding communicative usefulness while preserving semantic control.

The main rule is:

```text
Do not expand sentence quantity before semantic constraints are stable.
```

American English should remain the default standard across all future shopping content in this project.
