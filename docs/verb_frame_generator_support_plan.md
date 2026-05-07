# Verb-Frame Generator Support Plan

## Status

Planning document.

This document defines how the sentence generator should support verb-frame generation using:

- verb frame
- object/place/task/media slots
- allowed_frames
- semantic_group
- paired slots
- blacklist safety checks

This plan is motivated by the Daily Routine Phase 2 checkpoint audit.

## Problem

Daily Routine now has verb-frame slot groups such as:

- `daily_routine_eat_food_A1`
- `daily_routine_go_to_place_A1`
- `daily_routine_do_task_A1`
- `daily_routine_read_object_A1`
- `daily_routine_watch_object_A1`

However, most patterns still rely on old action-phrase or fixed-pair structures.

The current generator can use slot values, but it does not yet treat `allowed_frames` as a first-class validation rule.

As a result:

- verb-frame slots exist but are underused
- pattern migration is slow and manual
- many safe migrations are blocked by generator limitations
- `allowed_frames` is metadata only, not enforced generation logic

## Goal

Add generator support for controlled verb-frame composition.

The generator should be able to generate sentences like:

```text
I eat breakfast.
I eat lunch.
I go to school.
I read a book.
I watch TV.
```

from structured pattern data such as:

```json
{
  "template": "I {verb} {object}.",
  "frame": "eat",
  "slots_used": ["daily_routine_eat_food_A1"]
}
```

while preventing invalid outputs such as:

```text
eat homework
read dinner
watch breakfast
take breakfast
go to homework
```

## Non-Goals

This phase should NOT:

- create a general NLP semantic engine
- freely combine all verbs and nouns
- rewrite all existing patterns at once
- change UI or app routing
- modify unrelated scenarios
- force all legacy slots to disappear immediately

## Required Data Concepts

### 1. Frame

A frame is the action or verb family that controls what objects are allowed.

Examples:

```text
eat
have
take
go_to
do
read
watch
listen_to
play
```

### 2. Slot Item

A slot item is an object/place/task/media phrase with metadata.

Example:

```json
{
  "text": "breakfast",
  "level": "A1",
  "scenario": "daily_routine",
  "part_of_speech": "noun_phrase",
  "semantic_group": "food",
  "allowed_frames": ["eat", "have"]
}
```

### 3. allowed_frames

`allowed_frames` defines which frames may use a slot item.

Example:

```text
breakfast → eat, have
homework → do
a book → read
TV → watch
school → go_to
```

### 4. Frame-Specific Slot

A frame-specific slot already limits what the pattern may generate.

Example:

```text
daily_routine_eat_food_A1
```

This slot should only be used by the `eat` or `have` frame if the item allows it.

## Proposed Pattern Schema

The generator should support a lightweight frame-aware pattern format.

Example:

```json
{
  "pattern_id": "DR_A1_EAT_FOOD",
  "level": "A1",
  "scenario": "daily_routine",
  "template": "I eat {object}.",
  "frame": "eat",
  "slots_used": ["daily_routine_eat_food_A1"],
  "slot_bindings": {
    "object": "daily_routine_eat_food_A1"
  },
  "grammar_focus": [
    "simple_present_affirmative"
  ]
}
```

For go-to patterns:

```json
{
  "pattern_id": "DR_A1_GO_TO_PLACE",
  "level": "A1",
  "scenario": "daily_routine",
  "template": "I go to {place}.",
  "frame": "go_to",
  "slot_bindings": {
    "place": "daily_routine_go_to_place_A1"
  }
}
```

## Validation Rules

### Rule 1: Frame Compatibility

Before inserting a slot item into a template, validate:

```text
pattern.frame in slot_item.allowed_frames
```

If not true, skip the item.

Example:

```text
frame = eat
item = homework
allowed_frames = ["do"]
→ reject
```

### Rule 2: Scenario Compatibility

If slot item includes `scenario`, it must match the pattern scenario or be explicitly shared.

```text
pattern.scenario == item.scenario
```

### Rule 3: Level Compatibility

A pattern may use items from:

- the same level
- lower levels, if allowed by policy

Recommended default:

```text
A1 pattern → A1 items only
A1+ pattern → A1 or A1+ items
A2 pattern → A1, A1+, or A2 items
```

Do not let A1 use A2/B1 vocabulary.

### Rule 4: Semantic Group Compatibility

If a pattern declares expected semantic groups, item group must match.

Example:

```json
"expected_semantic_group": "food"
```

### Rule 5: Blacklist Safety

After generation, check generated text against:

```text
daily_routine_bad_phrase_blacklist
```

Reject matching sentences.

Blacklist is a final safety net, not the main control mechanism.

## Generator Workflow

### Step 1: Load pattern

Read:

- template
- frame
- slot_bindings
- level
- scenario
- grammar_focus

### Step 2: Load slot candidates

For each binding:

```text
slot_bindings.object → daily_routine_eat_food_A1
```

Load all candidates.

### Step 3: Filter candidates

Filter by:

- allowed_frames
- level
- scenario
- semantic_group
- blacklist risk

### Step 4: Render sentence

Insert item text into template.

Example:

```text
template = "I eat {object}."
object = "breakfast"
→ I eat breakfast.
```

### Step 5: Validate final sentence

Check:

- no blacklist hit
- no duplicate target_sentence
- chunks match target sentence
- grammar_focus exists
- level exists
- scenario exists

## Chunk Generation Requirement

Frame-aware generation must preserve chunk order.

Example:

```text
I eat breakfast.
```

Chunks should remain:

```json
["I", "eat", "breakfast", "."]
```

For phrase items:

```text
I go to the library.
```

Chunks should preserve natural order:

```json
["I", "go", "to", "the library", "."]
```

Do not split phrase-level slot items unless the current chunk policy requires it.

## Migration Strategy

Do not migrate everything at once.

### Phase A: Add generator support

Add frame-aware support without changing existing outputs.

### Phase B: Add one test pattern

Add one small pattern using frame-aware slot generation.

Example:

```text
I eat {object}.
```

Target:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
```

### Phase C: Validate output

Check:

- no bad phrases
- no duplicates
- correct level
- correct grammar_focus
- correct chunks

### Phase D: Migrate A1 patterns

Migrate simple A1 patterns:

- eat food
- go to place
- read object
- watch object
- do task

### Phase E: Migrate A1+ patterns

Migrate:

- frequency patterns
- negative patterns
- question patterns

Only after base-form / third-person handling is safe.

## Handling A1+ Negative and Question Patterns

Negative/question generation requires special care.

Example:

```text
Base:
I eat breakfast.

Negative:
I do not eat breakfast.

Question:
Do you eat breakfast?
```

The generator should not produce:

```text
Does she eats breakfast?
She go to school.
```

Recommended approach:

- keep A1+ negative/question patterns controlled
- require base verb field where needed
- do not infer third-person forms blindly
- use paired data for subject-verb agreement

## Third-Person Support

Third-person migration should wait until the generator supports:

```json
{
  "base_verb": "eat",
  "third_person_verb": "eats"
}
```

or equivalent paired structures.

Do not rely on automatic `+s` rules only.

Blocked examples:

```text
He go to school.
Does she goes to school?
```

## Personal Care Support

Personal care should remain paired.

Example:

```json
{
  "verb": "brush",
  "object": "my teeth"
}
```

Do not convert personal care into free verb-object slots unless semantic controls are strong.

## Test Requirements

When implementing generator support, add tests for:

### Frame compatibility

- eat + breakfast allowed
- eat + homework blocked
- read + book allowed
- read + dinner blocked

### allowed_frames

- reject item if frame not listed

### level filtering

- A1 pattern does not use A2/B1 item

### blacklist

- blacklist hit is rejected

### generated bank

- no duplicate target_sentence
- no bad phrase output
- expected sentence count remains within target range

### chunks

- chunks match rendered sentence order

## Rollback Strategy

If frame-aware generation causes output drift:

1. revert pattern migration
2. keep slot_bank additions
3. keep generator support behind optional schema
4. re-enable only one pattern at a time

## Completion Criteria

Generator support is complete when:

1. generator reads `frame` and `slot_bindings`
2. generator filters candidates using `allowed_frames`
3. generator filters candidates by level and scenario
4. generator applies blacklist safety
5. frame-aware patterns can generate sentences safely
6. A1 simple patterns can migrate without semantic errors
7. tests cover allowed and blocked combinations

## Recommended Commit Strategy

Use small commits:

1. docs: add verb-frame generator support plan
2. generator: add frame-aware slot filtering
3. tests: add verb-frame slot filtering tests
4. data: add one frame-aware A1 pattern
5. data: migrate A1 verb-frame patterns

## Status

Planned.
