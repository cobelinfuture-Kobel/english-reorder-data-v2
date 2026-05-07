# Daily Routine A1 Core Frame Coverage Review

## Status

Audit report.

This review checks the current A1 core frame coverage in Daily Routine and evaluates whether the next production frame pattern should be `watch`, `do`, `play`, `listen_to`, `have`, or `take`.

No data, generator, UI, API, or test changes are included in this phase.

## 1. Live A1 Production Frame Patterns

### `ROUTINE_FRAME_EAT_FOOD_A1`

- `pattern_id`: `ROUTINE_FRAME_EAT_FOOD_A1`
- `frame`: `eat`
- `slot_bindings`: `{"object": "daily_routine_eat_food_A1"}`
- slot group item count: `6`
- slot items:
  - `breakfast`
  - `lunch`
  - `dinner`
  - `rice`
  - `noodles`
  - `an apple`
- actual generated count: `3`
- duplicate filtered count: `3`
  - filtered by existing coverage:
    - `I eat breakfast.`
    - `I eat lunch.`
    - `I eat dinner.`
- actual target sentences:
  - `I eat an apple.`
  - `I eat rice.`
  - `I eat noodles.`
- semantic safety result: pass
  - no `eat homework`
  - no `eat my teeth`
  - no `eat school`

### `ROUTINE_FRAME_GO_TO_PLACE_A1`

- `pattern_id`: `ROUTINE_FRAME_GO_TO_PLACE_A1`
- `frame`: `go_to`
- `slot_bindings`: `{"place": "daily_routine_go_to_place_A1"}`
- slot group item count: `3`
- slot items:
  - `school`
  - `bed`
  - `the park`
- actual generated count: `1`
- duplicate filtered count: `2`
  - filtered by existing coverage:
    - `I go to school.`
    - `I go to bed.`
- actual target sentences:
  - `I go to the park.`
- semantic safety result: pass
  - no `go to homework`
  - no `go to a shower`
  - no `go to breakfast`
  - no `go to my teeth`

### `ROUTINE_FRAME_READ_OBJECT_A1`

- `pattern_id`: `ROUTINE_FRAME_READ_OBJECT_A1`
- `frame`: `read`
- `slot_bindings`: `{"object": "daily_routine_read_object_A1"}`
- slot group item count: `3`
- slot items:
  - `a book`
  - `a story`
  - `a comic`
- actual generated count: `2`
- duplicate filtered count: `1`
  - filtered by existing coverage:
    - `I read a book.`
- actual target sentences:
  - `I read a story.`
  - `I read a comic.`
- semantic safety result: pass
  - no `read dinner`
  - no `read breakfast`
  - no `read homework`

## 2. A1 Core Frame Candidate Review

### `watch` → `daily_routine_watch_object_A1`

- slot group exists: yes
- item count: `3`
- items:
  - `TV`
  - `cartoons`
  - `a video`
- likely duplicates:
  - `I watch TV.` already exists
- likely new outputs:
  - `I watch cartoons.`
  - `I watch a video.`
- semantic risk: low
- article / phrase risk: low
  - `a video` is already phrase-safe
- ready for production pattern: yes

### `do` → `daily_routine_do_task_A1`

- slot group exists: yes
- item count: `3`
- items:
  - `homework`
  - `my homework`
  - `exercise`
- likely duplicates:
  - `I do my homework.` already exists
- likely new outputs:
  - `I do homework.`
  - `I do exercise.`
- semantic risk: medium
  - `I do exercise.` is grammatical but slightly less natural than `I exercise` or `I do exercise every day` in some contexts
- article / phrase risk: low
- ready for production pattern: yes, but with small style risk

### `play` → `daily_routine_play_object_A1`

- slot group exists: yes
- item count: `3`
- items:
  - `soccer`
  - `basketball`
  - `a game`
- likely duplicates: low
- likely new outputs:
  - `I play soccer.`
  - `I play basketball.`
  - `I play a game.`
- semantic risk: low
- article / phrase risk: low
- ready for production pattern: yes

### `listen_to` → `daily_routine_listen_to_object_A1`

- slot group exists: yes
- item count: `3`
- items:
  - `music`
  - `a song`
  - `the teacher`
- likely duplicates:
  - `I listen to music.` already exists
- likely new outputs:
  - `I listen to a song.`
  - `I listen to the teacher.`
- semantic risk: low
- article / phrase risk: low
- ready for production pattern: yes

### `have` → `daily_routine_have_object_A1`

- slot group exists: yes
- item count: `5`
- items:
  - `breakfast`
  - `lunch`
  - `dinner`
  - `my book`
  - `my bag`
- likely duplicates:
  - `I have my book.` already exists
  - `I have my bag.` already exists
- likely new outputs:
  - `I have breakfast.`
  - `I have lunch.`
  - `I have dinner.`
- semantic risk: medium
  - not wrong, but very close in function to existing `eat` coverage
- article / phrase risk: low
- ready for production pattern: yes, but lower priority

### `take` → `daily_routine_take_object_A1`

- slot group exists: yes
- item count: `3`
- items:
  - `a shower`
  - `a bath`
  - `the bus`
- likely duplicates:
  - `I take a shower.` already exists
- likely new outputs:
  - `I take a bath.`
  - `I take the bus.`
- semantic risk: medium
  - mixes hygiene and transport in one simple A1 frame
- article / phrase risk: low
- ready for production pattern: yes, but less clean pedagogically than `watch`, `play`, or `listen_to`

## 3. A1 Generated Distribution

- total A1 sentence count: `135`
- frame-aware generated count: `6`
  - `ROUTINE_FRAME_EAT_FOOD_A1`: `3`
  - `ROUTINE_FRAME_GO_TO_PLACE_A1`: `1`
  - `ROUTINE_FRAME_READ_OBJECT_A1`: `2`
- old-style action phrase count: `129`
- frame-aware percentage: about `4.4%`

Assessment:

- A1 production frame coverage is still small
- the system is still mostly old-style at A1
- the current three frame patterns prove the generator works, but they do not yet dominate A1 output

## 4. A1 Vocabulary Balance

Rough A1 distribution from generated output:

- food: `18`
- place: `17`
- reading: `6`
- media: `3`
- task: `7`
- play/activity: `0` direct frame coverage so far
- personal care: `11`

Assessment:

- food and place are already strong
- reading now has explicit frame coverage
- media is still light
- play/activity is underrepresented
- personal care is covered, but through old paired/action-based structures rather than frame patterns

## 5. Risk Assessment

### Low Risk

- `watch`
- `play`
- `listen_to`

These all have:

- clean A1 slot groups
- phrase-safe items
- clear semantic boundaries
- low exception pressure

### Medium Risk

- `do`
- `have`
- `take`

Reasons:

- `do` has style/naturalness questions around `I do exercise.`
- `have` overlaps heavily with existing `eat` and item-possession coverage
- `take` mixes two semantic families (`a bath` / `the bus`) under one surface pattern

### High Risk

- none of the current six candidates are truly high-risk in the same way `go_to + home` was
- the higher-risk issue is not the frame itself, but whether a mixed slot group starts to hide quality issues

## 6. Recommended Next Frame

### 1. Most Recommended

`watch`

Why:

- very simple grammar
- low semantic ambiguity
- likely yields two clean new A1 sentences
- no new exception rule needed

### 2. Second Recommended

`listen_to`

Why:

- also grammatically simple
- phrase forms are clean
- likely yields two new sentences after one duplicate is filtered
- good semantic contrast with `read`

### 3. Deferred Frame

`take`

Why:

- still possible, but less clean as an A1 core frame because the slot group mixes routine hygiene and transport
- better after a bit more slot-family refinement or with a clearer A1 teaching objective

## 7. Completion Recommendation

Yes, it is appropriate to continue adding A1 core frame patterns.

Recommended next frame:

- `watch`

Why:

- it is the cleanest next production trial after `eat`, `go_to`, and `read`
- it has low duplicate pressure
- it is semantically safe
- it does not introduce a new exception rule
- it improves A1 vocabulary balance by strengthening media coverage
