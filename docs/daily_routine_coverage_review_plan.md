# Daily Routine Coverage Review Plan

## Status

Planning document.

This document defines the review plan for Daily Routine v1.1 coverage.

It applies the following project-wide specifications:

- `docs/slot_system_spec.md`
- `docs/sentence_generation_spec.md`
- `docs/grammar_mapping_spec.md`

No data, generator, UI, API, or test changes are included in this phase.

## Goal

Review and prepare Daily Routine for:

- CEFR A1 → B1 grammar coverage
- FSI horizontal substitution
- FSI vertical progression
- controlled verb-frame vocabulary expansion
- semantic safety
- future sentence bank regeneration

## Scope

In scope for review:

- Daily Routine slot banks
- Daily Routine pattern banks
- Daily Routine generated sentence bank
- Daily Routine FSI tasks
- Daily Routine grammar_focus tags
- Daily Routine semantic safety rules

Out of scope for this planning phase:

- modifying generated sentence data
- changing generator logic
- changing tests
- changing app integration
- changing UI
- changing other scenarios

## Reference Specs

### Slot System

Daily Routine must follow:

- no free verb + noun recombination
- phrase-level slots when articles/prepositions matter
- frame-specific slots for verb-object generation
- paired slots where free recombination is unsafe
- allowed_frames for controlled substitution
- bad phrase blacklist as a final safety net

### Sentence Generation

Daily Routine must support:

- pattern-based sentence generation
- controlled slot filling
- horizontal FSI substitution
- vertical FSI progression
- sentence metadata
- chunk order correctness
- QA workflow

### Grammar Mapping

Daily Routine must explicitly cover grammar_focus tags by level:

- A1: simple present affirmative, time expressions, basic objects
- A1+: negatives, yes/no questions, frequency, third-person singular
- A2: before/after sequence, object variation, and/but connector
- A2+: because clauses, before/after clauses, controlled reasons
- B1: multi-clause routines, weekday/weekend contrast, reason + sequence

## Review Questions

### 1. Slot Coverage

Check whether Daily Routine has controlled slots for:

- eat + food
- have + food / class / test / break
- take + shower / bath / bus / break
- go to + place phrase
- do + task
- read + reading object
- watch + media object
- listen to + audio object
- play + activity / instrument / sport
- brush / wash / get dressed personal care pairs
- wake up / get up / come home / leave home routine actions

Expected slot types:

- phrase slots
- frame-specific object slots
- paired slots
- clause pairs
- subject-verb pairs

## Proposed Daily Routine Slot Groups

### Food Frames

Recommended groups:

- `daily_routine_eat_food_A1`
- `daily_routine_eat_food_A2`
- `daily_routine_eat_food_B1`
- `daily_routine_have_food_A1`
- `daily_routine_have_food_A2`
- `daily_routine_have_food_B1`

Design rule:

Some items may allow both `eat` and `have`.

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

### Place Frames

Recommended groups:

- `daily_routine_go_to_place_A1`
- `daily_routine_go_to_place_A2`
- `daily_routine_go_to_place_B1`

Design rule:

Use phrase-level place items.

Examples:

```text
school
bed
the park
the station
the library
the bus stop
my friend's house
```

Do not use raw place nouns if articles are required.

### Task Frames

Recommended groups:

- `daily_routine_do_task_A1`
- `daily_routine_do_task_A2`
- `daily_routine_do_task_B1`

Examples:

```text
homework
my homework
math homework
my chores
extra practice
```

### Personal Care Pairs

Recommended group:

- `daily_routine_personal_care_pairs`

Examples:

```json
{
  "verb": "brush",
  "object": "my teeth",
  "level": "A1"
}
```

Required examples:

- brush my teeth
- wash my face
- wash my hands
- take a shower
- take a bath
- get dressed
- comb my hair
- pack my bag

### Reading / Media Frames

Recommended groups:

- `daily_routine_read_object_A1`
- `daily_routine_read_object_A2`
- `daily_routine_read_object_B1`
- `daily_routine_watch_object_A1`
- `daily_routine_watch_object_A2`
- `daily_routine_watch_object_B1`
- `daily_routine_listen_to_object_A1`
- `daily_routine_listen_to_object_A2`
- `daily_routine_listen_to_object_B1`

### Routine Action Frames

Recommended groups:

- `daily_routine_basic_action_time_pairs_A1`
- `daily_routine_sequence_pairs_A2`
- `daily_routine_reason_pairs_A2plus`
- `daily_routine_weekday_weekend_pairs_B1`
- `daily_routine_third_person_pairs_A1plus`

## Grammar Coverage Review Matrix

### A1

Required:

- simple_present_affirmative
- time_expression
- basic_object

Review checklist:

- Has `I eat {food}.`
- Has `I go to {place}.`
- Has `I do {task}.`
- Has `I read {object}.`
- Has `I watch {object}.`
- Has `I listen to {object}.`
- Has basic time expressions.

Target after implementation:

- at least 40 sentences
- high repetition
- short concrete sentences
- no clauses

### A1+

Required:

- simple_present_negative
- do_does_yes_no_question
- frequency_adverb
- third_person_singular

Review checklist:

- Has `I usually {routine}.`
- Has `I do not {routine}.`
- Has `Do you {routine}?`
- Has `He/She {third_person_routine}.`
- Has `Does he/she {base_verb_routine}?`

Target after implementation:

- at least 50 sentences
- enough FSI transformations
- no because clauses
- no before/after clauses

### A2

Required:

- before_after_sequence
- object_variation
- and_but_connector
- frequency_adverb

Review checklist:

- Has `I {routine} before school.`
- Has `I {routine} after school.`
- Has `I {routine} before I go to school.`
- Has `I {routine} after I come home.`
- Has simple `and` / `but` routine combinations.

Target after implementation:

- at least 50 sentences
- controlled object expansion
- short clauses only

### A2+

Required:

- because_reason_clause
- before_after_sequence
- controlled reasons
- simple negative where natural

Review checklist:

- Has `I eat breakfast because I am hungry.`
- Has `I go to bed early because I am tired.`
- Has `I do homework because I have class tomorrow.`
- Has paired reason slots.
- Has no free reason recombination.

Target after implementation:

- at least 50 sentences
- one clause at a time
- no excessive stacking

### B1

Required:

- multi_clause_sentence
- weekday_weekend_contrast
- habit_description
- reason_plus_sequence

Review checklist:

- Has weekday/weekend contrast.
- Has longer routine descriptions.
- Has reason + sequence combinations.
- Has natural but controlled sentence length.
- Has no overly academic language.

Target after implementation:

- at least 40 sentences
- 2–3 clauses allowed
- natural daily routine context

## FSI Review Matrix

### Horizontal FSI

Check whether same-level substitution exists for:

- eat + food
- go to + place
- do + task
- read + object
- watch + object
- listen to + object
- personal care routines
- time phrases
- frequency adverbs

Example:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
I eat rice.
I eat noodles.
```

### Vertical FSI

Check whether same semantic ideas progress across levels.

Required vertical sets:

#### Set 1: breakfast

```text
A1: I eat breakfast.
A1+: I usually eat breakfast.
A2: I eat breakfast before school.
A2+: I eat breakfast because I am hungry.
B1: On weekdays, I usually eat breakfast at seven because I have school.
```

#### Set 2: school

```text
A1: I go to school.
A1+: I usually go to school.
A2: I go to school after breakfast.
A2+: I go to school early because I have class.
B1: On weekdays, I usually go to school early because I have class in the morning.
```

#### Set 3: homework

```text
A1: I do homework.
A1+: I usually do homework.
A2: I do homework after school.
A2+: I do homework because I have class tomorrow.
B1: After I come home, I usually do my homework before dinner because I want to finish it early.
```

#### Set 4: bedtime

```text
A1: I go to bed.
A1+: I usually go to bed at nine.
A2: I go to bed before ten on school days.
A2+: I go to bed early because I am tired.
B1: On school days, I usually go to bed early because I need enough sleep for the next day.
```

## Semantic Safety Review

Check for automatic prevention of:

```text
eat homework
eat my teeth
take breakfast
go to homework
go to a shower
read dinner
watch breakfast
brush lunch
wash homework
Does he gets
Does she goes
She go to school
He eat breakfast
```

Review whether existing data has a bad phrase blacklist or equivalent checks.

## Metadata Review

Each generated sentence should include:

- sentence_id
- level
- scenario
- grammar_focus
- target_sentence
- chunks
- translation

Review whether:

- grammar_focus is complete
- level is accurate
- scenario is `daily_routine`
- chunks match target sentence order
- FSI task chunks are correct

## Implementation Phases

### Phase 1: Audit Only

- inspect current Daily Routine slots
- inspect current Daily Routine patterns
- inspect current generated bank
- count sentences by level
- count grammar_focus by level
- identify missing FSI transformations

No data changes.

### Phase 2: Slot Expansion Plan

- add controlled verb-frame vocabulary
- add allowed_frames
- add phrase-level slots
- add paired slots
- add blacklist entries

### Phase 3: Pattern Expansion Plan

- add A1 simple patterns
- add A1+ negative/question/frequency patterns
- add A2 before/after patterns
- add A2+ because patterns
- add B1 weekday/weekend and multi-clause patterns

### Phase 4: Generate and Review

- regenerate sentence bank
- run automatic checks
- export review list
- human mark OK / awkward / wrong / too_hard_for_level / duplicate

### Phase 5: Stabilize

- keep only OK sentences
- add regression tests
- update future expansion notes if needed

## Output Needed from Audit

When the actual audit is performed, report:

1. current sentence count by level
2. current grammar_focus count
3. current FSI task count by type
4. current slot groups found
5. missing slot groups
6. missing grammar_focus areas
7. semantic safety risks
8. recommended implementation order

## Status

Planned.
