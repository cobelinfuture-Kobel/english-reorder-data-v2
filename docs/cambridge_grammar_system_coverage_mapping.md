# Cambridge Grammar to System Coverage Mapping

## Status

Planning / reference document.

This document maps Cambridge / CEFR A1-B1 grammar expectations to the project's sentence-bank, FSI, paired-slot, and scenario-based implementation model.

This is a reference document only.

It does not change:

- slot banks
- pattern banks
- generated sentence data
- generator code
- tests
- application code
- UI behavior

## Purpose

This document is used to:

- compare Cambridge grammar targets with current system capability
- guide future scenario sentence expansion
- identify grammar gaps by level
- prevent uncontrolled grammar expansion
- decide which scenario should carry which grammar
- support Food & Drink, Shopping, Daily Routine, and future scenarios
- provide a reference for sentence review and supplementation

## 0. System Level Definition

The project uses an internal Level 1-6 model to control grammar scope, substitution safety, and scenario rollout.

| System Level | Name | Main Function | Current Status |
| --- | --- | --- | --- |
| Level 1 | Core Sentence Frames | short stable sentence frames, first-person learner language | implemented in active scenarios |
| Level 2 | Chunk / Verb Expansion | controlled object/item/action substitution | partly implemented |
| Level 3 | Connected Meaning | because / before / after / reason / sequence | partly implemented |
| Level 4 | Question / Negative Control | controlled question and negative forms | partly implemented in Daily Routine |
| Level 5 | Grammar-Aware Agreement | pronoun / possessive / number / subject-verb agreement | implemented minimally in Daily Routine Phase 5 |
| Level 6 | Controlled Tense Families | past simple, present continuous, going to future, present perfect basics | planned only |

Important principle:

FSI is controlled substitution, not a free transformation engine.

Grammar expansion must use:

- paired slots
- explicit pattern families
- level gating
- semantic compatibility rules
- regression tests

## 1. A1 Grammar Mapping

| Cambridge A1 Grammar | Example | System Implementation | Best Scenario Carrier | Current Coverage | Gap |
| --- | --- | --- | --- | --- | --- |
| be: am / is / are | I am ready. She is late. They are here. | fixed starter patterns and core sentence frames | Family / People, Feelings / Health, Weather | partial | broader person coverage and more scenario spread |
| have | I have my book. | slot-based possession patterns; partly expanded in Daily Routine | Daily Routine, Family / People, School / Classroom | partial | broader third-person and plural families |
| first-person present simple | I eat breakfast. I go to school. | strongest current pattern family in scenario banks | Daily Routine, Food & Drink, Work / Jobs | strong | more verb variety across scenarios |
| basic nouns | book, bag, cup, floor | core noun slot inventories | all scenarios | strong | broader domain coverage in newer scenarios |
| a / an / the | a bag, an apple, the floor | limited fixed phrases; not yet systematic | Food & Drink, Shopping, Places / Town | limited | article control and review rules |
| singular / plural basics | book / books | some paired noun slots and count control | Shopping, Food & Drink, Family / People | partial | systematic plural agreement and quantifier interaction |
| this / that | this bag, that book | not yet systematic | Shopping, School / Classroom | limited | demonstrative pattern families |
| there is / there are | There is a book. There are two chairs. | not yet a strong implemented family | Home / Chores, Places / Town | limited | dedicated existential patterns |
| in / on / at | in my bag, on the table, at school | common fixed chunks in sentences | Daily Routine, Home / Chores, Places / Town | partial | more explicit preposition coverage and testing |
| basic can | I can swim. | controlled ability patterns in some banks | Sports / Activities, Technology / Devices | partial | broader scenario rollout |
| imperatives | Sit down. Open your book. | not yet a major bank family | School / Classroom, Technology / Devices | limited | instruction pattern families |
| basic WH questions | Where is my book? | only partly implemented through question work | School / Classroom, Shopping, Places / Town | limited | systematic WH question patterns |
| yes/no questions | Do you like apples? | Daily Routine has begun controlled question support | Daily Routine, Food & Drink, Sports / Activities | partial | broader cross-scenario question support |
| simple negatives | I do not clean my room. | controlled negatives now partly present in Daily Routine | Daily Routine, Home / Chores, Work / Jobs | partial | more verbs and more levels |

A1 current coverage: approximately 60%-75%.

With 15 scenarios Level 1-3: approximately 80%-90%.

Main A1 gaps:

- there is / there are
- imperatives
- this / that
- systematic articles
- classroom WH questions

## 2. A1+ Grammar Mapping

A1+ is used as an internal bridge level between basic A1 sentence stability and more explicit grammar-aware expansion.

| A1+ Grammar | Example | System Implementation | Best Scenario Carrier | Current Coverage | Gap |
| --- | --- | --- | --- | --- | --- |
| like to + verb | I like to read after school. | common fixed preference frames | Hobbies / Free Time, Daily Routine | partial | broader activity coverage |
| want to + verb | I want to buy a snack. | fixed intention chunks in limited patterns | Shopping, Food & Drink, Travel / Transport | partial | more cross-scenario reuse |
| need to + verb | I need to clean my room. | present in Daily Routine and some planning docs | Daily Routine, Home / Chores, School / Classroom | partial | more stable level placement |
| simple time phrases | after school, in the morning | chunk-level time expansion | Daily Routine, Travel / Transport, Work / Jobs | partial | more systematic time bank coverage |
| always / never | I always eat breakfast. | not yet systematic | Daily Routine, Hobbies / Free Time | limited | frequency adverb families |
| very / really / quite | very tired, really hungry | mostly fixed chunks only | Feelings / Health, Food & Drink | limited | degree adverb control |
| polite chunks | please, thank you, excuse me | fixed expressions, not yet deeply mapped | Food & Drink, Shopping, School / Classroom | partial | broader request families |
| controlled he/she be | He is hungry. She is at home. | only partly covered in scenario-specific material | Family / People, Feelings / Health | limited | paired pronoun families |
| controlled he/she have | He has his book. She has her bag. | minimally implemented in Daily Routine Phase 5 | Daily Routine, Family / People, School / Classroom | partial | broader noun/object coverage |
| fixed present continuous chunks | I am eating now. | planned more than implemented | Food & Drink, Sports / Activities, Work / Jobs | limited | tense-family rollout at Level 6 |

A1+ current coverage: approximately 45%-60%.

With 15 scenarios: approximately 70%-85%.

Main gaps:

- frequency adverbs
- degree adverbs
- controlled he/she be
- fixed present continuous
- classroom / home interaction

## 3. A2 Grammar Mapping

| Cambridge A2 Grammar | Example | System Implementation | Best Scenario Carrier | Current Coverage | Gap |
| --- | --- | --- | --- | --- | --- |
| present simple agreement | He cleans his room. | Daily Routine Phase 5 introduced controlled agreement families | Daily Routine, Family / People, Work / Jobs | partial | more verbs and scenario spread |
| have / has | He has his book. They have their books. | minimally implemented with paired slots | Daily Routine, Family / People, School / Classroom | partial | more semantic domains |
| do / does questions | Does she clean her room? | controlled question family partly implemented | Daily Routine, Home / Chores, Sports / Activities | partial | wider scenario reuse |
| do / does negatives | He does not clean his room. | controlled negative family partly implemented | Daily Routine, Work / Jobs, Home / Chores | partial | more verb coverage |
| need to / have to | I have to finish my homework. | some need-to coverage; have-to still limited | School / Classroom, Home / Chores, Work / Jobs | limited | obligation families |
| would like to | I would like some tea. | planned and scenario-appropriate but not broad yet | Food & Drink, Shopping | limited | request/polite intent patterns |
| can / could requests | Can I have some water? Could you help me? | not yet systematic | Food & Drink, Shopping, School / Classroom | limited | request grammar families |
| past simple regular | I cleaned my room yesterday. | planned only | Stories / Past Events, Travel / Transport, Home / Chores | limited | Level 6 tense implementation |
| past simple irregular | I went home late. | planned only | Travel / Transport, Stories / Past Events | limited | irregular verb family control |
| present continuous | She is cooking dinner. | planned only | Food & Drink, Sports / Activities, Work / Jobs | limited | Level 6 rollout |
| going to future | We are going to shop tonight. | planned only | Weather, Travel / Transport, Shopping | limited | future plan families |
| comparatives | This bag is cheaper. | not yet broad | Shopping, Places / Town | limited | comparison pattern families |
| superlatives | This is the cheapest one. | not yet broad | Shopping, Places / Town | limited | restricted superlative families |
| countable / uncountable | some apples, some rice | best fit for future scenario work | Food & Drink, Shopping | limited | slot typing and quantifier control |
| some / any / much / many | Do you have any milk? | not yet systematic | Food & Drink, Shopping | limited | quantifier pattern families |
| and / but / or | I want tea or juice. | common in simple sentences; not deeply tracked | Food & Drink, Shopping, Hobbies / Free Time | partial | explicit review and level policy |
| before / after time clauses | I wash my hands before dinner. | partly implemented as connected meaning | Daily Routine, Home / Chores, School / Classroom | partial | broader time-clause families |

Current A2 coverage after Daily Routine Phase 5: approximately 45%-60%.

After Level 6 and multiple scenarios: approximately 65%-80%.

Main gaps:

- past simple
- present continuous
- going to future
- comparatives / superlatives
- quantifiers
- systematic some / any / much / many

## 4. A2+ Grammar Mapping

| A2+ Grammar | Example | System Implementation | Best Scenario Carrier | Current Coverage | Gap |
| --- | --- | --- | --- | --- | --- |
| because clauses | I stay home because I am tired. | partly implemented through connected meaning patterns | Daily Routine, Feelings / Health, Work / Jobs | partial | more reason families by pronoun and tense |
| before / after sequence | I brush my teeth before school. | partly implemented in sequence-style sentences | Daily Routine, Home / Chores, Travel / Transport | partial | broader action sequencing |
| cannot because | I cannot go because I am sick. | not yet systematic | Feelings / Health, Travel / Transport, School / Classroom | limited | modal + reason families |
| request with reason | Can I sit here because I feel sick? | mostly unimplemented | School / Classroom, Food & Drink | limited | controlled request-reason templates |
| pronoun-aware reasons | He stays home because he is tired. | not yet systematic | Family / People, Feelings / Health, Work / Jobs | limited | pronoun-aware clause pairing |
| simple if condition | If it rains, I stay home. | planned only | Weather, Travel / Transport, Technology / Devices | limited | clause gating and semantic rules |
| sequence of actions | I get up, wash my face, and eat breakfast. | partly present as short routine chains | Daily Routine, Home / Chores | partial | longer controlled sequencing |
| object pronouns | I see him. She helps me. | not yet broad | School / Classroom, Family / People | limited | pronoun slot families |
| adverbs of manner | He runs quickly. | not yet systematic | Sports / Activities, Work / Jobs | limited | manner-adverb control |
| obligation expansion: must / should / have to | You should rest. I have to study. | still limited | Feelings / Health, School / Classroom, Work / Jobs | limited | modal nuance and policy by level |

Current A2+ coverage: approximately 35%-50%.

With 15 scenarios and Level 6: approximately 60%-75%.

Main gaps:

- if clauses
- object pronouns
- pronoun-aware plural reasons
- adverbs of manner
- modal nuance

## 5. B1 Grammar Mapping

| Cambridge B1 Grammar | Example | System Implementation | Best Scenario Carrier | Current Coverage | Gap |
| --- | --- | --- | --- | --- | --- |
| present perfect | I have finished my homework. | planned only | School / Classroom, Work / Jobs, Daily Routine | limited | Level 6 tense family design |
| past continuous | I was walking home when it started to rain. | planned only | Travel / Transport, Stories / Past Events, Weather | limited | narrative tense control |
| first conditional | If I have time, I will cook dinner. | planned only | Weather, Work / Jobs, Technology / Devices | limited | clause engine support |
| relative clauses | The bag that I bought is cheap. | not suitable for early slot expansion | Shopping, Places / Town, Family / People | very limited | clause-level grammar engine |
| should / must / might | You should rest. It might rain. | only small pieces are currently feasible | Feelings / Health, Weather, Work / Jobs | limited | modal range and nuance |
| passive basics | The room is cleaned every day. | not currently targeted | Home / Chores, Work / Jobs | very limited | passive pattern families or later engine |
| reported speech basics | She said she was tired. | not currently targeted | Work / Jobs, Family / People, Stories / Past Events | very limited | discourse-aware transformation |
| although / however | I am tired; however, I will study. | not yet systematic | School / Classroom, Work / Jobs, Hobbies / Free Time | limited | discourse connector layer |
| longer explanations | I usually eat at home because it is cheaper and healthier. | partly possible with clause chaining, not robust | Food & Drink, Daily Routine, Work / Jobs | limited | clause/discourse support |
| opinions with reasons | I think this shop is better because it is cheaper. | partially possible in controlled templates | Shopping, Hobbies / Free Time, Technology / Devices | limited | opinion families and connector control |
| comparisons in context | This train is faster than the bus for my trip. | not yet broad | Travel / Transport, Shopping, Places / Town | limited | comparative families in context |
| plans / arrangements | We are meeting at six tomorrow. | planned only | Travel / Transport, Work / Jobs, Weather | limited | future arrangement families |

Current B1 coverage: approximately 20%-35%.

After Level 6: approximately 35%-50%.

With 15 scenarios + clause system: approximately 50%-65%.

Main gaps:

- present perfect
- past continuous
- conditionals
- relative clauses
- passives
- discourse connectors
- paragraph-level output

## 6. Fifteen Scenario Grammar Carrier Map

| # | Scenario | Primary Grammar Load |
| --- | --- | --- |
| 1 | Daily Routine | present simple, agreement, time, sequence, questions, negatives, tense basics |
| 2 | Food & Drink | countable/uncountable, some/any, would like, polite requests, measure phrases |
| 3 | Shopping | this/that/these/those, singular/plural, price, comparison, return/exchange |
| 4 | School / Classroom | imperatives, WH questions, object pronouns, classroom instructions |
| 5 | Home / Chores | there is/are, prepositions, obligation, sequence |
| 6 | Family / People | he/she/they, possessives, be/have, descriptions |
| 7 | Feelings / Health | be + adjective, should/must, advice, symptoms |
| 8 | Weather | it is..., if clauses, going to, future plans |
| 9 | Travel / Transport | directions, past travel, going to, will, time expressions |
| 10 | Hobbies / Free Time | like/love/enjoy + gerund, frequency adverbs, opinions |
| 11 | Sports / Activities | can/can't, adverbs of manner, present continuous |
| 12 | Work / Jobs | routines, obligations, reported speech, future plans |
| 13 | Places / Town | prepositions, there is/are, directions, comparatives |
| 14 | Technology / Devices | can/cannot, instructions, condition/result |
| 15 | Stories / Past Events | past simple, past continuous, narrative connectors |

## 7. Coverage Estimate After Fifteen Scenarios

| Stage | A1 | A2 | A2+ | B1 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Current after Daily Routine Phase 5 | 60-75% | 45-60% | 35-50% | 20-35% | 40-55% |
| After Level 6 Daily Routine only | 65-80% | 55-70% | 40-55% | 25-40% | 45-60% |
| After 15 scenarios Level 1-5 | 85-90% | 60-75% | 55-70% | 35-50% | 60-70% |
| After 15 scenarios Level 1-6 | 85-92% | 70-80% | 60-75% | 50-65% | 65-78% |
| With clause/discourse engine | 90-95% | 80-88% | 75-85% | 65-80% | 78-88% |

Note:

These are engineering estimates, not official Cambridge percentages.

They represent practical coverage by sentence-bank and controlled grammar generation.

## 8. What the System Should Not Try to Cover Yet

The current architecture should not try to cover the following as simple slot-bank expansion:

- full free tense conversion
- full paragraph writing
- full relative clause generation
- free passive conversion
- free reported speech
- open-ended grammar correction
- unrestricted morphology engine

These require a higher-level grammar engine or discourse engine and should not be implemented as simple slot-bank expansion.

## 9. Product Strategy

The system's strongest position is not 100% grammar coverage.

The system's strongest position is:

- A1-A2+ stability
- high-frequency sentence patterns
- safe substitution
- learner-friendly grammar exposure
- parent / student understandable output
- testable generated data
- gradual scenario expansion

The correct strategy:

- each scenario carries selected grammar
- grammar is implemented through paired slots
- sentence output is reviewed by level
- no free transformation engine
- tense and clause expansion are separate future phases

## 10. How to Use This Document

Use this document when planning a scenario update.

For each scenario, ask:

1. Which Cambridge grammar points should this scenario carry?
2. Which grammar points are already covered elsewhere?
3. Which grammar points require paired slots?
4. Which outputs should be forbidden?
5. Which level should the pattern appear in?
6. Does this require a new phase plan?
7. Does this require generator changes?
8. Is this sentence-level, clause-level, or discourse-level?

Use this document for:

- scenario planning
- sentence review
- gap analysis
- future Food & Drink work
- future Shopping work
- deciding whether a grammar feature belongs in the current phase

## Final Recommendation

Do not try to make every scenario cover every grammar point.

Use scenario-specific grammar responsibility.

Recommended next scenario work:

Food & Drink Grammar / FSI Coverage Review Plan

Suggested future document:

`docs/food_drink_grammar_fsi_coverage_review_plan.md`
