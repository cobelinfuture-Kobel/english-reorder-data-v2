# Daily Routine Scope and Design Notes

## Status

Daily Routine is planned as the third scenario after:

- Shopping
- Food & Drink

This document defines the initial scope and semantic design rules for Daily Routine.

It is a design reference document only.

It does not change generator code, slot banks, pattern banks, generated sentence data, application code, or tests.

## Design Goal

Daily Routine should support spiral learning.

The purpose is not to introduce many new grammar structures immediately.

The purpose is to reuse familiar communicative functions from earlier scenarios and apply them to daily life actions, times, places, and states.

Core strategy:

```text
reuse stable pattern logic
replace domain slots
control semantic combinations
increase difficulty by level
```

Daily Routine should be highly overlapping with earlier scenarios so learners can practice familiar sentence shapes in a new context.

## Language Standard

Use American English.

Preferred forms:

- bathroom
- restroom
- go to school
- go to work
- get up
- go home
- go to bed
- take a shower
- brush my teeth
- wash my face
- wash my hands
- do my homework
- study English
- eat breakfast
- eat lunch
- eat dinner
- drink water

Acceptable simple school-age learner language:

- I go to school.
- I go home.
- I do my homework.
- I study English.
- I brush my teeth.
- I go to bed.

Avoid regionally marked, unnatural, or less suitable forms for this project:

- have a wash
- revise for school
- do sport
- go to the toilet
- take a bath as a default daily routine action
- have tea as a default routine meal expression

Use high-frequency, concrete daily-life language.

## Relationship to Existing Scenarios

Daily Routine should inherit the general semantic principle already used in Shopping and Food & Drink:

```text
pattern + slot + level + context
```

Do not assume a slot can be reused everywhere.

A routine action may be valid in one sentence pattern but weak in another.

Good examples:

```text
I get up early.
I go to bed early.
I do my homework after school.
I brush my teeth at night.
```

Possible but more context-dependent:

```text
I eat dinner early.
I take a shower in the morning.
```

Weak for basic learner examples:

```text
I go to school at night.
I eat dinner before school.
I go to bed in the morning.
```

Therefore, Daily Routine should use restricted slots or paired slots when the sentence frame adds time, place, reason, or sequence context.

## Core Scenario Functions

Daily Routine should initially focus on common daily-life communication.

Core functions:

- say what someone does every day
- say what someone likes to do
- say what someone wants to do
- say what someone needs to do
- say what someone has to do
- say when someone does something
- say where someone does something
- describe simple states
- describe simple routine problems
- give short reasons
- talk about before school and after school
- talk about morning, afternoon, evening, and night routines

## Level Scope

## A1 Scope

A1 should use short, direct, high-frequency sentences.

Typical functions:

- say a basic routine action
- say a simple state
- say a simple place
- say a simple time
- use first-person routine sentences

Recommended sentence directions:

```text
I get up.
I go to school.
I go home.
I eat breakfast.
I drink water.
I brush my teeth.
I wash my face.
I do my homework.
I go to bed.
I am tired.
I am busy.
I am at home.
I am at school.
It is morning.
```

A1 should avoid:

```text
because
usually
always
sometimes
before I ...
after I ...
when I ...
have to
need to
would like to
too ... for me
```

A1 should not introduce complex sequence logic.

## A1+ Scope

A1+ may add light routine extensions while staying controlled.

Typical additions:

- early
- late
- today
- every day
- in the morning
- in the afternoon
- in the evening
- at night
- after school
- before school

Recommended sentence directions:

```text
I get up early.
I go to school today.
I go home after school.
I eat breakfast in the morning.
I do my homework after school.
I brush my teeth at night.
I go to bed late.
I am busy today.
I am tired today.
```

Scope rule:

When adding time expressions, do not freely combine all routine actions with all times.

Use restricted or paired slots for action + time combinations.

## A2 Scope

A2 can introduce polite or slightly more structured routine language.

Typical additions:

- I need to ...
- I have to ...
- I would like to ...
- I think ...
- Where can I ...
- Can I ... here?
- simple problem statements
- simple too + adjective statements

Recommended sentence directions:

```text
I need to do my homework.
I need to wash my hands.
I have to go to school.
I have to study English.
I would like to go to bed early.
I think I am tired.
I think I am too busy today.
Where can I wash my hands?
Can I do my homework here?
Can I study English here?
```

Scope rule:

A2 still requires tight semantic control for:

- routine action + place
- routine action + time
- state + reason
- too + adjective
- school-related obligations

## A2+ Scope

A2+ can introduce short reason clauses and controlled before / after phrases.

Typical additions:

- because
- before school
- after school
- before I go to bed
- after I get home
- simple preference reasons
- simple problem reasons

Recommended sentence directions:

```text
I go to bed early because I am tired.
I drink water because I am thirsty.
I eat breakfast because I am hungry.
I do my homework after I get home.
I brush my teeth before I go to bed.
I like my morning routine because it is easy.
I do not want to be late for school.
I need to study because I have a test.
```

Scope rule:

A2+ reason clauses must be natural and useful.

Do not freely combine routine actions with random reasons.

Bad examples:

```text
I brush my teeth because I am hungry.
I go to school because I am sleepy.
I take a shower because I am full.
I do my homework because I am thirsty.
```

Use paired reason slots where needed.

## B1 Future Scope

B1 should expand Daily Routine from simple action sentences into routine planning, habits, conflicts, and schedule management.

Possible B1 functions:

- describe a usual day
- compare weekdays and weekends
- explain schedule conflicts
- make plans
- talk about responsibilities
- describe habits
- discuss time management
- describe changes in routine
- explain why a routine is difficult

Possible B1 sentence directions:

```text
I usually get up at seven on school days.
On weekends, I get up later than usual.
I have to finish my homework before dinner.
I cannot go out because I have to study.
My morning routine is busy, but I can finish everything on time.
I try to go to bed earlier because I feel tired at school.
```

B1 should not simply add harder vocabulary.

It should add communicative usefulness and routine-level organization.

## Initial Slot Categories

The following slot categories are recommended for Daily Routine.

These should not be blindly reused across all patterns.

## `routine_actions_basic`

Purpose:

Support simple A1 action sentences.

Examples:

```json
[
  "get up",
  "go to school",
  "go home",
  "eat breakfast",
  "eat lunch",
  "eat dinner",
  "drink water",
  "brush my teeth",
  "wash my face",
  "wash my hands",
  "take a shower",
  "do my homework",
  "study English",
  "read a book",
  "go to bed"
]
```

Possible use:

```text
I get up.
I go to school.
I brush my teeth.
I do my homework.
```

## `routine_actions_to_infinitive`

Purpose:

Support want / like / need / have to / would like to patterns.

Examples:

```json
[
  "get up",
  "go to school",
  "go home",
  "eat breakfast",
  "drink water",
  "brush my teeth",
  "wash my face",
  "wash my hands",
  "take a shower",
  "do my homework",
  "study English",
  "read a book",
  "go to bed"
]
```

Possible use:

```text
I want to go home.
I like to read a book.
I need to brush my teeth.
I have to do my homework.
I would like to go to bed early.
```

Design note:

Some actions may work as bare present-tense actions but not naturally with every modal or preference frame.

Review by full pattern.

## `routine_times_simple`

Purpose:

Support simple time phrases.

Examples:

```json
[
  "today",
  "every day",
  "in the morning",
  "in the afternoon",
  "in the evening",
  "at night",
  "after school",
  "before school"
]
```

Possible use:

```text
I eat breakfast in the morning.
I do my homework after school.
I brush my teeth at night.
```

Design note:

This slot should not be freely combined with every action.

Use paired action-time slots when the pattern requires natural routine timing.

## `routine_action_time_pairs`

Purpose:

Control action + time compatibility.

Example design:

```json
[
  {"action": "get up", "time": "in the morning"},
  {"action": "wash my face", "time": "in the morning"},
  {"action": "brush my teeth", "time": "in the morning"},
  {"action": "eat breakfast", "time": "in the morning"},
  {"action": "go to school", "time": "in the morning"},
  {"action": "eat lunch", "time": "at school"},
  {"action": "go home", "time": "after school"},
  {"action": "do my homework", "time": "after school"},
  {"action": "study English", "time": "after school"},
  {"action": "read a book", "time": "in the evening"},
  {"action": "eat dinner", "time": "in the evening"},
  {"action": "brush my teeth", "time": "at night"},
  {"action": "take a shower", "time": "at night"},
  {"action": "go to bed", "time": "at night"}
]
```

Good outputs:

```text
I get up in the morning.
I do my homework after school.
I go to bed at night.
```

Avoid:

```text
I go to bed in the morning.
I eat dinner before school.
I take a shower at school.
```

## `routine_places`

Purpose:

Support simple location statements and place questions.

Examples:

```json
[
  "at home",
  "at school",
  "in my room",
  "in the bathroom",
  "in the kitchen",
  "in the classroom",
  "at my desk"
]
```

Possible use:

```text
I am at home.
I am at school.
I am in my room.
```

## `routine_action_place_pairs`

Purpose:

Control action + place compatibility.

Example design:

```json
[
  {"action": "brush my teeth", "place": "in the bathroom"},
  {"action": "wash my face", "place": "in the bathroom"},
  {"action": "wash my hands", "place": "in the bathroom"},
  {"action": "take a shower", "place": "in the bathroom"},
  {"action": "eat breakfast", "place": "in the kitchen"},
  {"action": "eat dinner", "place": "in the kitchen"},
  {"action": "do my homework", "place": "in my room"},
  {"action": "do my homework", "place": "at my desk"},
  {"action": "study English", "place": "in the classroom"},
  {"action": "read a book", "place": "in my room"},
  {"action": "go to bed", "place": "in my room"}
]
```

Good outputs:

```text
I brush my teeth in the bathroom.
I do my homework in my room.
I study English in the classroom.
```

Avoid:

```text
I eat breakfast in the bathroom.
I go to bed in the classroom.
I take a shower in the kitchen.
```

## `routine_states`

Purpose:

Support simple state sentences.

Examples:

```json
[
  "tired",
  "busy",
  "sleepy",
  "hungry",
  "thirsty",
  "late",
  "early",
  "ready",
  "free"
]
```

Possible use:

```text
I am tired.
I am busy today.
I am ready.
```

Design note:

Some states overlap with Food & Drink, such as hungry and thirsty.

That is acceptable because spiral learning should reuse known language in a new context.

## `routine_problem_pairs`

Purpose:

Support controlled problem or complaint sentences.

Example design:

```json
[
  {"subject": "I", "problem": "am too tired"},
  {"subject": "I", "problem": "am too busy"},
  {"subject": "I", "problem": "am late for school"},
  {"subject": "my bag", "problem": "is too heavy"},
  {"subject": "my homework", "problem": "is too hard"},
  {"subject": "my room", "problem": "is too messy"}
]
```

Good outputs:

```text
I am too tired.
I am too busy.
My homework is too hard.
My bag is too heavy.
```

Avoid:

```text
My breakfast is too sleepy.
My homework is too thirsty.
My bag is too hungry.
```

## `routine_reason_pairs`

Purpose:

Support A2+ reason clauses.

Example design:

```json
[
  {
    "sentence_start": "I go to bed early",
    "reason": "I am tired"
  },
  {
    "sentence_start": "I drink water",
    "reason": "I am thirsty"
  },
  {
    "sentence_start": "I eat breakfast",
    "reason": "I am hungry"
  },
  {
    "sentence_start": "I do my homework after school",
    "reason": "I have time"
  },
  {
    "sentence_start": "I study English",
    "reason": "I have a test"
  },
  {
    "sentence_start": "I brush my teeth at night",
    "reason": "I want clean teeth"
  },
  {
    "sentence_start": "I go to school early",
    "reason": "I do not want to be late"
  }
]
```

Good outputs:

```text
I go to bed early because I am tired.
I drink water because I am thirsty.
I study English because I have a test.
```

Avoid:

```text
I brush my teeth because I am hungry.
I do my homework because I am thirsty.
I take a shower because I am full.
```

## `routine_before_after_pairs`

Purpose:

Support controlled before / after sequence phrases.

Example design:

```json
[
  {
    "main_clause": "I brush my teeth",
    "sequence_phrase": "before I go to bed"
  },
  {
    "main_clause": "I wash my face",
    "sequence_phrase": "after I get up"
  },
  {
    "main_clause": "I eat breakfast",
    "sequence_phrase": "before I go to school"
  },
  {
    "main_clause": "I do my homework",
    "sequence_phrase": "after I get home"
  },
  {
    "main_clause": "I take a shower",
    "sequence_phrase": "before I go to bed"
  }
]
```

Good outputs:

```text
I brush my teeth before I go to bed.
I do my homework after I get home.
```

Avoid:

```text
I eat dinner before I go to school.
I go to bed after I get up.
```

## Pattern Families

Initial Daily Routine pattern families should be conservative.

Recommended pattern groups:

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
```

## Recommended Level Mapping

## A1

Suggested pattern families:

```text
ROUTINE_DO
ROUTINE_BE_STATE
ROUTINE_PLACE
```

Examples:

```text
I get up.
I go to school.
I eat breakfast.
I brush my teeth.
I do my homework.
I go to bed.
I am tired.
I am busy.
I am at home.
I am at school.
```

## A1+

Suggested pattern families:

```text
ROUTINE_DO_TIME
ROUTINE_LIKE
ROUTINE_WANT
ROUTINE_BE_STATE_TODAY
```

Examples:

```text
I get up early.
I eat breakfast in the morning.
I do my homework after school.
I like to read a book at night.
I want to go home today.
I am busy today.
```

## A2

Suggested pattern families:

```text
ROUTINE_NEED
ROUTINE_HAVE_TO
ROUTINE_WOULD_LIKE
ROUTINE_CAN_PLACE
ROUTINE_TOO
```

Examples:

```text
I need to do my homework.
I have to go to school.
I would like to go to bed early.
Can I wash my hands here?
Can I study English here?
I think I am too tired.
```

## A2+

Suggested pattern families:

```text
ROUTINE_REASON
ROUTINE_BEFORE_AFTER
ROUTINE_PREFERENCE_REASON
ROUTINE_PROBLEM_REASON
```

Examples:

```text
I go to bed early because I am tired.
I drink water because I am thirsty.
I brush my teeth before I go to bed.
I do my homework after I get home.
I like my morning routine because it is easy.
I need to study because I have a test.
```

## Count Guidance

Do not force every pattern to generate the same number of sentences.

Broad safe patterns may have higher counts.

Narrow semantic patterns should have lower counts.

`COUNT_BY_PATTERN_LEVEL` should be treated as a semantic quality cap, not as a full list of every pattern.

Patterns not listed in the count map may use the project default count if their slot space is broad and semantically safe.

Suggested count guidance:

```python
COUNT_BY_PATTERN_LEVEL = {
    # A1
    ("ROUTINE_DO", "A1"): 20,
    ("ROUTINE_BE_STATE", "A1"): 12,
    ("ROUTINE_PLACE", "A1"): 10,

    # A1+
    ("ROUTINE_DO_TIME", "A1+"): 18,
    ("ROUTINE_LIKE", "A1+"): 15,
    ("ROUTINE_WANT", "A1+"): 15,
    ("ROUTINE_BE_STATE_TODAY", "A1+"): 12,

    # A2
    ("ROUTINE_NEED", "A2"): 16,
    ("ROUTINE_HAVE_TO", "A2"): 16,
    ("ROUTINE_WOULD_LIKE", "A2"): 14,
    ("ROUTINE_CAN_PLACE", "A2"): 12,
    ("ROUTINE_TOO", "A2"): 12,

    # A2+
    ("ROUTINE_REASON", "A2+"): 15,
    ("ROUTINE_BEFORE_AFTER", "A2+"): 15,
    ("ROUTINE_PREFERENCE_REASON", "A2+"): 12,
    ("ROUTINE_PROBLEM_REASON", "A2+"): 12,
}
```

Design note:

The counts are lower for patterns that require action-time compatibility, action-place compatibility, reason compatibility, or controlled problem language.

The goal is semantic quality, not uniform sentence count.

## Semantic Risk Areas

Daily Routine has several common semantic risk areas.

## 1. Action + Time Mismatch

Bad examples:

```text
I go to bed in the morning.
I eat dinner before school.
I get up at night.
```

Use `routine_action_time_pairs` when time is part of the pattern.

## 2. Action + Place Mismatch

Bad examples:

```text
I eat breakfast in the bathroom.
I go to bed in the classroom.
I brush my teeth in the kitchen.
```

Use `routine_action_place_pairs` when place is part of the pattern.

## 3. State + Reason Mismatch

Bad examples:

```text
I drink water because I am sleepy.
I do my homework because I am thirsty.
I brush my teeth because I am hungry.
```

Use `routine_reason_pairs`.

## 4. Too + Problem Mismatch

Bad examples:

```text
My breakfast is too sleepy.
My homework is too thirsty.
My bag is too hungry.
```

Use `routine_problem_pairs`.

## 5. Overuse of Abstract Routine Language

Avoid overusing abstract words at A1–A2+.

Weak examples:

```text
I manage my schedule.
I organize my lifestyle.
I maintain my routine.
```

These may be useful later but are not good initial Daily Routine examples.

## 6. Premature Sequence Complexity

Avoid complex sequence structures in the first version.

Defer:

```text
After I finish my homework, I watch TV.
Before I leave home, I check my bag.
When I get home, I usually take a rest.
```

These are useful, but they should be B1 or later unless the generator explicitly supports them safely.

## Manual Review Checklist

## A1 Checklist

A1 must not contain:

```text
because
usually
always
sometimes
before I
after I
when I
have to
need to
would like to
too ... for me
```

A1 should use short and direct routine sentences.

## A1+ Checklist

A1+ may contain:

```text
early
late
today
every day
in the morning
in the afternoon
in the evening
at night
after school
before school
```

Check that time expressions are natural for the action.

## A2 Checklist

Check:

```text
need to
have to
would like to
Can I ... here?
too + adjective
action + place
action + time
```

Make sure `too` patterns use approved routine problem pairs.

## A2+ Checklist

Check:

```text
because clauses are natural
before / after clauses are controlled
no random action + reason pairing
no overly complex sequence sentence
```

## Automated Test Ideas

Add tests later to prevent semantic regression.

Suggested tests:

```python
def test_daily_routine_a1_has_no_a2plus_structures(sentences):
    forbidden = [
        "because",
        "usually",
        "always",
        "sometimes",
        "before I",
        "after I",
        "when I",
        "have to",
        "need to",
        "would like to",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine" and s["level"] == "A1":
            assert not any(x in s["target_sentence"] for x in forbidden)


def test_daily_routine_no_bad_action_time_pairs(sentences):
    bad_pairs = [
        "go to bed in the morning",
        "eat dinner before school",
        "get up at night",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_no_bad_action_place_pairs(sentences):
    bad_pairs = [
        "eat breakfast in the bathroom",
        "go to bed in the classroom",
        "take a shower in the kitchen",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_no_bad_reason_pairs(sentences):
    bad_pairs = [
        "drink water because I am sleepy",
        "do my homework because I am thirsty",
        "brush my teeth because I am hungry",
        "take a shower because I am full",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_no_lowercase_sentence_start(sentences):
    for s in sentences:
        if s["scenario"] == "daily_routine":
            text = s["target_sentence"]
            assert text[0].isupper()
```

## Future Expansion Ideas

The following ideas are useful but should be deferred until the initial Daily Routine version is stable.

## 1. Usually / Always / Sometimes

Possible future patterns:

```text
I usually get up at seven.
I always brush my teeth at night.
I sometimes read before bed.
```

Design note:

Frequency adverbs require careful action compatibility but are generally safer after the basic routine sentence bank is stable.

## 2. Exact Clock Times

Possible future patterns:

```text
I get up at seven.
I go to school at seven thirty.
I go to bed at nine.
```

Design note:

Clock times require a controlled time slot and may need local educational context.

## 3. Weekday / Weekend Contrast

Possible future patterns:

```text
I get up early on weekdays.
I get up late on weekends.
I do my homework on Sunday.
```

Design note:

This belongs naturally to B1 because it supports comparison and routine contrast.

## 4. Schedule Conflicts

Possible future patterns:

```text
I cannot play because I have homework.
I cannot go out because I have to study.
I am busy after school.
```

Design note:

This should be B1 or B1+.

## 5. Short Routine Paragraphs

Possible future task:

```text
Write about your day.
Say:
- when you get up
- what you do after school
- when you go to bed
```

Sample answer:

```text
I get up at seven. I go to school in the morning. I do my homework after school. I go to bed at nine.
```

Design note:

Writing tasks should be separate from the sentence bank.

## 6. Short Daily Routine Dialogues

Possible future dialogue:

```text
A: What do you do after school?
B: I do my homework.
A: Do you watch TV at night?
B: No, I go to bed early.
```

Design note:

Dialogues should probably use a separate dialogue bank rather than the existing sentence bank.

## Implementation Rule

Do not implement Daily Routine sentence generation until this scope is accepted.

When implementation begins, every new pattern should include:

- restricted slots or paired slots where needed
- level-specific counts
- generated sentence review
- regression tests
- manual review by level and pattern

Do not expand sentence quantity before semantic constraints are stable.

## Status

Planned.
