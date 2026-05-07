# Daily Routine Slot Usage Audit

## Status

Audit report.

This report checks how A1 / A1+ Daily Routine patterns currently use the new verb-frame slot groups.

No data, generator, UI, API, or test changes are included in this phase.

## Reference Files

- `data/slot_bank/daily_routine_slots.json`
- `data/pattern_bank/daily_routine_patterns.json`
- `data/generated/daily_routine_sentence_bank.json`

## New Verb-Frame Slot Groups

| Slot Group | Item Count |
| --- | ---: |
| `daily_routine_eat_food_A1` | 6 |
| `daily_routine_eat_food_A2` | 5 |
| `daily_routine_eat_food_B1` | 3 |
| `daily_routine_have_object_A1` | 5 |
| `daily_routine_have_object_A2` | 5 |
| `daily_routine_have_object_B1` | 3 |
| `daily_routine_take_object_A1` | 3 |
| `daily_routine_take_object_A2` | 3 |
| `daily_routine_take_object_B1` | 3 |
| `daily_routine_go_to_place_A1` | 4 |
| `daily_routine_go_to_place_A2` | 4 |
| `daily_routine_go_to_place_B1` | 3 |
| `daily_routine_do_task_A1` | 3 |
| `daily_routine_do_task_A2` | 4 |
| `daily_routine_do_task_B1` | 3 |
| `daily_routine_read_object_A1` | 3 |
| `daily_routine_read_object_A2` | 3 |
| `daily_routine_read_object_B1` | 3 |
| `daily_routine_watch_object_A1` | 3 |
| `daily_routine_watch_object_A2` | 3 |
| `daily_routine_watch_object_B1` | 3 |
| `daily_routine_listen_to_object_A1` | 3 |
| `daily_routine_listen_to_object_A2` | 3 |
| `daily_routine_listen_to_object_B1` | 3 |
| `daily_routine_play_object_A1` | 3 |
| `daily_routine_play_object_A2` | 3 |
| `daily_routine_play_object_B1` | 3 |

## A1 / A1+ Pattern Inventory

Legend:

- `uses new verb-frame slots: yes` means at least one `slot_constraints.category` points to a `daily_routine_*` verb-frame group.
- `slots_used` lists slot categories or paired-slot categories actually referenced by the pattern.

### A1

- `ROUTINE_DO` | level: `A1` | template: `I {action}.` | slots_used: `routine_actions_basic` | grammar_focus: `present_simple`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `18` | samples: `I go to school.` / `I study English.` / `I watch TV.` | uses new verb-frame slots: `no`
- `ROUTINE_BE_STATE` | level: `A1` | template: `I am {state}.` | slots_used: `routine_states` | grammar_focus: `be_verb`, `adjectives`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `9` | samples: `I am early.` / `I am ready.` / `I am tired.` | uses new verb-frame slots: `no`
- `ROUTINE_PLACE` | level: `A1` | template: `I am {place}.` | slots_used: `routine_places` | grammar_focus: `be_verb`, `prepositions`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `7` | samples: `I am in the classroom.` / `I am at my desk.` / `I am in my room.` | uses new verb-frame slots: `no`
- `ROUTINE_HAVE_ITEM` | level: `A1` | template: `I have {item}.` | slots_used: `routine_simple_items` | grammar_focus: `have_verb`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `8` | samples: `I have my cup.` / `I have my umbrella.` / `I have my hat.` | uses new verb-frame slots: `no`
- `ROUTINE_READY` | level: `A1` | template: `I am ready now.` | slots_used: none | grammar_focus: `be_verb`, `daily_routine_vocabulary`, `simple_present_affirmative`, `time_expression` | generated count: `1` | samples: `I am ready now.` | uses new verb-frame slots: `no`
- `ROUTINE_SIMPLE_TIME` | level: `A1` | template: `It is {simple_time}.` | slots_used: `routine_simple_times` | grammar_focus: `be_verb`, `time_expression`, `simple_present_affirmative` | generated count: `4` | samples: `It is afternoon.` / `It is night.` / `It is morning.` | uses new verb-frame slots: `no`
- `ROUTINE_HAVE_ITEM_FSI` | level: `A1` | template: `I have {item}.` | slots_used: `routine_have_items_fsi` | grammar_focus: `have_verb`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `10` | samples: `I have my water bottle.` / `I have my school uniform.` / `I have my English book.` | uses new verb-frame slots: `no`
- `ROUTINE_CLEAN_OBJECT` | level: `A1` | template: `I clean {object}.` | slots_used: `routine_clean_objects` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `6` | samples: `I clean the kitchen.` / `I clean my room.` / `I clean my bag.` | uses new verb-frame slots: `no`
- `ROUTINE_BRUSH_OBJECT` | level: `A1` | template: `I brush {object}.` | slots_used: `routine_brush_objects` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `2` | samples: `I brush my hair.` / `I brush my teeth.` | uses new verb-frame slots: `no`
- `ROUTINE_WASH_OBJECT` | level: `A1` | template: `I wash {object}.` | slots_used: `routine_wash_objects` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `2` | samples: `I wash my face.` / `I wash my hands.` | uses new verb-frame slots: `no`
- `ROUTINE_PACK_ITEM_FSI` | level: `A1` | template: `I pack {item}.` | slots_used: `routine_pack_items_fsi` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `8` | samples: `I pack my lunch.` / `I pack my pencil case.` / `I pack my English book.` | uses new verb-frame slots: `no`
- `ROUTINE_GET_ITEM` | level: `A1` | template: `I get {item}.` | slots_used: `routine_get_items` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `8` | samples: `I get my notebook.` / `I get my jacket.` / `I get my books.` | uses new verb-frame slots: `no`
- `ROUTINE_ACTION_PLACE_A1` | level: `A1` | template: `I {action} {place}.` | slots_used: `routine_action_place_pairs` | grammar_focus: `present_simple`, `simple_present_affirmative` | generated count: `17` | samples: `I wash my hands in the bathroom.` / `I eat breakfast in the kitchen.` / `I clean my room in my room.` | uses new verb-frame slots: `no`
- `ROUTINE_CLOCK_TIME_A1` | level: `A1` | template: `I {action} {time}.` | slots_used: `routine_clock_time_pairs` | grammar_focus: `present_simple`, `simple_present_affirmative`, `time_expression` | generated count: `11` | samples: `I get up at seven.` / `I take a shower at eight.` / `I eat dinner at six thirty.` | uses new verb-frame slots: `no`
- `ROUTINE_EVERY_DAY_A1` | level: `A1` | template: `I {action} every day.` | slots_used: `routine_actions_basic` | grammar_focus: `present_simple`, `simple_present_affirmative`, `time_expression` | generated count: `18` | samples: `I go to school every day.` / `I watch TV every day.` / `I go home every day.` | uses new verb-frame slots: `no`

### A1+

- `ROUTINE_DO_TIME` | level: `A1+` | template: `I {action} {time}.` | slots_used: `routine_action_time_pairs` | grammar_focus: `present_simple`, `time_expression`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `21` | samples: `I go to school in the morning.` / `I pack my bag before school.` / `I eat dinner in the evening.` | uses new verb-frame slots: `no`
- `ROUTINE_LIKE` | level: `A1+` | template: `I like to {action}.` | slots_used: `routine_actions_to_infinitive` | grammar_focus: `like_to`, `to_infinitive`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `9` | samples: `I like to drink water.` / `I like to listen to music.` / `I like to read a book.` | uses new verb-frame slots: `no`
- `ROUTINE_WANT` | level: `A1+` | template: `I want to {action} today.` | slots_used: `routine_actions_to_infinitive` | grammar_focus: `want_to`, `to_infinitive`, `daily_routine_vocabulary`, `simple_present_affirmative` | generated count: `7` | samples: `I want to go home today.` / `I want to watch TV today.` / `I want to study English today.` | uses new verb-frame slots: `no`
- `ROUTINE_BE_STATE_TODAY` | level: `A1+` | template: `I am {state} today.` | slots_used: `routine_states` | grammar_focus: `be_verb`, `adjectives`, `simple_present_affirmative` | generated count: `7` | samples: `I am hungry today.` / `I am tired today.` / `I am thirsty today.` | uses new verb-frame slots: `no`
- `ROUTINE_PACK` | level: `A1+` | template: `I {action}.` | slots_used: `routine_pack_actions` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `3` | samples: `I check my homework.` / `I take my lunch.` / `I put my book in my bag.` | uses new verb-frame slots: `no`
- `ROUTINE_HELP_SIMPLE` | level: `A1+` | template: `I {action}.` | slots_used: `routine_help_actions` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `3` | samples: `I help at home.` / `I help my sister.` / `I help my brother.` | uses new verb-frame slots: `no`
- `ROUTINE_CHORE_SIMPLE` | level: `A1+` | template: `I {action}.` | slots_used: `routine_chore_actions` | grammar_focus: `present_simple`, `simple_present_affirmative`, `daily_routine_vocabulary` | generated count: `4` | samples: `I put away my toys.` / `I wash the dishes.` / `I take out the trash.` | uses new verb-frame slots: `no`
- `ROUTINE_PUT_ON` | level: `A1+` | template: `I put on {item}.` | slots_used: `routine_put_on_items` | grammar_focus: `phrasal_verb`, `getting_ready`, `simple_present_affirmative` | generated count: `4` | samples: `I put on my socks.` / `I put on my jacket.` / `I put on my hat.` | uses new verb-frame slots: `no`
- `ROUTINE_CLEAN_OBJECT_TIME` | level: `A1+` | template: `I clean {object} {time}.` | slots_used: `routine_clean_object_time_pairs` | grammar_focus: `present_simple`, `simple_present_affirmative`, `time_expression` | generated count: `5` | samples: `I clean the bathroom on weekends.` / `I clean the table after dinner.` / `I clean my bag on weekends.` | uses new verb-frame slots: `no`
- `ROUTINE_PACK_ITEM_TIME` | level: `A1+` | template: `I pack {item} {time}.` | slots_used: `routine_pack_item_time_pairs` | grammar_focus: `present_simple`, `simple_present_affirmative`, `time_expression` | generated count: `7` | samples: `I pack my pencil case before school.` / `I pack my notebook before school.` / `I pack my books before school.` | uses new verb-frame slots: `no`
- `ROUTINE_PUT_ON_ITEM_TIME` | level: `A1+` | template: `I put on {item} {time}.` | slots_used: `routine_put_on_item_time_pairs` | grammar_focus: `phrasal_verb`, `time_expression`, `getting_ready`, `simple_present_affirmative` | generated count: `4` | samples: `I put on my jacket in the morning.` / `I put on my school uniform in the morning.` / `I put on my hat in the morning.` | uses new verb-frame slots: `no`
- `ROUTINE_WASH_OBJECT_TIME` | level: `A1+` | template: `I wash {object} {time}.` | slots_used: `routine_wash_object_time_pairs` | grammar_focus: `present_simple`, `simple_present_affirmative`, `time_expression` | generated count: `2` | samples: `I wash my hands after school.` / `I wash my hands before dinner.` | uses new verb-frame slots: `no`
- `ROUTINE_FREQUENCY_ACTION` | level: `A1+` | template: `I {frequency} {action}.` | slots_used: `routine_frequency_adverbs`, `routine_actions_basic` | grammar_focus: `present_simple`, `simple_present_affirmative`, `frequency_adverb` | generated count: `30` | samples: `I usually read a book.` / `I often study English.` / `I sometimes go to bed.` | uses new verb-frame slots: `no`
- `ROUTINE_EVERY_DAY_ACTION` | level: `A1+` | template: `I {action} every day.` | slots_used: `routine_frequency_actions` | grammar_focus: `present_simple`, `simple_present_affirmative`, `frequency_adverb`, `time_expression` | generated count: `13` | samples: `I put away my books every day.` / `I help my sister every day.` / `I put away my toys every day.` | uses new verb-frame slots: `no`
- `ROUTINE_ALWAYS_CARE` | level: `A1+` | template: `I always {action}.` | slots_used: `routine_personal_care_actions` | grammar_focus: `present_simple`, `simple_present_affirmative`, `frequency_adverb` | generated count: `4` | samples: `I always take a shower.` / `I always wash my face.` / `I always wash my hands.` | uses new verb-frame slots: `no`
- `ROUTINE_SOMETIMES_LEISURE` | level: `A1+` | template: `I sometimes {action}.` | slots_used: `routine_actions_to_infinitive` with leisure filter | grammar_focus: `present_simple`, `simple_present_affirmative`, `frequency_adverb` | generated count: `1` | samples: `I sometimes read a book.` | uses new verb-frame slots: `no`
- `ROUTINE_NEGATIVE_TIME_A1PLUS` | level: `A1+` | template: `I do not {action} {time}.` | slots_used: `routine_action_time_pairs` | grammar_focus: `present_simple`, `simple_present_negative`, `time_expression` | generated count: `21` | samples: `I do not listen to music in the evening.` / `I do not pack my bag before school.` / `I do not eat dinner in the evening.` | uses new verb-frame slots: `no`
- `ROUTINE_NEGATIVE_ACTION_A1PLUS` | level: `A1+` | template: `I do not {action}.` | slots_used: `routine_chore_actions`, `routine_help_actions`, `routine_school_preparation_actions` | grammar_focus: `present_simple`, `simple_present_negative` | generated count: `16` | samples: `I do not help my brother.` / `I do not take my lunch.` / `I do not put my book in my bag.` | uses new verb-frame slots: `no`
- `ROUTINE_NEGATIVE_PACK_TIME` | level: `A1+` | template: `I do not pack {item} {time}.` | slots_used: `routine_pack_item_time_pairs` | grammar_focus: `present_simple`, `simple_present_negative`, `time_expression` | generated count: `7` | samples: `I do not pack my books before school.` / `I do not pack my pencil case before school.` / `I do not pack my English book before school.` | uses new verb-frame slots: `no`
- `ROUTINE_NEGATIVE_LEISURE_A1PLUS` | level: `A1+` | template: `I do not {action} at night.` | slots_used: `routine_actions_to_infinitive` with leisure filter | grammar_focus: `present_simple`, `simple_present_negative`, `time_expression` | generated count: `3` | samples: `I do not read a book at night.` / `I do not listen to music at night.` / `I do not watch TV at night.` | uses new verb-frame slots: `no`
- `ROUTINE_QUESTION_ACTION_A1PLUS` | level: `A1+` | template: `Do you {action}?` | slots_used: `routine_actions_basic` | grammar_focus: `present_simple`, `do_does_yes_no_question` | generated count: `18` | samples: `Do you study English?` / `Do you put on my shoes?` / `Do you listen to music?` | uses new verb-frame slots: `no`
- `ROUTINE_QUESTION_TIME_A1PLUS` | level: `A1+` | template: `Do you {action} {time}?` | slots_used: `routine_action_time_pairs` | grammar_focus: `present_simple`, `do_does_yes_no_question`, `time_expression` | generated count: `21` | samples: `Do you get up in the morning?` / `Do you eat dinner in the evening?` / `Do you brush my teeth at night?` | uses new verb-frame slots: `no`
- `ROUTINE_QUESTION_PACK_TIME_A1PLUS` | level: `A1+` | template: `Do you pack {item} {time}?` | slots_used: `routine_pack_item_time_pairs` | grammar_focus: `present_simple`, `do_does_yes_no_question`, `time_expression` | generated count: `7` | samples: `Do you pack my homework before school?` / `Do you pack my water bottle in the morning?` / `Do you pack my English book before school?` | uses new verb-frame slots: `no`
- `ROUTINE_QUESTION_BRING_ITEM_A1PLUS` | level: `A1+` | template: `Do you bring {item} to school?` | slots_used: `routine_bring_items` | grammar_focus: `present_simple`, `do_does_yes_no_question` | generated count: `10` | samples: `Do you bring my notebook to school?` / `Do you bring my umbrella to school?` / `Do you bring my water bottle to school?` | uses new verb-frame slots: `no`
- `ROUTINE_THIRD_PERSON_GET_UP_A1PLUS` | level: `A1+` | template: `He gets up at seven.` | slots_used: none | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `He gets up at seven.` | uses new verb-frame slots: `no`
- `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS` | level: `A1+` | template: `My brother does homework after school.` | slots_used: none | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `My brother does homework after school.` | uses new verb-frame slots: `no`
- `ROUTINE_OFTEN_LEISURE_AT_NIGHT` | level: `A1+` | template: `I often {action} at night.` | slots_used: `routine_actions_to_infinitive` with leisure filter | grammar_focus: `present_simple`, `simple_present_affirmative`, `frequency_adverb`, `time_expression` | generated count: `3` | samples: `I often watch TV at night.` / `I often read a book at night.` / `I often listen to music at night.` | uses new verb-frame slots: `no`
- `ROUTINE_THIRD_PERSON_BREAKFAST_A1PLUS` | level: `A1+` | template: `She eats {food} at home.` | slots_used: `daily_routine_eat_food_A1` | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `She eats breakfast at home.` | uses new verb-frame slots: `yes`
- `ROUTINE_THIRD_PERSON_READ_A1PLUS` | level: `A1+` | template: `My sister reads {object} at night.` | slots_used: `daily_routine_read_object_A1` | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `My sister reads a book at night.` | uses new verb-frame slots: `yes`
- `ROUTINE_THIRD_PERSON_WATCH_A1PLUS` | level: `A1+` | template: `My father watches {object} in the evening.` | slots_used: `daily_routine_watch_object_A1` | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `My father watches TV in the evening.` | uses new verb-frame slots: `yes`
- `ROUTINE_THIRD_PERSON_WORK_A1PLUS` | level: `A1+` | template: `My mother goes to work in the morning.` | slots_used: none | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `My mother goes to work in the morning.` | uses new verb-frame slots: `no`
- `ROUTINE_THIRD_PERSON_BRUSH_A1PLUS` | level: `A1+` | template: `He brushes his teeth at night.` | slots_used: none | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `He brushes his teeth at night.` | uses new verb-frame slots: `no`
- `ROUTINE_THIRD_PERSON_PACK_A1PLUS` | level: `A1+` | template: `She packs her bag before school.` | slots_used: none | grammar_focus: `present_simple`, `simple_present_affirmative`, `third_person_singular`, `time_expression`, `before_after_sequence` | generated count: `1` | samples: `She packs her bag before school.` | uses new verb-frame slots: `no`
- `ROUTINE_DOES_BROTHER_HOMEWORK_A1PLUS` | level: `A1+` | template: `Does your brother do {task} after school?` | slots_used: `daily_routine_do_task_A1` | grammar_focus: `present_simple`, `do_does_yes_no_question`, `third_person_singular`, `time_expression` | generated count: `1` | samples: `Does your brother do homework after school?` | uses new verb-frame slots: `yes`
- `ROUTINE_DOES_SHE_GO_TO_SCHOOL_A1PLUS` | level: `A1+` | template: `Does she go to {place} by bus?` | slots_used: `daily_routine_go_to_place_A1` | grammar_focus: `present_simple`, `do_does_yes_no_question`, `third_person_singular` | generated count: `1` | samples: `Does she go to school by bus?` | uses new verb-frame slots: `yes`

## Already Migrated Patterns

These patterns already use the new verb-frame slot groups.

| Pattern | Old Style If Inferable | New Slot Used | Generated Sample | Output Unchanged |
| --- | --- | --- | --- | --- |
| `ROUTINE_THIRD_PERSON_BREAKFAST_A1PLUS` | fixed `breakfast` phrase | `daily_routine_eat_food_A1` | `She eats breakfast at home.` | yes |
| `ROUTINE_THIRD_PERSON_READ_A1PLUS` | fixed `a book` phrase | `daily_routine_read_object_A1` | `My sister reads a book at night.` | yes |
| `ROUTINE_THIRD_PERSON_WATCH_A1PLUS` | fixed `TV` phrase | `daily_routine_watch_object_A1` | `My father watches TV in the evening.` | yes |
| `ROUTINE_DOES_BROTHER_HOMEWORK_A1PLUS` | fixed `homework` phrase | `daily_routine_do_task_A1` | `Does your brother do homework after school?` | yes |
| `ROUTINE_DOES_SHE_GO_TO_SCHOOL_A1PLUS` | fixed `school` phrase | `daily_routine_go_to_place_A1` | `Does she go to school by bus?` | yes |

## Not Yet Migrated Patterns

### Safe to migrate now

These are not yet migrated, but a zero-output-change migration is realistic with current slot inventory.

- `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS`
  - Current style: fixed sentence
  - Why safe: can bind `homework` to `daily_routine_do_task_A1`
  - Risk: low
  - Expected output: unchanged

### Needs careful migration

These can likely be migrated, but the sentence set may drift because current patterns mix multiple verbs in one action slot or because `ensure_unique_targets` can reshuffle which level keeps a duplicated sentence.

- `ROUTINE_DO`
- `ROUTINE_HAVE_ITEM`
- `ROUTINE_HAVE_ITEM_FSI`
- `ROUTINE_DO_TIME`
- `ROUTINE_LIKE`
- `ROUTINE_WANT`
- `ROUTINE_FREQUENCY_ACTION`
- `ROUTINE_EVERY_DAY_A1`
- `ROUTINE_EVERY_DAY_ACTION`
- `ROUTINE_SOMETIMES_LEISURE`
- `ROUTINE_NEGATIVE_LEISURE_A1PLUS`
- `ROUTINE_QUESTION_ACTION_A1PLUS`
- `ROUTINE_OFTEN_LEISURE_AT_NIGHT`

Common reason:

- one slot currently carries a full action phrase such as `read a book`, `go to school`, or `watch TV`
- migrating to verb-frame form would require splitting one action slot into verb + object or verb + place without changing the visible sentence set
- current generator does not infer inflection or recombine frame pieces automatically

### Do not migrate yet

These should stay on the old structure for now.

- `ROUTINE_BE_STATE`
- `ROUTINE_PLACE`
- `ROUTINE_READY`
- `ROUTINE_SIMPLE_TIME`
- `ROUTINE_PACK`
- `ROUTINE_HELP_SIMPLE`
- `ROUTINE_CHORE_SIMPLE`
- `ROUTINE_PUT_ON`
- `ROUTINE_CLEAN_OBJECT`
- `ROUTINE_BRUSH_OBJECT`
- `ROUTINE_WASH_OBJECT`
- `ROUTINE_PACK_ITEM_FSI`
- `ROUTINE_GET_ITEM`
- `ROUTINE_CLEAN_OBJECT_TIME`
- `ROUTINE_PACK_ITEM_TIME`
- `ROUTINE_PUT_ON_ITEM_TIME`
- `ROUTINE_WASH_OBJECT_TIME`
- `ROUTINE_ALWAYS_CARE`
- `ROUTINE_NEGATIVE_TIME_A1PLUS`
- `ROUTINE_NEGATIVE_ACTION_A1PLUS`
- `ROUTINE_NEGATIVE_PACK_TIME`
- `ROUTINE_QUESTION_TIME_A1PLUS`
- `ROUTINE_QUESTION_PACK_TIME_A1PLUS`
- `ROUTINE_QUESTION_BRING_ITEM_A1PLUS`
- `ROUTINE_THIRD_PERSON_GET_UP_A1PLUS`
- `ROUTINE_THIRD_PERSON_WORK_A1PLUS`
- `ROUTINE_THIRD_PERSON_BRUSH_A1PLUS`
- `ROUTINE_THIRD_PERSON_PACK_A1PLUS`
- `ROUTINE_ACTION_PLACE_A1`
- `ROUTINE_CLOCK_TIME_A1`

Common reason:

- paired semantic slots should stay paired
- personal-care routines should stay paired
- some patterns have no matching new verb-frame family yet
- some patterns depend on time/place being fused to the action
- some patterns would need subject-aware base-form / `-s` form support

## Needs Schema / Generator Support

The following not-yet-migrated patterns are blocked mainly by schema or generator limits rather than missing vocabulary.

- `ROUTINE_DO`
- `ROUTINE_DO_TIME`
- `ROUTINE_LIKE`
- `ROUTINE_WANT`
- `ROUTINE_FREQUENCY_ACTION`
- `ROUTINE_EVERY_DAY_A1`
- `ROUTINE_EVERY_DAY_ACTION`
- `ROUTINE_SOMETIMES_LEISURE`
- `ROUTINE_NEGATIVE_TIME_A1PLUS`
- `ROUTINE_NEGATIVE_LEISURE_A1PLUS`
- `ROUTINE_QUESTION_ACTION_A1PLUS`
- `ROUTINE_QUESTION_TIME_A1PLUS`
- `ROUTINE_OFTEN_LEISURE_AT_NIGHT`
- `ROUTINE_THIRD_PERSON_GET_UP_A1PLUS`

Main blocker types:

- one field currently stores a fully formed action phrase
- generator has no native `allowed_frames` enforcement step during pattern expansion
- generator does not transform base verb to third-person `-s` or reverse `does + base` automatically
- negative and question patterns using mixed action slots would need frame-aware base-form control

## A1 Migration Candidates

### `I eat {food}.`

- Current pattern style: embedded inside `ROUTINE_DO`, `ROUTINE_ACTION_PLACE_A1`, `ROUTINE_CLOCK_TIME_A1`, and `ROUTINE_EVERY_DAY_A1` as full action phrases such as `eat breakfast`
- Matching verb-frame slot exists: yes, `daily_routine_eat_food_A1`
- Zero-output-change possible: not as a broad migration with current schema
- Recommended next action: migrate in a dedicated frame family or add schema support for `verb + object` composition while preserving existing time/place wrappers

### `I have {object}.`

- Current pattern style: `ROUTINE_HAVE_ITEM` and `ROUTINE_HAVE_ITEM_FSI`
- Matching verb-frame slot exists: partially
- Zero-output-change possible: not yet, because current generated items include `my cup`, `my umbrella`, `my water bottle`, `my school uniform`, and similar items not covered by the new `have_object_A1` inventory
- Recommended next action: either expand `daily_routine_have_object_A1` to mirror current inventory or defer migration until inventory is intentionally changed

### `I go to {place}.`

- Current pattern style: mixed into `routine_actions_basic`, `routine_action_time_pairs`, and fixed question/third-person patterns
- Matching verb-frame slot exists: yes, `daily_routine_go_to_place_A1`
- Zero-output-change possible: yes for fixed patterns, not yet for broad mixed-action patterns
- Recommended next action: keep the two migrated A1+ fixed patterns; plan a controlled migration for A1 mixed-action patterns later

### `I do {task}.`

- Current pattern style: mixed into `ROUTINE_DO`, time pairs, and fixed third-person/question patterns
- Matching verb-frame slot exists: yes, `daily_routine_do_task_A1`
- Zero-output-change possible: yes for fixed third-person outputs, no for broad A1 mixed-action sets
- Recommended next action: migrate `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS` next; defer broad A1 migration

### `I read {object}.`

- Current pattern style: embedded in action slots and leisure subsets
- Matching verb-frame slot exists: yes, `daily_routine_read_object_A1`
- Zero-output-change possible: yes only for fixed outputs; no for multi-verb action pools
- Recommended next action: defer general migration until frame composition or pattern splitting is planned

### `I watch {object}.`

- Current pattern style: embedded in action slots and leisure subsets
- Matching verb-frame slot exists: yes, `daily_routine_watch_object_A1`
- Zero-output-change possible: yes only for fixed outputs; no for multi-verb action pools
- Recommended next action: same as `read`

### `I listen to {object}.`

- Current pattern style: embedded in action slots and leisure subsets
- Matching verb-frame slot exists: yes, `daily_routine_listen_to_object_A1`
- Zero-output-change possible: not with current generic `{action}` patterns
- Recommended next action: defer until generator can safely distinguish `listen to` from bare-verb frames

### `I play {object}.`

- Current pattern style: currently appears through action-phrase inventories, not dedicated A1 patterns
- Matching verb-frame slot exists: yes, `daily_routine_play_object_A1`
- Zero-output-change possible: not yet
- Recommended next action: defer until a controlled play-frame pattern family is explicitly planned

### `I get up / wake up / come home / go to bed` action-time pairs

- Current pattern style: paired time structures such as `routine_action_time_pairs` and `routine_clock_time_pairs`
- Matching verb-frame slot exists: only partially
- Zero-output-change possible: no
- Recommended next action: keep as paired action-time data for now

### Personal care routines

- Current pattern style: dedicated object slots and personal-care pairs
- Matching verb-frame slot exists: partly, but personal-care meaning depends on the pair
- Zero-output-change possible: not worth forcing
- Recommended next action: keep paired-slot design

## A1+ Migration Candidates

### Frequency patterns

- Current pattern style: adverb + full action phrase
- Matching verb-frame slot exists: partly
- Zero-output-change possible: rarely
- Should wait until FSI activation: mostly yes

Relevant patterns:

- `ROUTINE_FREQUENCY_ACTION`
- `ROUTINE_EVERY_DAY_ACTION`
- `ROUTINE_ALWAYS_CARE`
- `ROUTINE_SOMETIMES_LEISURE`
- `ROUTINE_OFTEN_LEISURE_AT_NIGHT`

Reason:

- frame-safe migration would work best when the system can treat `frequency + verb + object/place` as structured output rather than a single action string

### Negative patterns

- Current pattern style: `do not + action` or `do not + paired action/time`
- Matching verb-frame slot exists: partly
- Zero-output-change possible: only in very narrow cases
- Should wait until FSI activation: yes for most mixed-action negative patterns

Relevant patterns:

- `ROUTINE_NEGATIVE_TIME_A1PLUS`
- `ROUTINE_NEGATIVE_ACTION_A1PLUS`
- `ROUTINE_NEGATIVE_PACK_TIME`
- `ROUTINE_NEGATIVE_LEISURE_A1PLUS`

### Do/Does yes/no question patterns

- Current pattern style: `Do you {action}?`, `Do you {action} {time}?`, plus fixed third-person questions
- Matching verb-frame slot exists: partly
- Zero-output-change possible: yes for fixed patterns only
- Should wait until FSI activation: yes for broad `Do you {action}` families

Relevant patterns:

- `ROUTINE_QUESTION_ACTION_A1PLUS`
- `ROUTINE_QUESTION_TIME_A1PLUS`
- `ROUTINE_QUESTION_PACK_TIME_A1PLUS`
- `ROUTINE_QUESTION_BRING_ITEM_A1PLUS`
- `ROUTINE_DOES_BROTHER_HOMEWORK_A1PLUS`
- `ROUTINE_DOES_SHE_GO_TO_SCHOOL_A1PLUS`

### Third-person singular patterns

- Current pattern style: fixed outputs
- Matching verb-frame slot exists: yes for some, no for others
- Zero-output-change possible: yes for fixed object/place patterns
- Should wait until FSI activation: partly

Relevant patterns:

- already migrated: `ROUTINE_THIRD_PERSON_BREAKFAST_A1PLUS`, `ROUTINE_THIRD_PERSON_READ_A1PLUS`, `ROUTINE_THIRD_PERSON_WATCH_A1PLUS`
- safe next: `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS`
- defer: `ROUTINE_THIRD_PERSON_GET_UP_A1PLUS`, `ROUTINE_THIRD_PERSON_WORK_A1PLUS`, `ROUTINE_THIRD_PERSON_BRUSH_A1PLUS`, `ROUTINE_THIRD_PERSON_PACK_A1PLUS`

## Slot Usage Summary

| Category | Pattern Count | Uses New Slots | Still Old Style | Safe to Migrate | Needs Care | Do Not Migrate Yet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A1 simple present | 11 | 0 | 11 | 0 | 3 | 8 |
| A1 time expression | 4 | 0 | 4 | 0 | 1 | 3 |
| A1+ frequency | 5 | 0 | 5 | 0 | 4 | 1 |
| A1+ negative | 4 | 0 | 4 | 0 | 1 | 3 |
| A1+ question | 6 | 2 | 4 | 0 | 1 | 3 |
| A1+ third person | 8 | 3 | 5 | 1 | 0 | 4 |

## Risks Found

- The new verb-frame slot groups exist, but most A1 / A1+ generated output still comes from old action-phrase or paired-slot structures.
- The generator currently filters slot items by direct field equality. It does not actively interpret `allowed_frames` as a frame-composition system.
- `ensure_unique_targets` means even a careful migration can move sentence ownership across levels if a migrated pattern starts generating a sentence already produced somewhere else.
- Several A1+ negative and question patterns still use broad action phrases. These are the most likely places where migration can accidentally create awkward outputs unless base-form control stays explicit.
- Personal-care routines are safer as paired slots than as free verb-object recombination.
- A1 `have` patterns are blocked more by slot inventory mismatch than by template structure.

## Recommended Next Step

1. Finish safe zero-output-change migration for `ROUTINE_THIRD_PERSON_HOMEWORK_A1PLUS`.
2. Audit whether `daily_routine_have_object_A1` should be expanded to cover the current `have item` sentence inventory before migrating `ROUTINE_HAVE_ITEM` and `ROUTINE_HAVE_ITEM_FSI`.
3. Plan A1 simple frame migrations around dedicated verb families instead of one generic `ROUTINE_DO` action slot.
4. Defer broad A1+ frequency migrations until frame-aware migration strategy is decided.
5. Defer most A1+ negative and question migrations until FSI activation or explicit base-form-safe schema support is in place.
6. Keep personal-care, action-time, and action-place pairs paired until a later phase explicitly replaces them.
7. Only after the migration set is chosen, regenerate and retest the bank once.

## Completion Criteria for Future Migration

- A1 simple present patterns use verb-frame slots wherever the surface sentence can stay stable.
- A1+ frequency patterns use verb-frame slots where migration is demonstrably safe.
- Generated `target_sentence` values remain unique.
- Semantic safety scan still passes.
- No unexpected level-count drift appears after regeneration.
- No script changes are introduced unless explicitly planned and reviewed.
