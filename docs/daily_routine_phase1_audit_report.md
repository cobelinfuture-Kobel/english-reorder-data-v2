# Daily Routine Phase 1 Audit Report

## Status

Audit report.

This report reviews the current `daily_routine` implementation against:

- `docs/slot_system_spec.md`
- `docs/sentence_generation_spec.md`
- `docs/grammar_mapping_spec.md`
- `docs/daily_routine_coverage_review_plan.md`

This phase is read-only.

No data, generator, UI, API, or test changes were made.

## 1. Existing Daily Routine Files

### Slot bank file

- `data/slot_bank/daily_routine_slots.json`

### Pattern bank file

- `data/pattern_bank/daily_routine_patterns.json`

### Generated bank file

- `data/generated/daily_routine_sentence_bank.json`

### Generator / related scripts found

- `scripts/generate_sentences.py`
- `scripts/validate_generated_bank.py`
- `engines/fsi_policy.py`

## 2. Sentence Count by Level

| Level | Sentence Count |
| --- | ---: |
| A1 | 83 |
| A1+ | 77 |
| A2 | 134 |
| A2+ | 84 |
| B1 | 107 |
| Total | 485 |

## 3. Grammar Focus Count

### Current raw grammar_focus tags found in generated bank

| grammar_focus | Count |
| --- | ---: |
| daily_routine_vocabulary | 273 |
| present_simple | 143 |
| to_infinitive | 92 |
| time_expression | 82 |
| because_so | 65 |
| routine_management | 53 |
| daily_routine | 47 |
| school_preparation | 43 |
| before_after | 43 |
| be_verb | 38 |
| have_to | 36 |
| need_to | 32 |
| school_life | 31 |
| adjectives | 30 |
| have_verb | 23 |
| wh_question | 21 |
| can_request | 20 |
| subject_verb_agreement | 20 |
| prepositions | 17 |
| like_verb | 17 |
| cannot | 17 |
| imperative | 16 |
| fixed_expression | 12 |
| clock_time | 11 |
| time_duration | 11 |
| reported_rule | 11 |
| possessive_agreement | 10 |
| frequency_adverbs | 10 |
| weekday_weekend | 10 |
| chores | 8 |
| phrasal_verb | 8 |
| getting_ready | 8 |
| would_like_to | 8 |
| time_condition | 8 |
| routine_opinion | 8 |
| want_to | 7 |
| helping_actions | 6 |
| too_enough | 6 |
| negative_statements | 6 |
| should | 6 |

### Requested standardized grammar_focus tags

The current bank does not use the new standardized tags from `docs/grammar_mapping_spec.md`.

| standardized grammar_focus | Direct Count in Current Bank |
| --- | ---: |
| simple_present_affirmative | 0 |
| simple_present_negative | 0 |
| do_does_yes_no_question | 0 |
| frequency_adverb | 0 |
| time_expression | 82 |
| before_after_sequence | 0 |
| because_reason_clause | 0 |
| third_person_singular | 0 |
| weekday_weekend_contrast | 0 |
| multi_clause_sentence | 0 |

### Approximate legacy-tag equivalents

| standardized grammar_focus | Approximate Legacy Coverage | Current Approximate Count |
| --- | --- | ---: |
| simple_present_affirmative | `present_simple` | 143 |
| simple_present_negative | `negative_statements` | 6 |
| do_does_yes_no_question | `subject_verb_agreement` | 20 |
| frequency_adverb | `frequency_adverbs` | 10 |
| time_expression | `time_expression`, `clock_time` | 93 |
| before_after_sequence | `before_after` | 43 |
| because_reason_clause | `because_so` | 65 |
| third_person_singular | `subject_verb_agreement`, `possessive_agreement` | 30 |
| weekday_weekend_contrast | `weekday_weekend` | 10 |
| multi_clause_sentence | `because_so`, `before_after`, `weekday_weekend`, `routine_management`, `routine_opinion` | 179 |

## 4. FSI Task Audit

### Generated bank result

| FSI task type | Count |
| --- | ---: |
| original sentences in bank | 485 |
| negative tasks in `fsi_tasks` | 0 |
| question tasks in `fsi_tasks` | 0 |
| answer / short answer tasks in `fsi_tasks` | 0 |

### Level coverage

| Level | Sentences with non-empty `fsi_tasks` |
| --- | ---: |
| A1 | 0 |
| A1+ | 0 |
| A2 | 0 |
| A2+ | 0 |
| B1 | 0 |

### Audit note

The generated bank currently has no active FSI tasks.

Although `scripts/generate_sentences.py` contains `_build_fsi_tasks`, the current Daily Routine patterns define `fsi_rules: []` throughout the pattern bank, so no FSI tasks are emitted into the generated bank.

## 5. Slot Group Audit

| Slot Group | Current Status | Notes |
| --- | --- | --- |
| eat + food | partial | present mostly as full action phrases such as `eat breakfast`, not as a clean frame-specific `eat_food` slot family |
| have + food / class / test / break | partial | `have` coverage exists through paired items and agreement pairs, but not as a structured verb-frame family |
| take + shower / bath / bus / break | partial | `take a shower` exists; broader `take` frame family is incomplete |
| go to + place | partial | strong phrase coverage such as `go to school`, but still mostly action-phrase based |
| do + task | partial | present through `do my homework` and related pairs; not normalized into frame-specific task slots |
| read + object | partial | present as `read a book` and similar fixed items |
| watch + object | partial | present as `watch TV` and related action phrases |
| listen to + object | partial | present as `listen to music` and related action phrases |
| play + activity | limited | some evidence in pair data, but not a clear dedicated slot family |
| personal care pairs | partial | `brush`, `wash`, `take a shower` exist, but not consolidated into one explicit shared paired-slot system |
| sequence pairs | yes | `routine_before_after_pairs` exists |
| reason pairs | yes | multiple `reason_pairs` groups exist |
| third person pairs | yes | agreement-pair groups exist |
| weekday/weekend pairs | yes | `routine_weekday_weekend_pairs` exists |
| bad phrase blacklist | missing | no explicit blacklist structure found in slot bank |

### Slot-bank structure assessment

The slot bank is relatively rich in quantity.

However, it is still centered on:

- action phrases
- action-time pairs
- action-place pairs
- reason pairs

More than on:

- frame-specific object slots
- reusable verb-object slot families
- explicit `allowed_frames`
- explicit scenario metadata
- explicit level metadata on all slot items

## 6. Pattern Audit

| Pattern Area | Current Status | Notes |
| --- | --- | --- |
| A1 simple present affirmative | yes | strong |
| A1 time expression | partial | limited in A1; stronger in A1+ and B1 |
| A1+ frequency | weak | only small frequency coverage found |
| A1+ negative | missing at level target | negative agreement content exists in A2, not A1+ |
| A1+ yes/no question | missing at level target | do/does question agreement exists in A2, not A1+ |
| A1+ third person singular | missing at level target | third-person agreement exists in A2, not A1+ |
| A2 before/after | weak at level target | `before_after` exists mainly in A2+, not A2 |
| A2 and/but | missing | no clear `and` / `but` routine pattern found |
| A2+ because | yes | strong |
| B1 weekday/weekend contrast | yes | present |
| B1 reason + sequence | partial | present, but tags are legacy and structure is not standardized |

### Pattern distribution by level

| Level | Pattern Count in Generated Bank |
| --- | ---: |
| A1 | 12 |
| A1+ | 12 |
| A2 | 21 |
| A2+ | 12 |
| B1 | 15 |

### Notable examples already present

- A2 question agreement: `Does he clean his room?`
- A2 negative agreement: `He does not clean his room.`
- A2 agreement statements: `She cleans her room.`
- A2+ reason: `I eat breakfast because I am hungry.`
- A2+ sequence: `I pack my bag before I go to school.`
- B1 weekday/weekend: `I get up late on weekends.`

## 7. Semantic Safety Risk

### Explicit bad phrase scan in generated bank

The following phrases were checked in the current generated bank and were not found:

- `eat homework`
- `eat my teeth`
- `take breakfast`
- `go to homework`
- `go to a shower`
- `read dinner`
- `watch breakfast`
- `brush lunch`
- `wash homework`
- `Does he gets`
- `Does she goes`
- `She go to school`
- `He eat breakfast`

### Current risk assessment

Current generated output appears safe for the known bad phrases above.

However, there are still structural risks:

- no explicit bad phrase blacklist found
- no project-style `allowed_frames` metadata in current Daily Routine slot bank
- many slots are action phrases instead of reusable frame-safe object groups
- grammar tagging is inconsistent with new spec, which weakens QA enforcement

## 8. Gap Report

| Area | Current Status | Gap | Priority | Recommended Fix |
| --- | --- | --- | --- | --- |
| Standardized grammar tags | legacy tag system only | does not match `grammar_mapping_spec` | high | add standardized `grammar_focus` taxonomy and map old tags |
| FSI tasks | generated bank has zero active `fsi_tasks` | no negative/question/short-answer output in bank | high | add `fsi_rules` to Daily Routine patterns and regenerate |
| Verb-frame slot design | mostly action phrases and pairs | not aligned with slot-system spec | high | split into frame-specific slots and paired slots with `allowed_frames` |
| A1+ negative coverage | mostly absent at target level | spec requires negatives at A1+ | high | add A1+ negative patterns |
| A1+ yes/no question coverage | mostly absent at target level | spec requires yes/no questions at A1+ | high | move/add question patterns to A1+ |
| A1+ third-person singular | mostly absent at target level | spec requires controlled third-person singular at A1+ | high | add A1+ third-person pattern family |
| A2 before/after coverage | mostly realized at A2+ | level drift | high | add short A2 before/after patterns |
| A2 and/but connector coverage | missing | required by spec | medium | add controlled connector patterns |
| Frequency coverage | present but small | not broad enough across levels | medium | expand frequency patterns and slots |
| Blacklist safety net | not found | no explicit final safety net | medium | add bad phrase blacklist structure |
| Slot metadata | limited | no consistent level/scenario/semantic metadata | medium | enrich slot item metadata |
| Pattern grammar focus consistency | mixed and legacy | difficult to test directly against spec | high | standardize tags per level |

## 9. Recommended Implementation Order

1. Standardize Daily Routine `grammar_focus` tags to match `docs/grammar_mapping_spec.md`.
2. Refactor core slot groups into verb-frame families with phrase-level items and `allowed_frames`.
3. Consolidate personal-care, reason, sequence, and third-person data into explicit paired-slot families.
4. Add a bad phrase blacklist as a final safety net.
5. Add A1+ pattern coverage for negatives, yes/no questions, frequency, and third-person singular.
6. Add A2 short `before/after` and controlled `and/but` patterns.
7. Keep A2+ `because` coverage, but convert it to standardized tags and cleaner reason pairs.
8. Refine B1 weekday/weekend, reason, and sequence patterns using the new grammar tag system.
9. Add Daily Routine `fsi_rules` so negative and question tasks are actually generated.
10. Regenerate the sentence bank and run validation.
11. Add regression tests for grammar tags, FSI presence, and semantic safety.

## 10. Recommended Phase 2 Starting Point

Phase 2 should start with slot and tagging work before pattern expansion.

Reason:

- the current bank already has many useful sentence ideas
- the main structural weakness is slot architecture and grammar tag consistency
- adding more patterns before fixing slot/frame design would increase drift
- FSI generation depends on patterns, but safe pattern growth depends on stronger slot definitions first

Recommended order inside Phase 2:

1. slot bank verb-frame expansion
2. `allowed_frames`
3. paired slot cleanup
4. grammar tag standardization
5. A1/A1+ FSI expansion
6. A2 sequence patterns
7. A2+ reason patterns
8. B1 weekday/weekend patterns
9. regenerate sentence bank
10. add regression tests

## 11. Audit Summary

The current Daily Routine implementation is stronger than a minimal prototype:

- sentence count is already healthy across all five levels
- A2 agreement work is present
- A2+ reason coverage is present
- B1 weekday/weekend and management-style content is present
- generated output does not currently show the audited bad phrases

But it is not yet aligned with the new three-spec system:

- grammar tags are still legacy and not standardized
- FSI output is not actually generated
- slot architecture is still phrase-heavy rather than frame-safe
- several grammar targets exist at the wrong level
- A2 connector coverage is missing

Overall conclusion:

Daily Routine is ready for a structured Phase 2 implementation pass, but that pass should begin with slot-system normalization and grammar-tag alignment before new large-scale pattern expansion.

## Status

Completed audit.
