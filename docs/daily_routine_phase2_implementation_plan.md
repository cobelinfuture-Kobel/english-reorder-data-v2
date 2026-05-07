# Daily Routine Phase 2 Implementation Plan

## Status

Planning document.

Phase 2 should fix structure before adding more sentence volume.

## Phase 2 Goal

Align Daily Routine with:

- docs/slot_system_spec.md
- docs/sentence_generation_spec.md
- docs/grammar_mapping_spec.md
- docs/daily_routine_coverage_review_plan.md
- docs/daily_routine_phase1_audit_report.md

## Implementation Order

### 1. Grammar Focus Tag Standardization

Goal:
Map legacy grammar_focus tags to standardized tags.

Required standardized tags include:

- simple_present_affirmative
- simple_present_negative
- do_does_yes_no_question
- wh_question_basic
- frequency_adverb
- time_expression
- third_person_singular
- before_after_sequence
- because_reason_clause
- and_but_connector
- weekday_weekend_contrast
- multi_clause_sentence
- habit_description
- reason_plus_sequence

Recommended approach:

- Keep useful legacy meaning where possible.
- Add standardized tags to patterns first.
- Regenerate generated bank after pattern tags are updated.
- Do not rely only on post-processing generated bank.

Legacy mapping examples:

- present_simple -> simple_present_affirmative
- negative_statements -> simple_present_negative
- frequency_adverbs -> frequency_adverb
- before_after -> before_after_sequence
- because_so -> because_reason_clause
- weekday_weekend -> weekday_weekend_contrast
- subject_verb_agreement -> third_person_singular / do_does_yes_no_question depending on pattern

### 2. Verb-Frame Slot Expansion

Goal:
Refactor Daily Routine slots from mostly action phrases into reusable verb-frame slot families.

Required frame families:

- eat + food
- have + food / class / test / break
- take + shower / bath / bus / break
- go to + place phrase
- do + task
- read + object
- watch + object
- listen to + object
- play + activity / sport / instrument
- personal care pairs
- wake up / get up / come home / leave home routine action-time pairs

Recommended slot groups:

- daily_routine_eat_food_A1
- daily_routine_eat_food_A2
- daily_routine_eat_food_B1
- daily_routine_have_object_A1
- daily_routine_have_object_A2
- daily_routine_have_object_B1
- daily_routine_take_object_A1
- daily_routine_take_object_A2
- daily_routine_take_object_B1
- daily_routine_go_to_place_A1
- daily_routine_go_to_place_A2
- daily_routine_go_to_place_B1
- daily_routine_do_task_A1
- daily_routine_do_task_A2
- daily_routine_do_task_B1
- daily_routine_read_object_A1
- daily_routine_read_object_A2
- daily_routine_read_object_B1
- daily_routine_watch_object_A1
- daily_routine_watch_object_A2
- daily_routine_watch_object_B1
- daily_routine_listen_to_object_A1
- daily_routine_listen_to_object_A2
- daily_routine_listen_to_object_B1
- daily_routine_play_object_A1
- daily_routine_play_object_A2
- daily_routine_play_object_B1

### 3. allowed_frames

Goal:
Prevent invalid verb-object generation.

Each frame-specific object item should include allowed_frames where applicable.

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

Examples:

- breakfast -> eat, have
- rice -> eat
- a sandwich -> eat, have
- homework -> do
- a book -> read
- TV -> watch
- music -> listen_to
- school -> go_to
- a shower -> take, have

### 4. Paired-Slot Cleanup

Goal:
Consolidate phrase pairs that should not be freely recombined.

Required paired-slot families:

- daily_routine_personal_care_pairs
- daily_routine_sequence_pairs_A2
- daily_routine_reason_pairs_A2plus
- daily_routine_third_person_pairs_A1plus
- daily_routine_weekday_weekend_pairs_B1
- daily_routine_action_time_pairs_A1

Examples:

- brush + my teeth
- wash + my face
- take + a shower
- eat breakfast + before I go to school
- do homework + after I come home
- eat breakfast + because I am hungry
- go to bed early + because I am tired
- she + eats breakfast
- he + goes to school

### 5. Bad Phrase Blacklist

Goal:
Add final safety net for known invalid generated strings.

Recommended blacklist examples:

- eat homework
- eat my teeth
- take breakfast
- go to homework
- go to a shower
- read dinner
- watch breakfast
- brush lunch
- wash homework
- Does he gets
- Does she goes
- She go to school
- He eat breakfast

Rule:
Blacklist is not a replacement for good slot design. It is only a final safety check.

### 6. A1 / A1+ FSI Rules

Goal:
Activate FSI output for Daily Routine.

A1 FSI should focus on horizontal substitution:

- I eat breakfast.
- I eat lunch.
- I eat dinner.
- I go to school.
- I go to bed.
- I read a book.

A1+ FSI should include:

- frequency
- negative
- yes/no question
- third-person singular where controlled

Required FSI types:

- original
- negative
- question
- optional short_answer

Examples:

Base:
I eat breakfast.

Negative:
I do not eat breakfast.

Question:
Do you eat breakfast?

Third person:
She eats breakfast.

Third-person question:
Does she eat breakfast?

Do not generate:

- Does she eats breakfast?
- She eat breakfast.

### 7. Regenerate Generated Bank

Goal:
After slot and pattern changes, regenerate:

`data/generated/daily_routine_sentence_bank.json`

Required checks:

- sentence count by level
- grammar_focus count
- FSI task count
- chunk order
- translations present
- semantic safety blacklist
- duplicate detection

### 8. Regression Tests

Goal:
Add tests only after data structure is stable.

Recommended tests:

- generated bank exists
- all target levels have data
- standardized grammar_focus tags are present
- fsi_tasks are non-empty for A1/A1+
- no bad phrases appear
- do/does transformations are correct
- third-person singular is correct
- chunks match target sentence order
- scenario is daily_routine

## Phase 2 Non-Goals

Do not:

- redesign UI
- change app integration
- modify shopping or food_drink
- create a general NLP semantic engine
- directly import a full Cambridge vocabulary list into generation slots
- freely combine all verbs and nouns

## Completion Criteria

Phase 2 is complete when:

1. Daily Routine uses standardized grammar_focus tags.
2. Core verb-frame slot families exist.
3. allowed_frames are present where needed.
4. paired slots are consolidated.
5. bad phrase blacklist exists.
6. A1/A1+ FSI tasks are generated.
7. generated bank is regenerated successfully.
8. regression tests pass.
9. generated output passes semantic safety checks.

## Recommended Commit Strategy

Use small commits:

1. docs: add daily routine phase 2 implementation plan
2. data: standardize daily routine grammar tags
3. data: add daily routine verb-frame slots
4. data: add daily routine paired slots and blacklist
5. data: enable daily routine A1 A1plus FSI rules
6. data: regenerate daily routine sentence bank
7. tests: add daily routine grammar and FSI regression tests

## Status

Planned.
