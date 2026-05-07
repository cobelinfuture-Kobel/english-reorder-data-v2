# Daily Routine Phase 5 Grammar-Aware Agreement Plan

## Status

Planned.

This is a planning document only.

It does not change:

- slot banks
- pattern banks
- generated sentence data
- generator code
- application code
- tests
- UI behavior

## Background

Daily Routine Phase 4C-A and Phase 4C-B are complete.

Phase 4C-A completed FSI chunk density refactor.

Phase 4C-B documented and validated Phase 4C boundaries.

Relevant commits:

```text
d6173e1 data: refactor daily routine FSI chunk density
853cf7a docs: add daily routine phase 4c-a completion notes
ffa0844 test: document and validate daily routine phase 4c-b boundaries
```

Phase 4C intentionally avoided broad grammar-aware agreement expansion.

Phase 5 is the next possible grammar expansion phase, but it must be implemented separately and carefully.

## Purpose

The purpose of Phase 5 is to add controlled grammar-aware agreement to selected Daily Routine sentence families.

Target grammar dimensions:

```text
I / you / he / she / we / they
my / your / his / her / our / their
present simple agreement
have / has agreement
singular / plural object agreement
possessive agreement
limited do / does question families
```

The goal is not free grammar transformation.

The goal is controlled grammar-safe substitution through paired grammar slots.

## Core Principle

Never implement Phase 5 through independent free substitution lists.

Bad design:

```json
{
  "subject": ["I", "you", "he", "she", "we", "they"],
  "verb": ["clean", "cleans"],
  "possessive": ["my", "your", "his", "her", "our", "their"],
  "object": ["room", "rooms"]
}
```

This can generate invalid sentences:

```text
He clean my room.
They cleans their room.
We has our books.
She brush your teeth.
```

Correct design requires paired grammar slots.

Example paired slot:

```json
"routine_clean_agreement_pairs": [
  {
    "subject": "I",
    "verb": "clean",
    "possessive": "my",
    "object": "room",
    "full_object": "my room",
    "number": "singular",
    "person": "first",
    "verb_form": "base"
  },
  {
    "subject": "you",
    "verb": "clean",
    "possessive": "your",
    "object": "room",
    "full_object": "your room",
    "number": "singular",
    "person": "second",
    "verb_form": "base"
  },
  {
    "subject": "he",
    "verb": "cleans",
    "possessive": "his",
    "object": "room",
    "full_object": "his room",
    "number": "singular",
    "person": "third_singular",
    "verb_form": "third_person_s"
  },
  {
    "subject": "she",
    "verb": "cleans",
    "possessive": "her",
    "object": "room",
    "full_object": "her room",
    "number": "singular",
    "person": "third_singular",
    "verb_form": "third_person_s"
  },
  {
    "subject": "we",
    "verb": "clean",
    "possessive": "our",
    "object": "rooms",
    "full_object": "our rooms",
    "number": "plural",
    "person": "first_plural",
    "verb_form": "base"
  },
  {
    "subject": "they",
    "verb": "clean",
    "possessive": "their",
    "object": "rooms",
    "full_object": "their rooms",
    "number": "plural",
    "person": "third_plural",
    "verb_form": "base"
  }
]
```

Pattern:

```text
{subject} {verb} {full_object}.
```

Valid outputs:

```text
I clean my room.
You clean your room.
He cleans his room.
She cleans her room.
We clean our rooms.
They clean their rooms.
```

## Relationship to Phase 4C

Phase 4C focused on:

```text
first-person frames
present simple
controlled modal frames
chunk substitution
verb-specific object slots
paired reason / time / condition slots
```

Phase 5 may build on Phase 4C chunks, but it must not replace Phase 4C.

Phase 4C remains stable.

Phase 5 should add separate grammar-aware pattern families instead of mutating all Phase 4C patterns.

## Recommended Phase 5 Implementation Strategy

Implement Phase 5 in small subphases.

## Phase 5-A: Statement Agreement Families

Focus only on declarative present simple statements.

Candidate frames:

```text
{subject} {verb} {full_object}.
{subject} {have_verb} {full_item}.
{subject} {pack_verb} {full_item}.
{subject} {brush_verb} {full_object}.
```

Candidate pattern IDs:

```text
ROUTINE_CLEAN_OBJECT_AGREEMENT
ROUTINE_HAVE_ITEM_AGREEMENT
ROUTINE_PACK_ITEM_AGREEMENT
ROUTINE_BRUSH_OBJECT_AGREEMENT
```

Do not rename existing Phase 4C pattern IDs.

Do not replace:

```text
ROUTINE_CLEAN_OBJECT
ROUTINE_HAVE_ITEM_FSI
ROUTINE_BRUSH_OBJECT
```

Instead, add separate Phase 5 pattern families.

## Phase 5-B: Have / Has Agreement

Target:

```text
I have my book.
You have your book.
He has his book.
She has her book.
We have our books.
They have their books.
```

Required paired slot:

```json
"routine_have_agreement_pairs": [
  {
    "subject": "I",
    "have_verb": "have",
    "possessive": "my",
    "item": "book",
    "full_item": "my book"
  },
  {
    "subject": "he",
    "have_verb": "has",
    "possessive": "his",
    "item": "book",
    "full_item": "his book"
  }
]
```

Bad outputs to prevent:

```text
He have his book.
She have her bag.
They has their books.
We has our books.
```

## Phase 5-C: Do / Does Question Families

Only after statement agreement is stable.

Target:

```text
Do you clean your room?
Does he clean his room?
Does she brush her teeth?
Do they pack their bags?
```

Important:
Question patterns require separate paired slots.

Do not auto-transform statements into questions.

Required model:

```json
"routine_question_agreement_pairs": [
  {
    "auxiliary": "Do",
    "subject": "you",
    "base_verb": "clean",
    "full_object": "your room"
  },
  {
    "auxiliary": "Does",
    "subject": "he",
    "base_verb": "clean",
    "full_object": "his room"
  },
  {
    "auxiliary": "Does",
    "subject": "she",
    "base_verb": "brush",
    "full_object": "her teeth"
  },
  {
    "auxiliary": "Do",
    "subject": "they",
    "base_verb": "pack",
    "full_object": "their bags"
  }
]
```

Valid:

```text
Does he clean his room?
Does she brush her teeth?
Do they pack their bags?
```

Invalid:

```text
Does he cleans his room?
Do she brush her teeth?
Does they pack their bags?
```

## Phase 5-D: Negative Families

Only after statement and question agreement are stable.

Target:

```text
I do not clean my room.
He does not clean his room.
She does not brush her teeth.
They do not pack their bags.
```

Required model:
Use paired auxiliary + subject + base verb + object.

Do not auto-negate all statements.

## Level Scope

Recommended level placement:

```text
A1: keep Phase 4C first-person FSI only
A1+: maybe limited you / your fixed chunks only
A2: controlled he / she have/has and simple agreement pairs
A2+: controlled reason clauses with pronoun-aware pairs only
B1: broader but still paired agreement families
```

Do not add full agreement expansion to A1.

A1 generated data should remain stable and low cognitive load.

## Candidate Data Design

Use separate paired slots.

Suggested slot groups:

```text
routine_clean_agreement_pairs
routine_have_agreement_pairs
routine_pack_agreement_pairs
routine_brush_agreement_pairs
routine_wash_agreement_pairs
routine_question_agreement_pairs
routine_negative_agreement_pairs
```

Each pair should carry all grammar-dependent values together:

```text
subject
verb_form
base_verb
possessive
full_object
full_item
person
number
auxiliary if needed
level_min
semantic_tags
```

Do not split these across independent slot lists unless the generator later has explicit morphology support.

## Candidate Pattern Design

Suggested new pattern IDs:

```text
ROUTINE_CLEAN_OBJECT_AGREEMENT
ROUTINE_HAVE_ITEM_AGREEMENT
ROUTINE_PACK_ITEM_AGREEMENT
ROUTINE_BRUSH_OBJECT_AGREEMENT
ROUTINE_WASH_OBJECT_AGREEMENT
ROUTINE_DO_DOES_QUESTION_AGREEMENT
ROUTINE_NEGATIVE_AGREEMENT
```

Naming rule:

```text
Use ROUTINE_* only.
Do not use DR_*.
Do not rename Phase 4C pattern IDs.
Do not overload Phase 4C FSI pattern IDs.
```

## Generator Policy

Phase 5 should initially avoid generator-wide morphology logic.

Preferred initial approach:

```text
paired slot values + explicit pattern frames
```

Deferred:

```text
automatic subject replacement
automatic verb conjugation
automatic possessive replacement
automatic statement-to-question conversion
automatic negative conversion
```

Only consider morphology-aware generator support after paired slot implementation is stable and tests clearly define expected behavior.

## Tests Required Before Implementation

Before implementing Phase 5 data, add tests for forbidden outputs.

Forbidden agreement errors:

```text
He clean his room.
She brush her teeth.
They cleans their rooms.
We has our books.
He have his book.
They has their bags.
Does he cleans his room?
Do she brush her teeth?
Does they pack their bags?
```

Forbidden scope errors:

```text
Phase 5 agreement sentences appearing in A1
DR_* pattern IDs
free past tense expansion
automatic generated questions from all statements
automatic generated negatives from all statements
```

Required positive examples only after implementation:

```text
He cleans his room.
She brushes her teeth.
They pack their bags.
We have our books.
Does he clean his room?
Do they pack their bags?
He does not clean his room.
```

## Implementation Order

Recommended order:

1. Add Phase 5 plan document.
2. Add tests that define Phase 5 boundaries.
3. Add one small statement agreement slot group.
4. Add one statement agreement pattern family.
5. Regenerate daily_routine only.
6. Confirm A1 remains unchanged.
7. Confirm no DR_* IDs.
8. Confirm no invalid agreement outputs.
9. Expand to have/has only after clean agreement works.
10. Defer do/does questions and negatives until later.

## Explicit Non-Goals

Phase 5 should not implement:

```text
general past tense
present perfect
past continuous
passive voice
relative clauses
paragraph output
dialogue output
free transformation engine
global morphology engine
data/chunk_bank migration
shopping grammar expansion
food_drink grammar expansion
```

## Risk List

Main risks:

```text
invalid subject-verb agreement
wrong possessive pairing
A1 becoming too difficult
Phase 4C generated count changing unexpectedly
pattern_id naming split
generator becoming a free transformation engine
tests overfitting exact sentence count too early
```

## Success Criteria

Phase 5 should only be considered safe to implement when:

```text
paired grammar slots are designed
pattern IDs are separate from Phase 4C IDs
A1 exclusion rules are clear
forbidden-output tests exist
positive-output tests are level-gated
daily_routine only is affected
ROUTINE_* naming is preserved
no DR_* IDs appear
pytest passes
```

## Final Recommendation

Do not implement Phase 5 immediately in the same commit as this plan.

First commit this plan as documentation only.

Recommended commit message:

```text
docs: add daily routine phase 5 grammar agreement plan
```
