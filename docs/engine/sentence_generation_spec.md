# Sentence Generation Specification

## Status

This document defines how sentences are generated across all scenarios.

It works together with:

- docs/slot_system_spec.md
- docs/daily_routine_vocabulary_sources.md
- future grammar mapping specifications

The goal is:

- large-scale FSI-style sentence generation
- CEFR-aligned grammar progression
- semantic safety
- consistent structure across scenarios

---

## Core Principle

Sentence generation must follow:

```text
pattern + controlled slots + level rules
```

NOT:

```text
free text generation
```

---

## Sentence Structure Model

Each sentence must follow a defined pattern.

Example:

```text
I + eat + {food}
I + go to + {place}
I + do + {task}
```

Each `{slot}` must come from the slot system.

---

## Pattern Definition

Each pattern must include:

- pattern_id
- level
- scenario
- grammar_focus
- template
- slots_used

Example:

```json
{
  "pattern_id": "DR_A1_EAT_SIMPLE",
  "level": "A1",
  "scenario": "daily_routine",
  "grammar_focus": ["simple_present_affirmative"],
  "template": "I eat {food}.",
  "slots_used": ["eat_food_A1"]
}
```

---

## FSI Substitution Rules

### Horizontal Substitution（橫向）

Replace slot items within the same level and same structure.

Example:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
I eat rice.
I eat noodles.
```

Rules:

- same pattern
- same grammar complexity
- same level
- only slot changes

Minimum requirement:

```text
Each pattern should generate 8–20 sentences
```

---

### Vertical Progression（縱向）

Upgrade the same idea across levels.

Example:

```text
A1:
I eat breakfast.

A1+:
I usually eat breakfast.

A2:
I eat breakfast before school.

A2+:
I eat breakfast because I am hungry.

B1:
On weekdays, I usually eat breakfast at seven because I have school.
```

Rules:

- same core meaning
- increasing grammar complexity
- natural progression
- no sudden jumps

---

## Level-Based Sentence Design

### A1

Structure:

```text
Subject + verb + slot
```

Examples:

```text
I eat breakfast.
I go to school.
I read a book.
```

Rules:

- short sentences
- no clause stacking
- concrete vocabulary
- high repetition allowed

---

### A1+

Add:

- frequency adverbs
- negative
- yes/no questions

Examples:

```text
I usually eat breakfast.
I do not eat breakfast.
Do you eat breakfast?
```

---

### A2

Add:

- before / after
- more object variation
- simple context

Examples:

```text
I eat breakfast before school.
I do homework after school.
```

---

### A2+

Add:

- because clauses
- reason expressions
- controlled clause combinations

Examples:

```text
I eat breakfast because I am hungry.
I go to bed early because I am tired.
```

---

### B1

Add:

- multiple clauses
- contrast (weekday/weekend)
- longer but controlled sentences

Examples:

```text
On weekdays, I usually eat breakfast at seven because I have school.
After I come home, I do my homework before dinner because I want to finish it early.
```

---

## FSI Transformation Rules

Each base sentence may generate:

### 1. Original

```text
I eat breakfast.
```

---

### 2. Negative

```text
I do not eat breakfast.
```

Rules:

- use base form after "do not"
- do not add -s

---

### 3. Yes/No Question

```text
Do you eat breakfast?
Does she eat breakfast?
```

Rules:

- do/does + base verb
- no verb -s after does

---

### 4. Short Answer（optional）

```text
Yes, I do.
No, I do not.
```

---

## Third Person Rules

Must ensure subject-verb agreement.

Correct:

```text
He eats breakfast.
She goes to school.
```

Incorrect:

```text
He eat breakfast.
She go to school.
```

---

## Sentence Count Requirements

Per scenario:

Minimum targets:

```text
A1: 40 sentences
A1+: 50 sentences
A2: 50 sentences
A2+: 50 sentences
B1: 40 sentences
```

Distribution:

- simple present: high
- FSI transformations: required
- sequence: medium
- reason: medium
- contrast: lower but present

---

## Grammar Coverage Requirement

Each scenario must cover:

- simple present
- negative
- questions
- frequency
- time expressions
- sequence (before/after)
- reason (because)
- subject-verb agreement

---

## Sentence Metadata Requirements

Each generated sentence must include:

```json
{
  "sentence_id": "DR_A1_001",
  "level": "A1",
  "scenario": "daily_routine",
  "grammar_focus": ["simple_present"],
  "target_sentence": "I eat breakfast.",
  "chunks": [...],
  "translation": "..."
}
```

---

## Chunk Rules

Chunks must:

- follow sentence order
- be complete
- not leak answers in FSI tasks
- match target sentence exactly

---

## Semantic Safety

Generation must obey:

- allowed_frames
- slot compatibility
- paired slots
- blacklist filtering

Blocked examples:

```text
eat homework
go to breakfast
take homework
read dinner
```

---

## Generation Workflow

### Step 1: Select pattern

```text
based on level + grammar_focus
```

### Step 2: Fill slots

```text
using slot system
```

### Step 3: Apply FSI transformation

```text
original / negative / question
```

### Step 4: Validate

Check:

- grammar
- slot compatibility
- blacklist
- duplication

---

## QA Process

### Automatic checks

- subject-verb agreement
- do/does correctness
- slot compatibility
- duplicates
- missing fields

---

### Human review

Label:

```text
OK
awkward
wrong
too_hard_for_level
duplicate
```

Only OK sentences go into stable bank.

---

## Implementation Rules

1. Do not generate sentences without patterns.
2. Do not mix levels in one pattern.
3. Do not bypass slot system.
4. Always apply FSI rules where applicable.
5. Always include metadata.
6. Always run QA checks.
7. Keep sentences natural and realistic.

---

## Status

Active specification.
