# Daily Routine Phase 4B Interaction Patterns Plan

## Status

Planned.

This document defines the executable plan for Daily Routine Phase 4B.

Phase 4B follows:

- `docs/daily_routine_scope.md`
- `docs/daily_routine_v1_implementation_plan.md`
- `docs/daily_routine_interaction_expansion_plan.md`

Phase 4A expanded slot pools and refined existing pattern constraints.

Phase 4B adds new Daily Routine interaction pattern families.

This is a planning document only.

It does not change slot banks, pattern banks, generated sentence data, generator code, application code, or tests.

## Current State

After Phase 4A, Daily Routine is no longer only a minimal sentence bank.

It now has a stronger core routine bank with:

- basic routine actions
- states
- places
- action + time pairs
- like / want / need / have to / would like
- can + here requests
- too + problem statements
- because reasons
- before / after sequence
- frequency
- clock time
- weekday / weekend contrast
- simple conflicts
- finish-before deadlines
- routine opinions

Approximate generated size after Phase 4A:

```text
A1: about 38 sentences
A1+: about 44 sentences
A2: about 38 sentences
A2+: about 38 sentences
B1: about 54 sentences
Total: about 212 sentences
```

This is better than the initial version, but still much smaller than Shopping.

## Why Phase 4B Is Needed

Shopping has broader interaction completeness because it includes many functional families:

```text
price
availability
trying items
payment
looking for items
size
sale
receipt
comparison
recommendation
return
exchange
refund
damage
warranty
quality
material
```

Daily Routine should not copy Shopping’s consumer functions.

Daily Routine needs its own interaction completeness:

```text
asking about routines
asking what someone does
asking when someone does something
getting ready
being late
forgetting something
asking permission
helping at home
doing chores
reminders
cannot-do-now situations
simple rules
time management
routine comparison
before-leaving preparation
after-finishing actions
```

Phase 4B should add these missing interaction functions.

## Goal

The goal of Phase 4B is to move Daily Routine from:

```text
core routine sentence bank
```

toward:

```text
complete daily-life / school-life interaction bank
```

Phase 4B should target approximately:

```text
A1: 55–70 sentences
A1+: 70–90 sentences
A2: 85–110 sentences
A2+: 80–105 sentences
B1: 95–125 sentences
Total: 385–500 sentences
```

This is a target range, not a hard requirement.

Semantic quality remains more important than matching Shopping counts.

## Core Rules

Phase 4B must follow the existing project conventions:

```text
data/slot_bank/daily_routine_slots.json
data/pattern_bank/daily_routine_patterns.json
data/generated/daily_routine_sentence_bank.json
scripts/generate_sentences.py
tests/test_content_generator.py
```

Do not split Daily Routine pattern banks by level.

Do not create a second generator.

Do not create a second count system.

New `ROUTINE_*` count overrides must be added to the existing centralized:

```text
COUNT_BY_PATTERN_LEVEL
```

in:

```text
scripts/generate_sentences.py
```

## FSI Model

Phase 4B remains FSI-style substitution driven.

Each new pattern family should define:

- a stable frame
- level-appropriate chunks
- restricted slot groups
- paired slots where needed
- semantic constraints
- count guidance

Most new Phase 4B patterns may still use:

```json
"fsi_rules": []
```

This is acceptable.

Phase 4B is about sentence-bank substitution coverage, not UI-level FSI task expansion.

Explicit `ROUTINE_*` FSI task logic may be deferred.

## Do Not Add in Phase 4B

Do not add:

```text
third-person routine descriptions
past tense routine descriptions
paragraph writing
dialogue banks
complex when clauses
weekly calendar planning
advanced habit discussion
rarely / hardly ever / twice a week
full family routine descriptions
```

These belong to later expansions.

## Phase 4B Pattern Scope

Phase 4B should add the following new pattern families.

## A1 New Pattern Families

Add:

```text
ROUTINE_HAVE_ITEM
ROUTINE_READY
ROUTINE_SIMPLE_TIME
```

Purpose:

Strengthen concrete A1 daily-life language without adding grammar complexity.

### ROUTINE_HAVE_ITEM

Function:

Say what daily-life or school item the learner has.

Frame:

```text
I have {item}.
```

Examples:

```text
I have my bag.
I have my book.
I have my lunch.
I have my homework.
```

Suggested slot group:

```text
routine_simple_items
```

Suggested slot entries:

```json
[
  {"text": "my bag"},
  {"text": "my book"},
  {"text": "my lunch"},
  {"text": "my homework"},
  {"text": "my pencil case"},
  {"text": "my shoes"},
  {"text": "my water bottle"},
  {"text": "my school bag"}
]
```

Count guidance:

```python
("ROUTINE_HAVE_ITEM", "A1"): 8
```

### ROUTINE_READY

Function:

Say simple readiness.

Frame:

```text
I am ready.
```

Optional frame:

```text
I am ready now.
```

Recommended v1 frame:

```text
I am ready.
```

Count guidance:

```python
("ROUTINE_READY", "A1"): 1
```

Design note:

This is intentionally low-count because it has limited safe variation.

### ROUTINE_SIMPLE_TIME

Function:

Say simple time-of-day context.

Frame:

```text
It is {simple_time}.
```

Examples:

```text
It is morning.
It is afternoon.
It is evening.
It is night.
```

Suggested slot group:

```text
routine_simple_times
```

Suggested slot entries:

```json
[
  {"text": "morning"},
  {"text": "afternoon"},
  {"text": "evening"},
  {"text": "night"}
]
```

Count guidance:

```python
("ROUTINE_SIMPLE_TIME", "A1"): 4
```

## A1+ New Pattern Families

Add:

```text
ROUTINE_PACK
ROUTINE_HELP_SIMPLE
ROUTINE_CHORE_SIMPLE
ROUTINE_PUT_ON
```

Purpose:

Add school preparation, helping, chores, and getting-ready language.

### ROUTINE_PACK

Function:

Say simple school preparation actions.

Frame:

```text
I {action}.
```

Examples:

```text
I pack my bag.
I check my homework.
I get my books.
```

Suggested slot group:

```text
routine_school_preparation_actions
```

Suggested slot entries:

```json
[
  {"text": "pack my bag"},
  {"text": "check my homework"},
  {"text": "get my books"},
  {"text": "get my pencil case"},
  {"text": "put my book in my bag"},
  {"text": "take my lunch"}
]
```

Count guidance:

```python
("ROUTINE_PACK", "A1+"): 6
```

### ROUTINE_HELP_SIMPLE

Function:

Say simple helping actions.

Frame:

```text
I {action}.
```

Examples:

```text
I help my parents.
I help my brother.
I help my sister.
I help at home.
```

Suggested slot group:

```text
routine_help_actions
```

Suggested slot entries:

```json
[
  {"text": "help my parents"},
  {"text": "help my brother"},
  {"text": "help my sister"},
  {"text": "help at home"}
]
```

Count guidance:

```python
("ROUTINE_HELP_SIMPLE", "A1+"): 4
```

### ROUTINE_CHORE_SIMPLE

Function:

Say simple chore actions.

Frame:

```text
I {action}.
```

Examples:

```text
I clean my room.
I make my bed.
I wash the dishes.
I take out the trash.
```

Suggested slot group:

```text
routine_chore_actions
```

Suggested slot entries:

```json
[
  {"text": "clean my room"},
  {"text": "make my bed"},
  {"text": "wash the dishes"},
  {"text": "take out the trash"},
  {"text": "put away my books"},
  {"text": "put away my toys"}
]
```

Count guidance:

```python
("ROUTINE_CHORE_SIMPLE", "A1+"): 6
```

### ROUTINE_PUT_ON

Function:

Say simple getting-ready clothing actions.

Frame:

```text
I put on {item}.
```

Examples:

```text
I put on my shoes.
I put on my jacket.
I put on my school uniform.
```

Suggested slot group:

```text
routine_put_on_items
```

Suggested slot entries:

```json
[
  {"text": "my shoes"},
  {"text": "my jacket"},
  {"text": "my school uniform"},
  {"text": "my socks"},
  {"text": "my hat"}
]
```

Count guidance:

```python
("ROUTINE_PUT_ON", "A1+"): 5
```

## A2 New Pattern Families

Add:

```text
ROUTINE_ASK_TIME
ROUTINE_ASK_WHAT_DO
ROUTINE_ASK_WHEN_DO
ROUTINE_READY_FOR
ROUTINE_LATE_FOR
ROUTINE_FORGOT
ROUTINE_PERMISSION
```

Purpose:

Add daily-life interaction and school-life questions.

### ROUTINE_ASK_TIME

Function:

Ask what time someone does a routine action.

Frame:

```text
What time do you {action}?
```

Examples:

```text
What time do you get up?
What time do you go to school?
What time do you go to bed?
```

Suggested slot group:

```text
routine_ask_time_actions
```

Suggested slot entries:

```json
[
  {"text": "get up"},
  {"text": "go to school"},
  {"text": "eat breakfast"},
  {"text": "go home"},
  {"text": "eat dinner"},
  {"text": "go to bed"}
]
```

Count guidance:

```python
("ROUTINE_ASK_TIME", "A2"): 6
```

### ROUTINE_ASK_WHAT_DO

Function:

Ask what someone does in a routine context.

Frame:

```text
What do you do {context}?
```

Examples:

```text
What do you do after school?
What do you do in the morning?
What do you do at night?
```

Suggested slot group:

```text
routine_ask_what_contexts
```

Suggested slot entries:

```json
[
  {"text": "after school"},
  {"text": "in the morning"},
  {"text": "in the evening"},
  {"text": "at night"},
  {"text": "on weekends"}
]
```

Count guidance:

```python
("ROUTINE_ASK_WHAT_DO", "A2"): 5
```

### ROUTINE_ASK_WHEN_DO

Function:

Ask when someone does a specific routine action.

Frame:

```text
When do you {action}?
```

Examples:

```text
When do you do your homework?
When do you brush your teeth?
When do you pack your bag?
```

Suggested slot group:

```text
routine_ask_when_actions
```

Suggested slot entries:

```json
[
  {"text": "do your homework"},
  {"text": "brush your teeth"},
  {"text": "pack your bag"},
  {"text": "clean your room"},
  {"text": "read a book"},
  {"text": "watch TV"}
]
```

Count guidance:

```python
("ROUTINE_ASK_WHEN_DO", "A2"): 6
```

Design note:

Use second-person possessives in this slot group: `your homework`, `your teeth`, `your bag`.

Do not reuse first-person action slots here.

### ROUTINE_READY_FOR

Function:

Say readiness for a simple routine context.

Frame:

```text
I am ready for {context}.
```

Examples:

```text
I am ready for school.
I am ready for bed.
I am ready for dinner.
```

Suggested slot group:

```text
routine_ready_for_contexts
```

Suggested slot entries:

```json
[
  {"text": "school"},
  {"text": "bed"},
  {"text": "dinner"},
  {"text": "class"},
  {"text": "the test"}
]
```

Count guidance:

```python
("ROUTINE_READY_FOR", "A2"): 5
```

### ROUTINE_LATE_FOR

Function:

Say being late for a simple context.

Frame:

```text
I am late for {context}.
```

Examples:

```text
I am late for school.
I am late for class.
I am late for dinner.
```

Suggested slot group:

```text
routine_late_for_contexts
```

Suggested slot entries:

```json
[
  {"text": "school"},
  {"text": "class"},
  {"text": "dinner"},
  {"text": "the bus"},
  {"text": "my lesson"}
]
```

Count guidance:

```python
("ROUTINE_LATE_FOR", "A2"): 5
```

### ROUTINE_FORGOT

Function:

Say forgetting a school or daily-life item.

Frame:

```text
I forgot {item}.
```

Examples:

```text
I forgot my homework.
I forgot my book.
I forgot my lunch.
```

Suggested slot group:

```text
routine_forgot_items
```

Suggested slot entries:

```json
[
  {"text": "my homework"},
  {"text": "my book"},
  {"text": "my lunch"},
  {"text": "my bag"},
  {"text": "my pencil case"},
  {"text": "my water bottle"},
  {"text": "my shoes"},
  {"text": "my key"}
]
```

Count guidance:

```python
("ROUTINE_FORGOT", "A2"): 8
```

Design note:

Although `forgot` is past tense, this pattern is allowed as a fixed high-frequency classroom/daily-life phrase at A2.

Do not expand into general past tense in Phase 4B.

### ROUTINE_PERMISSION

Function:

Ask permission for a simple daily-life activity with a condition.

Frame:

```text
Can I {action} {condition}?
```

Examples:

```text
Can I watch TV after homework?
Can I play outside after school?
Can I use the computer after dinner?
```

Suggested paired slot group:

```text
routine_permission_pairs
```

Suggested slot entries:

```json
[
  {"action": "watch TV", "condition": "after homework"},
  {"action": "play outside", "condition": "after school"},
  {"action": "use the computer", "condition": "after dinner"},
  {"action": "read a book", "condition": "before bed"},
  {"action": "listen to music", "condition": "after homework"},
  {"action": "take a break", "condition": "after homework"},
  {"action": "go outside", "condition": "after I finish my homework"},
  {"action": "watch TV", "condition": "after I clean my room"}
]
```

Count guidance:

```python
("ROUTINE_PERMISSION", "A2"): 8
```

Design note:

Use paired slots.

Do not freely combine actions and conditions.

## A2+ New Pattern Families

Add:

```text
ROUTINE_HELP_REASON
ROUTINE_CHORE_REASON
ROUTINE_REMIND
ROUTINE_CANNOT_NOW
```

Purpose:

Add controlled explanation, reminder, and cannot-now interaction.

### ROUTINE_HELP_REASON

Function:

Explain helping with a reason.

Frame:

```text
I {action} because {reason}.
```

Examples:

```text
I help my parents because they are busy.
I help my brother because he needs help.
```

Suggested paired slot group:

```text
routine_help_reason_pairs
```

Suggested slot entries:

```json
[
  {"action": "help my parents", "reason": "they are busy"},
  {"action": "help my brother", "reason": "he needs help"},
  {"action": "help my sister", "reason": "she needs help"},
  {"action": "help at home", "reason": "my parents are busy"}
]
```

Count guidance:

```python
("ROUTINE_HELP_REASON", "A2+"): 4
```

### ROUTINE_CHORE_REASON

Function:

Explain a chore with a reason.

Frame:

```text
I {action} because {reason}.
```

Examples:

```text
I clean my room because it is messy.
I make my bed because it looks nice.
```

Suggested paired slot group:

```text
routine_chore_reason_pairs
```

Suggested slot entries:

```json
[
  {"action": "clean my room", "reason": "it is messy"},
  {"action": "make my bed", "reason": "it looks nice"},
  {"action": "wash the dishes", "reason": "they are dirty"},
  {"action": "put away my books", "reason": "my room is messy"},
  {"action": "put away my toys", "reason": "my room is messy"}
]
```

Count guidance:

```python
("ROUTINE_CHORE_REASON", "A2+"): 5
```

### ROUTINE_REMIND

Function:

Ask someone to remind me to do a routine action.

Frame:

```text
Please remind me to {action}.
```

Examples:

```text
Please remind me to brush my teeth.
Please remind me to pack my bag.
Please remind me to do my homework.
```

Suggested slot group:

```text
routine_reminder_actions
```

Suggested slot entries:

```json
[
  {"text": "brush my teeth"},
  {"text": "pack my bag"},
  {"text": "do my homework"},
  {"text": "wash my hands"},
  {"text": "go to bed early"},
  {"text": "bring my book"},
  {"text": "clean my room"}
]
```

Count guidance:

```python
("ROUTINE_REMIND", "A2+"): 7
```

### ROUTINE_CANNOT_NOW

Function:

Say I cannot do something now because of a daily-life reason.

Frame:

```text
I cannot {action} now because {reason}.
```

Examples:

```text
I cannot play now because I have homework.
I cannot watch TV now because I have to study.
```

Suggested paired slot group:

```text
routine_cannot_now_pairs
```

Suggested slot entries:

```json
[
  {"action": "play", "reason": "I have homework"},
  {"action": "watch TV", "reason": "I have to study"},
  {"action": "go outside", "reason": "I need to finish my homework"},
  {"action": "use the computer", "reason": "I have to clean my room"},
  {"action": "listen to music", "reason": "I need to sleep"}
]
```

Count guidance:

```python
("ROUTINE_CANNOT_NOW", "A2+"): 5
```

Design note:

This overlaps slightly with B1 `ROUTINE_CANNOT_BECAUSE`, but the A2+ version is fixed with `now` and simpler actions.

## B1 New Pattern Families

Add:

```text
ROUTINE_TIME_TAKES
ROUTINE_SHOULD
ROUTINE_PARENT_RULE
ROUTINE_BEFORE_LEAVE
ROUTINE_AFTER_FINISH
```

Purpose:

Add controlled B1 routine management without paragraph writing.

### ROUTINE_TIME_TAKES

Function:

Describe how long a routine task takes.

Frame:

```text
It takes {duration} to {task}.
```

Examples:

```text
It takes ten minutes to pack my bag.
It takes five minutes to brush my teeth.
```

Suggested paired slot group:

```text
routine_time_takes_pairs
```

Suggested slot entries:

```json
[
  {"duration": "ten minutes", "task": "pack my bag"},
  {"duration": "five minutes", "task": "brush my teeth"},
  {"duration": "twenty minutes", "task": "finish my homework"},
  {"duration": "fifteen minutes", "task": "walk to school"},
  {"duration": "ten minutes", "task": "clean my room"},
  {"duration": "five minutes", "task": "make my bed"}
]
```

Count guidance:

```python
("ROUTINE_TIME_TAKES", "B1"): 6
```

### ROUTINE_SHOULD

Function:

Give simple routine advice.

Frame:

```text
I should {action}.
```

Examples:

```text
I should go to bed earlier.
I should finish my homework first.
```

Suggested slot group:

```text
routine_should_actions
```

Suggested slot entries:

```json
[
  {"text": "go to bed earlier"},
  {"text": "finish my homework first"},
  {"text": "pack my bag before school"},
  {"text": "study before the test"},
  {"text": "clean my room today"},
  {"text": "drink more water"}
]
```

Count guidance:

```python
("ROUTINE_SHOULD", "B1"): 6
```

### ROUTINE_PARENT_RULE

Function:

Describe simple parent or home rules.

Frame:

```text
My parents say I have to {action}.
```

Examples:

```text
My parents say I have to go to bed early.
My parents say I have to finish my homework first.
```

Suggested slot group:

```text
routine_parent_rule_actions
```

Suggested slot entries:

```json
[
  {"text": "go to bed early"},
  {"text": "finish my homework first"},
  {"text": "clean my room"},
  {"text": "brush my teeth before bed"},
  {"text": "pack my bag before school"},
  {"text": "help at home"}
]
```

Count guidance:

```python
("ROUTINE_PARENT_RULE", "B1"): 6
```

### ROUTINE_BEFORE_LEAVE

Function:

Describe what happens before leaving home.

Frame:

```text
Before I leave home, I {action}.
```

Examples:

```text
Before I leave home, I check my bag.
Before I leave home, I put on my shoes.
```

Suggested slot group:

```text
routine_before_leave_actions
```

Suggested slot entries:

```json
[
  {"text": "check my bag"},
  {"text": "put on my shoes"},
  {"text": "get my lunch"},
  {"text": "say goodbye to my parents"},
  {"text": "take my school bag"},
  {"text": "check my homework"}
]
```

Count guidance:

```python
("ROUTINE_BEFORE_LEAVE", "B1"): 6
```

### ROUTINE_AFTER_FINISH

Function:

Describe what happens after finishing homework or chores.

Frame:

```text
After I finish {task}, I {action}.
```

Examples:

```text
After I finish my homework, I watch TV.
After I finish my chores, I listen to music.
```

Suggested paired slot group:

```text
routine_after_finish_pairs
```

Suggested slot entries:

```json
[
  {"task": "my homework", "action": "watch TV"},
  {"task": "my homework", "action": "read a book"},
  {"task": "my homework", "action": "play outside"},
  {"task": "my chores", "action": "listen to music"},
  {"task": "cleaning my room", "action": "take a break"},
  {"task": "studying English", "action": "go to bed"}
]
```

Count guidance:

```python
("ROUTINE_AFTER_FINISH", "B1"): 6
```

## Expected Phase 4B New Counts

Approximate added sentence count:

```text
A1:
ROUTINE_HAVE_ITEM: +8
ROUTINE_READY: +1
ROUTINE_SIMPLE_TIME: +4
Expected A1 increase: +13

A1+:
ROUTINE_PACK: +6
ROUTINE_HELP_SIMPLE: +4
ROUTINE_CHORE_SIMPLE: +6
ROUTINE_PUT_ON: +5
Expected A1+ increase: +21

A2:
ROUTINE_ASK_TIME: +6
ROUTINE_ASK_WHAT_DO: +5
ROUTINE_ASK_WHEN_DO: +6
ROUTINE_READY_FOR: +5
ROUTINE_LATE_FOR: +5
ROUTINE_FORGOT: +8
ROUTINE_PERMISSION: +8
Expected A2 increase: +43

A2+:
ROUTINE_HELP_REASON: +4
ROUTINE_CHORE_REASON: +5
ROUTINE_REMIND: +7
ROUTINE_CANNOT_NOW: +5
Expected A2+ increase: +21

B1:
ROUTINE_TIME_TAKES: +6
ROUTINE_SHOULD: +6
ROUTINE_PARENT_RULE: +6
ROUTINE_BEFORE_LEAVE: +6
ROUTINE_AFTER_FINISH: +6
Expected B1 increase: +30
```

Expected total increase:

```text
about +128 sentences
```

Expected total Daily Routine after Phase 4B:

```text
about 340 sentences
```

This is still smaller than Shopping, but it is a large improvement and should stay semantically controlled.

## Implementation Files

Phase 4B implementation should modify:

```text
data/slot_bank/daily_routine_slots.json
data/pattern_bank/daily_routine_patterns.json
scripts/generate_sentences.py
```

Then generate:

```text
data/generated/daily_routine_sentence_bank.json
```

Then update tests:

```text
tests/test_content_generator.py
```

Do not modify Shopping or Food & Drink files.

## Implementation Order

Use small commits.

## Step 1: Add Phase 4B Slots

Modify:

```text
data/slot_bank/daily_routine_slots.json
```

Add only the slot groups required by Phase 4B.

Do not modify patterns yet.

Run:

```powershell
python -m json.tool data/slot_bank/daily_routine_slots.json | Out-Null
```

## Step 2: Add Phase 4B Patterns

Modify:

```text
data/pattern_bank/daily_routine_patterns.json
```

Add Phase 4B pattern families.

Run:

```powershell
python -m json.tool data/pattern_bank/daily_routine_patterns.json | Out-Null
```

## Step 3: Add Count Overrides

Modify:

```text
scripts/generate_sentences.py
```

Add Phase 4B `ROUTINE_*` count overrides to the existing `COUNT_BY_PATTERN_LEVEL`.

Run:

```powershell
python -m py_compile scripts/generate_sentences.py
```

## Step 4: Generate Sentence Bank

Run:

```powershell
python scripts/generate_sentences.py --scenario daily_routine
```

Expected output:

```text
data/generated/daily_routine_sentence_bank.json
```

## Step 5: Review Generated Sentences

Review by level:

```text
A1
A1+
A2
A2+
B1
```

Check:

- total sentence count
- count by level
- count by pattern
- semantic quality
- bad pair outputs
- no third-person expansion
- no general past-tense expansion
- no paragraphs
- no dialogues

## Step 6: Add Tests

Modify:

```text
tests/test_content_generator.py
```

Add Daily Routine Phase 4B coverage.

Do not create a separate test loading system.

## Pattern Schema Reminder

Use the existing schema:

```json
{
  "PATTERN_ID": {
    "pattern_id": "PATTERN_ID",
    "function": "...",
    "variants": {
      "LEVEL": {
        "example_template": "...",
        "chunks_template": ["..."],
        "grammar_focus": ["..."],
        "slot_constraints": {},
        "paired_slot": {
          "category": "..."
        },
        "fsi_rules": [],
        "complexity": {"depth": 1}
      }
    }
  }
}
```

Use `paired_slot` for patterns where action + condition, action + reason, duration + task, or task + action must remain compatible.

## Proposed Pattern Specifications

## A1 Patterns

### ROUTINE_HAVE_ITEM

```json
"ROUTINE_HAVE_ITEM": {
  "pattern_id": "ROUTINE_HAVE_ITEM",
  "function": "say_daily_items",
  "variants": {
    "A1": {
      "example_template": "I have {item}.",
      "chunks_template": ["I have", "{item}"],
      "grammar_focus": ["have_verb", "daily_routine_vocabulary"],
      "slot_constraints": {
        "item": {
          "category": ["routine_simple_items"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

### ROUTINE_READY

```json
"ROUTINE_READY": {
  "pattern_id": "ROUTINE_READY",
  "function": "say_readiness",
  "variants": {
    "A1": {
      "example_template": "I am ready.",
      "chunks_template": ["I am", "ready"],
      "grammar_focus": ["be_verb", "daily_routine_vocabulary"],
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

### ROUTINE_SIMPLE_TIME

```json
"ROUTINE_SIMPLE_TIME": {
  "pattern_id": "ROUTINE_SIMPLE_TIME",
  "function": "say_simple_time_of_day",
  "variants": {
    "A1": {
      "example_template": "It is {simple_time}.",
      "chunks_template": ["It is", "{simple_time}"],
      "grammar_focus": ["be_verb", "time_expression"],
      "slot_constraints": {
        "simple_time": {
          "category": ["routine_simple_times"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

## A1+ Patterns

### ROUTINE_PACK

```json
"ROUTINE_PACK": {
  "pattern_id": "ROUTINE_PACK",
  "function": "describe_school_preparation",
  "variants": {
    "A1+": {
      "example_template": "I {action}.",
      "chunks_template": ["I", "{action}"],
      "grammar_focus": ["present_simple", "school_preparation"],
      "slot_constraints": {
        "action": {
          "category": ["routine_school_preparation_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

### ROUTINE_HELP_SIMPLE

```json
"ROUTINE_HELP_SIMPLE": {
  "pattern_id": "ROUTINE_HELP_SIMPLE",
  "function": "describe_simple_helping",
  "variants": {
    "A1+": {
      "example_template": "I {action}.",
      "chunks_template": ["I", "{action}"],
      "grammar_focus": ["present_simple", "helping_actions"],
      "slot_constraints": {
        "action": {
          "category": ["routine_help_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

### ROUTINE_CHORE_SIMPLE

```json
"ROUTINE_CHORE_SIMPLE": {
  "pattern_id": "ROUTINE_CHORE_SIMPLE",
  "function": "describe_simple_chores",
  "variants": {
    "A1+": {
      "example_template": "I {action}.",
      "chunks_template": ["I", "{action}"],
      "grammar_focus": ["present_simple", "chores"],
      "slot_constraints": {
        "action": {
          "category": ["routine_chore_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

### ROUTINE_PUT_ON

```json
"ROUTINE_PUT_ON": {
  "pattern_id": "ROUTINE_PUT_ON",
  "function": "describe_getting_ready_clothing",
  "variants": {
    "A1+": {
      "example_template": "I put on {item}.",
      "chunks_template": ["I put on", "{item}"],
      "grammar_focus": ["phrasal_verb", "getting_ready"],
      "slot_constraints": {
        "item": {
          "category": ["routine_put_on_items"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 1}
    }
  }
}
```

## A2 Patterns

### ROUTINE_ASK_TIME

```json
"ROUTINE_ASK_TIME": {
  "pattern_id": "ROUTINE_ASK_TIME",
  "function": "ask_routine_clock_time",
  "variants": {
    "A2": {
      "example_template": "What time do you {action}?",
      "chunks_template": ["What time do you", "{action}", "?"],
      "grammar_focus": ["wh_question", "present_simple", "daily_routine"],
      "slot_constraints": {
        "action": {
          "category": ["routine_ask_time_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_ASK_WHAT_DO

```json
"ROUTINE_ASK_WHAT_DO": {
  "pattern_id": "ROUTINE_ASK_WHAT_DO",
  "function": "ask_routine_context",
  "variants": {
    "A2": {
      "example_template": "What do you do {context}?",
      "chunks_template": ["What do you do", "{context}", "?"],
      "grammar_focus": ["wh_question", "present_simple", "time_expression"],
      "slot_constraints": {
        "context": {
          "category": ["routine_ask_what_contexts"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_ASK_WHEN_DO

```json
"ROUTINE_ASK_WHEN_DO": {
  "pattern_id": "ROUTINE_ASK_WHEN_DO",
  "function": "ask_when_routine_action_happens",
  "variants": {
    "A2": {
      "example_template": "When do you {action}?",
      "chunks_template": ["When do you", "{action}", "?"],
      "grammar_focus": ["wh_question", "present_simple", "daily_routine"],
      "slot_constraints": {
        "action": {
          "category": ["routine_ask_when_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_READY_FOR

```json
"ROUTINE_READY_FOR": {
  "pattern_id": "ROUTINE_READY_FOR",
  "function": "say_ready_for_context",
  "variants": {
    "A2": {
      "example_template": "I am ready for {context}.",
      "chunks_template": ["I am ready for", "{context}"],
      "grammar_focus": ["be_verb", "prepositions", "daily_routine"],
      "slot_constraints": {
        "context": {
          "category": ["routine_ready_for_contexts"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_LATE_FOR

```json
"ROUTINE_LATE_FOR": {
  "pattern_id": "ROUTINE_LATE_FOR",
  "function": "say_late_for_context",
  "variants": {
    "A2": {
      "example_template": "I am late for {context}.",
      "chunks_template": ["I am late for", "{context}"],
      "grammar_focus": ["be_verb", "prepositions", "daily_routine"],
      "slot_constraints": {
        "context": {
          "category": ["routine_late_for_contexts"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_FORGOT

```json
"ROUTINE_FORGOT": {
  "pattern_id": "ROUTINE_FORGOT",
  "function": "say_forgot_daily_item",
  "variants": {
    "A2": {
      "example_template": "I forgot {item}.",
      "chunks_template": ["I forgot", "{item}"],
      "grammar_focus": ["fixed_expression", "school_life"],
      "slot_constraints": {
        "item": {
          "category": ["routine_forgot_items"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

### ROUTINE_PERMISSION

```json
"ROUTINE_PERMISSION": {
  "pattern_id": "ROUTINE_PERMISSION",
  "function": "ask_permission_for_routine_activity",
  "variants": {
    "A2": {
      "example_template": "Can I {action} {condition}?",
      "chunks_template": ["Can I", "{action}", "{condition}", "?"],
      "grammar_focus": ["can_request", "time_condition", "daily_routine"],
      "paired_slot": {
        "category": "routine_permission_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 2}
    }
  }
}
```

## A2+ Patterns

### ROUTINE_HELP_REASON

```json
"ROUTINE_HELP_REASON": {
  "pattern_id": "ROUTINE_HELP_REASON",
  "function": "explain_helping_reason",
  "variants": {
    "A2+": {
      "example_template": "I {action} because {reason}.",
      "chunks_template": ["I", "{action}", "because", "{reason}"],
      "grammar_focus": ["because_so", "helping_actions"],
      "paired_slot": {
        "category": "routine_help_reason_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 2.5}
    }
  }
}
```

### ROUTINE_CHORE_REASON

```json
"ROUTINE_CHORE_REASON": {
  "pattern_id": "ROUTINE_CHORE_REASON",
  "function": "explain_chore_reason",
  "variants": {
    "A2+": {
      "example_template": "I {action} because {reason}.",
      "chunks_template": ["I", "{action}", "because", "{reason}"],
      "grammar_focus": ["because_so", "chores"],
      "paired_slot": {
        "category": "routine_chore_reason_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 2.5}
    }
  }
}
```

### ROUTINE_REMIND

```json
"ROUTINE_REMIND": {
  "pattern_id": "ROUTINE_REMIND",
  "function": "ask_for_reminder",
  "variants": {
    "A2+": {
      "example_template": "Please remind me to {action}.",
      "chunks_template": ["Please remind me to", "{action}"],
      "grammar_focus": ["imperative", "to_infinitive", "daily_routine"],
      "slot_constraints": {
        "action": {
          "category": ["routine_reminder_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 2.5}
    }
  }
}
```

### ROUTINE_CANNOT_NOW

```json
"ROUTINE_CANNOT_NOW": {
  "pattern_id": "ROUTINE_CANNOT_NOW",
  "function": "explain_cannot_do_now",
  "variants": {
    "A2+": {
      "example_template": "I cannot {action} now because {reason}.",
      "chunks_template": ["I cannot", "{action}", "now because", "{reason}"],
      "grammar_focus": ["cannot", "because_so", "daily_routine"],
      "paired_slot": {
        "category": "routine_cannot_now_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 2.5}
    }
  }
}
```

## B1 Patterns

### ROUTINE_TIME_TAKES

```json
"ROUTINE_TIME_TAKES": {
  "pattern_id": "ROUTINE_TIME_TAKES",
  "function": "describe_time_needed_for_task",
  "variants": {
    "B1": {
      "example_template": "It takes {duration} to {task}.",
      "chunks_template": ["It takes", "{duration}", "to", "{task}"],
      "grammar_focus": ["time_duration", "to_infinitive", "routine_management"],
      "paired_slot": {
        "category": "routine_time_takes_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 3}
    }
  }
}
```

### ROUTINE_SHOULD

```json
"ROUTINE_SHOULD": {
  "pattern_id": "ROUTINE_SHOULD",
  "function": "give_simple_routine_advice",
  "variants": {
    "B1": {
      "example_template": "I should {action}.",
      "chunks_template": ["I should", "{action}"],
      "grammar_focus": ["should", "routine_management"],
      "slot_constraints": {
        "action": {
          "category": ["routine_should_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 3}
    }
  }
}
```

### ROUTINE_PARENT_RULE

```json
"ROUTINE_PARENT_RULE": {
  "pattern_id": "ROUTINE_PARENT_RULE",
  "function": "describe_parent_rules",
  "variants": {
    "B1": {
      "example_template": "My parents say I have to {action}.",
      "chunks_template": ["My parents say", "I have to", "{action}"],
      "grammar_focus": ["reported_rule", "have_to", "routine_management"],
      "slot_constraints": {
        "action": {
          "category": ["routine_parent_rule_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 3}
    }
  }
}
```

### ROUTINE_BEFORE_LEAVE

```json
"ROUTINE_BEFORE_LEAVE": {
  "pattern_id": "ROUTINE_BEFORE_LEAVE",
  "function": "describe_before_leaving_home",
  "variants": {
    "B1": {
      "example_template": "Before I leave home, I {action}.",
      "chunks_template": ["Before I leave home, I", "{action}"],
      "grammar_focus": ["before_after", "routine_management"],
      "slot_constraints": {
        "action": {
          "category": ["routine_before_leave_actions"]
        }
      },
      "fsi_rules": [],
      "complexity": {"depth": 3}
    }
  }
}
```

### ROUTINE_AFTER_FINISH

```json
"ROUTINE_AFTER_FINISH": {
  "pattern_id": "ROUTINE_AFTER_FINISH",
  "function": "describe_after_finishing_task",
  "variants": {
    "B1": {
      "example_template": "After I finish {task}, I {action}.",
      "chunks_template": ["After I finish", "{task}", ", I", "{action}"],
      "grammar_focus": ["before_after", "routine_management"],
      "paired_slot": {
        "category": "routine_after_finish_pairs"
      },
      "slot_constraints": {},
      "fsi_rules": [],
      "complexity": {"depth": 3}
    }
  }
}
```

## Tests to Add Later

After implementation and generation, extend:

```text
tests/test_content_generator.py
```

Suggested new checks:

```python
def test_daily_routine_phase4b_expected_patterns_exist():
    expected_new_patterns = {
        "ROUTINE_HAVE_ITEM",
        "ROUTINE_READY",
        "ROUTINE_SIMPLE_TIME",
        "ROUTINE_PACK",
        "ROUTINE_HELP_SIMPLE",
        "ROUTINE_CHORE_SIMPLE",
        "ROUTINE_PUT_ON",
        "ROUTINE_ASK_TIME",
        "ROUTINE_ASK_WHAT_DO",
        "ROUTINE_ASK_WHEN_DO",
        "ROUTINE_READY_FOR",
        "ROUTINE_LATE_FOR",
        "ROUTINE_FORGOT",
        "ROUTINE_PERMISSION",
        "ROUTINE_HELP_REASON",
        "ROUTINE_CHORE_REASON",
        "ROUTINE_REMIND",
        "ROUTINE_CANNOT_NOW",
        "ROUTINE_TIME_TAKES",
        "ROUTINE_SHOULD",
        "ROUTINE_PARENT_RULE",
        "ROUTINE_BEFORE_LEAVE",
        "ROUTINE_AFTER_FINISH",
    }
```

Semantic checks:

```python
def test_daily_routine_no_bad_permission_pairs(sentences):
    bad_pairs = [
        "Can I go to bed after homework",
        "Can I go to school after dinner",
        "Can I brush my teeth after school",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_no_general_past_tense_expansion(sentences):
    bad_phrases = [
        "Yesterday",
        "last night",
        "went to",
        "got up late",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_phrases)


def test_daily_routine_forgot_allowed_as_fixed_expression(sentences):
    forgot_sentences = [
        s for s in sentences
        if s["scenario"] == "daily_routine"
        and s["pattern_id"] == "ROUTINE_FORGOT"
    ]
    assert forgot_sentences
    assert all(s["target_sentence"].startswith("I forgot ") for s in forgot_sentences)
```

## Semantic Review Checklist

## A1

Check:

```text
short sentence only
no because
no before / after clause
no modal verbs
no general past tense
no third person
```

## A1+

Check:

```text
school preparation is natural
chores are concrete
put on items are wearable
no complex sequence clauses
```

## A2

Check:

```text
questions are natural
second-person action slots use your, not my
ready for / late for contexts are natural
forgot is fixed phrase only
permission pairs are natural
```

## A2+

Check:

```text
help reasons are natural
chore reasons are natural
reminder actions are useful
cannot-now pairs are natural
no paragraph-like output
```

## B1

Check:

```text
time-takes pairs are natural
should actions are natural
parent rules are natural
before-leave actions are natural
after-finish pairs are natural
no paragraph output
no dialogue output
```

## Completion Criteria

Phase 4B is complete when:

```text
1. Required Phase 4B slot groups are added.
2. Required Phase 4B pattern families are added.
3. ROUTINE_* count overrides are added to COUNT_BY_PATTERN_LEVEL.
4. daily_routine_sentence_bank.json is regenerated.
5. Generated output includes A1 through B1.
6. Generated output has expected new Phase 4B pattern coverage.
7. Five-level semantic review passes.
8. Daily Routine tests pass.
9. Existing Shopping and Food & Drink tests still pass.
10. No third-person expansion is introduced.
11. No general past-tense expansion is introduced.
12. No paragraph or dialogue outputs are introduced.
```

## Recommended Commit Sequence

Use small commits:

```bash
git add docs/daily_routine_phase4b_interaction_patterns_plan.md
git commit -m "docs: add daily routine phase 4b interaction plan"

git add data/slot_bank/daily_routine_slots.json
git commit -m "data: add daily routine phase 4b slots"

git add data/pattern_bank/daily_routine_patterns.json
git commit -m "data: add daily routine phase 4b patterns"

git add scripts/generate_sentences.py
git commit -m "scripts: add daily routine phase 4b counts"

git add data/generated/daily_routine_sentence_bank.json
git commit -m "data: regenerate daily routine sentence bank"

git add tests/test_content_generator.py
git commit -m "test: add daily routine phase 4b checks"
```

Do not include unrelated untracked local note files.

Do not include temporary level-split `.txt` review files unless the project explicitly stores them.

## Status

Planned.
