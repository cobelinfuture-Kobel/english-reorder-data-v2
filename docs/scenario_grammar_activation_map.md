# Scenario Grammar Activation Map

## Status

Active specification.

This document defines which grammar tags are allowed per:

- CEFR level (A1 -> B1)
- scenario

It works with:

- docs/grammar_mapping_spec.md
- docs/slot_system_spec.md
- docs/sentence_generation_spec.md

---

## Core Principle

Grammar system is:

- globally complete
- locally restricted

```text
All grammar exists,
but only a subset is activated per scenario and level.
```

---

## Core Grammar Tags

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
wh_question_basic
frequency_adverb
time_expression
third_person_singular
before_after_sequence
because_reason_clause
and_but_connector
weekday_weekend_contrast
multi_clause_sentence
habit_description
reason_plus_sequence
```

---

# Level-Based Activation (Global Rules)

## A1

Allowed:

```text
simple_present_affirmative
time_expression
```

Optional (limited):

```text
third_person_singular
```

Blocked:

```text
simple_present_negative
do_does_yes_no_question
frequency_adverb
before_after_sequence
because_reason_clause
multi_clause_sentence
```

---

## A1+

Allowed:

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
wh_question_basic
frequency_adverb
third_person_singular
time_expression
```

Optional (limited):

```text
and_but_connector
```

Blocked:

```text
before_after_sequence
because_reason_clause
multi_clause_sentence
```

---

## A2

Allowed:

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
wh_question_basic
frequency_adverb
time_expression
third_person_singular
before_after_sequence
and_but_connector
```

Optional:

```text
because_reason_clause
habit_description
```

Blocked:

```text
multi_clause_sentence
reason_plus_sequence
```

---

## A2+

Allowed:

```text
simple_present_affirmative
simple_present_negative
do_does_yes_no_question
wh_question_basic
frequency_adverb
time_expression
third_person_singular
before_after_sequence
and_but_connector
because_reason_clause
```

Optional:

```text
habit_description
multi_clause_sentence (simple only)
```

Blocked:

```text
reason_plus_sequence
```

---

## B1

Allowed:

```text
ALL core grammar tags
```

---

# Scenario Activation

## 1. Daily Routine

### A1

```text
simple_present_affirmative
time_expression
```

### A1+

```text
simple_present_negative
do_does_yes_no_question
frequency_adverb
third_person_singular
```

### A2

```text
before_after_sequence
and_but_connector
```

### A2+

```text
because_reason_clause
```

### B1

```text
weekday_weekend_contrast
multi_clause_sentence
habit_description
reason_plus_sequence
```

---

## 2. Shopping

### A1

```text
simple_present_affirmative
time_expression
```

### A1+

```text
do_does_yes_no_question
simple_present_negative
```

### A2

```text
and_but_connector
frequency_adverb
```

### A2+

```text
because_reason_clause
```

### B1

```text
multi_clause_sentence
habit_description
```

---

## 3. Food & Drink

### A1

```text
simple_present_affirmative
```

### A1+

```text
frequency_adverb
do_does_yes_no_question
```

### A2

```text
and_but_connector
```

### A2+

```text
because_reason_clause
```

### B1

```text
multi_clause_sentence
```

---

## 4. School Life

### A1

```text
simple_present_affirmative
time_expression
```

### A1+

```text
frequency_adverb
do_does_yes_no_question
```

### A2

```text
before_after_sequence
and_but_connector
```

### A2+

```text
because_reason_clause
```

### B1

```text
multi_clause_sentence
habit_description
```

---

## 5. Home / Family

### A1

```text
simple_present_affirmative
```

### A1+

```text
third_person_singular
frequency_adverb
```

### A2

```text
and_but_connector
```

### A2+

```text
because_reason_clause
```

### B1

```text
habit_description
multi_clause_sentence
```

---

## 6. Travel

### A1

```text
simple_present_affirmative
```

### A1+

```text
wh_question_basic
do_does_yes_no_question
```

### A2

```text
and_but_connector
before_after_sequence
```

### A2+

```text
because_reason_clause
```

### B1

```text
multi_clause_sentence
reason_plus_sequence
```

---

## 7. Free Time

### A1

```text
simple_present_affirmative
```

### A1+

```text
frequency_adverb
```

### A2

```text
and_but_connector
```

### A2+

```text
because_reason_clause
```

### B1

```text
habit_description
multi_clause_sentence
```

---

## Activation Rules

1. Scenario must NOT activate grammar above its level.
2. Pattern must only use grammar allowed by both:

   - level
   - scenario
3. Generated sentences must be validated against this map.
4. FSI vertical progression must follow level expansion.
5. Do NOT bypass activation rules using slot substitution.

---

## Status

Active specification.
