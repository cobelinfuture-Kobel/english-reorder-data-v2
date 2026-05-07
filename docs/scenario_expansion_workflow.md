# Scenario Expansion Workflow

This document defines the workflow for adding or expanding a scenario such as shopping, restaurant, travel, school, health, or daily routine.

## Step 1. Define Scope

Create a scope document before modifying slots or patterns.

Recommended file name:

```text
docs/cambridge_<scenario>_scope_us.md
```

The scope document should define:

- target CEFR-like levels
- American English vocabulary policy
- core communicative functions
- level-by-level vocabulary
- level-by-level grammar patterns
- patterns that require semantic pairing
- patterns that require restricted slots
- patterns that should not generate 30 sentences

## Step 2. Build General Slots

Create broad slots only for simple patterns.

Examples:

```text
food_items
places
people
daily_objects
```

General slots are safe only for simple patterns such as:

```text
I want...
I like...
Where is...?
Do you have...?
```

## Step 3. Build Restricted Slots

Create restricted slots for patterns with extra context.

Examples:

```text
school_items_single
payment_locations
clothing_size_items
returnable_items
```

Do not reuse broad slots when the context is narrow.

## Step 4. Build Paired Slots

Use paired slots when two fields must be semantically compatible.

Examples:

```text
too_item_adjective_pairs
damaged_item_pairs
material_item_pairs
reason_item_pairs
comparison_item_pairs
```

Use paired slots for:

- item + adjective
- item + material
- item + damage
- item + reason
- item + comparison

## Step 5. Define Pattern Counts

Do not force every pattern to generate 30 sentences.

Use lower counts for:

- payment patterns
- complaint patterns
- reason patterns
- comparison patterns
- paired-slot patterns
- context-specific patterns

## Step 6. Generate Sentence Bank

Run:

```bash
python scripts/generate_sentences.py
```

## Step 7. Manual Semantic Review

Review every generated sentence by:

- level
- pattern
- semantic naturalness
- grammar
- level appropriateness
- American English consistency
- cross-level contamination

## Step 8. Add Regression Tests

After a scenario passes review, add regression tests to prevent future breakage.

Common tests:

- no duplicate target sentences
- no lowercase sentence starts
- no forbidden terms
- level prefix matches level field
- low levels do not contain high-level structures
- paired-slot patterns use approved semantic pairs

## Step 9. Commit

Commit in small steps:

1. docs
2. slots / patterns / generator
3. generated bank
4. tests

Do not mix unrelated scenarios in the same commit.
