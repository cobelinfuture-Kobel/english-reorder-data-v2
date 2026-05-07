# Slot System Specification

## Status

This document defines the project-wide slot system rules for sentence generation.

It applies to:

- Daily Routine
- Shopping
- Food & Drink
- future scenarios

The goal is to support large-scale FSI-style substitution while preventing semantically invalid generated sentences.

## Core Principle

The generator must not freely combine verbs and nouns.

Use controlled slots, phrase-level slots, paired slots, and frame restrictions.

Bad generation examples:

```text
eat homework
brush breakfast
go to a shower
read dinner
Does he gets up at seven?
She go to school.
```

Valid generation examples:

```text
eat breakfast
brush my teeth
go to school
take a shower
read a book
Does he get up at seven?
She goes to school.
```

## Slot Types

### 1. Single Slot

A simple replacement list used only when all items are safe in the same grammatical position.

Example:

```json
"frequency_adverbs": [
  "always",
  "usually",
  "often",
  "sometimes",
  "never"
]
```

Allowed use:

```text
I usually eat breakfast.
I sometimes go to school early.
```

### 2. Phrase Slot

A slot item may contain a complete phrase, including articles or fixed prepositions.

Use phrase slots when article choice or fixed wording matters.

Example:

```json
"go_to_place_A1": [
  "school",
  "bed",
  "the park",
  "the station",
  "the library"
]
```

Reason:

```text
go to school
go to bed
go to the park
go to the station
```

Do not split these into raw nouns unless the generator can handle articles correctly.

Bad design:

```json
"places": [
  "school",
  "bed",
  "park",
  "station"
]
```

This may generate:

```text
go to park
go to the school
go to the bed
```

### 3. Frame-Specific Slot

A slot that is only valid for specific verb frames.

Example:

```json
"eat_food_A1": [
  {
    "text": "breakfast",
    "allowed_frames": ["eat", "have"]
  },
  {
    "text": "rice",
    "allowed_frames": ["eat"]
  },
  {
    "text": "a sandwich",
    "allowed_frames": ["eat", "have"]
  }
]
```

Allowed:

```text
eat breakfast
have breakfast
eat rice
eat a sandwich
have a sandwich
```

Blocked:

```text
have rice
eat homework
take breakfast
```

### 4. Paired Slot

A paired slot stores two or more fields that must stay together.

Use paired slots when free recombination creates semantic or grammatical errors.

Example:

```json
"personal_care_pairs": [
  {
    "verb": "brush",
    "object": "my teeth"
  },
  {
    "verb": "wash",
    "object": "my face"
  },
  {
    "verb": "take",
    "object": "a shower"
  }
]
```

Allowed:

```text
brush my teeth
wash my face
take a shower
```

Blocked:

```text
brush my face
wash my teeth
take my teeth
```

### 5. Clause Pair

A clause pair stores a main action and a compatible clause.

Example:

```json
"routine_sequence_pairs": [
  {
    "main": "eat breakfast",
    "clause": "before I go to school"
  },
  {
    "main": "do homework",
    "clause": "after I come home"
  },
  {
    "main": "take a shower",
    "clause": "before I go to bed"
  }
]
```

Allowed:

```text
I eat breakfast before I go to school.
I do homework after I come home.
I take a shower before I go to bed.
```

Blocked:

```text
I do homework before I wake up.
I go to bed before I eat breakfast at school.
```

### 6. Subject-Verb Pair

Use subject-verb pairs when agreement cannot be safely inferred.

Example:

```json
"third_person_routine_pairs": [
  {
    "subject": "he",
    "verb_phrase": "gets up",
    "time": "at seven"
  },
  {
    "subject": "she",
    "verb_phrase": "goes to school",
    "time": "at eight"
  },
  {
    "subject": "my brother",
    "verb_phrase": "does homework",
    "time": "after school"
  }
]
```

Allowed:

```text
He gets up at seven.
She goes to school at eight.
My brother does homework after school.
```

Blocked:

```text
He get up at seven.
She go to school at eight.
My brother do homework after school.
```

## Required Slot Metadata

Each vocabulary item should include metadata when possible.

Recommended schema:

```json
{
  "text": "a sandwich",
  "level": "A2",
  "scenario": "daily_routine",
  "part_of_speech": "noun_phrase",
  "semantic_group": "food",
  "allowed_frames": ["eat", "have"],
  "source_note": "Cambridge-style A2 daily routine / food vocabulary"
}
```

### Field Rules

#### text

The exact phrase inserted into the sentence.

Examples:

```text
breakfast
a sandwich
the library
my homework
```

#### level

The intended CEFR level.

Allowed values:

```text
A1
A1+
A2
A2+
B1
```

#### scenario

The scenario where the item is used.

Examples:

```text
daily_routine
shopping
food_drink
```

#### part_of_speech

Use practical generation labels, not only traditional grammar labels.

Examples:

```text
noun
noun_phrase
verb_phrase
place_phrase
time_phrase
clause
reason_clause
sequence_clause
```

#### semantic_group

The semantic category used to prevent invalid combinations.

Examples:

```text
food
drink
place
school_task
personal_care
time
frequency
reason
problem
payment
shopping_item
```

#### allowed_frames

A list of verb frames or pattern frames where this item may appear.

Examples:

```json
["eat", "have"]
["go_to"]
["do"]
["read"]
["watch"]
["take"]
["buy"]
["order"]
```

## Naming Rules

Slot names should follow this pattern when possible:

```text
{scenario}_{function}_{semantic_group}_{level}
```

Examples:

```text
daily_routine_eat_food_A1
daily_routine_go_to_place_A1
daily_routine_do_task_A2
daily_routine_reason_pairs_A2plus
shopping_buy_item_A1
food_drink_order_item_A2
```

For shared slots:

```text
shared_frequency_adverbs
shared_time_phrases_A1
shared_polite_request_phrases_A2
```

## Level Rules

### A1

Use short, concrete, high-frequency items.

Allowed:

```text
eat breakfast
go to school
read a book
watch TV
go to bed
```

Avoid:

```text
prepare a healthy breakfast
review my schedule
finish my assignment
```

### A1+

Add simple frequency, negatives, and yes/no questions.

Allowed:

```text
I usually eat breakfast.
I do not eat breakfast.
Do you eat breakfast?
```

Avoid:

```text
I usually eat breakfast before I leave because I have class.
```

### A2

Add simple sequence, more object variation, and basic context.

Allowed:

```text
I eat breakfast before school.
I do homework after school.
I go to the library after class.
```

### A2+

Add because clauses, before/after clauses, and controlled reasons.

Allowed:

```text
I eat breakfast because I am hungry.
I go to bed early because I am tired.
I do homework after I come home.
```

### B1

Allow longer but still controlled combinations.

Allowed:

```text
On weekdays, I usually eat breakfast at seven because I have school.
After I come home, I do my homework before dinner because I want to finish it early.
```

Avoid overly academic or unnatural wording for daily routine contexts.

## FSI Substitution Rules

FSI substitution must use controlled slots.

### Horizontal Substitution

Horizontal substitution means replacing items at the same level and same grammar complexity.

Example A1:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
I eat rice.
I eat noodles.
```

Example A1:

```text
I go to school.
I go to bed.
I go to the park.
I go to the station.
```

### Vertical Substitution

Vertical substitution means upgrading the same semantic idea across levels.

Example:

```text
A1: I eat breakfast.
A1+: I usually eat breakfast.
A2: I eat breakfast before school.
A2+: I eat breakfast because I am hungry.
B1: On weekdays, I usually eat breakfast at seven because I have school.
```

## Negative and Question Transformation Rules

### Simple Present Negative

Base:

```text
I eat breakfast.
```

Negative:

```text
I do not eat breakfast.
```

Do not generate:

```text
I do not eats breakfast.
```

### Yes/No Question

Base:

```text
You eat breakfast.
```

Question:

```text
Do you eat breakfast?
```

Third person:

```text
She eats breakfast.
```

Question:

```text
Does she eat breakfast?
```

Do not generate:

```text
Does she eats breakfast?
```

### Third Person Singular

Allowed:

```text
She eats breakfast.
He goes to school.
My brother does homework.
```

Blocked:

```text
She eat breakfast.
He go to school.
My brother do homework.
```

## Semantic Safety Rules

### Do Not Freely Combine Verb and Object Slots

Blocked examples:

```text
eat homework
eat my teeth
take breakfast
go to homework
read dinner
watch breakfast
brush lunch
```

### Use Frame-Specific Object Slots

Example:

```json
{
  "frame": "eat",
  "allowed_semantic_groups": ["food"]
}
```

Example:

```json
{
  "frame": "go_to",
  "allowed_semantic_groups": ["place_phrase"]
}
```

Example:

```json
{
  "frame": "do",
  "allowed_semantic_groups": ["task"]
}
```

### Use Phrase-Level Items

Prefer:

```json
"the park"
"the station"
"my homework"
"a sandwich"
```

Over:

```json
"park"
"station"
"homework"
"sandwich"
```

when articles or possessives are required.

## Bad Phrase Blacklist

Each scenario may include a blacklist for known invalid outputs.

Example:

```json
"bad_phrase_blacklist": [
  "eat homework",
  "eat my teeth",
  "take breakfast",
  "go to a shower",
  "do a book",
  "read dinner",
  "brush breakfast",
  "wash homework",
  "Does he gets",
  "Does she goes",
  "She go to school",
  "He eat breakfast"
]
```

The blacklist is not a replacement for good slot design.

It is a final safety net.

## Review Workflow

Generated sentences should be reviewed in two phases.

### Phase 1: Automatic Filtering

Check:

- slot frame compatibility
- bad phrase blacklist
- subject-verb agreement
- do/does question form
- duplicate sentences
- missing chunks
- missing translations
- level field
- scenario field

### Phase 2: Human Review

Export generated sentences for review.

Recommended labels:

```text
OK
awkward
wrong
too_hard_for_level
duplicate
needs_translation_review
```

Only OK sentences should be promoted to stable generated banks.

## Implementation Rules

1. Do not add a new free noun slot unless all items are safe in the same position.
2. Prefer phrase slots over raw noun slots.
3. Use paired slots when grammar or meaning depends on two fields staying together.
4. Use allowed_frames for verb-object generation.
5. Use level metadata for CEFR-style filtering.
6. Do not mix scenario-specific vocabulary without a reason.
7. Do not rely only on blacklist filtering.
8. Every new scenario should document its special slot constraints.
9. Every generated bank should be regression-tested.
10. Every FSI task should preserve correct chunk order.

## Required Checks for New Slot Banks

Before accepting a new or updated slot bank, verify:

- all slot names follow naming rules
- items have level metadata when applicable
- items have scenario metadata when applicable
- frame-specific items include allowed_frames
- phrase-level items include articles or possessives when needed
- paired slots are used where free recombination is unsafe
- no obvious bad phrases are generated
- generated sentences pass tests

## Status

Active project-wide specification.
