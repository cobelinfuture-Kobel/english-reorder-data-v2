# Daily Routine Phase 4C-B Metadata Cleanup Notes

## Status

Complete.

## Phase 4C-A Reference Commits

- d6173e1
- 853cf7a

## Purpose

Phase 4C-B records and protects the Daily Routine Phase 4C-A FSI design without expanding the data model or changing generator behavior.

This phase keeps the Phase 4C-A bank maintainable by:

- documenting `ROUTINE_*` FSI pattern roles
- documenting daily_routine slot group chunk roles
- clarifying the metadata strategy
- strengthening validation coverage for Phase 4C-A boundaries

## Scope

Modified in this phase:

- `docs/daily_routine_phase4c_b_metadata_cleanup_notes.md`
- `tests/test_content_generator.py`

Not modified in this phase:

- `app.py`
- `scripts/generate_sentences.py`
- generator core logic
- `data/generated/daily_routine_sentence_bank.json`
- shopping / food_drink scenario files
- `data/chunk_bank/`

## ROUTINE Pattern Role Table

| Pattern ID | FSI Role | Density | Semantic Control | Notes |
| --- | --- | --- | --- | --- |
| `ROUTINE_HAVE_ITEM_FSI` | `semantic_chunk_substitution` | `high` | `item_chunk` | Same frame with school-life item substitution |
| `ROUTINE_CLEAN_OBJECT` | `semantic_chunk_substitution` | `medium` | `verb_specific_object` | Cleanable objects only |
| `ROUTINE_BRUSH_OBJECT` | `semantic_chunk_substitution` | `low` | `verb_specific_object` | `my teeth` / `my hair` only |
| `ROUTINE_WASH_OBJECT` | `semantic_chunk_substitution` | `low` | `verb_specific_object` | `my hands` / `my face` only |
| `ROUTINE_NEED_BRING_ITEM` | `semantic_chunk_substitution` | `high` | `item_chunk` | Controlled modal frame |
| `ROUTINE_FORGOT_ITEM_FSI` | `semantic_chunk_substitution` | `high` | `fixed_expression_item_chunk` | `I forgot ...` is fixed expression only; no general past expansion |
| `ROUTINE_REMIND_BRING_ITEM` | `semantic_chunk_substitution` | `high` | `item_chunk` | Imperative frame with controlled item slot |
| `ROUTINE_BEFORE_LEAVE_CHECK_ITEM` | `frame_spiral` | `high` | `item_chunk` | Same item bank used in higher-level connected frame |
| `ROUTINE_CLEAN_OBJECT_REASON` | `paired_reason` | `paired_only` | `paired_reason` | Reason must stay paired to object |
| `ROUTINE_PACK_ITEM_REASON` | `paired_reason` | `paired_only` | `paired_reason` | Reason must stay paired to item |
| `ROUTINE_CANNOT_USE_ITEM_REASON` | `paired_reason` | `paired_only` | `paired_reason` | Reason must stay paired to item/context |
| `ROUTINE_TIME_TAKES_CLEAN_OBJECT` | `paired_time` | `paired_only` | `duration_task_pair` | Duration must stay paired to clean task |
| `ROUTINE_AFTER_FINISH_ACTIVITY_FSI` | `paired_condition_or_sequence` | `paired_only` | `paired_sequence` | Sequence is explicitly paired |

## Slot Group Chunk Role Table

| Slot Group | Chunk Role | Density | Semantic Control | Notes |
| --- | --- | --- | --- | --- |
| `routine_have_items_fsi` | `item` | `high` | `safe_pattern_tags: have_item / forgot_item / bring_item / check_item` | Shared high-density item carrier |
| `routine_bring_items` | `item` | `high` | controlled school-life item chunk | Used by bring/remind frames |
| `routine_forgot_items_fsi` | `item` | `high` | `fixed_expression_only` | Only for fixed `I forgot ...` usage |
| `routine_check_items` | `item` | `high` | controlled school-life item chunk | Used in `Before I leave home...` |
| `routine_clean_objects` | `object` | `medium` | `cleanable_object` | Safe clean targets only |
| `routine_brush_objects` | `object` | `low` | `brushable_object` | Body/self-care only |
| `routine_wash_objects` | `object` | `low` | `washable_body_part` | Body-part scope only |
| `routine_clean_object_reason_pairs` | `paired_reason` | `paired_only` | paired object-reason mapping | No free recombination |
| `routine_pack_item_reason_pairs` | `paired_reason` | `paired_only` | paired item-reason mapping | No free recombination |
| `routine_cannot_use_item_reason_pairs` | `paired_reason` | `paired_only` | paired item-reason mapping | No free recombination |
| `routine_time_takes_clean_object_pairs` | `paired_time` | `paired_only` | paired duration-task mapping | No free recombination |
| `routine_after_finish_activity_pairs_fsi` | `paired_sequence` | `paired_only` | paired sequence mapping | No free recombination |

## Metadata Strategy

- If the schema already supported dedicated metadata fields, Phase 4C-B would attach FSI role metadata directly in schema.
- The current implementation keeps generator-facing JSON stable.
- Therefore Phase 4C-B stores metadata in docs and protects behavior in tests.
- This avoids accidental schema drift, generator edits, or generated-bank churn.

## Validation Strategy

Phase 4C-B validation keeps Phase 4C-A boundaries explicit:

- no `DR_*` pattern IDs in generated daily_routine data
- core FSI outputs continue to use `ROUTINE_*`
- no Phase 5 third-person or past-tense expansion
- no unsafe verb-object or bad reason combinations
- density floors remain intact
- required Phase 4C notes files exist
- generated daily_routine sentence count remains `464`

## Explicit Non-Goals

- no `data/chunk_bank/`
- no `app.py` changes
- no generator architecture change
- no `DR_*` pattern IDs
- no Phase 5 agreement expansion
- no broad pronoun replacement
- no general past tense expansion
- no automatic statement-to-question transformation
- no automatic positive-to-negative transformation

## Completion Checklist

- [x] Added Phase 4C-B notes document
- [x] Documented `ROUTINE_*` pattern role mapping
- [x] Documented slot group chunk role mapping
- [x] Kept metadata strategy in docs/tests instead of schema changes
- [x] Added validation coverage for doc existence
- [x] Added validation coverage for stable generated count
- [x] Left `app.py` unchanged
- [x] Left generator scripts unchanged
- [x] Left shopping / food_drink unchanged
- [x] Left generated daily_routine count unchanged at `464`
