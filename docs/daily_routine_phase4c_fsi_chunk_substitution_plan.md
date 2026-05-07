# Daily Routine Phase 4C FSI Chunk Substitution Plan

## Status

Planned.

This document defines Daily Routine Phase 4C.

Phase 4C follows:

- `docs/daily_routine_scope.md`
- `docs/daily_routine_v1_implementation_plan.md`
- `docs/daily_routine_interaction_expansion_plan.md`
- `docs/daily_routine_phase4b_interaction_patterns_plan.md`
- `docs/grammar_expansion_pronoun_possessive_number_plan.md`

Phase 4B expanded Daily Routine from a core routine bank into a broader daily-life and school-life interaction bank.

Phase 4C has a different goal.

It does not primarily add new interaction functions.

It adds FSI drill density through controlled word-level, chunk-level, and frame-level substitution.

This is a planning document only.

It does not change slot banks, pattern banks, generated sentence data, generator code, application code, or tests.

## Problem

The current Daily Routine bank contains many useful sentences, but many frames do not yet provide enough repeated substitution practice.

Examples:

```text
I clean my room.
I brush my teeth.
I have my book.
```

These are useful sentences, but a learner needs repeated drill patterns such as:

```text
I clean my room.
I clean my desk.
I clean the table.
I clean the kitchen.

I brush my teeth.
I brush my hair.

I have my book.
I have my bag.
I have my lunch.
I have my homework.
I have my pencil case.
```

The current bank is strong as a sentence bank.

It is not yet dense enough as an FSI-style substitution drill bank.

## Goal

The goal of Phase 4C is to make Daily Routine more FSI-like.

That means:

```text
same frame
same grammar
different controlled chunk
high repetition
low semantic risk
level-appropriate vocabulary
```

Phase 4C should increase drill density without introducing uncontrolled grammar expansion.

Specifically, Phase 4C should add:

```text
word-level substitution
chunk-level substitution
frame-level substitution
verb-specific object slots
item-specific substitution slots
paired-only reason / time / condition slots
FSI metadata where useful
```

Phase 4C should not add broad pronoun / possessive / agreement expansion.

That belongs to Phase 5.

## Relationship to Global Grammar Plan

The global grammar plan defines grammar expansion across scenarios.

Phase 4C is narrower.

It only applies to Daily Routine and focuses on first-person FSI chunk substitution.

The grammar baseline for Phase 4C remains:

```text
mostly first person
mostly present simple
controlled modal patterns
no broad third-person expansion
no general past tense expansion
no paragraph output
no dialogue output
```

Allowed:

```text
I have {item}.
I clean {object}.
I brush {object}.
I need to bring {item}.
Can I use {item} here?
Before I leave home, I check {item}.
```

Deferred:

```text
He cleans his room.
She brushes her teeth.
They pack their bags.
We have our books.
Yesterday, I cleaned my room.
```

These belong to Phase 5 or later tense expansion.

## Relationship to Global Chunks Bank Design

Phase 4C is compatible with the future global chunks_bank design described in:

```text
docs/global_chunks_bank_design.md
```

However, Phase 4C should not implement a real `data/chunk_bank/` yet.

For this phase, Daily Routine FSI chunks are represented through existing slot groups.

Short-term representation:

```text
slot group = chunk carrier
pattern = frame carrier
generated sentence = output
```

Examples:

```text
routine_have_items_fsi = item chunk group
routine_clean_objects = object chunk group
routine_brush_objects = low-density object chunk group
routine_clean_object_reason_pairs = paired reason chunk group
routine_pack_item_time_pairs = paired time chunk group
```

This allows Phase 4C to increase FSI drill density without changing generator architecture.

The future chunks_bank may later extract these teachable chunks into:

```text
data/chunk_bank/daily_routine_chunks.json
```

or another global chunk-bank structure.

Phase 4C should therefore avoid naming or schema choices that would block a later chunk-bank migration.

## FSI Chunk Inventory for Phase 4C

Phase 4C uses the following chunk categories.

### Item Chunks

Used in:

```text
I have {item}.
I forgot {item}.
I need to bring {item}.
Please remind me to bring {item}.
Before I leave home, I check {item}.
```

Current carrier:

```text
routine_have_items_fsi
routine_bring_items
routine_forgot_items_fsi
routine_check_items
routine_pack_items
routine_get_items
```

Teaching value:

```text
high repetition
high transfer
clear school-life item substitution
```

### Object Chunks

Used in:

```text
I clean {object}.
I brush {object}.
I wash {object}.
I need to clean {object}.
```

Current carrier:

```text
routine_clean_objects
routine_brush_objects
routine_wash_objects
```

Teaching value:

```text
verb-object compatibility
error prevention
medium or low density substitution
```

### Time Chunks

Used in:

```text
I clean {object} {time}.
I pack {item} {time}.
I put on {item} {time}.
I wash {object} {time}.
```

Current carrier:

```text
routine_clean_object_time_pairs
routine_pack_item_time_pairs
routine_put_on_item_time_pairs
routine_wash_object_time_pairs
```

Teaching value:

```text
action-time compatibility
spiral learning from A1 to A1+
```

### Reason Chunks

Used in:

```text
I clean {object} because {reason}.
I pack {item} because {reason}.
I cannot use {item} now because {reason}.
```

Current carrier:

```text
routine_clean_object_reason_pairs
routine_pack_item_reason_pairs
routine_cannot_use_item_reason_pairs
```

Teaching value:

```text
semantic pairing
reason clause control
A2+ sentence expansion
```

### Condition / Sequence Chunks

Used in:

```text
After I finish {task}, I {activity}.
It takes {duration} to clean {object}.
```

Current carrier:

```text
routine_after_finish_activity_pairs_fsi
routine_time_takes_clean_object_pairs
```

Teaching value:

```text
B1 routine-management frames
controlled multi-chunk substitution
```

## Why Phase 4C Does Not Add data/chunk_bank Yet

A real chunk bank would be useful, but it requires a separate architecture phase.

It may affect:

```text
generator loading
pattern schema
slot schema
tests
UI drill grouping
Shopping compatibility
Food & Drink compatibility
```

Therefore Phase 4C should first use slot groups as chunk carriers.

A later chunk-bank implementation can map or migrate these slot groups into an explicit chunk-bank schema.

This keeps Phase 4C teachable now and architecture-compatible later.

## FSI Layers

Phase 4C should distinguish three FSI layers.

## 1. Word-Level Substitution

A single word or short noun phrase changes.

Example frame:

```text
I have {item}.
```

Outputs:

```text
I have my book.
I have my bag.
I have my lunch.
I have my homework.
```

Best for:

```text
items
objects
food/drink items in other scenarios
simple school objects
simple home objects
```

## 2. Chunk-Level Substitution

A larger phrase changes.

Example frame:

```text
I clean {object}.
```

Outputs:

```text
I clean my room.
I clean my desk.
I clean the table.
I clean the kitchen.
```

The chunk is not just a word. It is a semantically valid object phrase.

Best for:

```text
verb + compatible object
routine action phrase
condition phrase
time phrase
reason phrase
```

## 3. Frame-Level Substitution

The same core phrase appears in multiple controlled frames.

Example:

```text
I clean my room.
I clean my room after school.
I need to clean my room.
I clean my room because it is messy.
It takes ten minutes to clean my room.
```

This supports spiral learning.

The learner sees the same chunk in increasingly complex frames.

## FSI Density Classes

Not all slots can be expanded equally.

Phase 4C must classify substitution targets by density.

## High-Density Chunks

These can support many substitutions safely.

Examples:

```text
I have {item}.
I forgot {item}.
Please remind me to bring {item}.
Before I leave home, I check {item}.
```

Potential slot:

```text
routine_high_density_items
```

Example values:

```json
[
  {"text": "my book"},
  {"text": "my bag"},
  {"text": "my lunch"},
  {"text": "my homework"},
  {"text": "my pencil case"},
  {"text": "my water bottle"},
  {"text": "my key"},
  {"text": "my notebook"},
  {"text": "my English book"},
  {"text": "my school uniform"},
  {"text": "my jacket"},
  {"text": "my shoes"}
]
```

Expected density:

```text
8–16 safe substitutions per frame
```

## Medium-Density Chunks

These support several substitutions, but require verb-specific compatibility.

Example:

```text
I clean {object}.
```

Safe values:

```json
[
  {"text": "my room"},
  {"text": "my desk"},
  {"text": "the table"},
  {"text": "the kitchen"},
  {"text": "the bathroom"},
  {"text": "my bag"}
]
```

Unsafe values:

```text
my homework
my lunch
my teeth
my book
```

Expected density:

```text
4–8 safe substitutions per frame
```

## Low-Density Chunks

These have very few natural substitutions.

Example:

```text
I brush {object}.
```

Safe values:

```json
[
  {"text": "my teeth"},
  {"text": "my hair"}
]
```

Unsafe values:

```text
my room
my bag
the table
my homework
```

Expected density:

```text
2–3 safe substitutions per frame
```

Low-density slots are still valuable, but they should not be artificially inflated.

## Paired-Only Chunks

These cannot be freely substituted.

They must be paired.

Examples:

```text
I {action} because {reason}.
I {action} {time}.
Can I {action} {condition}?
It takes {duration} to {task}.
```

Bad free combinations:

```text
I drink water because I am sleepy.
I brush my teeth because I am hungry.
Can I go to school after dinner?
It takes five minutes to finish all my homework.
```

Good paired examples:

```json
[
  {
    "action": "drink water",
    "reason": "I am thirsty"
  },
  {
    "action": "brush my teeth",
    "reason": "I want clean teeth"
  },
  {
    "action": "clean my room",
    "reason": "it is messy"
  }
]
```

## Design Principle

Phase 4C should not simply increase sentence count.

It should create drill groups.

A useful FSI drill group looks like:

```text
Drill frame: I have {item}.

I have my book.
I have my bag.
I have my lunch.
I have my homework.
I have my pencil case.
I have my water bottle.
I have my key.
I have my notebook.
```

This is more valuable than a scattered set of unrelated sentences.

## Verb Core FSI Grid

Phase 4C should not be understood as only adding more individual sentences.

It should also not be understood as only adding clause expansion.

The target model is:

```text
FSI = horizontal substitution density + vertical expansion ladder
```

A Daily Routine verb core should support two dimensions.

## 1. Horizontal Substitution Density

Horizontal substitution means many safe replacements inside the same stable frame.

Example:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
I eat rice.
I eat noodles.
I eat bread.
I eat fruit.
```

The frame remains stable:

```text
I eat {food}.
```

Only the chunk changes.

This is the core of FSI.

The learner repeats the same rhythm and grammar while changing one controlled meaning unit.

## 2. Vertical Expansion Ladder

Vertical expansion means the same verb core appears in more complex frames as the level increases.

Example with `eat`:

```text
A1:
I eat breakfast.

A1+:
I eat breakfast in the morning.

A2:
I need to eat breakfast.

A2+:
I eat breakfast because I am hungry.

B1:
Before I go to school, I eat breakfast.
```

This supports spiral learning.

The learner sees the same verb core in increasingly complex grammar.

## Combined Model

The correct Phase 4C model is not:

```text
one verb
one sentence
one level
```

The correct model is:

```text
one verb core
many safe substitutions per level
controlled expansion across levels
```

Example with `clean`:

```text
A1:
I clean my room.
I clean my desk.
I clean the table.

A1+:
I clean my room after school.
I clean my desk after school.
I clean the table after dinner.

A2:
I need to clean my room.
I need to clean my desk.
I have to clean the table.

A2+:
I clean my room because it is messy.
I clean my desk because it is messy.
I clean the table because it is dirty.

B1:
It takes ten minutes to clean my room.
My parents say I have to clean my room.
Before dinner, I clean the table.
```

This is stronger than only adding unrelated new sentences.

## Core Daily Routine Verbs

Daily Routine Phase 4C should gradually build FSI grids for high-frequency verb cores.

Priority verb cores:

```text
eat
drink
pack
take
read
help
make
do
clean
brush
wash
study
watch
listen to
go
get
put on
bring
check
use
```

Not every verb core has the same substitution density.

Some are high-density:

```text
have
pack
bring
check
eat
drink
read
study
```

Some are medium-density:

```text
clean
wash
go
get
put on
help
make
do
```

Some are naturally low-density:

```text
brush
```

Low-density verbs are still useful, but they should not be artificially inflated.

## Verb Core Grid Fields

Each verb core should eventually define:

```text
verb core
base frame
allowed levels
safe object / item / food / drink chunks
safe time chunks
safe place chunks
safe reason pairs
safe condition pairs
unsafe combinations
density target
pattern families
slot groups
```

Example:

```text
verb core: clean

A1 base frame:
I clean {object}.

A1 object chunks:
my room
my desk
the table

A1+ time pairs:
my room + after school
my desk + after school
the table + after dinner

A2 modal frames:
I need to clean {object}.
I have to clean {object}.

A2+ reason pairs:
my room + it is messy
my desk + it is messy
the table + it is dirty

B1 management frames:
It takes {duration} to clean {object}.
My parents say I have to clean {object}.
```

## Level-Based Expansion Rules

Do not unlock every expansion type at A1.

The level progression should be:

```text
A1:
base frame + horizontal object/item substitution

A1+:
base frame + time/place phrase substitution

A2:
modal/request/question frame substitution

A2+:
because / before / after / condition expansion with paired chunks

B1:
routine-management and multi-slot controlled frames
```

This means clauses can appear later, but substitution density should exist at every level where the verb core is active.

## Density Targets by Level

Approximate targets:

```text
A1:
3-8 safe substitutions per active verb core

A1+:
3-6 safe time/place paired substitutions per active verb core

A2:
3-6 modal/request/question substitutions per active verb core

A2+:
3-5 reason/sequence paired substitutions per active verb core

B1:
2-4 routine-management substitutions per active verb core
```

These are targets, not hard rules.

Semantic quality is more important than raw count.

## Example: eat FSI Grid

The `eat` verb core should not only appear as one sentence.

It can support horizontal and vertical FSI.

A1:

```text
I eat breakfast.
I eat lunch.
I eat dinner.
I eat rice.
I eat noodles.
I eat bread.
I eat fruit.
```

A1+:

```text
I eat breakfast in the morning.
I eat lunch at school.
I eat dinner in the evening.
I eat fruit after school.
```

A2:

```text
I need to eat breakfast.
I want to eat lunch.
Can I eat lunch here?
What time do you eat dinner?
```

A2+:

```text
I eat breakfast because I am hungry.
I eat lunch because I need energy.
I eat dinner after I finish my homework.
I eat fruit because it is healthy.
```

B1:

```text
I usually eat breakfast at seven.
It takes ten minutes to eat breakfast.
Before I go to school, I eat breakfast.
After I finish my homework, I eat dinner.
```

Implementation note:

`eat` may overlap with Food & Drink.

Daily Routine should only use routine-safe eat frames.

Food & Drink may later own broader food-specific chunk density.

## Example: drink FSI Grid

A1:

```text
I drink water.
I drink milk.
I drink juice.
```

A1+:

```text
I drink water in the morning.
I drink milk at breakfast.
I drink juice after school.
```

A2:

```text
I need to drink water.
Can I drink water here?
I would like to drink water.
```

A2+:

```text
I drink water because I am thirsty.
I drink water after I exercise.
```

B1:

```text
I should drink more water.
I usually drink water after school.
```

Implementation note:

Food & Drink may later own broader drink-specific item density.

Daily Routine should focus on routine-safe hydration frames.

## Example: read FSI Grid

A1:

```text
I read a book.
I read my English book.
I read my notebook.
```

A1+:

```text
I read a book in the evening.
I read my English book after school.
```

A2:

```text
I would like to read a book.
Can I read a book here?
When do you read a book?
```

A2+:

```text
I read a book because it is fun.
I read my English book because I have English class.
```

B1:

```text
After I finish my homework, I read a book.
I sometimes read a book before bed.
```

## Example: pack FSI Grid

A1:

```text
I pack my bag.
I pack my books.
I pack my lunch.
I pack my pencil case.
```

A1+:

```text
I pack my bag before school.
I pack my lunch in the morning.
```

A2:

```text
I need to pack my bag.
I have to pack my lunch.
```

A2+:

```text
I pack my bag because I need my books.
I pack my lunch because I eat at school.
```

B1:

```text
It takes ten minutes to pack my bag.
My parents say I have to pack my bag before school.
```

## Example: help FSI Grid

A1:

```text
I help my parents.
I help my brother.
I help my sister.
```

A1+:

```text
I help my parents after school.
I help at home after dinner.
```

A2:

```text
I need to help my parents.
I have to help at home.
```

A2+:

```text
I help my brother because he needs help.
I help my sister because she needs help.
I help my parents because they are busy.
```

B1:

```text
I often help my parents after dinner.
My parents say I have to help at home.
```

## Cleanup Principle

When a sentence feels too difficult for a lower level, do not automatically delete the chunk.

Prefer one of these actions:

```text
move it to a higher level
use it in a more appropriate frame
split it into a separate slot group
pair it with a safer time/reason chunk
reduce its count
```

Example:

```text
I clean the kitchen.
```

This may be heavy for A1, but it can work in A1+ or B1:

```text
I clean the kitchen after dinner.
It takes fifteen minutes to clean the kitchen.
```

Therefore, Phase 4C cleanup should not be only deletion.

It should use:

```text
move
split
level-control
frame-control
pairing
```

## Implementation Implication

The current Phase 4C Step 1 and Step 2 implemented only the first wave of FSI chunk substitution.

That is acceptable.

However, later Phase 4C work may add more verb-core grids, especially for:

```text
eat
drink
read
help
make
do
study
watch
listen to
go
take
```

These should be added in small increments with semantic review after each group.

Do not add all verb grids at once.

## Relationship to Food & Drink

Some verb cores overlap with Food & Drink.

Examples:

```text
eat
drink
want
would like
have
```

Daily Routine should only include routine-safe uses.

Food & Drink should later carry broader food-specific FSI density, such as:

```text
I want {food}.
Can I have {drink}, please?
I would like {food}.
Do you have {food}?
```

Avoid duplicating full Food & Drink scope inside Daily Routine.

## Relationship to Shopping

Some verb cores overlap with Shopping.

Examples:

```text
want
take
get
have
use
check
```

Daily Routine should only include daily-life or school-life meanings.

Shopping should own consumer-interaction meanings such as:

```text
I want this shirt.
Can I try this on?
Can I pay by card?
Do you have this in blue?
```

## Completion Criteria Addendum

Phase 4C should be considered stronger when:

```text
1. Core verbs have visible substitution density.
2. The same verb core appears across multiple levels where appropriate.
3. Each level has safe horizontal substitutions.
4. Later levels add controlled expansion rather than random complexity.
5. Semantic cleanup moves or splits chunks instead of deleting useful material blindly.
6. Food & Drink and Shopping overlaps are kept scenario-safe.
```

## Current Limitation

Many current Daily Routine slots are full action chunks:

```text
clean my room
brush my teeth
pack my bag
have my book
```

This is safe, but it limits drill density.

Phase 4C should add micro-slot patterns such as:

```text
I clean {object}.
I brush {object}.
I wash {object}.
I have {item}.
I pack {item}.
I check {item}.
I get {item}.
I bring {item}.
```

These patterns make the substitution target visible and repeatable.

## Phase 4C Scope

Phase 4C should add controlled FSI drill patterns from A1 through B1.

It should not replace all existing patterns.

It should add targeted FSI-dense pattern families.

## A1 Phase 4C Patterns

A1 should receive the highest chunk-substitution density because A1 benefits most from short frame drills.

Recommended new pattern families:

```text
ROUTINE_HAVE_ITEM_FSI
ROUTINE_CLEAN_OBJECT
ROUTINE_BRUSH_OBJECT
ROUTINE_WASH_OBJECT
ROUTINE_PACK_ITEM
ROUTINE_GET_ITEM
```

## ROUTINE_HAVE_ITEM_FSI

Frame:

```text
I have {item}.
```

Purpose:

High-density item substitution.

Examples:

```text
I have my book.
I have my bag.
I have my lunch.
I have my homework.
I have my pencil case.
I have my water bottle.
I have my notebook.
```

Slot group:

```text
routine_have_items_fsi
```

Density:

```text
High
```

Notes:

This overlaps with `ROUTINE_HAVE_ITEM`.

The implementation must decide whether to:

```text
expand ROUTINE_HAVE_ITEM
```

or:

```text
add ROUTINE_HAVE_ITEM_FSI
```

Preferred for traceability:

```text
add ROUTINE_HAVE_ITEM_FSI
```

because Phase 4C should be measurable.

## ROUTINE_CLEAN_OBJECT

Frame:

```text
I clean {object}.
```

Examples:

```text
I clean my room.
I clean my desk.
I clean the table.
I clean the kitchen.
I clean the bathroom.
```

Slot group:

```text
routine_clean_objects
```

Density:

```text
Medium
```

## ROUTINE_BRUSH_OBJECT

Frame:

```text
I brush {object}.
```

Examples:

```text
I brush my teeth.
I brush my hair.
```

Slot group:

```text
routine_brush_objects
```

Density:

```text
Low
```

## ROUTINE_WASH_OBJECT

Frame:

```text
I wash {object}.
```

Examples:

```text
I wash my hands.
I wash my face.
I wash the dishes.
```

Slot group:

```text
routine_wash_objects
```

Density:

```text
Low to medium
```

## ROUTINE_PACK_ITEM

Frame:

```text
I pack {item}.
```

Examples:

```text
I pack my bag.
I pack my books.
I pack my lunch.
I pack my pencil case.
```

Slot group:

```text
routine_pack_items
```

Density:

```text
Medium
```

## ROUTINE_GET_ITEM

Frame:

```text
I get {item}.
```

Examples:

```text
I get my books.
I get my lunch.
I get my pencil case.
I get my water bottle.
```

Slot group:

```text
routine_get_items
```

Density:

```text
Medium
```

## A1+ Phase 4C Patterns

A1+ should add simple time chunks while keeping controlled action-object compatibility.

Recommended new pattern families:

```text
ROUTINE_CLEAN_OBJECT_TIME
ROUTINE_PACK_ITEM_TIME
ROUTINE_PUT_ON_ITEM_TIME
ROUTINE_WASH_OBJECT_TIME
```

## ROUTINE_CLEAN_OBJECT_TIME

Frame:

```text
I clean {object} {time}.
```

Examples:

```text
I clean my room after school.
I clean my desk after school.
I clean the table after dinner.
```

Recommended paired slot:

```text
routine_clean_object_time_pairs
```

Reason:

Not every clean object pairs naturally with every time phrase.

## ROUTINE_PACK_ITEM_TIME

Frame:

```text
I pack {item} {time}.
```

Examples:

```text
I pack my bag before school.
I pack my lunch in the morning.
I pack my pencil case before school.
```

Recommended paired slot:

```text
routine_pack_item_time_pairs
```

## ROUTINE_PUT_ON_ITEM_TIME

Frame:

```text
I put on {item} {time}.
```

Examples:

```text
I put on my shoes before school.
I put on my jacket in the morning.
I put on my school uniform before school.
```

Recommended paired slot:

```text
routine_put_on_item_time_pairs
```

## ROUTINE_WASH_OBJECT_TIME

Frame:

```text
I wash {object} {time}.
```

Examples:

```text
I wash my face in the morning.
I wash my hands before dinner.
I wash the dishes after dinner.
```

Recommended paired slot:

```text
routine_wash_object_time_pairs
```

## A2 Phase 4C Patterns

A2 should use modals, requests, forgot, and simple item substitution.

Recommended new pattern families:

```text
ROUTINE_NEED_BRING_ITEM
ROUTINE_FORGOT_ITEM_FSI
ROUTINE_CAN_USE_ITEM_HERE
ROUTINE_HAVE_TO_PACK_ITEM
ROUTINE_NEED_CLEAN_OBJECT
```

## ROUTINE_NEED_BRING_ITEM

Frame:

```text
I need to bring {item}.
```

Examples:

```text
I need to bring my book.
I need to bring my homework.
I need to bring my lunch.
I need to bring my water bottle.
```

Slot group:

```text
routine_bring_items
```

Density:

```text
High
```

## ROUTINE_FORGOT_ITEM_FSI

Frame:

```text
I forgot {item}.
```

Examples:

```text
I forgot my book.
I forgot my homework.
I forgot my lunch.
I forgot my water bottle.
```

Slot group:

```text
routine_forgot_items_fsi
```

Note:

`forgot` is allowed only as a fixed classroom / daily-life expression.

Do not expand general past tense.

## ROUTINE_CAN_USE_ITEM_HERE

Frame:

```text
Can I use {item} here?
```

Examples:

```text
Can I use my pencil here?
Can I use my book here?
Can I use the computer here?
```

Slot group:

```text
routine_usable_items
```

Density:

```text
Medium
```

## ROUTINE_HAVE_TO_PACK_ITEM

Frame:

```text
I have to pack {item}.
```

Examples:

```text
I have to pack my bag.
I have to pack my lunch.
I have to pack my books.
```

Slot group:

```text
routine_pack_items
```

Density:

```text
Medium
```

## ROUTINE_NEED_CLEAN_OBJECT

Frame:

```text
I need to clean {object}.
```

Examples:

```text
I need to clean my room.
I need to clean my desk.
I need to clean the table.
```

Slot group:

```text
routine_clean_objects
```

Density:

```text
Medium
```

## A2+ Phase 4C Patterns

A2+ should add controlled reason and reminder drills.

Recommended new pattern families:

```text
ROUTINE_CLEAN_OBJECT_REASON
ROUTINE_PACK_ITEM_REASON
ROUTINE_REMIND_BRING_ITEM
ROUTINE_CANNOT_USE_ITEM_REASON
```

## ROUTINE_CLEAN_OBJECT_REASON

Frame:

```text
I clean {object} because {reason}.
```

Examples:

```text
I clean my room because it is messy.
I clean my desk because it is messy.
I clean the table because it is dirty.
```

Recommended paired slot:

```text
routine_clean_object_reason_pairs
```

Reason:

The reason must fit the object.

## ROUTINE_PACK_ITEM_REASON

Frame:

```text
I pack {item} because {reason}.
```

Examples:

```text
I pack my bag because I need my books.
I pack my lunch because I eat at school.
I pack my pencil case because I need my pencils.
```

Recommended paired slot:

```text
routine_pack_item_reason_pairs
```

## ROUTINE_REMIND_BRING_ITEM

Frame:

```text
Please remind me to bring {item}.
```

Examples:

```text
Please remind me to bring my book.
Please remind me to bring my homework.
Please remind me to bring my lunch.
Please remind me to bring my water bottle.
```

Slot group:

```text
routine_bring_items
```

## ROUTINE_CANNOT_USE_ITEM_REASON

Frame:

```text
I cannot use {item} now because {reason}.
```

Examples:

```text
I cannot use the computer now because I have to study.
I cannot use my phone now because I have homework.
```

Recommended paired slot:

```text
routine_cannot_use_item_reason_pairs
```

## B1 Phase 4C Patterns

B1 should use routine-management frames with chunk substitution.

Recommended new pattern families:

```text
ROUTINE_TIME_TAKES_CLEAN_OBJECT
ROUTINE_BEFORE_LEAVE_CHECK_ITEM
ROUTINE_PARENT_RULE_CLEAN_OBJECT
ROUTINE_AFTER_FINISH_ACTIVITY_FSI
```

## ROUTINE_TIME_TAKES_CLEAN_OBJECT

Frame:

```text
It takes {duration} to clean {object}.
```

Examples:

```text
It takes ten minutes to clean my room.
It takes five minutes to clean my desk.
It takes fifteen minutes to clean the kitchen.
```

Recommended paired slot:

```text
routine_time_takes_clean_object_pairs
```

## ROUTINE_BEFORE_LEAVE_CHECK_ITEM

Frame:

```text
Before I leave home, I check {item}.
```

Examples:

```text
Before I leave home, I check my bag.
Before I leave home, I check my homework.
Before I leave home, I check my lunch.
Before I leave home, I check my water bottle.
```

Slot group:

```text
routine_check_items
```

## ROUTINE_PARENT_RULE_CLEAN_OBJECT

Frame:

```text
My parents say I have to clean {object}.
```

Examples:

```text
My parents say I have to clean my room.
My parents say I have to clean my desk.
My parents say I have to clean the table.
```

Slot group:

```text
routine_clean_objects
```

## ROUTINE_AFTER_FINISH_ACTIVITY_FSI

Frame:

```text
After I finish {task}, I {activity}.
```

Examples:

```text
After I finish my homework, I watch TV.
After I finish my homework, I read a book.
After I finish my homework, I listen to music.
After I finish my chores, I take a break.
```

Recommended paired slot:

```text
routine_after_finish_activity_pairs_fsi
```

## Proposed Slot Groups

Phase 4C should add or extend these slot groups.

## Item Slots

```text
routine_have_items_fsi
routine_bring_items
routine_forgot_items_fsi
routine_check_items
routine_usable_items
routine_pack_items
routine_get_items
```

## Object Slots

```text
routine_clean_objects
routine_brush_objects
routine_wash_objects
```

## Paired Slots

```text
routine_clean_object_time_pairs
routine_pack_item_time_pairs
routine_put_on_item_time_pairs
routine_wash_object_time_pairs
routine_clean_object_reason_pairs
routine_pack_item_reason_pairs
routine_cannot_use_item_reason_pairs
routine_time_takes_clean_object_pairs
routine_after_finish_activity_pairs_fsi
```

## Slot Safety Rules

## 1. Verb-specific object slots are mandatory

Bad:

```text
I brush my room.
I clean my homework.
I wash my book.
```

Good:

```text
I brush my teeth.
I clean my room.
I wash my hands.
```

## 2. High-density item slots can be broad but still school-life safe

Good:

```text
my book
my bag
my lunch
my homework
my pencil case
my water bottle
my notebook
```

Risky:

```text
my money
my phone
my toy gun
```

Avoid items that may create safety, policy, or age-appropriateness issues.

## 3. Time and reason chunks must usually be paired

Bad:

```text
I pack my lunch at night.
I wash my hands after I get home because I need my books.
```

Good:

```text
I pack my lunch in the morning.
I wash my hands before dinner.
I pack my bag because I need my books.
```

## 4. Do not duplicate Phase 4B unless needed for drill grouping

Some Phase 4C sentences may duplicate Phase 4B targets.

The generator has global uniqueness behavior, so duplicated targets may be skipped.

To make Phase 4C measurable, prefer either:

```text
slightly distinct pattern frames
```

or:

```text
larger non-overlapping slot pools
```

Example:

Phase 4B already has:

```text
I have my book.
```

Phase 4C may still include:

```text
ROUTINE_HAVE_ITEM_FSI
```

but generated output may skip duplicate targets if identical.

This is acceptable only if enough new targets remain.

## 5. Avoid hidden grammar expansion

Phase 4C should not introduce:

```text
he / she / they subject variation
past tense
future tense
present perfect
comparatives
superlatives
paragraphs
dialogues
```

Those are later phases.

## FSI Metadata

Most current patterns use:

```json
"fsi_rules": []
```

Phase 4C should consider adding basic metadata.

Example:

```json
"fsi_rules": [
  {
    "type": "chunk_substitution",
    "slot": "item",
    "label": "item substitution"
  }
]
```

However, Phase 4C implementation may proceed in two possible modes.

## Mode A: Sentence-Bank FSI Only

Add slots and patterns.

Keep:

```json
"fsi_rules": []
```

Pros:

```text
minimum generator risk
consistent with current system
fast implementation
```

Cons:

```text
UI may not know which slot is the FSI target
FSI drill grouping may require inference from pattern_id
```

## Mode B: Add FSI Metadata

Add `fsi_rules` metadata to Phase 4C patterns.

Pros:

```text
clear drill target
future UI support
better traceability
```

Cons:

```text
may require test updates
may require generator review
unknown if current UI reads fsi_rules
```

Recommendation:

```text
Implement Phase 4C initially as Mode A.
Add fsi_rules metadata later only after inspecting generator and UI behavior.
```

## Expected Count Targets

Approximate added sentence counts:

```text
A1: +35–55
A1+: +25–40
A2: +35–55
A2+: +25–40
B1: +20–35
Total: +140–225
```

After Phase 4B, Daily Routine is approximately 360 sentences.

After Phase 4C, Daily Routine should target:

```text
500–585 sentences
```

This target is approximate.

Semantic quality is more important than total count.

## Implementation Files

Phase 4C implementation should eventually modify:

```text
data/slot_bank/daily_routine_slots.json
data/pattern_bank/daily_routine_patterns.json
scripts/generate_sentences.py
data/generated/daily_routine_sentence_bank.json
tests/test_content_generator.py
```

But this document creation step modifies none of them.

## Implementation Order

Use small commits.

## Step 1: Add Phase 4C Slots

Modify:

```text
data/slot_bank/daily_routine_slots.json
```

Add only Phase 4C slot groups.

Do not modify patterns yet.

Run:

```powershell
python -m json.tool data/slot_bank/daily_routine_slots.json | Out-Null
```

## Step 2: Add Phase 4C Patterns

Modify:

```text
data/pattern_bank/daily_routine_patterns.json
```

Add Phase 4C patterns.

Do not modify generator logic.

Run:

```powershell
python -m json.tool data/pattern_bank/daily_routine_patterns.json | Out-Null
```

## Step 3: Add Count Overrides

Modify:

```text
scripts/generate_sentences.py
```

Add Phase 4C `ROUTINE_*` count overrides to existing `COUNT_BY_PATTERN_LEVEL`.

Do not create a second count map.

Run:

```powershell
python -m py_compile scripts/generate_sentences.py
```

## Step 4: Regenerate Daily Routine Bank

Run:

```powershell
python scripts/generate_sentences.py --scenario daily_routine
```

Expected output:

```text
data/generated/daily_routine_sentence_bank.json
```

## Step 5: Five-Level Semantic Review

Review:

```text
A1
A1+
A2
A2+
B1
```

Check:

```text
FSI drill density
verb-object compatibility
time compatibility
reason compatibility
no third-person subject expansion
no general past tense
no paragraph output
no dialogue output
no strange object substitution
```

## Step 6: Add Tests

Modify:

```text
tests/test_content_generator.py
```

Add Phase 4C tests for:

```text
expected Phase 4C patterns exist
high-density item substitution coverage
no bad clean/brush/wash combinations
no uncontrolled past tense
no third-person subject expansion
no duplicate-risk regressions where avoidable
level coverage remains valid
count lower bound increases
```

## Proposed Count Overrides

Suggested count overrides:

```python
    # Daily Routine Phase 4C A1
    ("ROUTINE_HAVE_ITEM_FSI", "A1"): 14,
    ("ROUTINE_CLEAN_OBJECT", "A1"): 8,
    ("ROUTINE_BRUSH_OBJECT", "A1"): 3,
    ("ROUTINE_WASH_OBJECT", "A1"): 5,
    ("ROUTINE_PACK_ITEM", "A1"): 6,
    ("ROUTINE_GET_ITEM", "A1"): 6,

    # Daily Routine Phase 4C A1+
    ("ROUTINE_CLEAN_OBJECT_TIME", "A1+"): 8,
    ("ROUTINE_PACK_ITEM_TIME", "A1+"): 8,
    ("ROUTINE_PUT_ON_ITEM_TIME", "A1+"): 6,
    ("ROUTINE_WASH_OBJECT_TIME", "A1+"): 6,

    # Daily Routine Phase 4C A2
    ("ROUTINE_NEED_BRING_ITEM", "A2"): 10,
    ("ROUTINE_FORGOT_ITEM_FSI", "A2"): 12,
    ("ROUTINE_CAN_USE_ITEM_HERE", "A2"): 8,
    ("ROUTINE_HAVE_TO_PACK_ITEM", "A2"): 8,
    ("ROUTINE_NEED_CLEAN_OBJECT", "A2"): 8,

    # Daily Routine Phase 4C A2+
    ("ROUTINE_CLEAN_OBJECT_REASON", "A2+"): 8,
    ("ROUTINE_PACK_ITEM_REASON", "A2+"): 8,
    ("ROUTINE_REMIND_BRING_ITEM", "A2+"): 10,
    ("ROUTINE_CANNOT_USE_ITEM_REASON", "A2+"): 6,

    # Daily Routine Phase 4C B1
    ("ROUTINE_TIME_TAKES_CLEAN_OBJECT", "B1"): 8,
    ("ROUTINE_BEFORE_LEAVE_CHECK_ITEM", "B1"): 10,
    ("ROUTINE_PARENT_RULE_CLEAN_OBJECT", "B1"): 6,
    ("ROUTINE_AFTER_FINISH_ACTIVITY_FSI", "B1"): 8,
```

Actual output may be lower because duplicate target sentences are skipped.

## Test Ideas

Future tests should include:

```python
def test_daily_routine_phase4c_expected_patterns_exist():
    expected = {
        "ROUTINE_HAVE_ITEM_FSI",
        "ROUTINE_CLEAN_OBJECT",
        "ROUTINE_BRUSH_OBJECT",
        "ROUTINE_WASH_OBJECT",
        "ROUTINE_PACK_ITEM",
        "ROUTINE_GET_ITEM",
        "ROUTINE_CLEAN_OBJECT_TIME",
        "ROUTINE_PACK_ITEM_TIME",
        "ROUTINE_PUT_ON_ITEM_TIME",
        "ROUTINE_WASH_OBJECT_TIME",
        "ROUTINE_NEED_BRING_ITEM",
        "ROUTINE_FORGOT_ITEM_FSI",
        "ROUTINE_CAN_USE_ITEM_HERE",
        "ROUTINE_HAVE_TO_PACK_ITEM",
        "ROUTINE_NEED_CLEAN_OBJECT",
        "ROUTINE_CLEAN_OBJECT_REASON",
        "ROUTINE_PACK_ITEM_REASON",
        "ROUTINE_REMIND_BRING_ITEM",
        "ROUTINE_CANNOT_USE_ITEM_REASON",
        "ROUTINE_TIME_TAKES_CLEAN_OBJECT",
        "ROUTINE_BEFORE_LEAVE_CHECK_ITEM",
        "ROUTINE_PARENT_RULE_CLEAN_OBJECT",
        "ROUTINE_AFTER_FINISH_ACTIVITY_FSI",
    }
```

Semantic guard ideas:

```python
def test_daily_routine_no_bad_brush_objects():
    bad = [
        "I brush my room",
        "I brush my bag",
        "I brush the table",
    ]


def test_daily_routine_no_bad_clean_objects():
    bad = [
        "I clean my homework",
        "I clean my lunch",
        "I clean my teeth",
    ]


def test_daily_routine_no_bad_wash_objects():
    bad = [
        "I wash my book",
        "I wash my homework",
        "I wash my pencil case",
    ]
```

FSI density ideas:

```python
def test_daily_routine_have_item_fsi_density():
    # Expect several distinct targets for the same frame.
    # Exact count should remain flexible.
    pass


def test_daily_routine_check_item_fsi_density():
    # Before I leave home, I check {item}.
    pass
```

## Completion Criteria

Phase 4C is complete when:

```text
1. Phase 4C slots are added.
2. Phase 4C patterns are added.
3. Phase 4C count overrides are added.
4. daily_routine_sentence_bank.json is regenerated.
5. Generated output includes all Phase 4C pattern families unless skipped by documented duplicate behavior.
6. FSI drill density visibly improves.
7. Five-level semantic review passes.
8. Tests pass.
9. No third-person subject expansion is introduced.
10. No general past tense expansion is introduced.
11. No paragraph or dialogue output is introduced.
12. No bad verb-object substitutions are introduced.
```

## Recommended Commit Sequence

Use small commits:

```bash
git add docs/daily_routine_phase4c_fsi_chunk_substitution_plan.md
git commit -m "docs: add daily routine phase 4c fsi plan"

git add data/slot_bank/daily_routine_slots.json
git commit -m "data: add daily routine phase 4c slots"

git add data/pattern_bank/daily_routine_patterns.json
git commit -m "data: add daily routine phase 4c patterns"

git add scripts/generate_sentences.py
git commit -m "scripts: add daily routine phase 4c counts"

git add data/generated/daily_routine_sentence_bank.json
git commit -m "data: regenerate daily routine sentence bank with phase 4c"

git add tests/test_content_generator.py
git commit -m "test: add daily routine phase 4c checks"
```

Do not include unrelated untracked local note files.

Do not include temporary level-split `.txt` review files unless the project explicitly stores them.

## Status

Planned.
