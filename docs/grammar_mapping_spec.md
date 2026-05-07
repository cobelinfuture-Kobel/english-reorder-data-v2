# Grammar Mapping Specification

## Status

This document defines required grammar coverage for each CEFR level.

It applies to all scenarios:

- daily_routine
- shopping
- food_drink
- future scenarios

This specification works together with:

- docs/slot_system_spec.md
- docs/sentence_generation_spec.md

---

## Core Principle

Grammar coverage must be:

```text
level-specific + explicitly controlled + testable
```

Do NOT rely on implicit grammar emergence.

Each level must explicitly include defined grammar_focus categories.

---

## Grammar Focus Categories

All grammar must be labeled using standardized tags.

### Core Tags

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
wh_question_basic
frequency_adverb
time_expression
third_person_singular
```

---

### Intermediate Tags

```text
before_after_sequence
because_reason_clause
and_but_connector
object_variation
```

---

### Advanced (B1) Tags

```text
multi_clause_sentence
weekday_weekend_contrast
habit_description
reason_plus_sequence
```

---

## Level Requirements

---

## A1

### Required Grammar

```text
simple_present_affirmative
time_expression
basic_object
```

### Optional (limited)

```text
third_person_singular
```

### Examples

```text
I eat breakfast.
I go to school.
I read a book.
```

### Restrictions

```text
NO because
NO before/after clauses
NO multi-clause sentences
```

---

## A1+

### Required Grammar

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
frequency_adverb
third_person_singular
```

### Examples

```text
I usually eat breakfast.
I do not eat breakfast.
Do you eat breakfast?
Does she go to school?
```

### Restrictions

```text
NO because
NO before/after clauses
NO multi-clause stacking
```

---

## A2

### Required Grammar

```text
simple_present_affirmative
frequency_adverb
before_after_sequence
object_variation
and_but_connector
```

### Examples

```text
I eat breakfast before school.
I do homework after school.
I go to the library and read a book.
```

### Notes

- clauses must be short
- avoid complex nesting

---

## A2+

### Required Grammar

```text
because_reason_clause
before_after_sequence
frequency_adverb
simple_present_negative
```

### Examples

```text
I eat breakfast because I am hungry.
I go to bed early because I am tired.
I do homework after I come home.
```

### Rules

- only ONE clause at a time
- no multi-clause stacking beyond 2 parts

---

## B1

### Required Grammar

```text
multi_clause_sentence
weekday_weekend_contrast
habit_description
reason_plus_sequence
```

### Examples

```text
On weekdays, I usually eat breakfast at seven because I have school.
After I come home, I do my homework before dinner because I want to finish it early.
```

### Rules

- allow 2-3 clauses
- maintain clarity
- avoid overly academic structures

---

## Grammar Distribution Requirements

Each scenario must include:

```text
simple_present_affirmative → high
negative → medium
questions → medium
frequency → medium
time_expression → high
sequence → medium
reason → medium
contrast → low-medium
```

---

## Grammar Mapping in Pattern

Each pattern must include grammar_focus.

Example:

```json
{
  "pattern_id": "DR_A2_SEQUENCE",
  "level": "A2",
  "grammar_focus": ["before_after_sequence"],
  "template": "I eat breakfast before school."
}
```

---

## Grammar Progression Rule

The same idea should expand across levels.

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

---

## Invalid Grammar Cases

The system must prevent:

```text
I eat breakfast because school. ❌
I go to bed before I am tired. ❌
Does she eats breakfast? ❌
She go to school. ❌
```

---

## QA Grammar Checks

Automatic checks must verify:

- subject-verb agreement
- do/does correctness
- clause structure validity
- level-appropriate grammar
- grammar_focus consistency

---

## Human Review Criteria

Mark sentences:

```text
OK
grammar_error
awkward
too_hard_for_level
too_simple_for_level
```

---

## Implementation Rules

1. Every sentence must have grammar_focus tags.
2. No sentence should include grammar above its level.
3. Patterns must align with grammar requirements.
4. FSI vertical progression must follow grammar mapping.
5. Grammar must be testable via rules.

---

## Status

Active specification.
