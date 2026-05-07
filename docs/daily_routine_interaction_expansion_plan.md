# Daily Routine Interaction Expansion Plan

## Status

Planned.

This document defines the next expansion direction for Daily Routine after the initial A1–B1 sentence-bank implementation.

The current Daily Routine v1 is a conservative sentence-bank implementation.

This expansion plan is intended to move Daily Routine toward interaction completeness comparable to Shopping, while preserving semantic control and FSI-style substitution.

This is a planning document only.

It does not change slot banks, pattern banks, generated sentence data, generator code, application code, or tests.

## Goal

Shopping completeness is based on consumer interaction:

- asking price
- asking availability
- trying items
- asking location
- paying
- choosing items
- asking for size
- asking about sales
- asking for receipts
- comparing items
- asking for recommendations
- returning or exchanging items
- describing damage
- asking about warranty, material, and quality

Daily Routine cannot copy these functions directly because it is not a consumer interaction scenario.

Daily Routine completeness should instead mean:

```text
personal routine completeness
school-life interaction completeness
home-life interaction completeness
simple schedule-management completeness
```

The goal is to make Daily Routine a complete learner scenario, not merely a list of daily action sentences.

## Core Expansion Principle

Daily Routine should expand through controlled interaction functions.

Do not increase quantity by blindly adding broad slots.

Every new pattern should answer one of these questions:

```text
What real daily-life function does this sentence support?
What level is it appropriate for?
What slots does it need?
Does it require paired slots?
Can it stay sentence-level and FSI-compatible?
```

Daily Routine should continue to follow:

```text
pattern + slot + level + context
```

FSI-style substitution remains the main generation model.

However, higher-level interaction patterns must use more restrictive slots or paired slots.

## Current Daily Routine Coverage

The current Daily Routine implementation covers these core pattern families:

```text
ROUTINE_DO
ROUTINE_BE_STATE
ROUTINE_PLACE
ROUTINE_DO_TIME
ROUTINE_LIKE
ROUTINE_WANT
ROUTINE_BE_STATE_TODAY
ROUTINE_NEED
ROUTINE_HAVE_TO
ROUTINE_WOULD_LIKE
ROUTINE_CAN_PLACE
ROUTINE_TOO
ROUTINE_REASON
ROUTINE_BEFORE_AFTER
ROUTINE_PREFERENCE_REASON
ROUTINE_PROBLEM_REASON
ROUTINE_USUALLY
ROUTINE_CLOCK_TIME
ROUTINE_WEEKDAY_WEEKEND
ROUTINE_CANNOT_BECAUSE
ROUTINE_FINISH_BEFORE
ROUTINE_ROUTINE_OPINION
```

This is a useful foundation.

However, it is still smaller than Shopping because it has fewer interaction functions and smaller paired-slot pools.

## Why Daily Routine Is Currently Smaller Than Shopping

Daily Routine is smaller for four main reasons.

## 1. It is still conservative v1

The first Daily Routine implementation intentionally focused on semantic safety.

It avoided:

```text
third person
past tense
long sequences
paragraph writing
dialogues
open-ended planning
complex schedule descriptions
```

This made the initial version safer but smaller.

## 2. Many Daily Routine patterns require paired slots

Daily Routine has high semantic risk when time, place, reason, or sequence is involved.

Bad examples to avoid:

```text
I go to bed in the morning.
Can I go home here?
I brush my teeth because I am hungry.
I do my homework because I am thirsty.
```

Therefore, many Daily Routine patterns use paired slots.

If a paired slot group has only 4–7 entries, the generator can only produce 4–7 unique targets.

## 3. Daily Routine currently has fewer interaction functions

Shopping includes more real-world interaction functions such as payment, returns, size, receipts, recommendations, comparison, warranty, and material.

Daily Routine currently focuses more on statements than interactions.

Daily Routine needs more functions such as:

```text
asking about routine
asking what someone does
asking when someone does something
asking for permission
asking for help
saying someone is ready
saying someone is late
saying someone forgot something
describing chores
describing school preparation
describing after-school plans
describing simple rules
describing schedule conflicts
```

## 4. Daily Routine has limited FSI task logic

Current Daily Routine patterns are FSI-style substitution patterns, but most have:

```json
"fsi_rules": []
```

This is acceptable for sentence-bank generation.

However, if the UI needs explicit FSI task objects such as negative, question, or substitution tasks, later work may need to extend generator support for `ROUTINE_*` task logic.

This should not block the interaction expansion.

## Target Completeness

A more complete Daily Routine bank should aim for approximately:

```text
A1–B1 pattern families: 35–45
A1–B1 generated sentences: 450–650
```

This target is approximate.

Semantic quality is more important than matching Shopping sentence counts exactly.

## Expansion Layers

Daily Routine should expand in layers.

## Layer 1: Core Routine Foundation

Already mostly implemented.

Functions:

```text
say daily actions
say states
say places
say when actions happen
say likes and wants
say needs and obligations
ask simple permission
describe simple problems
give reasons
describe before/after sequence
use frequency
use clock time
contrast weekdays and weekends
describe simple conflicts
describe routine opinions
```

## Layer 2: School-Life and Home-Life Interaction

This is the main missing layer.

Functions:

```text
ask about routines
ask about time
ask what someone does
ask when someone does something
ask for permission
ask for help
describe chores
describe preparation
describe being ready
describe being late
describe forgetting something
give reminders
describe parent or school rules
describe after-school plans
```

This layer should be prioritized before adding third person or past tense.

## Layer 3: B1 Routine Management

Functions:

```text
compare routines
describe time needed
describe attempts
give advice using should
describe simple rules
describe simple weekend plans
describe what happens before leaving home
describe what happens after finishing homework
describe simple schedule conflicts
```

This layer should remain sentence-level in the first expansion.

Do not turn it into paragraph or dialogue generation.

## Items Not Recommended for This Expansion

Do not add these in the first interaction expansion:

```text
third-person routine descriptions
past tense routine descriptions
full paragraph writing
dialogue banks
complex when clauses
weekly calendar planning
advanced habit discussion
rarely / hardly ever / twice a week
full family routine descriptions
```

Reason:

These add new grammar dimensions or new task types.

They should be separate future expansions.

## Recommended Expansion Roadmap

## Phase A: Slot Pool Expansion

Purpose:

Increase the number of semantically safe FSI substitutions without adding many new grammar structures.

Modify later:

```text
data/slot_bank/daily_routine_slots.json
data/pattern_bank/daily_routine_patterns.json
scripts/generate_sentences.py
```

Do not generate final data until review passes.

Recommended slot additions:

```text
routine_like_actions
routine_need_actions
routine_have_to_actions
routine_would_like_actions
routine_school_preparation_actions
routine_chore_actions
routine_help_actions
routine_permission_actions
routine_ready_for_pairs
routine_late_for_pairs
routine_forgot_items
routine_reminder_pairs
routine_after_school_plan_pairs
routine_parent_rule_pairs
routine_time_takes_pairs
routine_compare_pairs
routine_should_pairs
routine_try_to_pairs
routine_before_leave_pairs
routine_after_finish_pairs
```

## Phase B: Existing Pattern Cleanup

Purpose:

Improve semantic precision in existing patterns.

Recommended changes:

```text
ROUTINE_LIKE should use routine_like_actions.
ROUTINE_NEED should use routine_need_actions.
ROUTINE_HAVE_TO should use routine_have_to_actions.
ROUTINE_WOULD_LIKE should use routine_would_like_actions.
ROUTINE_CAN_PLACE should remain restricted to routine_here_actions.
ROUTINE_WANT should remain restricted to routine_want_actions.
```

Do not go back to broad action slots for all modal patterns.

## Phase C: Interaction Pattern Expansion

Purpose:

Add Daily Routine-specific interaction patterns.

New pattern families should be added to:

```text
data/pattern_bank/daily_routine_patterns.json
```

Do not split pattern files by level.

## Phase D: Count Override Expansion

Purpose:

Add new `ROUTINE_*` counts to the centralized count map.

Modify later:

```text
scripts/generate_sentences.py
```

All new count overrides should go into the existing:

```text
COUNT_BY_PATTERN_LEVEL
```

Do not create a second count system.

## Phase E: Generation and Semantic Review

Purpose:

Generate a larger Daily Routine sentence bank and review by level.

Output:

```text
data/generated/daily_routine_sentence_bank.json
```

Required review:

```text
A1 semantic review
A1+ semantic review
A2 semantic review
A2+ semantic review
B1 semantic review
pattern coverage review
level coverage review
bad-pair review
sentence-count review
```

## Phase F: Tests

Purpose:

Extend existing tests.

Preferred initial target:

```text
tests/test_content_generator.py
```

If Daily Routine tests become too long, move semantic-only tests later to:

```text
tests/test_daily_routine_semantics.py
```

Do not create a separate data-loading system.

## Proposed New Pattern Families by Level

## A1 Expansion

Current A1:

```text
ROUTINE_DO
ROUTINE_BE_STATE
ROUTINE_PLACE
```

Recommended new A1 patterns:

```text
ROUTINE_HAVE_ITEM
ROUTINE_READY
ROUTINE_SIMPLE_TIME
```

Functions:

```text
say what item someone has
say readiness
say simple time of day
```

Examples:

```text
I have my bag.
I have my book.
I am ready.
It is morning.
It is night.
```

Slot groups needed:

```text
routine_simple_items
routine_simple_times
```

Count guidance:

```python
("ROUTINE_HAVE_ITEM", "A1"): 10
("ROUTINE_READY", "A1"): 4
("ROUTINE_SIMPLE_TIME", "A1"): 4
```

## A1+ Expansion

Current A1+:

```text
ROUTINE_DO_TIME
ROUTINE_LIKE
ROUTINE_WANT
ROUTINE_BE_STATE_TODAY
```

Recommended new A1+ patterns:

```text
ROUTINE_PACK
ROUTINE_HELP_SIMPLE
ROUTINE_CHORE_SIMPLE
ROUTINE_PUT_ON
```

Functions:

```text
describe school preparation
describe simple helping
describe simple chores
describe getting dressed or ready
```

Examples:

```text
I pack my bag.
I help my parents.
I clean my room.
I put on my shoes.
```

Slot groups needed:

```text
routine_school_preparation_actions
routine_help_actions
routine_chore_actions
routine_put_on_items
```

Count guidance:

```python
("ROUTINE_PACK", "A1+"): 6
("ROUTINE_HELP_SIMPLE", "A1+"): 6
("ROUTINE_CHORE_SIMPLE", "A1+"): 8
("ROUTINE_PUT_ON", "A1+"): 5
```

## A2 Expansion

Current A2:

```text
ROUTINE_NEED
ROUTINE_HAVE_TO
ROUTINE_WOULD_LIKE
ROUTINE_CAN_PLACE
ROUTINE_TOO
```

Recommended new A2 patterns:

```text
ROUTINE_ASK_TIME
ROUTINE_ASK_WHAT_DO
ROUTINE_ASK_WHEN_DO
ROUTINE_READY_FOR
ROUTINE_LATE_FOR
ROUTINE_FORGOT
ROUTINE_PERMISSION
```

Functions:

```text
ask about routine time
ask what someone does
ask when someone does something
say ready for school or bed
say late for school or class
say forgot an item or task
ask permission for a simple routine activity
```

Examples:

```text
What time do you get up?
What do you do after school?
When do you do your homework?
I am ready for school.
I am late for school.
I forgot my homework.
Can I watch TV after homework?
```

Slot groups needed:

```text
routine_ask_time_pairs
routine_ask_what_contexts
routine_ask_when_pairs
routine_ready_for_pairs
routine_late_for_pairs
routine_forgot_items
routine_permission_pairs
```

Count guidance:

```python
("ROUTINE_ASK_TIME", "A2"): 6
("ROUTINE_ASK_WHAT_DO", "A2"): 6
("ROUTINE_ASK_WHEN_DO", "A2"): 6
("ROUTINE_READY_FOR", "A2"): 6
("ROUTINE_LATE_FOR", "A2"): 6
("ROUTINE_FORGOT", "A2"): 8
("ROUTINE_PERMISSION", "A2"): 8
```

## A2+ Expansion

Current A2+:

```text
ROUTINE_REASON
ROUTINE_BEFORE_AFTER
ROUTINE_PREFERENCE_REASON
ROUTINE_PROBLEM_REASON
```

Recommended new A2+ patterns:

```text
ROUTINE_HELP_REASON
ROUTINE_CHORE_REASON
ROUTINE_REMIND
ROUTINE_PERMISSION_REASON
ROUTINE_CANNOT_NOW
```

Functions:

```text
explain helping
explain chores
ask someone to remind me
ask permission with condition
describe cannot-do-now situations
```

Examples:

```text
I help my parents because they are busy.
I clean my room because it is messy.
Please remind me to brush my teeth.
Can I watch TV after I finish my homework?
I cannot play now because I have homework.
```

Slot groups needed:

```text
routine_help_reason_pairs
routine_chore_reason_pairs
routine_reminder_pairs
routine_permission_condition_pairs
routine_cannot_now_pairs
```

Count guidance:

```python
("ROUTINE_HELP_REASON", "A2+"): 8
("ROUTINE_CHORE_REASON", "A2+"): 8
("ROUTINE_REMIND", "A2+"): 8
("ROUTINE_PERMISSION_REASON", "A2+"): 6
("ROUTINE_CANNOT_NOW", "A2+"): 8
```

## B1 Expansion

Current B1:

```text
ROUTINE_USUALLY
ROUTINE_CLOCK_TIME
ROUTINE_WEEKDAY_WEEKEND
ROUTINE_CANNOT_BECAUSE
ROUTINE_FINISH_BEFORE
ROUTINE_ROUTINE_OPINION
```

Recommended new B1 patterns:

```text
ROUTINE_COMPARE_ROUTINES
ROUTINE_TIME_TAKES
ROUTINE_SHOULD
ROUTINE_TRY_TO
ROUTINE_PARENT_RULE
ROUTINE_WEEKEND_PLAN
ROUTINE_BEFORE_LEAVE
ROUTINE_AFTER_FINISH
```

Functions:

```text
compare routines
describe how long something takes
give simple advice
describe attempts
describe parent rules
describe weekend plans
describe preparation before leaving
describe what happens after finishing homework
```

Examples:

```text
My school day is busier than my weekend.
It takes ten minutes to pack my bag.
I should go to bed earlier.
I try to finish my homework before dinner.
My parents say I have to go to bed early.
I plan to clean my room on Saturday.
Before I leave home, I check my bag.
After I finish my homework, I can watch TV.
```

Slot groups needed:

```text
routine_compare_pairs
routine_time_takes_pairs
routine_should_pairs
routine_try_to_pairs
routine_parent_rule_pairs
routine_weekend_plan_pairs
routine_before_leave_pairs
routine_after_finish_pairs
```

Count guidance:

```python
("ROUTINE_COMPARE_ROUTINES", "B1"): 8
("ROUTINE_TIME_TAKES", "B1"): 8
("ROUTINE_SHOULD", "B1"): 8
("ROUTINE_TRY_TO", "B1"): 8
("ROUTINE_PARENT_RULE", "B1"): 8
("ROUTINE_WEEKEND_PLAN", "B1"): 8
("ROUTINE_BEFORE_LEAVE", "B1"): 8
("ROUTINE_AFTER_FINISH", "B1"): 8
```

## Proposed Slot Groups

Future implementation should add or expand these slot groups.

## `routine_like_actions`

Purpose:

Restrict `I like to ...` to naturally likable actions.

Examples:

```json
[
  {"text": "read a book", "routine_action": true},
  {"text": "drink water", "routine_action": true},
  {"text": "study English", "routine_action": true},
  {"text": "eat breakfast", "routine_action": true},
  {"text": "go home", "routine_action": true},
  {"text": "take a shower", "routine_action": true}
]
```

Avoid:

```text
I like to get up.
I like to brush my teeth.
I like to wash my hands.
```

## `routine_need_actions`

Purpose:

Restrict `I need to ...` to natural needs.

Examples:

```json
[
  {"text": "wash my hands"},
  {"text": "drink water"},
  {"text": "do my homework"},
  {"text": "study English"},
  {"text": "go to bed"},
  {"text": "take a shower"},
  {"text": "brush my teeth"}
]
```

## `routine_have_to_actions`

Purpose:

Restrict `I have to ...` to natural obligations.

Examples:

```json
[
  {"text": "go to school"},
  {"text": "do my homework"},
  {"text": "study English"},
  {"text": "brush my teeth"},
  {"text": "wash my hands"},
  {"text": "pack my bag"},
  {"text": "go to bed"}
]
```

## `routine_would_like_actions`

Purpose:

Restrict `I would like to ...` to natural wants or preferences.

Examples:

```json
[
  {"text": "go home"},
  {"text": "read a book"},
  {"text": "take a shower"},
  {"text": "drink water"},
  {"text": "study English"},
  {"text": "go to bed early"}
]
```

## `routine_school_preparation_actions`

Examples:

```json
[
  {"text": "pack my bag"},
  {"text": "put on my shoes"},
  {"text": "check my homework"},
  {"text": "get my books"}
]
```

## `routine_chore_actions`

Examples:

```json
[
  {"text": "clean my room"},
  {"text": "make my bed"},
  {"text": "wash the dishes"},
  {"text": "take out the trash"}
]
```

## `routine_help_actions`

Examples:

```json
[
  {"text": "help my parents"},
  {"text": "help my brother"},
  {"text": "help my sister"},
  {"text": "help at home"}
]
```

## `routine_permission_pairs`

Examples:

```json
[
  {"action": "watch TV", "condition": "after homework"},
  {"action": "play outside", "condition": "after school"},
  {"action": "read a book", "condition": "before bed"},
  {"action": "use the computer", "condition": "after dinner"}
]
```

## `routine_forgot_items`

Examples:

```json
[
  {"text": "my homework"},
  {"text": "my book"},
  {"text": "my bag"},
  {"text": "my lunch"},
  {"text": "my pencil case"}
]
```

## `routine_time_takes_pairs`

Examples:

```json
[
  {"duration": "ten minutes", "task": "pack my bag"},
  {"duration": "five minutes", "task": "brush my teeth"},
  {"duration": "twenty minutes", "task": "finish my homework"},
  {"duration": "fifteen minutes", "task": "walk to school"}
]
```

## Semantic Risk Controls

Every new expansion pattern must define risk controls.

## 1. Avoid broad action reuse

Bad:

```json
"category": ["routine_actions_to_infinitive"]
```

in every pattern.

Better:

```json
"category": ["routine_need_actions"]
"category": ["routine_have_to_actions"]
"category": ["routine_would_like_actions"]
```

## 2. Use paired slots for context-heavy patterns

Patterns with time, place, reason, deadline, condition, comparison, or duration should usually use paired slots.

Examples:

```text
routine_action_time_pairs
routine_reason_pairs
routine_permission_pairs
routine_time_takes_pairs
routine_compare_pairs
```

## 3. Avoid grammar creep

Do not mix in third person or past tense during this expansion.

Bad for this phase:

```text
My mom gets up at six.
Yesterday, I got up late.
```

These are useful future directions but should be separate expansions.

## 4. Keep sentence-level output

This expansion should not produce paragraphs or dialogues.

Bad for this phase:

```text
First, I get up. Then, I brush my teeth. After that, I eat breakfast.
```

This belongs to a later writing or sequence-flow expansion.

## 5. Keep B1 controlled

B1 can include:

```text
frequency
clock time
weekdays/weekends
simple conflicts
simple comparison
simple advice
simple rules
simple time duration
```

B1 should not include:

```text
full weekly calendar planning
complex habit discussion
long explanation paragraphs
multi-turn dialogue
advanced frequency expressions such as hardly ever
```

## Suggested Count Target

After this expansion, Daily Routine should target approximately:

```text
A1: 60–80 sentences
A1+: 80–110 sentences
A2: 100–130 sentences
A2+: 90–120 sentences
B1: 100–140 sentences
```

Approximate total:

```text
430–580 sentences
```

This should be treated as a target range, not a hard requirement.

Semantic quality remains more important than quantity.

## Review Checklist

## A1 Review

Check:

```text
short sentences
concrete actions
no because
no before/after clauses
no modal complexity
no third person
no past tense
```

## A1+ Review

Check:

```text
safe time phrases
safe like/want actions
simple preparation actions
simple chores
no complex condition clauses
```

## A2 Review

Check:

```text
natural need/have to/would like actions
natural permission requests
natural ready/late/forgot statements
no broad action misuse
```

## A2+ Review

Check:

```text
natural because clauses
natural reminder requests
natural chore/help reasons
natural condition phrases
no paragraph-like output
```

## B1 Review

Check:

```text
natural routine management sentences
natural time duration pairs
natural compare pairs
natural parent-rule sentences
natural before-leave / after-finish sequences
no complex paragraph output
no dialogue output
```

## Test Ideas

Future tests should check:

```python
def test_daily_routine_like_uses_likable_actions(sentences):
    bad_phrases = [
        "I like to get up",
        "I like to brush my teeth",
        "I like to wash my hands",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_phrases)


def test_daily_routine_modal_patterns_do_not_use_bad_actions(sentences):
    bad_phrases = [
        "I would like to get up",
        "I would like to brush my teeth",
        "I have to read a book",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_phrases)


def test_daily_routine_no_third_person_in_v1_expansion(sentences):
    bad_starts = [
        "My mom ",
        "My dad ",
        "My brother ",
        "My sister ",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(s["target_sentence"].startswith(x) for x in bad_starts)


def test_daily_routine_no_past_tense_in_v1_expansion(sentences):
    bad_words = [
        "Yesterday",
        "last night",
        "got up",
        "went to",
        "forgot",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_words)
```

## Completion Criteria

This interaction expansion is ready for implementation only when:

```text
1. The expansion scope is accepted.
2. New pattern families are confirmed by level.
3. New slot groups are confirmed.
4. Risk controls are documented.
5. Count targets are accepted as approximate.
6. Future deferred grammar expansions are clearly separated.
```

Implementation should begin only after this plan is accepted.

## Deferred Future Expansions

Possible future expansions:

```text
Daily Routine Dialogue Bank
Daily Routine Paragraph Writing
Daily Routine Past Tense Extension
Daily Routine Third-Person Family Routine Extension
Daily Routine Weekly Schedule Extension
Daily Routine Habit Discussion Extension
Daily Routine Calendar Planning Extension
```

These should not be mixed into the first interaction expansion.

## Status

Planned.
