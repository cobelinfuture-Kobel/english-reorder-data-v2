# Global Chunks Bank Design

## Status

Planned.

This document defines a future global `chunks_bank` design for the English sentence-bank and FSI drill system.

It is a planning document only.

It does not change:

- slot banks
- pattern banks
- generated sentence data
- generator code
- application code
- tests

## Why a Chunks Bank Is Needed

The project currently uses:

```text
data/slot_bank/
data/pattern_bank/
data/generated/
```

This is enough for generating sentence banks, but it does not fully expose teachable chunks.

The current `slot_bank` often carries two roles:

```text
1. lexical substitution pool
2. teachable chunk pool
```

This works for early implementation, but it becomes less clear when the system needs FSI-style drill groups.

Examples:

```text
I have {item}.
I clean {object}.
Can I have {food}, please?
Do you have this {item}?
```

These are not only sentence templates.

They are also teachable chunk-substitution drills.

A future `chunks_bank` would make the teachable units explicit.

## Core Teaching Problem

Without an explicit chunks layer, the system may generate many sentences, but the learner may not clearly see the substitution structure.

Example sentence set:

```text
I clean my room.
I clean my desk.
I clean the table.
I clean the kitchen.
```

The hidden drill structure is:

```text
Frame: I clean {object}.
Chunk target: {object}
Safe chunks:
- my room
- my desk
- the table
- the kitchen
```

A chunks bank can make this visible to teachers, tests, and future UI.

## Chunk vs Slot vs Pattern

## Pattern

A pattern defines the sentence frame.

Example:

```text
I clean {object}.
```

A pattern answers:

```text
What is the sentence structure?
What grammar is being practiced?
What level is this frame?
```

## Slot

A slot currently provides candidate values for placeholders.

Example:

```json
"routine_clean_objects": [
  {"text": "my room"},
  {"text": "my desk"},
  {"text": "the table"}
]
```

A slot answers:

```text
What values can fill this placeholder now?
```

## Chunk

A chunk is a teachable phrase unit.

Example:

```text
my room
my desk
the table
a bottle of water
some rice
this blue shirt
after school
because I am thirsty
```

A chunk answers:

```text
What reusable phrase should the learner notice, repeat, and transfer?
What semantic constraints does it have?
Which frames can safely use it?
```

## Proposed Relationship

Short-term:

```text
slot group = chunk carrier
pattern = frame carrier
generated sentence = output
```

Long-term:

```text
chunk_bank = teachable chunk inventory
slot_bank = generation-facing pool
pattern_bank = frame inventory
generated = final sentence bank
```

The project should not immediately remove slot banks.

Instead, a future chunks bank can sit above or beside slot banks.

## FSI Teaching Value

A chunks bank supports:

```text
repetition
noticing
transfer
semantic safety
chunk-level review
teacher-facing drill groups
future UI drill grouping
```

Example FSI drill group:

```text
Frame: I have {item}.

I have my book.
I have my bag.
I have my lunch.
I have my homework.
I have my pencil case.
I have my water bottle.
```

The learner practices one stable frame and one controlled substitution target.

## Chunk Types

The future chunks bank should support multiple chunk types.

## 1. Item Chunks

Examples:

```text
my book
my bag
my lunch
my homework
my pencil case
this shirt
these shoes
an apple
some water
```

Used by:

```text
I have {item}.
I forgot {item}.
Do you have {item}?
Can I have {item}, please?
```

## 2. Object Chunks

Examples:

```text
my room
my desk
the table
the kitchen
my teeth
my hair
```

Used by:

```text
I clean {object}.
I brush {object}.
I wash {object}.
```

These must be verb-specific.

Bad:

```text
I brush my room.
I clean my homework.
```

Good:

```text
I brush my teeth.
I clean my room.
```

## 3. Food and Drink Chunks

Examples:

```text
an apple
a sandwich
some rice
some water
a bottle of juice
a cup of tea
```

Used by:

```text
I want {food_or_drink}.
Can I have {food_or_drink}, please?
I would like {food_or_drink}.
```

Food & Drink is a strong future candidate for chunk-bank migration because it depends heavily on:

```text
countable nouns
uncountable nouns
measure phrases
a / an / some
drink containers
restaurant requests
```

## 4. Shopping Item Chunks

Examples:

```text
this shirt
that jacket
these shoes
those bags
a gift for my brother
this blue notebook
```

Used by:

```text
I want {item}.
How much is {item}?
Do you have {item}?
Can I try on {item}?
```

Shopping is a strong future candidate for chunk-bank migration because it depends heavily on:

```text
this / that / these / those
singular / plural agreement
item type
wearability
colorability
priceability
```

## 5. Time Chunks

Examples:

```text
in the morning
after school
before dinner
at night
on weekends
at seven thirty
```

Used by:

```text
I clean my room {time}.
I go to school {time}.
I usually study English {time}.
```

Time chunks often require pairing with actions.

Bad:

```text
I eat dinner before school.
I go to bed in the morning.
```

Good:

```text
I eat dinner in the evening.
I go to bed at night.
```

## 6. Reason Chunks

Examples:

```text
because I am thirsty
because it is messy
because I have a test
because I need my books
```

Used by:

```text
I drink water {reason}.
I clean my room {reason}.
I pack my bag {reason}.
```

Reason chunks must usually be paired.

Bad:

```text
I drink water because I am sleepy.
I brush my teeth because I am hungry.
```

Good:

```text
I drink water because I am thirsty.
I brush my teeth because I want clean teeth.
```

## 7. Condition Chunks

Examples:

```text
after homework
after I finish my homework
before bed
after dinner
```

Used by:

```text
Can I watch TV {condition}?
Can I use the computer {condition}?
```

Condition chunks should often be paired with the action.

## Density Classes

Chunks should be classified by FSI density.

## High-Density Chunks

These support many safe substitutions.

Examples:

```text
my book
my bag
my lunch
my homework
my pencil case
my water bottle
my notebook
```

Good for:

```text
I have {item}.
I forgot {item}.
Please remind me to bring {item}.
```

Expected density:

```text
8-16 substitutions per frame
```

## Medium-Density Chunks

These support several safe substitutions but require restrictions.

Examples:

```text
my room
my desk
the table
the kitchen
the bathroom
```

Good for:

```text
I clean {object}.
```

Expected density:

```text
4-8 substitutions per frame
```

## Low-Density Chunks

These have few safe substitutions.

Examples:

```text
my teeth
my hair
```

Good for:

```text
I brush {object}.
```

Expected density:

```text
2-3 substitutions per frame
```

## Paired-Only Chunks

These must be stored or selected as compatible pairs.

Examples:

```json
[
  {
    "action": "drink water",
    "reason": "because I am thirsty"
  },
  {
    "action": "clean my room",
    "reason": "because it is messy"
  }
]
```

Good for:

```text
I {action} {reason}.
```

## Proposed Chunk Schema

A future chunk bank may use a schema like this:

```json
{
  "chunk_id": "ROUTINE_ITEM_BOOK_MY",
  "text": "my book",
  "chunk_type": "item",
  "scenario_tags": ["daily_routine", "school"],
  "level_min": "A1",
  "density_class": "high",
  "safe_pattern_tags": ["have_item", "forgot_item", "bring_item", "check_item"],
  "unsafe_pattern_tags": [],
  "grammar_features": {
    "number": "singular",
    "determiner": "my",
    "countability": "countable"
  },
  "semantic_tags": ["school_item", "portable_item"],
  "notes": "Safe high-frequency school-life item."
}
```

## Proposed Paired Chunk Schema

For reason, time, and condition chunks, paired schema may be safer:

```json
{
  "pair_id": "ROUTINE_REASON_CLEAN_ROOM_MESSY",
  "chunk_type": "paired_reason",
  "level_min": "A2+",
  "frame": "I {action} because {reason}.",
  "values": {
    "action": "clean my room",
    "reason": "it is messy"
  },
  "scenario_tags": ["daily_routine"],
  "semantic_tags": ["routine", "reason", "chore"],
  "notes": "Reason must remain paired with clean my room."
}
```

## Proposed File Structure

Do not implement this immediately.

Possible future structure:

```text
data/chunk_bank/
  daily_routine_chunks.json
  food_drink_chunks.json
  shopping_chunks.json
```

Alternative future structure:

```text
data/chunk_bank/global_chunks.json
data/chunk_bank/scenario_chunks/
  daily_routine.json
  food_drink.json
  shopping.json
```

Recommendation for first implementation:

```text
data/chunk_bank/daily_routine_chunks.json
```

Reason:

Daily Routine is the clearest pilot for FSI chunk substitution.

## Migration Strategy

Do not migrate all scenarios at once.

Recommended order:

```text
Phase C0: Add global chunks_bank design document.
Phase C1: Keep Daily Routine Phase 4C using slot_bank as chunk carrier.
Phase C2: Add optional chunk metadata or chunk inventory for Daily Routine.
Phase C3: Decide whether generator should read chunk_bank directly.
Phase C4: Migrate or map Food & Drink chunks.
Phase C5: Migrate or map Shopping chunks.
```

## Relationship to Daily Routine Phase 4C

Daily Routine Phase 4C should remain compatible with this future design.

Short-term:

```text
Use slot groups such as routine_clean_objects and routine_have_items_fsi as chunk carriers.
Do not add data/chunk_bank yet.
Do not change generator schema yet.
```

Long-term:

```text
Move or map teachable chunks from slot groups into daily_routine_chunks.json.
Allow patterns to reference chunk groups or slot groups.
Allow UI to show drill targets explicitly.
```

## Relationship to Food & Drink v2

Food & Drink should eventually benefit from chunks_bank because its sentence count is currently constrained by semantic safety and countability.

A chunks bank can help represent:

```text
a cup of tea
a bottle of water
some rice
some milk
a slice of pizza
no ice
less sugar
to go
for here
the check
a table for two
```

Food & Drink v2 can use chunks_bank to improve:

```text
measure phrase drills
countable / uncountable drills
restaurant request chunks
customization chunks
replacement and problem chunks
```

## Relationship to Shopping v2

Shopping can use chunks_bank to improve:

```text
this / that / these / those
singular / plural item chunks
colorable item chunks
wearable item chunks
priceable item chunks
returnable item chunks
comparison item pairs
```

Example:

```json
{
  "chunk_id": "SHOP_ITEM_THIS_SHIRT",
  "text": "this shirt",
  "chunk_type": "shopping_item",
  "grammar_features": {
    "number": "singular",
    "demonstrative": "this",
    "pronoun": "it"
  },
  "semantic_tags": ["wearable", "colorable", "priceable"]
}
```

## Implementation Boundary

This document does not authorize immediate generator changes.

Before implementing a real chunks_bank, create a dedicated implementation plan that answers:

```text
Will generator read chunk_bank directly?
Will chunk_bank replace or supplement slot_bank?
How will pattern constraints reference chunks?
How will tests validate chunk safety?
How will UI display chunk drill groups?
How will existing Shopping and Food & Drink data remain compatible?
```

## Recommended Next Step

After this document is added, update:

```text
docs/daily_routine_phase4c_fsi_chunk_substitution_plan.md
```

to state that Phase 4C uses slot groups as temporary chunk carriers and remains compatible with the future global chunks_bank design.

## Status

Planned.
