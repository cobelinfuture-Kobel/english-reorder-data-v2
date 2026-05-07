# Global Grammar Expansion Plan: Pronouns, Possessives, Number, and Agreement

## Status

Planned.

This document defines a global grammar expansion plan for the sentence-bank and FSI drill system.

It applies across:

- Shopping
- Food & Drink
- Daily Routine

The current project is strongly scenario-based and learner-centered.

Most generated sentences currently focus on:

```text
I
my
you-questions
Can I ...
present simple
fixed polite chunks
scenario-specific vocabulary
```

This keeps early sentence generation semantically safe, but it also omits major grammar dimensions that learners eventually need.

This document defines how to add those grammar dimensions by level without breaking semantic safety or FSI quality.

This is a planning document only.

It does not change slot banks, pattern banks, generated sentence data, generator code, application code, or tests.

## Core Purpose

The goal is not to add random grammar.

The goal is to define a Cambridge / CEFR-aligned grammar scope for A1 through B1 and then apply it through grammar-safe FSI substitution.

The plan must support:

```text
level-appropriate grammar
scenario-appropriate language
FSI-style repetition
chunk substitution
grammar substitution
semantic compatibility
```

The central principle is:

```text
Cambridge / CEFR controls level appropriateness.
FSI controls repetition and substitution density.
Semantic rules control naturalness.
Grammar-safe pairing controls agreement.
```

## Why This Plan Is Needed

The current scenario banks under-cover several grammar dimensions:

```text
singular / plural
I / you / he / she / it / we / they
my / your / his / her / its / our / their
be agreement: I am / you are / he is / they are
have agreement: I have / he has / they have
present simple agreement: I clean / he cleans
articles: a / an / the
this / that / these / those
countable / uncountable nouns
some / any / much / many
basic connectors
comparatives and superlatives
basic tense roadmap
```

These are necessary for a full English sentence-rebuild and FSI drill system.

However, they cannot be added as free substitution lists.

Bad design:

```json
{
  "subject": ["I", "you", "he", "she", "we", "they"],
  "verb": ["clean", "cleans"],
  "possessive": ["my", "your", "his", "her", "our", "their"]
}
```

This would generate errors such as:

```text
He clean my room.
They cleans their room.
We has our books.
She brush your teeth.
```

Correct design requires paired grammar slots.

Example:

```json
[
  {
    "subject": "I",
    "verb": "clean",
    "possessive": "my",
    "object": "room"
  },
  {
    "subject": "you",
    "verb": "clean",
    "possessive": "your",
    "object": "room"
  },
  {
    "subject": "he",
    "verb": "cleans",
    "possessive": "his",
    "object": "room"
  },
  {
    "subject": "she",
    "verb": "cleans",
    "possessive": "her",
    "object": "room"
  },
  {
    "subject": "we",
    "verb": "clean",
    "possessive": "our",
    "object": "rooms"
  },
  {
    "subject": "they",
    "verb": "clean",
    "possessive": "their",
    "object": "rooms"
  }
]
```

Frame:

```text
{subject} {verb} {possessive} {object}.
```

Outputs:

```text
I clean my room.
You clean your room.
He cleans his room.
She cleans her room.
We clean our rooms.
They clean their rooms.
```

This is the required model for grammar-safe FSI.

## Required Grammar by Level and Current Coverage

This section compares the project's level grammar target with current documentation and implementation coverage.

The goal is not to force every grammar point into the currently implemented scenarios.

The current active scenarios are:

- Shopping
- Food & Drink
- Daily Routine

Future scenarios should also carry part of the grammar load.

Therefore, a grammar point may be:

```text
covered now
partially covered now
planned but not implemented
deferred to future scenarios
deferred to a later grammar expansion phase
```

Important distinction:

```text
Documented coverage is not the same as generated sentence coverage.
```

A grammar point may be described in this document or in scenario design notes but still not be implemented in slot banks, pattern banks, generated data, or tests.

## Coverage Interpretation Rules

Use the following labels when evaluating grammar coverage.

```text
Covered:
The grammar point appears in generated sentence banks or stable scenario documentation with clear examples and semantic rules.

Partially covered:
The grammar point appears in limited fixed chunks, one scenario only, or planning documentation, but is not yet systematic.

Planned:
The grammar point is explicitly listed as a future expansion target.

Deferred:
The grammar point should not be implemented yet because it requires additional morphology, tense, agreement, dialogue, or semantic-control infrastructure.

Not in current scope:
The grammar point is useful, but should be handled by later scenarios or a later course level.
```

## A1 Required Grammar and Coverage

A1 should cover concrete, survival-level grammar.

### A1 Target Grammar

```text
I / you
my / your
be: I am / you are / it is
have: I have / you have
present simple first-person
basic singular nouns
basic plural nouns only in fixed chunks
this / that
a / an / the
basic prepositions of place: in / on / at
basic question words: what / where / who
basic yes/no questions
simple negatives: am not / do not / don't
simple imperatives
```

### A1 Currently Covered

Currently covered or strongly represented:

```text
I + present simple
I am + state
I am + place
I have + item
It is + simple time
basic in / at place phrases
high-frequency concrete vocabulary
```

Examples already represented in active scenario data include:

```text
I have my book.
I am at school.
It is morning.
I brush my teeth.
I drink water.
```

### A1 Partially Covered

```text
this / that
a / an / the
What / Where / Who
basic yes/no questions
you / your in statements
```

These appear in some scenario directions or may exist in Shopping / Food & Drink, but they are not yet treated as a global grammar-safe FSI dimension.

### A1 Missing or Deferred

```text
systematic you / your statement substitution
systematic article control
systematic this / that item control
A1 negative sentence family
A1 wh-question family across scenarios
A1 yes/no question family across scenarios
```

### A1 Notes

Do not claim that A1 currently has full grammar coverage.

A1 generated data is strong for first-person learner-centered sentence frames, but not yet complete for pronoun, article, demonstrative, question, or negative coverage.

Recommended future carriers:

```text
School objects: this / that / my / your
Home objects: in / on / at
Classroom language: What / Where / Who
Simple instructions: imperatives
```

## A1+ Required Grammar and Coverage

A1+ should extend A1 with light interaction, small modifiers, and controlled routine/time language.

### A1+ Target Grammar

```text
like to + base verb
want to + base verb
basic time phrases
today / please / in stock / for school
Can I ...? requests
Can I have ...? requests
basic frequency adverbs: always / never
degree adverbs: very / really / quite
controlled he / she / it in be frames
controlled he / she in have frames
present continuous fixed chunks
simple plural nouns in fixed chunks
```

### A1+ Currently Covered

Currently covered or strongly represented:

```text
like to + base verb
want to + base verb
simple time phrases
today
some polite request language in active scenarios
for school in Shopping-style context
```

Examples:

```text
I like to read a book.
I want to study English today.
I pack my bag before school.
Can I have a coffee, please?
```

### A1+ Partially Covered

```text
Can I ...? requests
Can I have ...? requests
always / never
very / really / quite
controlled he / she be
controlled he / she have
present continuous fixed chunks
```

Some of these are documented as allowed directions, but they should not be considered systematic generated coverage unless tests and pattern banks confirm it.

### A1+ Missing or Deferred

```text
systematic always / never drills
degree adverb drills
controlled he/she be-have drills
present continuous fixed patterns such as I am looking for ...
```

### A1+ Notes

Do not freely introduce third-person present simple at A1+.

If `he/she` is used at A1+, prefer tightly controlled `be` or `have` frames first:

```text
He is ready.
She is busy.
He has his bag.
She has her book.
```

Avoid unpaired forms such as:

```text
He clean his room.
She brush her teeth.
```

Recommended future carriers:

```text
Shopping: Can I have ...?
Food & Drink: Can I have ... please?
Daily Routine: always / never
Classroom: very / really / quite
```

## A2 Required Grammar and Coverage

A2 is the first level where grammar expansion becomes structurally important.

### A2 Target Grammar

```text
need to + base verb
have to + base verb
would like to + base verb
can / could requests
what time / when / what do you questions
do / does questions
he / she / we / they
his / her / our / their
present simple subject-verb agreement
plural nouns
countable / uncountable nouns
some / any / much / many
simple connectors: and / but / or
basic comparatives in controlled frames
controlled future with be going to
fixed past expressions such as I forgot ...
```

### A2 Currently Covered

Currently covered or strongly represented:

```text
need to + base verb
have to + base verb
would like to + base verb
Can I ...? requests
What time do you ...?
When do you ...?
What do you do ...?
I forgot ... as a fixed expression
too + adjective in controlled contexts
```

Examples:

```text
I need to pack my bag.
I have to brush my teeth.
I would like to read a book.
What time do you get up?
When do you brush your teeth?
I forgot my homework.
```

### A2 Partially Covered

```text
countable / uncountable nouns
some / any / much / many
and / but / or
comparatives
do / does with he/she
plural agreement
his / her / our / their
```

Food & Drink should carry much of the countability and quantifier load.

Shopping should carry much of the demonstrative, singular/plural, and comparison load.

Daily Routine should carry much of the subject-verb and possessive agreement load in a later grammar-aware FSI phase.

### A2 Missing or Deferred

```text
systematic do/does question families
systematic he/she/we/they statement families
systematic present simple agreement drills
systematic possessive agreement drills
controlled be going to future
general past simple
```

### A2 Notes

`I forgot ...` is allowed only as a fixed expression.

Allowed:

```text
I forgot my homework.
I forgot my book.
```

Do not expand from this into general past tense:

```text
I went to school yesterday.
I bought a shirt.
I cleaned my room.
```

Recommended future carriers:

```text
Food & Drink: countable / uncountable, some / any / much / many
Shopping: this / these, that / those, comparatives
Daily Routine: he/she/we/they + present simple agreement
Plans/Future scenario: be going to
```

## A2+ Required Grammar and Coverage

A2+ should combine controlled grammar with reasons, sequence, and early comparison/adverbial language.

### A2+ Target Grammar

```text
because clauses
before / after clauses
cannot because
permission with condition
remind me to + base verb
adverbs of manner: slowly / carefully / well
comparatives in controlled frames
should / must as early advice or obligation
indefinite pronouns: something / anything / nothing
controlled subject variation with paired slots
```

### A2+ Currently Covered

Currently covered or strongly represented:

```text
because clauses
before / after clauses
cannot because
permission with condition
remind me to + base verb
preference reason clauses
problem reason clauses
```

Examples:

```text
I clean my room because it is messy.
I brush my teeth before I go to bed.
I cannot watch TV now because I have to study.
Please remind me to pack my bag.
```

### A2+ Partially Covered

```text
comparatives
should / must
adverbs of manner
something / anything / nothing
controlled subject variation
```

Comparatives are important for Shopping and Food & Drink, but should use controlled item pairs.

Adverbs of manner are a natural fit for Daily Routine and school/work action scenarios.

### A2+ Missing or Deferred

```text
systematic adverb-of-manner drills
systematic comparative drills
systematic something / anything / nothing
must vs have to distinction
controlled subject variation across because clauses
```

### A2+ Notes

Reasons must remain semantically paired.

Bad:

```text
I drink water because I am sleepy.
I brush my teeth because I am hungry.
```

Good:

```text
I drink water because I am thirsty.
I brush my teeth because I want clean teeth.
I clean my room because it is messy.
```

Recommended future carriers:

```text
Shopping: cheaper than / bigger than / more expensive than
Food & Drink: sweeter than / better than / too spicy
Daily Routine: carefully / slowly / well
Health: should / must
School: something / anything / nothing
```

## B1 Required Grammar and Coverage

B1 should move toward controlled connected grammar and practical problem-solving.

### B1 Target Grammar

```text
frequency adverbs
clock time and schedule expressions
before / after subordinate clauses
It takes ... to ...
should / must / have to
reported rules
comparatives and superlatives
first conditional
relative clauses: who / which / that
passive voice in controlled frames
present perfect basic
past simple system if intentionally supported
complex time expressions: during / until / from ... to
controlled contrast and result language
```

### B1 Currently Covered

Currently covered or strongly represented:

```text
frequency adverbs
clock time
weekday / weekend contexts
cannot because
before / after subordinate clauses
It takes ... to ...
should
have to
reported rule with My parents say ...
routine opinion with but
```

Examples:

```text
I usually get up at seven.
It takes ten minutes to pack my bag.
I should go to bed earlier.
Before I leave home, I check my bag.
After I finish my homework, I watch TV.
My parents say I have to clean my room.
```

Shopping B1 planning also includes:

```text
recommendations
comparisons
returns
exchanges
refunds
warranties
materials
quality
gift suitability
condition/result language
```

### B1 Partially Covered

```text
comparatives
superlatives
must
reported rules beyond fixed parent-rule frames
condition/result language
complex time prepositions
```

### B1 Missing or Deferred

```text
relative clauses
passive voice
first conditional
present perfect
general past simple system
present perfect continuous
multi-sentence paragraphs
multi-turn dialogues
```

### B1 Notes

Do not automatically add all advanced B1 grammar to the current three scenarios.

Some B1 grammar is better handled by later scenarios:

```text
relative clauses: people, places, school, travel, hobbies
passive voice: food preparation, school rules, public services
first conditional: health, safety, travel, weather
present perfect: experiences, hobbies, travel
past simple: weekend, holidays, past events
superlatives: shopping, food reviews, travel
```

B1 should expand in a controlled way.

Do not introduce broad tense mixing until the tense expansion phase exists.

## Cross-Scenario Grammar Load Distribution

The current three active scenarios should not be forced to cover every grammar point.

Recommended distribution:

```text
Shopping:
- this / that / these / those
- singular / plural item agreement
- comparatives
- superlatives
- recommendations
- returns / exchanges / refund language
- condition/result language

Food & Drink:
- a / an / some
- countable / uncountable
- some / any / much / many
- eat vs drink
- it is / they are
- taste adjectives
- substitutions
- restaurant requests
- allergy and ingredient language

Daily Routine:
- present simple
- frequency adverbs
- time expressions
- before / after
- because
- should / have to
- subject-verb agreement
- possessive agreement
- routine management

Future scenarios:
- past simple
- present continuous
- be going to / will
- present perfect
- relative clauses
- passive voice
- first conditional
- broader adverbs of manner
- classroom imperatives
- location prepositions
```

## Planning Conclusion

The current documentation is strongest for:

```text
scenario semantics
first-person present simple
controlled requests
reason clauses
before/after sequence
semantic pairing
```

The largest remaining grammar gaps are:

```text
pronoun expansion
possessive expansion
number agreement
article control
question system
negative system
countability and quantifiers
comparatives and superlatives
tense expansion
relative clauses
passive voice
conditionals
```

These should not be solved by free substitution.

They require:

```text
paired grammar slots
scenario-specific semantic constraints
level-specific count controls
tests for bad agreement
manual review
```

## Global Level Grammar Scope

This section defines the broad grammar scope for A1 through B1.

It is not a strict textbook sequence.

It is a project-level implementation scope for controlled sentence generation.

## A1 Grammar Scope

A1 should focus on concrete, high-frequency, low-risk grammar.

Recommended A1 grammar dimensions:

```text
I / you
my / your
this / that
singular concrete nouns
basic plural nouns only in fixed chunks
be: I am / you are / it is
have: I have / you have
present simple first-person
simple imperatives
simple yes/no chunks
basic prepositions of place: in / on / at
basic question words: what / where / who
basic articles: a / an / the
```

A1 examples:

```text
I have my book.
You have your bag.
I am ready.
You are ready.
It is morning.
This is my bag.
That is my book.
I am at school.
The book is on the table.
What is this?
Where is my bag?
Who is he?
I want a book.
I have an apple.
```

A1 should avoid:

```text
broad he/she verb-s generation
broad we/they plural agreement
because clauses
general past tense
complex time clauses
comparatives
superlatives
open-ended paragraph output
```

### A1 Scenario Notes

Shopping:

```text
This is a shirt.
That is a bag.
I want a book.
Where is the shop?
```

Food & Drink:

```text
I want an apple.
I have a banana.
This is water.
Where is my lunch?
```

Daily Routine:

```text
I have my book.
I am at school.
The book is on the table.
I brush my teeth.
```

## A1+ Grammar Scope

A1+ may introduce slightly expanded interaction and high-frequency chunks.

Recommended A1+ grammar dimensions:

```text
he / she / it in controlled be frames
his / her in controlled item frames
simple time phrases
like to / want to + base verb
basic frequency adverbs: always / never
basic can requests
simple plural nouns in fixed chunks
```

A1+ examples:

```text
He is ready.
She is busy.
He has his bag.
She has her book.
I like to listen to music.
I want to read a book today.
I always wash my face.
I never go to bed late.
Can I have a coffee, please?
Can I have this bag?
```

A1+ should still avoid broad free subject replacement.

For example, do not freely generate:

```text
He clean his room.
She brush her teeth.
```

If he/she present simple is used, it must be paired:

```text
He cleans his room.
She brushes her teeth.
```

### A1+ Scenario Notes

Shopping:

```text
Can I have this bag?
Can I have a receipt?
I want this shirt.
```

Food & Drink:

```text
Can I have a coffee, please?
I want some water.
I like to drink milk.
```

Daily Routine:

```text
I always wash my face.
I never go to bed late.
He has his bag.
She has her book.
```

## A2 Grammar Scope

A2 can introduce broader subject variation and core grammar control.

Recommended A2 grammar dimensions:

```text
he / she / we / they
his / her / our / their
present simple agreement
do / does questions
can requests
need to / have to / would like to
plural nouns
countable / uncountable nouns
some / any / much / many
simple connectors: and / but / or
fixed past expression: I forgot ...
```

A2 examples:

```text
He cleans his room.
She brushes her teeth.
We pack our bags.
They have their books.
Does he have his book?
Do they have their lunch?
Can I use your pencil?
I need to pack my bag.
I would like some water.
Do you have any milk?
There isn't much water.
I want an apple and some milk.
I can eat here, but I cannot play here.
I forgot my homework.
```

A2 should treat `forgot` as a fixed high-frequency classroom or daily-life expression.

Allowed:

```text
I forgot my homework.
I forgot my book.
```

Not allowed as general expansion:

```text
Yesterday, I forgot my homework.
I went to school.
I bought a shirt.
I cleaned my room.
```

### A2 Scenario Notes

Shopping:

```text
Does he want this shirt?
Do they have these shoes?
Can I use your card?
This shirt is small, but it is cheap.
```

Food & Drink:

```text
Do you have any milk?
I would like some water.
There isn't much rice.
How many apples do you have?
```

Daily Routine:

```text
He cleans his room.
She brushes her teeth.
We pack our bags.
They have their books.
I forgot my homework.
```

## A2+ Grammar Scope

A2+ can combine controlled grammar with simple reasons, sequence, and manner.

Recommended A2+ grammar dimensions:

```text
because clauses
before / after sequence
cannot because
remind me to
permission with condition
controlled subject variation
adverbs of manner: slowly / carefully / well
comparatives in controlled frames
```

A2+ examples:

```text
He cleans his room because it is messy.
She packs her bag before school.
They cannot play because they have homework.
Please remind me to bring my book.
Can I watch TV after I finish my homework?
He brushes his teeth carefully.
She reads well.
This shirt is cheaper than that one.
This bag is bigger than that one.
```

A2+ grammar must use paired slots when necessary.

Bad:

```text
I drink water because I am sleepy.
I brush my teeth because I am hungry.
```

Good:

```json
{"action": "drink water", "reason": "I am thirsty"}
{"action": "brush my teeth", "reason": "I want clean teeth"}
{"action": "clean my room", "reason": "it is messy"}
```

### A2+ Scenario Notes

Shopping:

```text
This shirt is cheaper than that one.
This bag is bigger than that one.
I like this one because it is cheaper.
```

Food & Drink:

```text
This apple is sweeter than that one.
He eats slowly.
She cooks well.
I want some water because I am thirsty.
```

Daily Routine:

```text
He brushes his teeth carefully.
She packs her bag before school.
They cannot play because they have homework.
```

## B1 Grammar Scope

B1 can include controlled routine-management, decision-making, and more complex connected grammar.

Recommended B1 grammar dimensions:

```text
frequency adverbs
clock time
before / after subordinate clauses
It takes ... to ...
should
must
have to
reported rule: My parents say I have to ...
controlled comparison
superlatives
more complex prepositions of time: during / until / since
controlled multi-slot chunk substitution
```

B1 examples:

```text
He usually gets up at seven.
They usually clean their rooms on weekends.
It takes ten minutes to pack my bag.
Before I leave home, I check my bag.
After I finish my homework, I watch TV.
My parents say we have to finish our homework.
I should go to bed earlier.
You must wash your hands before dinner.
This is the best coffee here.
This is the cheapest shirt in the store.
I study during lunch.
I wait until six.
I have studied English since last year.
```

Important note:

`since` often implies perfect tense in natural English.

For B1 sentence generation, `since` should be deferred unless the project intentionally supports present perfect.

Safer B1 time prepositions:

```text
during
until
before
after
from ... to ...
```

B1 should still avoid uncontrolled:

```text
general past tense expansion
present perfect expansion
free relative clauses
paragraph generation
multi-turn dialogue
open-ended weekly calendar planning
```

### B1 Scenario Notes

Shopping:

```text
This is the cheapest shirt in the store.
This bag is better than that one.
You should keep the receipt.
You must show your card.
```

Food & Drink:

```text
This is the best coffee here.
You should drink more water.
We have to wait until six.
This meal is better than that one.
```

Daily Routine:

```text
Before I leave home, I check my bag.
After I finish my homework, I watch TV.
My parents say we have to finish our homework.
It takes ten minutes to pack my bag.
```

## Tense Roadmap

Tense must be handled separately from ordinary chunk substitution.

## Cambridge-Oriented Tense Coverage to B1

This project does not treat tense expansion as free substitution.

By Cambridge / CEFR B1, learners are normally expected to have encountered or started using the following tense and verb-form areas:

```text
Present Simple
Present Continuous
Past Simple
Past Continuous
Future with going to
Future with will
Present Perfect basic
Imperatives
Modal verb forms:
- can
- could
- should
- must
- have to
- need to
- would like to
First Conditional:
- if + present simple, will + base verb
Basic Passive Voice:
- present passive
- past passive
```

However, this does not mean every current scenario must implement all of these immediately.

The current sentence-bank system must separate:

```text
Cambridge target coverage
current generated sentence coverage
future grammar roadmap
deferred tense implementation
```

## Tense Coverage by Level

### A1 Tense Coverage

A1 target:

```text
Present Be:
- I am
- you are
- it is

Present Simple:
- I have
- I want
- I like
- I go
- I eat
- I drink

Basic imperatives:
- Look.
- Listen.
- Try again.
```

Current implementation status:

```text
Strong:
- Present Be
- first-person Present Simple

Partial:
- you are / you have
- imperatives

Deferred:
- broad he/she present simple
- past tense
- future tense
```

### A1+ Tense Coverage

A1+ target:

```text
Present Simple extension
like to / want to + base verb
Can I ...? request forms
Present Continuous fixed chunks
```

Possible controlled examples:

```text
I am looking for a gift.
I am eating an apple.
I am doing my homework.
```

Current implementation status:

```text
Strong:
- like to + base verb
- want to + base verb
- Can I ...? in some scenario contexts

Partial:
- Present Continuous fixed chunks

Deferred:
- full Present Continuous generation
- be agreement across all subjects
- verb-ing morphology generation
```

### A2 Tense Coverage

A2 target:

```text
Present Simple questions
do / does questions
need to / have to / would like to
Past Simple basic:
- regular verbs
- common irregular verbs
Future with going to
Future with will in simple decisions or offers
Present Continuous for current actions and near-future arrangements
Fixed classroom/daily-life past expressions
```

Current implementation status:

```text
Strong:
- need to + base verb
- have to + base verb
- would like to + base verb
- What time do you ...?
- When do you ...?
- Can I ...?

Fixed only:
- I forgot ...

Partial / planned:
- going to future
- will future
- do / does with he/she

Deferred:
- general Past Simple
- systematic irregular verb handling
- broad Present Continuous
```

Important rule:

```text
I forgot ... is allowed as a fixed expression.
It must not automatically open general Past Simple generation.
```

### A2+ Tense Coverage

A2+ target:

```text
Present Simple with because clauses
Present Simple with before / after clauses
cannot because
permission with condition
should / must / have to as advice or obligation
Future forms with simple reasons or plans
Past Simple with time markers in controlled contexts
```

Current implementation status:

```text
Strong:
- because clauses
- before / after clauses
- cannot because
- remind me to + base verb

Partial / planned:
- should / must
- controlled future
- controlled past with time markers

Deferred:
- free tense mixing
- broad past/future alternation inside FSI substitution
```

### B1 Tense Coverage

B1 target:

```text
Present Simple with frequency and schedule language
Present Continuous review
Past Simple system
Past Continuous basic
Future with going to / will
Present Perfect basic
Present Perfect vs Past Simple contrast, basic level
First Conditional:
- if + present simple, will + base verb
Basic Passive Voice:
- present passive
- past passive
Modal verb forms:
- should
- must
- have to
- need to
- can / could
```

Current implementation status:

```text
Strong:
- Present Simple with frequency
- clock time and schedule expressions
- should
- have to
- It takes ... to ...
- before / after subordinate clauses
- fixed reported rules such as My parents say I have to ...

Partial / planned:
- must
- future forms
- comparatives / superlatives
- condition/result language

Deferred:
- general Past Simple system
- Past Continuous
- Present Perfect
- Present Perfect vs Past Simple contrast
- First Conditional
- Basic Passive Voice
- broad tense mixing
```

B1 implementation rule:

```text
By B1, these tense areas belong in the roadmap.
They should not be added to generated data until the generator can safely control verb forms, subject agreement, time markers, and semantic compatibility.
```

## Tense Implementation Safety Rules

Do not implement tense expansion through free slot replacement.

Bad:

```text
I clean my room.
He clean his room.
I cleaned my room every day.
I have studied English yesterday.
```

Good controlled design:

```json
[
  {
    "subject": "I",
    "present": "clean",
    "past": "cleaned",
    "object": "my room",
    "time_present": "every day",
    "time_past": "yesterday"
  },
  {
    "subject": "he",
    "present": "cleans",
    "past": "cleaned",
    "object": "his room",
    "time_present": "every day",
    "time_past": "yesterday"
  }
]
```

Future tense expansion requires dedicated paired or morphology-aware slots such as:

```text
subject_present_simple_pairs
subject_present_continuous_pairs
subject_past_simple_pairs
subject_future_going_to_pairs
subject_future_will_pairs
subject_present_perfect_pairs
passive_voice_pairs
conditional_pairs
```

## Tense Roadmap Summary

The current project should use this order:

```text
Phase T1:
Present Simple + be agreement + have agreement

Phase T2:
Present Continuous fixed chunks

Phase T3:
Future with going to / will in controlled patterns

Phase T4:
Past Simple fixed and then controlled regular/irregular verbs

Phase T5:
Past Continuous basic

Phase T6:
Present Perfect basic

Phase T7:
First Conditional

Phase T8:
Basic Passive Voice

Phase T9:
Mixed tense review and contrast
```

This roadmap should be global.

It does not require Shopping, Food & Drink, or Daily Routine to cover every tense point immediately.

Future scenarios may carry part of the tense load:

```text
Weekend / Past Events:
- Past Simple

Plans / Future Activities:
- going to
- will

Travel:
- Present Perfect experience
- Past Simple travel events

Health / Safety:
- should
- must
- first conditional

Food Preparation / Public Services:
- passive voice

School / Work:
- present perfect
- past continuous
```

## Tense Matrix by CEFR Level

This matrix is a project-level teaching roadmap.

It is Cambridge / CEFR-oriented, but it is not a claim that every tense area is already implemented in generated data.

The matrix separates:

```text
Core:
Expected to be central at this level.

Controlled:
Can appear in restricted patterns or fixed chunks.

Review:
Previously introduced and recycled at this level.

Planned:
Should be added in a future grammar expansion phase.

Deferred:
Do not implement yet.

Out of current scope:
Belongs beyond the current A1-B1 implementation scope.
```

| Tense / Verb Form | A1 | A1+ | A2 | A2+ | B1 | Project Status |
| --- | --- | --- | --- | --- | --- | --- |
| Present Be: am / are / is | Core | Core | Review | Review | Review | Implemented partially; expand with agreement later |
| Present Simple | Core | Core | Core | Core | Core | Implemented mainly in first-person frames |
| Basic imperatives | Controlled | Controlled | Review | Review | Review | Planned / partial |
| Can for simple ability / request | Controlled | Core | Review | Review | Review | Implemented in scenario-specific requests |
| like to / want to + base verb | Controlled | Core | Review | Review | Review | Implemented in active scenarios |
| Present Continuous | Deferred | Controlled fixed chunks | Controlled | Review | Review | Planned; not broadly generated |
| Past Simple | Deferred | Deferred | Controlled basic | Controlled | Core review | Deferred except fixed chunks such as `I forgot ...` |
| Future with going to | Deferred | Deferred | Controlled basic | Controlled | Review | Planned |
| Future with will | Deferred | Deferred | Controlled basic | Controlled | Review | Planned |
| should / must / have to / need to | Deferred | Controlled chunks | Core | Core | Review | Partially implemented; must not be free-substituted |
| Past Continuous | Deferred | Deferred | Deferred | Deferred | Controlled basic | Deferred |
| Present Perfect basic | Deferred | Deferred | Deferred | Deferred | Controlled basic | Deferred |
| Present Perfect vs Past Simple | Deferred | Deferred | Deferred | Deferred | Controlled basic | Deferred |
| First Conditional | Deferred | Deferred | Deferred | Planned | Controlled basic | Deferred |
| Present Passive | Deferred | Deferred | Deferred | Deferred | Controlled basic | Deferred |
| Past Passive | Deferred | Deferred | Deferred | Deferred | Controlled basic | Deferred |
| Past Perfect | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | B1+ / B2 roadmap |
| Present Perfect Continuous | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | B1+ / B2 roadmap |
| Future Continuous | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | B1+ / B2 roadmap |
| Future Perfect | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | B2 / B2+ roadmap |
| Past Perfect Continuous | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | B2 / C1 roadmap |
| Future Perfect Continuous | Out of current scope | Out of current scope | Out of current scope | Out of current scope | Out of current scope | C1 roadmap |

## Interpretation of the Tense Matrix

The table above should not be read as a generator implementation checklist for the current phase.

For example:

```text
Past Simple is a Cambridge-oriented A2/B1 target.
Current generated data does not yet implement a general Past Simple system.

Present Perfect is a Cambridge-oriented B1 target.
Current generated data should treat it as deferred until a safe tense expansion exists.

Passive Voice is a Cambridge-oriented B1 target in basic form.
Current generated data should not add it through free transformation.

First Conditional is a Cambridge-oriented B1 target.
It requires controlled condition/result pairs.
```

Therefore, generated data should not claim full B1 tense coverage until the project has:

```text
verb-form controls
subject agreement controls
time-marker controls
semantic compatibility controls
negative and question form controls
tests for tense mismatch
manual review by level
```

## Beyond B1 Roadmap

The current implementation scope is:

```text
A1
A1+
A2
A2+
B1
```

Do not add B1+, B2, or B2+ to data files, generated banks, UI level filters, or generator configuration yet.

However, the global grammar plan may record a future roadmap beyond B1.

## B1+ Roadmap

B1+ may eventually introduce:

```text
Past Perfect introduction
Present Perfect Continuous introduction
broader conditionals
more complex reported speech
longer connected responses
more explicit tense contrast
```

Possible future examples:

```text
I had finished my homework before dinner.
I have been studying English for two years.
If I had more time, I would study more.
She said that she had finished her work.
```

Implementation note:

B1+ should probably require a new phase and possibly a new task type.

It should not be added to the current single-sentence A1-B1 generator without a separate design document.

## B2 Roadmap

B2 may eventually introduce:

```text
Past Perfect system
Future Continuous
advanced passive forms
second conditional
relative clauses with more complexity
discourse connectors
multi-sentence responses
argument and explanation structures
```

Possible future examples:

```text
I was studying when my friend called.
This product was made in Japan.
If I had more money, I would buy the better one.
The book that I bought yesterday is useful.
I will be studying at eight tonight.
```

Implementation note:

B2 content likely needs more than sentence substitution.

It may require:

```text
paragraph-level generation
dialogue-level generation
discourse connector control
tense contrast tests
longer-answer scoring
```

## B2+ Roadmap

B2+ may eventually introduce:

```text
Future Perfect
Future Perfect Continuous
mixed conditionals
advanced tense contrast
advanced passive forms
advanced relative clauses
hedging and nuance
extended explanation and opinion writing
```

Possible future examples:

```text
I will have finished my homework by eight.
By next year, I will have been studying English for five years.
If I had studied harder, I would have passed the test.
The meal, which was prepared by the chef, was excellent.
```

Implementation note:

B2+ should not be forced into the current sentence-bank model.

It should be treated as a future system expansion.

## Scope Boundary

The current A1-B1 system should continue to prioritize:

```text
short sentence frames
grammar-safe FSI substitution
semantic pairing
scenario-controlled vocabulary
manual review
automated regression tests
```

Beyond-B1 content should remain documentation-only until the project intentionally creates:

```text
new level definitions
new generator support
new task types
new tests
new review criteria
```

Current project state:

```text
Present simple is the main tense for A1-B1 scenario banks.
Some modal forms are used: can, need to, have to, would like to, should.
A2 may include fixed past chunks such as I forgot ...
General past tense is deferred.
Future forms are deferred or tightly controlled.
Present continuous is only allowed in fixed situational chunks.
```

## Present Simple

Primary tense for:

```text
Shopping
Food & Drink
Daily Routine
```

Examples:

```text
I want this shirt.
I drink water.
I clean my room.
He cleans his room.
They have their books.
```

Present simple expansion requires subject-verb agreement.

## Present Continuous

May be introduced as fixed or controlled chunks at A1+ / A2.

Recommended fixed patterns:

```text
I am looking for {item}.
I am eating {food}.
I am drinking {drink}.
```

Shopping example:

```text
I am looking for a gift.
```

Food example:

```text
I am eating an apple.
```

Daily Routine example:

```text
I am doing my homework.
```

Do not open full present continuous generation until the generator can safely control:

```text
be agreement
verb-ing forms
semantic compatibility
```

## Future Forms

Future should be deferred or controlled.

Possible later A2+ / B1 fixed patterns:

```text
I will take the steak.
I am going to clean my room.
We are going to eat dinner.
```

Risk:

```text
will + base verb
be going to + base verb
be agreement
```

Recommendation:

Keep future forms out of the current Phase 4C.

## Past Simple

Past simple should not be broadly enabled in the current A1-B1 scenario banks.

Allowed fixed expression:

```text
I forgot my homework.
I forgot my book.
```

Deferred general past examples:

```text
I went to school yesterday.
I bought a shirt.
I cleaned my room.
I ate breakfast.
```

Reason:

Past tense requires:

```text
regular verbs
irregular verbs
negative forms
questions
time markers
verb form control
```

This should be a dedicated later expansion.

## Present Perfect

Defer.

Do not use `since` freely unless present perfect is supported.

Risky:

```text
I study English since last year.
```

Natural:

```text
I have studied English since last year.
```

Because present perfect is not currently in scope, avoid `since` in generated B1 data unless explicitly implementing present perfect.

## FSI Grammar Substitution Model

The project should support two FSI dimensions.

## 1. Chunk Substitution

Example:

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

This is lexical or chunk substitution.

## 2. Grammar Substitution

Example:

```text
{subject} {verb} {possessive} {object}.
```

Outputs:

```text
I clean my room.
You clean your room.
He cleans his room.
She cleans her room.
We clean our rooms.
They clean their rooms.
```

This requires paired grammar slots.

## Safe Grammar Pair Categories

Future slot banks may define categories such as:

```text
subject_be_pairs
subject_have_pairs
subject_present_simple_pairs
subject_possessive_object_pairs
subject_possessive_plural_pairs
this_that_these_those_item_pairs
countable_food_pairs
uncountable_food_pairs
shopping_demonstrative_item_pairs
routine_subject_action_pairs
```

## Scenario-Specific Grammar Expansion

## Shopping

Important grammar dimensions:

```text
this / that / these / those
it is / they are
a / an / the
singular / plural items
wants / want
cheaper / more expensive
best / cheapest
can requests
should / must
```

Examples:

```text
This shirt is cheap.
These shoes are expensive.
She wants this shirt.
They want these shoes.
Do you have this in blue?
Do you have these in blue?
This is the cheapest shirt in the store.
You should keep the receipt.
```

## Food & Drink

Important grammar dimensions:

```text
countable / uncountable nouns
a / an / some
any / much / many
it is / they are
wants / want
comparatives
superlatives
can requests
would like
```

Examples:

```text
I want an apple.
I want some water.
Do you have any milk?
There isn't much rice.
How many apples do you have?
This apple is sweeter than that one.
This is the best coffee here.
She wants a sandwich.
They want sandwiches.
```

## Daily Routine

Important grammar dimensions:

```text
subject pronouns
possessive determiners
present simple agreement
be agreement
have / has
do / does questions
singular / plural routine objects
before / after sequence
because clauses
should / have to / must
```

Examples:

```text
I clean my room.
You clean your room.
He cleans his room.
She brushes her teeth.
We pack our bags.
They do their homework.
Does he have his book?
Before I leave home, I check my bag.
After I finish my homework, I watch TV.
```

## Implementation Strategy

Do not implement this global grammar expansion in one step.

Recommended phases:

## Phase 5A: Documentation and Grammar Inventory

Add this document.

Then inspect existing pattern banks and slot banks for:

```text
where first-person-only assumptions exist
where my/your assumptions exist
where singular-only assumptions exist
where demonstrative forms already exist
where countable/uncountable handling already exists
where agreement risks exist
```

## Phase 5B: Daily Routine Pilot

Daily Routine is the safest pilot for grammar-aware FSI because its action frames are simple.

Pilot patterns:

```text
ROUTINE_SUBJECT_CLEAN_OBJECT
ROUTINE_SUBJECT_BRUSH_OBJECT
ROUTINE_SUBJECT_HAVE_ITEM
ROUTINE_SUBJECT_PACK_ITEM
ROUTINE_SUBJECT_BE_STATE
```

Use paired grammar slots.

Do not start with Shopping or Food & Drink because countability and demonstratives make them more complex.

## Phase 5C: Food & Drink Countability Expansion

Add grammar-safe countable / uncountable handling.

Pilot patterns:

```text
FOOD_WANT_COUNTABLE_SUBJECT
FOOD_WANT_UNCOUNTABLE_SUBJECT
FOOD_HAVE_ANY
FOOD_MUCH_MANY
FOOD_THIS_THAT_THESE_THOSE
```

## Phase 5D: Shopping Demonstrative and Number Expansion

Add this / that / these / those, singular/plural items, and it/they agreement.

Pilot patterns:

```text
SHOP_THIS_THAT_ITEM
SHOP_THESE_THOSE_ITEMS
SHOP_IT_IS_ADJ
SHOP_THEY_ARE_ADJ
SHOP_SUBJECT_WANT_ITEM
```

## Phase 5E: Tense Expansion

Only after agreement, number, and countability are stable.

Possible future docs:

```text
docs/grammar_expansion_tense_plan.md
docs/daily_routine_past_tense_extension_plan.md
docs/shopping_past_purchase_extension_plan.md
docs/food_drink_past_order_extension_plan.md
```

## Risk Controls

## 1. No free pronoun replacement

Bad:

```text
I clean my room.
He clean my room.
They clean my room.
```

Good:

```text
I clean my room.
He cleans his room.
They clean their rooms.
```

## 2. No free possessive replacement

Bad:

```text
She brushes my teeth.
They pack his bags.
```

Good:

```text
She brushes her teeth.
They pack their bags.
```

## 3. No free singular/plural replacement

Bad:

```text
These shirt is cheap.
This shoes are expensive.
```

Good:

```text
This shirt is cheap.
These shoes are expensive.
```

## 4. No free countable/uncountable replacement

Bad:

```text
I want a water.
I want many milk.
```

Good:

```text
I want some water.
I want much milk.
I want an apple.
I want many apples.
```

## 5. No broad tense mixing

Bad:

```text
I went to school every day.
He clean his room yesterday.
I have studied English since last year.
```

unless the required tense system is explicitly implemented.

## Tests Needed Later

Future tests should verify:

```text
subject-verb agreement
be agreement
have/has agreement
possessive agreement
this/that/these/those agreement
singular/plural noun agreement
countable/uncountable determiner agreement
some/any/much/many usage
no uncontrolled past tense
no uncontrolled present perfect
no free pronoun replacement
scenario-specific semantic compatibility
```

Example tests:

```python
def test_no_bad_subject_verb_agreement(sentences):
    bad_phrases = [
        "He clean ",
        "She clean ",
        "He brush ",
        "She brush ",
        "They cleans ",
        "We has ",
    ]
    for s in sentences:
        assert not any(x in s["target_sentence"] for x in bad_phrases)


def test_no_bad_possessive_agreement(sentences):
    bad_phrases = [
        "She brushes my teeth",
        "He packs her bag",
        "They pack his bag",
    ]
    for s in sentences:
        assert not any(x in s["target_sentence"] for x in bad_phrases)


def test_no_bad_countability(sentences):
    bad_phrases = [
        "a water",
        "an water",
        "many milk",
        "much apples",
    ]
    for s in sentences:
        assert not any(x in s["target_sentence"] for x in bad_phrases)
```

## Completion Criteria

This global grammar expansion plan is accepted when:

```text
1. A1 through B1 grammar scope is documented.
2. Pronoun / possessive / number / agreement risks are documented.
3. Articles, prepositions, question words, countability, quantifiers, connectors, comparatives, superlatives, and modals are documented by level.
4. Tense roadmap is documented.
5. Shopping, Food & Drink, and Daily Routine scenario implications are documented.
6. Safe paired-slot implementation strategy is documented.
7. Deferred grammar areas are clearly separated.
```

## Status

Planned.
