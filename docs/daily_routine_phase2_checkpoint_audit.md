# Daily Routine Phase 2 Checkpoint Audit

## Status

Checkpoint audit before commit.

This report validates consistency across:

- slot_bank
- pattern_bank
- generated_bank

## 1. JSON Integrity

All three files are valid JSON:

- `data/slot_bank/daily_routine_slots.json`
- `data/pattern_bank/daily_routine_patterns.json`
- `data/generated/daily_routine_sentence_bank.json`

Duplicate-key check:

- no duplicate keys found in any of the three JSON files

Structural check:

- no missing-field issues found in the new verb-frame slot groups
- no missing-field issues found in `daily_routine_personal_care_pairs`

Checked slot-item schema fields:

- `text`
- `level`
- `scenario`
- `semantic_group`
- `allowed_frames`

Result:

- integrity status: pass

## 2. Generated Bank Summary

Total sentence count:

- `799`

Sentence count by level:

```text
A1   129
A1+  240
A2   209
A2+  125
B1    96
```

Assessment:

- the bank is internally coherent
- the count is still far above the legacy `485` baseline
- B1 remains lower than the earlier `107` checkpoint because of prior uniqueness collisions

## 3. Uniqueness Check

Result:

- all `target_sentence` values are unique
- duplicate count: `0`

Assessment:

- uniqueness status: pass

## 4. Grammar Focus Distribution

Generated-bank counts:

| Grammar Tag | Count |
| --- | ---: |
| `simple_present_affirmative` | 506 |
| `simple_present_negative` | 79 |
| `do_does_yes_no_question` | 62 |
| `wh_question_basic` | 17 |
| `frequency_adverb` | 77 |
| `time_expression` | 261 |
| `third_person_singular` | 29 |
| `before_after_sequence` | 52 |
| `because_reason_clause` | 98 |
| `and_but_connector` | 70 |
| `weekday_weekend_contrast` | 10 |
| `multi_clause_sentence` | 43 |
| `habit_description` | 28 |
| `reason_plus_sequence` | 0 |

Assessment:

- the distribution is no longer legacy-tag-only; the standardized grammar tags are present and useful
- A1 to A2+ coverage is strong in simple present, time, frequency, negative, question, reason, and connector usage
- B1-level discourse-style tags are still lighter than the lower-level tags, which is acceptable for this scenario
- `third_person_singular` remains slightly underrepresented relative to other A1+ targets
- `reason_plus_sequence` is still absent, so the system is not yet exercising that combined tag in practice
- overall progression is directionally correct, but the distribution is still biased toward high-volume A1+/A2 style practice rather than a balanced A1-B1 ladder

## 5. Slot Usage Check

Pattern usage of new verb-frame slots by level:

| Level | Uses New Verb-Frame Slots | Still Old Style | Total Patterns |
| --- | ---: | ---: | ---: |
| `A1` | 0 | 15 | 15 |
| `A1+` | 6 | 29 | 35 |
| `A2+` | 0 | 17 | 17 |

Overall checkpoint view:

- new-slot patterns across checked levels: `6`
- old-style patterns across checked levels: `61`

Assessment:

- the slot architecture now exists
- actual pattern usage is still mostly old-style
- the current bank still reflects phrase-based generation much more than frame-based generation

## 6. Migrated Pattern List

Currently migrated patterns:

| Pattern ID | Slot Group | Level | Zero-Output-Change |
| --- | --- | --- | --- |
| `ROUTINE_THIRD_PERSON_BREAKFAST_A1PLUS` | `daily_routine_eat_food_A1` | `A1+` | yes |
| `ROUTINE_THIRD_PERSON_READ_A1PLUS` | `daily_routine_read_object_A1` | `A1+` | yes |
| `ROUTINE_THIRD_PERSON_WATCH_A1PLUS` | `daily_routine_watch_object_A1` | `A1+` | yes |
| `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS` | `daily_routine_do_task_A1` | `A1+` | yes |
| `ROUTINE_DOES_BROTHER_HOMEWORK_A1PLUS` | `daily_routine_do_task_A1` | `A1+` | yes |
| `ROUTINE_DOES_SHE_GO_TO_SCHOOL_A1PLUS` | `daily_routine_go_to_place_A1` | `A1+` | yes |

Assessment:

- all migrated patterns are narrow fixed-surface patterns
- all six appear to preserve sentence surface exactly
- no broad high-volume pattern family has been migrated yet

## 7. Non-Migrated High-Frequency Patterns

High-frequency A1 / A1+ patterns, ordered by generated count:

| Pattern ID | Level | Generated Count | Classification |
| --- | --- | ---: | --- |
| `ROUTINE_FREQUENCY_ACTION` | `A1+` | 30 | `blocked_by_generator` |
| `ROUTINE_DO_TIME` | `A1+` | 21 | `needs_care` |
| `ROUTINE_NEGATIVE_TIME_A1PLUS` | `A1+` | 21 | `needs_care` |
| `ROUTINE_QUESTION_TIME_A1PLUS` | `A1+` | 21 | `needs_care` |
| `ROUTINE_DO` | `A1` | 18 | `needs_care` |
| `ROUTINE_EVERY_DAY_A1` | `A1` | 18 | `needs_care` |
| `ROUTINE_QUESTION_ACTION_A1PLUS` | `A1+` | 18 | `blocked_by_generator` |
| `ROUTINE_ACTION_PLACE_A1` | `A1` | 17 | `needs_care` |
| `ROUTINE_NEGATIVE_ACTION_A1PLUS` | `A1+` | 16 | `blocked_by_generator` |
| `ROUTINE_EVERY_DAY_ACTION` | `A1+` | 13 | `needs_care` |
| `ROUTINE_CLOCK_TIME_A1` | `A1` | 11 | `needs_care` |
| `ROUTINE_HAVE_ITEM_FSI` | `A1` | 10 | `needs_care` |
| `ROUTINE_QUESTION_BRING_ITEM_A1PLUS` | `A1+` | 10 | `needs_care` |
| `ROUTINE_LIKE` | `A1+` | 9 | `blocked_by_generator` |
| `ROUTINE_HAVE_ITEM` | `A1` | 8 | `needs_care` |

Assessment:

- the largest remaining non-migrated families are exactly the families that drive current sentence volume
- these are not safe “search and replace” migrations
- they are the main source of future count drift if migrated without stronger generator support

## 8. Semantic Safety Scan

Scanned for:

- `eat homework`
- `take breakfast`
- `read dinner`
- `watch breakfast`
- `go to homework`
- `I do book`
- `I play homework`
- `does not goes`
- `does not watches`
- `He get up`
- `She go to school`

Result:

- no semantic error hits found

Assessment:

- semantic safety status: pass

## 9. Slot / Pattern Consistency

Checks:

- every referenced pattern slot category exists
- no pattern found using a missing slot group
- new verb-frame slot groups include `allowed_frames`

Consistency findings:

- missing referenced slot groups: `0`
- many new slot groups still exist without any current pattern usage
- `allowed_frames` metadata exists, but it is not yet actively enforced by the generator as a frame-composition mechanism

Unused new verb-frame slot groups at this checkpoint:

- `daily_routine_eat_food_A2`
- `daily_routine_eat_food_B1`
- `daily_routine_have_object_A1`
- `daily_routine_have_object_A2`
- `daily_routine_have_object_B1`
- `daily_routine_take_object_A1`
- `daily_routine_take_object_A2`
- `daily_routine_take_object_B1`
- `daily_routine_go_to_place_A2`
- `daily_routine_go_to_place_B1`
- `daily_routine_do_task_A2`
- `daily_routine_do_task_B1`
- `daily_routine_read_object_A2`
- `daily_routine_read_object_B1`
- `daily_routine_watch_object_A2`
- `daily_routine_watch_object_B1`
- `daily_routine_listen_to_object_A1`
- `daily_routine_listen_to_object_A2`
- `daily_routine_listen_to_object_B1`
- `daily_routine_play_object_A1`
- `daily_routine_play_object_A2`
- `daily_routine_play_object_B1`

Assessment:

- structural consistency is good
- operational usage is still partial

## 10. Personal Care Pair Integrity

Checked personal-care targets and pair structure:

- `brush my teeth`
- `wash my face`
- `take a shower`
- `get dressed`

Findings:

- `daily_routine_personal_care_pairs` exists as a paired structure in the slot bank
- `brush my teeth`, `wash my face`, and `take a shower` still appear in generated output
- `get dressed` is present in paired-slot data but is not currently represented in generated output
- no evidence that personal-care pairs were accidentally converted into unsafe free recombination

Assessment:

- paired-structure integrity: pass

## 11. Risk Assessment

### Low Risk

- additional zero-output-change fixed-pattern migrations like the six already completed
- narrow third-person or fixed-question patterns where the slot can be pinned to one exact item

### Medium Risk

- A1 simple-present action families such as `ROUTINE_DO`
- A1 time and place wrappers such as `ROUTINE_DO_TIME`, `ROUTINE_ACTION_PLACE_A1`, and `ROUTINE_CLOCK_TIME_A1`
- A1 `have` families because the new `have` slot inventory does not yet fully mirror the current generated item inventory
- any migration that can trigger `ensure_unique_targets` collisions and shift level counts

### High Risk

- broad frequency, negative, and question migrations that still rely on full action phrases
- any migration that assumes the generator will compose `verb + object/place` while respecting `allowed_frames`
- third-person and do/does families beyond the current narrow fixed patterns
- anything requiring base-form and inflected-form pairing logic

## 12. Readiness for Commit

Conclusion:

```text
NOT READY
```

Reason:

- the data is internally valid and semantically clean
- migrated patterns are stable
- but the checkpoint is not yet commit-ready as a stable Phase 2 baseline because:
  - the test suite still contains the known generated-count failure (`799` vs legacy `485`)
  - slot usage is still overwhelmingly old-style
  - most new verb-frame groups are still unused
  - `allowed_frames` metadata exists structurally but is not yet meaningfully activated at generator level

Interpretation:

- this is a good experimental checkpoint
- it is not yet the cleanest point to freeze as a durable architecture milestone

## 13. Recommended Next Step

Recommended choice:

```text
C. implement generator support for verb-frame
```

Why:

- the next real bottleneck is no longer slot data
- the next bottleneck is the generator’s inability to treat `allowed_frames` and split verb/object structure as first-class generation logic
- continuing broad migration before that support exists is likely to create more count drift and ownership collisions

Secondary fallback:

- if generator work is intentionally deferred, the next-best option is `B. continue safe migration (A1)` only for narrow zero-output-change cases
