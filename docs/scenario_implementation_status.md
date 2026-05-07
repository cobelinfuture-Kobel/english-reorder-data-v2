# Scenario Implementation Status

## Status

Active project status overview.

This document records the current implementation state of major scenarios.

## Daily Routine

### Status

Stable after Phase 4C and Phase 5.

### Completed

Phase 4C-A  
Phase 4C-B  
Phase 5-A clean agreement  
Phase 5-B have/has agreement  
Phase 5-C do/does questions  
Phase 5-D negatives  

### Generated Count

485

### Pattern IDs

ROUTINE_CLEAN_OBJECT_AGREEMENT  
ROUTINE_HAVE_ITEM_AGREEMENT  
ROUTINE_DO_DOES_QUESTION_AGREEMENT  
ROUTINE_NEGATIVE_AGREEMENT  

### Validation

py_compile: passed  
pytest tests/test_content_generator.py: 72 passed  

### Limitation

Generator does not support per-pair level filtering.

We/They currently appear in A2.

### Non-Goals

No:

- past tense  
- present perfect  
- continuous  
- contractions  
- free transformation  

---

## Food & Drink

### Status

Stable (v1.1)

### Notes

Maintain:

- countable vs uncountable  
- polite requests  
- restaurant interaction patterns  

Future expansion deferred.

---

## Shopping

### Status

Stable / pending review

### Future Direction

- this / that / these / those  
- singular / plural  
- comparison  
- return / exchange  

Requires separate plan.

---

## Global

### Existing Documents

grammar_expansion_pronoun_possessive_number_plan.md  
global_fsi_transformation_policy.md  
global_chunks_bank_design.md  

### Policy

- FSI ≠ free transformation  
- grammar expansion must use paired slots  
- no chunk_bank yet  

---

## Next Step

1. Stop Daily Routine expansion  
2. Choose next scenario: Food & Drink or Shopping  
3. Create new plan before any implementation  

---
