# Daily Routine v1 Implementation Plan

## Status

Daily Routine v1 is planned.

This document converts `docs/daily_routine_scope.md` into a complete implementation plan.

This is a planning document only.

It does not change generator code, slot banks, pattern banks, generated sentence data, application code, or tests.

## Implementation Goal

Daily Routine v1 should add a third scenario using spiral learning.

The goal is not to introduce a large amount of unrelated new grammar.

The goal is to reuse stable sentence-generation logic from earlier scenarios and apply it to daily-life actions, times, places, states, simple obligations, reasons, sequence phrases, and B1-level routine descriptions.

Daily Routine v1 should cover:

- A1
- A1+
- A2
- A2+
- B1

Daily Routine v1 remains sentence-bank based.

B1 should use FSI-style substitution drills, not paragraph writing or dialogue generation.

## Core Principle

Daily Routine v1 must follow the same semantic principle used in earlier scenarios:

```text
pattern + slot + level + context
```

Do not reuse a slot only because it is grammatically possible.

A slot is valid only when the full generated sentence remains natural and pedagogically useful.

The goal is semantic quality, not maximum sentence quantity.

## FSI Substitution Drill Model

Daily Routine v1 should be built around FSI-style substitution drills.

Each pattern should define:

- a stable sentence frame
- a restricted slot set
- level-appropriate substitutions
- semantic compatibility rules
- generated sentence targets

The purpose is to help learners practice familiar sentence shapes with controlled substitutions.

FSI substitution is appropriate from A1 through B1.

However, higher-level FSI patterns require more restrictive paired slots because the semantic risk increases as the sentence frame becomes longer.

### A1 FSI Example

Frame:

```text
I {routine_action}.
```

Outputs:

```text
I get up.
I go to school.
I brush my teeth.
I do my homework.
I go to bed.
```

### A1+ FSI Example

Frame:

```text
I {action} {time}.
```

Outputs:

```text
I get up in the morning.
I do my homework after school.
I brush my teeth at night.
```

Design note:

This must use paired action-time slots.

Do not freely combine all actions with all time phrases.

### A2 FSI Example

Frame:

```text
I need to {action}.
```

Outputs:

```text
I need to do my homework.
I need to wash my hands.
I need to study English.
```

### A2+ FSI Example

Frame:

```text
{sentence_start} because {reason}.
```

Outputs:

```text
I go to bed early because I am tired.
I drink water because I am thirsty.
I study English because I have a test.
```

Design note:

This must use paired reason slots.

Do not freely combine actions and reasons.

### B1 FSI Example

Frame:

```text
I usually {action} {time_context}.
```

Outputs:

```text
I usually get up at seven on school days.
I usually do my homework after school.
I usually read before bed.
```

Design note:

B1 remains substitution-driven, but it must use controlled slots for frequency, clock time, weekday/weekend contrast, routine conflicts, and routine opinions.

## Files to Add Later

The implementation should eventually add the following files.

Do not add these files until the implementation phase begins.

## Slot Bank

```text
data/slot_bank/daily_routine_slots.json
```

Purpose:

Define domain-specific slots for Daily Routine.

This file should contain all Daily Routine slots for A1 through B1.

Expected slot groups:

```text
routine_actions_basic
routine_actions_to_infinitive
routine_times_simple
routine_action_time_pairs
routine_places
routine_action_place_pairs
routine_states
routine_problem_pairs
routine_reason_pairs
routine_before_after_pairs
routine_preference_reason_pairs
routine_frequency_adverbs
routine_clock_time_pairs
routine_weekday_weekend_pairs
routine_conflict_reason_pairs
routine_finish_before_pairs
routine_b1_opinion_pairs
```

## Pattern Bank

```text
data/pattern_bank/daily_routine_patterns.json
```

Purpose:

Define all Daily Routine pattern families and variants from A1 through B1.

The repository currently uses one pattern bank file per scenario, not one file per level.

Daily Routine should follow the existing scenario-level file convention.

## Generated Data

```text
data/generated/daily_routine_sentence_bank.json
```

Purpose:

Store generated Daily Routine sentence bank data for A1 through B1.

The repository currently uses one generated sentence bank file per scenario.

## Generator Script

```text
scripts/generate_sentences.py
```

Purpose:

Register Daily Routine as a supported scenario and add Daily Routine count overrides.

Required changes:

- add `daily_routine` to `SCENARIO_CONFIGS`
- set `sentence_prefix` to `DAILY_ROUTINE`
- set `pattern_path` to `data/pattern_bank/daily_routine_patterns.json`
- set `slot_path` to `data/slot_bank/daily_routine_slots.json`
- set `output_path` to `data/generated/daily_routine_sentence_bank.json`
- add `ROUTINE_*` entries to `COUNT_BY_PATTERN_LEVEL`

Do not create a separate generator or a second count system.

## Tests

Recommended first target:

```text
tests/test_content_generator.py
```

Purpose:

Extend the existing generator tests with Daily Routine coverage and semantic checks.

The current repository already tests Shopping and Food & Drink in `tests/test_content_generator.py`.

Daily Routine should initially follow that style.

If Daily Routine semantic tests become too long, a later cleanup may split them into:

```text
tests/test_daily_routine_semantics.py
```

However, do not create a separate test loading system.

Use the existing `ContentGenerator` test style.

## Implementation Phases

Daily Routine v1 should be implemented in small phases.

Do not implement all levels at once without review.

## Phase 0: Repository Pattern Inspection

Before adding implementation files, inspect the current repository conventions.

Check:

```text
data/slot_bank/
data/pattern_bank/
data/generated/
scripts/
tests/
```

Confirm:

- naming convention for scenario slot banks
- naming convention for pattern banks
- naming convention for generated sentence files
- generator entry point
- expected pattern schema
- expected slot schema
- current metadata fields
- test style
- whether count maps are stored in code, config, or docs
- whether existing scenarios already support B1 pattern banks
- how generated B1 data is stored for Food & Drink

Deliverable:

```text
Phase 0 confirmed the following repository conventions:

data/pattern_bank/<scenario>_patterns.json
data/slot_bank/<scenario>_slots.json
data/generated/<scenario>_sentence_bank.json
```

Existing scenarios:

```text
shopping
food_drink
```

Daily Routine should be implemented as:

```text
data/pattern_bank/daily_routine_patterns.json
data/slot_bank/daily_routine_slots.json
data/generated/daily_routine_sentence_bank.json
```

The generator currently registers supported scenarios in:

```text
scripts/generate_sentences.py
```

Daily Routine must be added to `SCENARIO_CONFIGS`.

Count overrides are currently centralized in:

```text
COUNT_BY_PATTERN_LEVEL
```

Daily Routine must add `ROUTINE_*` count entries there.
```

Do not change files in Phase 0.

## Phase 1: Slot Bank Draft

Add:

```text
data/slot_bank/daily_routine_slots.json
```

The first slot bank should be conservative.

It should include only slots needed for A1 through B1 sentence-level FSI drills.

Recommended initial slots:

```json
{
  "routine_actions_basic": [
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
  ],
  "routine_actions_to_infinitive": [
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
  ],
  "routine_times_simple": [
    "today",
    "every day",
    "in the morning",
    "in the afternoon",
    "in the evening",
    "at night",
    "after school",
    "before school"
  ],
  "routine_action_time_pairs": [
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
  ],
  "routine_places": [
    "at home",
    "at school",
    "in my room",
    "in the bathroom",
    "in the kitchen",
    "in the classroom",
    "at my desk"
  ],
  "routine_action_place_pairs": [
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
  ],
  "routine_states": [
    "tired",
    "busy",
    "sleepy",
    "hungry",
    "thirsty",
    "late",
    "early",
    "ready",
    "free"
  ],
  "routine_problem_pairs": [
    {"subject": "I", "problem": "am too tired"},
    {"subject": "I", "problem": "am too busy"},
    {"subject": "I", "problem": "am late for school"},
    {"subject": "my bag", "problem": "is too heavy"},
    {"subject": "my homework", "problem": "is too hard"},
    {"subject": "my room", "problem": "is too messy"}
  ],
  "routine_reason_pairs": [
    {"sentence_start": "I go to bed early", "reason": "I am tired"},
    {"sentence_start": "I drink water", "reason": "I am thirsty"},
    {"sentence_start": "I eat breakfast", "reason": "I am hungry"},
    {"sentence_start": "I do my homework after school", "reason": "I have time"},
    {"sentence_start": "I study English", "reason": "I have a test"},
    {"sentence_start": "I brush my teeth at night", "reason": "I want clean teeth"},
    {"sentence_start": "I go to school early", "reason": "I do not want to be late"}
  ],
  "routine_before_after_pairs": [
    {"main_clause": "I brush my teeth", "sequence_phrase": "before I go to bed"},
    {"main_clause": "I wash my face", "sequence_phrase": "after I get up"},
    {"main_clause": "I eat breakfast", "sequence_phrase": "before I go to school"},
    {"main_clause": "I do my homework", "sequence_phrase": "after I get home"},
    {"main_clause": "I take a shower", "sequence_phrase": "before I go to bed"}
  ],
  "routine_preference_reason_pairs": [
    {"thing": "my morning routine", "reason": "it is easy"},
    {"thing": "my evening routine", "reason": "it is quiet"},
    {"thing": "reading at night", "reason": "it is fun"},
    {"thing": "studying English", "reason": "it is useful"}
  ],
  "routine_frequency_adverbs": [
    "usually",
    "sometimes",
    "often"
  ],
  "routine_clock_time_pairs": [
    {"action": "get up", "time": "at seven"},
    {"action": "go to school", "time": "at seven thirty"},
    {"action": "eat lunch", "time": "at twelve"},
    {"action": "go home", "time": "at four"},
    {"action": "eat dinner", "time": "at six thirty"},
    {"action": "go to bed", "time": "at nine"}
  ],
  "routine_weekday_weekend_pairs": [
    {"sentence": "I get up early", "context": "on weekdays"},
    {"sentence": "I get up late", "context": "on weekends"},
    {"sentence": "I do my homework", "context": "on weekdays"},
    {"sentence": "I read a book", "context": "on weekends"},
    {"sentence": "I study English", "context": "on weekdays"}
  ],
  "routine_conflict_reason_pairs": [
    {"sentence_start": "I cannot go out", "reason": "I have homework"},
    {"sentence_start": "I cannot play now", "reason": "I have to study"},
    {"sentence_start": "I cannot watch TV", "reason": "I need to finish my homework"}
  ],
  "routine_finish_before_pairs": [
    {"task": "finish my homework", "deadline": "before dinner"},
    {"task": "pack my bag", "deadline": "before school"},
    {"task": "brush my teeth", "deadline": "before bed"},
    {"task": "finish my homework", "deadline": "before I watch TV"}
  ],
  "routine_b1_opinion_pairs": [
    {"subject": "my morning routine", "description": "is busy but useful"},
    {"subject": "my evening routine", "description": "is quiet and easy"},
    {"subject": "my school day", "description": "is busy but fun"},
    {"subject": "my weekend routine", "description": "is relaxed"}
  ]
}
```

Slot design rules:

- Do not use one broad routine action slot for every pattern.
- Use paired slots when time, place, reason, sequence, clock time, conflict reason, or deadline is involved.
- B1 slots may introduce frequency, simple clock times, weekday/weekend contrast, and simple schedule conflicts.
- B1 slots must remain sentence-level and FSI-compatible.
- Do not add routine paragraphs in v1.
- Do not add dialogue turns in v1.
- Do not add complex when clauses in v1.
- Do not add open-ended writing tasks in v1.

## Phase 2: A1 Pattern Bank

Add the A1 variants to `data/pattern_bank/daily_routine_patterns.json`.

A1 should include:

```text
ROUTINE_DO
ROUTINE_BE_STATE
ROUTINE_PLACE
```

Recommended A1 FSI frames:

```text
I {routine_action}.
I am {state}.
I am {place}.
```

Recommended A1 sentence directions:

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
```

A1 must not contain:

```text
because
usually
always
sometimes
often
before I
after I
when I
have to
need to
would like to
too ... for me
clock times
weekday/weekend contrast
```

A1 implementation rule:

Keep sentences short, direct, concrete, and high-frequency.

## Phase 3: A1+ Pattern Bank

Add the A1+ variants to `data/pattern_bank/daily_routine_patterns.json`.

A1+ should include:

```text
ROUTINE_DO_TIME
ROUTINE_LIKE
ROUTINE_WANT
ROUTINE_BE_STATE_TODAY
```

Recommended A1+ FSI frames:

```text
I {action} {time}.
I like to {action}.
I want to {action} today.
I am {state} today.
```

Recommended A1+ sentence directions:

```text
I get up early.
I go to school today.
I go home after school.
I eat breakfast in the morning.
I do my homework after school.
I brush my teeth at night.
I go to bed late.
I like to read a book.
I want to go home today.
I am busy today.
```

A1+ implementation rule:

Use `routine_action_time_pairs` for action + time patterns.

Do not freely combine `routine_actions_basic` with `routine_times_simple`.

## Phase 4: A2 Pattern Bank

Add the A2 variants to `data/pattern_bank/daily_routine_patterns.json`.

A2 should include:

```text
ROUTINE_NEED
ROUTINE_HAVE_TO
ROUTINE_WOULD_LIKE
ROUTINE_CAN_PLACE
ROUTINE_TOO
```

Recommended A2 FSI frames:

```text
I need to {action}.
I have to {action}.
I would like to {action}.
Can I {action} here?
I think {problem_sentence}.
```

Recommended A2 sentence directions:

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

A2 implementation rules:

- Use `routine_actions_to_infinitive` for need / have to / would like to patterns.
- Use `routine_action_place_pairs` for place-based action patterns.
- Use `routine_problem_pairs` for too / problem patterns.
- Do not generate unnatural action + place combinations.

## Phase 5: A2+ Pattern Bank

Add the A2+ variants to `data/pattern_bank/daily_routine_patterns.json`.

A2+ should include:

```text
ROUTINE_REASON
ROUTINE_BEFORE_AFTER
ROUTINE_PREFERENCE_REASON
ROUTINE_PROBLEM_REASON
```

Recommended A2+ FSI frames:

```text
{sentence_start} because {reason}.
{main_clause} {sequence_phrase}.
I like {thing} because {reason}.
I need to {action} because {reason}.
```

Recommended A2+ sentence directions:

```text
I go to bed early because I am tired.
I drink water because I am thirsty.
I eat breakfast because I am hungry.
I do my homework after I get home.
I brush my teeth before I go to bed.
I like my morning routine because it is easy.
I need to study because I have a test.
I do not want to be late for school.
```

A2+ implementation rules:

- Use `routine_reason_pairs` for because clauses.
- Use `routine_before_after_pairs` for before / after sequences.
- Use `routine_preference_reason_pairs` for preference reason clauses.
- Do not freely combine actions and reasons.
- Do not add paragraph-like outputs.

## Phase 6: B1 Pattern Bank

Add the B1 variants to `data/pattern_bank/daily_routine_patterns.json`.

B1 should include:

```text
ROUTINE_USUALLY
ROUTINE_CLOCK_TIME
ROUTINE_WEEKDAY_WEEKEND
ROUTINE_CANNOT_BECAUSE
ROUTINE_FINISH_BEFORE
ROUTINE_ROUTINE_OPINION
```

Recommended B1 FSI frames:

```text
I usually {action} {time}.
I {action} {time}.
{sentence} {context}.
{sentence_start} because {reason}.
I have to {task} {deadline}.
{subject} {description}.
```

Recommended B1 sentence directions:

```text
I usually get up at seven.
I usually go to school at seven thirty.
I sometimes read a book before bed.
I get up early on weekdays.
I get up late on weekends.
I cannot go out because I have homework.
I cannot play now because I have to study.
I have to finish my homework before dinner.
My morning routine is busy but useful.
My weekend routine is relaxed.
```

B1 implementation rules:

- Keep B1 sentence-level.
- Use FSI-style substitution patterns.
- Use paired slots for clock time, weekday/weekend contrast, conflict reasons, and finish-before deadlines.
- Do not generate paragraphs.
- Do not generate dialogues.
- Do not freely combine all actions with all clock times.
- Do not freely combine all conflicts with all reasons.
- Do not add complex `when` clauses.
- Do not add multi-sentence writing tasks.

## Phase 7: Generator Registration

Modify:

```text
scripts/generate_sentences.py
```

Add Daily Routine to `SCENARIO_CONFIGS`:

```python
"daily_routine": {
    "sentence_prefix": "DAILY_ROUTINE",
    "pattern_path": Path("data/pattern_bank/daily_routine_patterns.json"),
    "slot_path": Path("data/slot_bank/daily_routine_slots.json"),
    "output_path": Path("data/generated/daily_routine_sentence_bank.json"),
}
```

Implementation rules:

- Do not change existing `shopping` or `food_drink` config.
- Do not rename existing generated files.
- Do not create a separate Daily Routine generator.
- Do not change the `ContentGenerator` schema unless required by tests.
- Keep generated `sentence_id` format consistent with existing scenarios.

Expected Daily Routine sentence IDs:

```text
A1_DAILY_ROUTINE_ROUTINE_DO_001
B1_DAILY_ROUTINE_ROUTINE_USUALLY_001
```

## Phase 8: Count Configuration

Daily Routine v1 should follow level-specific count guidance.

Do not force every pattern to generate the same number of sentences.

`COUNT_BY_PATTERN_LEVEL` should be treated as a semantic quality cap, not as a full list of every pattern.

Daily Routine count overrides should be added to the existing `COUNT_BY_PATTERN_LEVEL` dictionary in:

```text
scripts/generate_sentences.py
```

Do not create a separate count map in another file unless the whole project is later refactored.

Shopping and Food & Drink already use the same centralized count map.

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

    # B1
    ("ROUTINE_USUALLY", "B1"): 16,
    ("ROUTINE_CLOCK_TIME", "B1"): 16,
    ("ROUTINE_WEEKDAY_WEEKEND", "B1"): 14,
    ("ROUTINE_CANNOT_BECAUSE", "B1"): 12,
    ("ROUTINE_FINISH_BEFORE", "B1"): 12,
    ("ROUTINE_ROUTINE_OPINION", "B1"): 12,
}
```

Implementation rule:

Before adding this map to code, inspect how Shopping and Food & Drink count overrides are currently implemented.

Use the existing project convention.

Do not create a second incompatible count system.

## Phase 9: Generation

Generate Daily Routine sentences into:

```text
data/generated/daily_routine_sentence_bank.json
```

The generated file should contain A1 through B1 sentences in one scenario-level sentence bank.

After slot bank and pattern banks are ready, generate Daily Routine sentences for:

```text
A1
A1+
A2
A2+
B1
```

Generated output should be reviewed by level and pattern.

Generation should not be considered complete until both automated tests and manual review pass.

## Phase 10: Automated Tests

Modify:

```text
tests/test_content_generator.py
```

Add Daily Routine coverage using the existing test style.

Recommended additions:

- `DAILY_ROUTINE_PATTERN_BANK_PATH`
- `DAILY_ROUTINE_SLOT_BANK_PATH`
- `EXPECTED_DAILY_ROUTINE_PATTERNS`
- `make_daily_routine_generator()`

Recommended tests:

```python
def test_daily_routine_a1_has_no_higher_level_structures(sentences):
    forbidden = [
        "because",
        "usually",
        "always",
        "sometimes",
        "often",
        "before I",
        "after I",
        "when I",
        "have to",
        "need to",
        "would like to",
        "at seven",
        "at seven thirty",
        "on weekdays",
        "on weekends",
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


def test_daily_routine_no_bad_too_problem_pairs(sentences):
    bad_pairs = [
        "My breakfast is too sleepy",
        "My homework is too thirsty",
        "My bag is too hungry",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_b1_no_paragraph_outputs(sentences):
    for s in sentences:
        if s["scenario"] == "daily_routine" and s["level"] == "B1":
            text = s["target_sentence"]
            assert text.count(".") <= 1


def test_daily_routine_b1_no_dialogue_outputs(sentences):
    dialogue_markers = ["A:", "B:", "Server:", "Student:", "Teacher:"]
    for s in sentences:
        if s["scenario"] == "daily_routine" and s["level"] == "B1":
            assert not any(marker in s["target_sentence"] for marker in dialogue_markers)


def test_daily_routine_no_bad_clock_time_pairs(sentences):
    bad_pairs = [
        "go to bed at seven thirty",
        "eat lunch at nine",
        "go to school at nine at night",
    ]
    for s in sentences:
        if s["scenario"] == "daily_routine":
            assert not any(x in s["target_sentence"] for x in bad_pairs)


def test_daily_routine_no_bad_conflict_reason_pairs(sentences):
    bad_pairs = [
        "I cannot go out because I am thirsty",
        "I cannot play now because I brush my teeth",
        "I cannot watch TV because I eat breakfast",
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

Test implementation rule:

Adapt these tests to the existing test fixture style in the repository.

If this makes `tests/test_content_generator.py` too long, a later cleanup may move Daily Routine-specific semantic checks to:

```text
tests/test_daily_routine_semantics.py
```

Do not create a separate data loading system.

## Phase 11: Manual Review Checklist

Manual review is required after generation.

## A1 Review

Check that A1 sentences:

- are short
- are concrete
- use high-frequency actions
- avoid because
- avoid before / after clauses
- avoid need to / have to / would like to
- avoid frequency adverbs
- avoid clock times
- avoid weekday/weekend contrast
- avoid B1-like schedule language

## A1+ Review

Check that A1+ sentences:

- use light extensions only
- use natural action + time combinations
- avoid complex sequence logic
- avoid reason clauses
- do not overuse abstract routine words
- remain FSI-friendly

## A2 Review

Check that A2 sentences:

- use need to / have to naturally
- use would like to naturally
- use Can I ... here? naturally
- use paired slots for action + place
- use paired slots for too + problem
- avoid unnatural school obligation sentences
- remain sentence-level

## A2+ Review

Check that A2+ sentences:

- use because clauses naturally
- use before / after sequences only from approved pairs
- avoid random action + reason combinations
- avoid paragraph-like sentences
- avoid dialogue-like sentences

## B1 Review

Check that B1 sentences:

- remain sentence-level FSI outputs
- use frequency adverbs naturally
- use clock times only from approved pairs
- use weekday/weekend contrast naturally
- use conflict + reason pairs naturally
- use finish-before deadlines naturally
- use routine opinion descriptions naturally
- do not become paragraphs
- do not become dialogues
- do not use random action + clock time combinations
- do not use random conflict + reason combinations
- do not introduce complex when clauses

## Phase 12: Completion Criteria

Daily Routine v1 is complete only when:

```text
1. data/slot_bank/daily_routine_slots.json exists and is reviewed.
2. data/pattern_bank/daily_routine_patterns.json exists and includes A1 through B1 variants.
3. scripts/generate_sentences.py registers daily_routine in SCENARIO_CONFIGS.
4. ROUTINE_* count overrides exist in COUNT_BY_PATTERN_LEVEL.
5. data/generated/daily_routine_sentence_bank.json exists.
6. Generated sentence file contains A1 through B1.
7. Daily Routine generator tests pass.
8. Daily Routine semantic tests pass.
9. Existing Shopping and Food & Drink tests still pass.
10. Manual review is complete by level and pattern.
11. A short future expansion note is added if any deferred ideas are discovered.
```

## Deferred Items

The following should not be implemented in Daily Routine v1:

```text
routine paragraphs
routine dialogues
open-ended writing tasks
complex when clauses
multi-sentence schedule planning
advanced habit discussion
teacher/student role-play dialogues
full weekly schedule descriptions
calendar-based planning
```

These should be deferred until Daily Routine v1 is stable.

## Recommended Commit Sequence

Use small commits.

Recommended sequence:

```bash
git add docs/daily_routine_v1_implementation_plan.md
git commit -m "docs: align daily routine implementation plan with repo conventions"

git add data/slot_bank/daily_routine_slots.json
git commit -m "data: add daily routine slot bank"

git add data/pattern_bank/daily_routine_patterns.json
git commit -m "data: add daily routine pattern bank"

git add scripts/generate_sentences.py
git commit -m "scripts: register daily routine generation"

git add data/generated/daily_routine_sentence_bank.json
git commit -m "data: generate daily routine sentence bank"

git add tests/test_content_generator.py
git commit -m "test: add daily routine generator checks"
```

If later split into a separate semantic test:

```bash
git add tests/test_daily_routine_semantics.py
git commit -m "test: add daily routine semantic checks"
```

## Status

Planned.
