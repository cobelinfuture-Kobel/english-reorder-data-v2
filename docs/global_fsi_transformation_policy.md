# Global FSI Transformation Policy

## Status

Planned.

This document defines the global policy for FSI transformation behavior across the English sentence-bank and FSI drill system.

It is a policy document only.

It does not change:

- slot banks
- pattern banks
- generated sentence data
- generator code
- application code
- tests
- UI behavior

This document should prevent future implementation from treating FSI as unrestricted automatic sentence transformation.

## Purpose

FSI in this project means controlled substitution and interaction practice.

It should support:

```text
repetition
noticing
transfer
semantic safety
grammar safety
level-appropriate progression
```

FSI should not mean:

```text
free pronoun replacement
free tense transformation
free sentence-to-question conversion
free contraction rewriting
free grammar mutation without paired controls
```

The core principle is:

```text
FSI is progressive enhancement, not a global on/off switch.
```

A1 should not receive the full FSI transformation system.

FSI capabilities should unlock gradually by level.

## Relationship to Other Global Documents

This policy works together with:

```text
docs/grammar_expansion_pronoun_possessive_number_plan.md
docs/global_chunks_bank_design.md
docs/sentence_generation_semantic_guidelines.md
```

The relationship is:

```text
global grammar plan = what grammar can appear by level
global chunks bank design = what teachable chunks may exist
FSI transformation policy = how substitution and transformation may be applied safely
semantic guidelines = what combinations are natural and teachable
```

## FSI Four-Mode Model

The project should distinguish four FSI modes.

These modes are not all available at A1.

They unlock gradually.

## Mode 1: Semantic / Chunk Substitution

This is the safest and earliest FSI mode.

It changes a word, phrase, object, item, or controlled chunk while keeping the sentence frame stable.

Examples:

```text
I have my book.
I have my bag.
I have my lunch.

I clean my room.
I clean my desk.
I clean the table.
```

Typical substitution targets:

```text
item
object
food
drink
color
time phrase
place phrase
reason phrase when paired
condition phrase when paired
```

This mode is required from A1.

## Mode 2: Structural Transformation

This changes the sentence structure.

Examples:

```text
positive -> negative
statement -> question
short answer -> full answer
request -> polite request
```

Examples:

```text
I am ready.
I am not ready.

This is big.
Is this big?

I want coffee.
Can I have coffee, please?
```

This mode should not be a free automatic transformation engine at early levels.

At A1+ and A2, structural transformation should usually appear as pre-authored or controlled pattern families.

## Mode 3: Grammar-Aware Agreement

This changes or validates grammar features that must move together.

Examples:

```text
I clean my room.
He cleans his room.

I have my book.
She has her book.

This shirt is cheap.
These shoes are cheap.
```

This requires paired grammar slots or morphology-aware controls.

Do not implement this through independent free substitution lists.

Bad:

```text
He clean my room.
They cleans their room.
We has our books.
These shirt is cheap.
```

Good:

```text
He cleans his room.
They clean their rooms.
We have our books.
These shoes are cheap.
```

This mode is planned for grammar-aware expansion phases.

It may appear in limited paired patterns earlier, but full agreement transformation is deferred.

## Mode 4: Interactive / Pragmatic Polishing

This changes the social or interactional form of a sentence.

Examples:

```text
I want coffee.
I would like coffee.
I'd like a coffee, please.

Can I have water?
Could I have some water, please?
```

This mode may include:

```text
politeness
please
could / would
would like
request softening
conversation-ready phrasing
optional contractions
```

This mode must be pattern-controlled.

It should not rewrite every sentence automatically.

Contractions are optional and mode-dependent.

Default generated teaching data should prefer full forms unless a pattern explicitly requires conversational style.

## Level Rollout Matrix

FSI capabilities should unlock by level.

The current project scope is:

```text
A1
A1+
A2
A2+
B1
```

B1+ / B2 / B2+ are roadmap-only and should not be added to current data or generator level filters.

| Level | Semantic / Chunk Substitution | Structural Transformation | Grammar-Aware Agreement | Interactive / Pragmatic Polishing |
| --- | --- | --- | --- | --- |
| A1 | Core | Deferred | Deferred | Deferred |
| A1+ | Core | Limited controlled patterns | Very limited fixed chunks | Limited polite/fixed chunks |
| A2 | Core | Controlled pattern families | Controlled paired forms only | Controlled requests |
| A2+ | Core | Controlled multi-slot patterns | Controlled paired forms only | Controlled reason/request expansion |
| B1 | Core | Controlled connected frames | Planned / partial with paired slots | Controlled practical interaction |
| B1+ and above | Roadmap | Roadmap | Roadmap | Roadmap |

## A1 FSI Policy

A1 should focus on stable frames and safe substitution.

Allowed:

```text
I have {item}.
I clean {object}.
I am {state}.
I am {place}.
This is {item}.  # if demonstratives are explicitly implemented
```

A1 should prioritize:

```text
short frames
first-person frames
concrete nouns
stable present simple
stable be patterns
high-frequency chunks
```

A1 should avoid:

```text
free subject replacement
he / she present-simple agreement
general negative transformation
general question transformation
past tense
future tense
because clauses
paragraphs
dialogues
```

Teaching purpose:

```text
pattern rhythm
sentence confidence
safe chunk substitution
low cognitive load
```

## A1+ FSI Policy

A1+ may add light extensions and controlled structural variants.

Allowed:

```text
I want to {action} today.
I like to {action}.
Can I have {item}, please?
I am not ready.  # only if explicitly authored
```

A1+ may include:

```text
please
today
simple time chunks
basic Can I ...? requests
always / never if explicitly controlled
very / really / quite if explicitly controlled
```

A1+ should not introduce a general transformation engine.

For example, do not automatically convert any A1 statement into:

```text
negative
question
third-person statement
past-tense statement
```

Teaching purpose:

```text
slightly longer chunks
controlled interaction
still-low grammar noise
```

## A2 FSI Policy

A2 may use controlled pattern families for requests, obligations, needs, and simple questions.

Allowed:

```text
I need to {action}.
I have to {action}.
I would like to {action}.
Can I {action} here?
What time do you {action}?
When do you {action}?
I forgot {item}.
```

Important rule:

```text
I forgot ... is allowed as a fixed expression.
It does not open general past tense generation.
```

A2 may introduce grammar-aware substitution only through paired slots.

Allowed if paired:

```text
He has his book.
She has her bag.
```

Not allowed as free substitution:

```text
He have my book.
She has your bag.
```

Teaching purpose:

```text
controlled interaction
modal-like frames
question frames
early grammar awareness
```

## A2+ FSI Policy

A2+ may add controlled reason, sequence, and condition expansion.

Allowed:

```text
I clean my room because it is messy.
I brush my teeth before I go to bed.
I cannot watch TV now because I have homework.
Please remind me to bring my book.
Can I watch TV after I finish my homework?
```

A2+ should use paired chunks for:

```text
reason
time
condition
before / after sequence
cannot because
```

Bad free combinations:

```text
I drink water because I am sleepy.
I brush my teeth because I am hungry.
Can I go to school after dinner?
```

Teaching purpose:

```text
meaningful expansion
semantic pairing
controlled sentence length
reason and sequence logic
```

## B1 FSI Policy

B1 may use controlled connected frames and routine-management / consumer-interaction frames.

Allowed examples:

```text
It takes ten minutes to pack my bag.
Before I leave home, I check my bag.
After I finish my homework, I watch TV.
My parents say I have to clean my room.
You should keep the receipt.
Can I return this if it does not fit?
```

B1 may include:

```text
frequency adverbs
clock time
before / after subordinate clauses
It takes ... to ...
should / must / have to
controlled comparison
controlled condition/result language
basic roadmap targets such as passive or present perfect only when explicitly implemented
```

B1 should not automatically add:

```text
general past tense
present perfect
past continuous
first conditional
passive voice
relative clauses
```

unless a dedicated implementation phase exists.

Teaching purpose:

```text
controlled connected grammar
practical interaction
multi-slot substitution
semantic decision-making
```

## Transformation Priority

When multiple FSI operations are eventually supported, apply them in this conceptual order.

This is a policy order, not a current generator implementation requirement.

## Priority 1: Select Scenario and Level

First determine:

```text
scenario
level
pattern family
allowed grammar scope
```

Do not select transformations that are outside the level scope.

## Priority 2: Select Pattern Frame

Choose the sentence frame.

Example:

```text
I clean {object}.
```

The pattern controls:

```text
grammar structure
level
function
allowed slot constraints
```

## Priority 3: Apply Semantic / Chunk Substitution

Fill slots or chunks with semantically valid values.

Example:

```text
{object} = my room
```

Output draft:

```text
I clean my room.
```

Semantic compatibility must be checked before grammar transformation.

## Priority 4: Apply Structural Transformation Only If Authorized

If the pattern explicitly supports a structural variant, apply it.

Example:

```text
I am ready.
I am not ready.
```

Do not transform structure unless the pattern family permits it.

## Priority 5: Apply Grammar-Aware Agreement Only If Paired or Supported

If a pattern uses subject variation or number variation, agreement must be controlled.

Example:

```text
subject = he
verb = cleans
possessive = his
object = room
```

Output:

```text
He cleans his room.
```

Never infer this from independent lists unless the generator has explicit morphology support.

## Priority 6: Apply Interactive / Pragmatic Polishing

Apply politeness, please, could/would, or contractions only if the pattern or mode permits it.

Examples:

```text
Can I have some water, please?
Could I try this on, please?
I would like a coffee.
```

Default teaching output should prefer full forms unless a conversational mode is explicitly selected.

## Collision Rules

## 1. Question Form vs Third-Person Verb Agreement

If a future engine supports both third-person subject and do/does question formation, the auxiliary controls the verb base form.

Bad:

```text
Does he wants an apple?
```

Good:

```text
Does he want an apple?
```

Policy:

```text
does + subject + base verb
```

This requires morphology-aware handling or pre-authored paired patterns.

## 2. Negative Form vs Contraction

Default teaching output should prefer full forms:

```text
I am not ready.
He is not ready.
They are not ready.
```

Contractions are optional:

```text
I'm not ready.
He isn't ready.
He's not ready.
They aren't ready.
```

Policy:

```text
full form first
contraction only in conversational or explicitly marked patterns
```

Do not automatically mix contraction styles.

## 3. Article Agreement

If a future engine supports article correction, `a/an` must be selected after the noun phrase is known.

Bad:

```text
a apple
an banana
```

Good:

```text
an apple
a banana
```

Policy:

```text
article selection depends on the following sound or predefined chunk metadata
```

For early implementation, use pre-authored chunks such as:

```text
an apple
a banana
```

## 4. Demonstrative and Number Agreement

Demonstratives must agree with number.

Bad:

```text
this shoes
these shirt
that bags
those jacket
```

Good:

```text
this shirt
these shoes
that jacket
those bags
```

Policy:

```text
use paired demonstrative item chunks
```

## 5. Pronoun Reference

Pronouns must match item number.

Bad:

```text
Could I try on these shoes before I buy it?
```

Good:

```text
Could I try on these shoes before I buy them?
```

Policy:

```text
use singular-only slots unless pronoun metadata exists
```

## 6. Reason Compatibility

Reasons must fit actions or items.

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

Policy:

```text
reason chunks are usually paired-only
```

## Atomic Chunk Immunity Rules

Some chunks should be treated as indivisible units.

They may appear inside patterns, but the transformation system should not split or mutate them internally unless the pattern explicitly supports it.

## Shopping Atomic Chunks

```text
How much is
Do you have
Where can I find
try on
looking for
pay with
in stock
after the discount
before I buy it
in a different color
```

## Food & Drink Atomic Chunks

```text
Can I have
I'd like
I would like
to go
for here
no ice
less sugar
the check
split the check
pay separately
a table for two
```

## Daily Routine Atomic Chunks

```text
I forgot
It takes
Before I leave home
After I finish
Please remind me to
go to bed
get up
brush my teeth
do my homework
```

## Global Atomic Chunks

```text
would like to
Can I
Could I
I need to
I have to
I am looking for
because
before
after
```

Policy:

```text
Atomic chunk does not mean the phrase can never appear in different patterns.
It means the transformation system must not freely split, reorder, or mutate the phrase internally.
```

## Immunity Examples

Do not transform:

```text
try on
```

into:

```text
try
```

or:

```text
on try
```

Do not transform:

```text
would like to
```

into:

```text
would likes to
```

Do not transform:

```text
I forgot my homework.
```

into a general past tense family unless a past-tense phase explicitly allows it.

## What Is Deferred

The following are explicitly deferred unless a dedicated implementation phase is created:

```text
free pronoun replacement
automatic he/she agreement
automatic do/does question transformation
automatic past tense transformation
automatic future tense transformation
automatic present perfect transformation
automatic passive voice transformation
automatic contraction rewriting
automatic paragraph generation
automatic dialogue generation
```

## Relationship to Chunks Bank

The future chunks bank may store:

```text
chunk text
chunk type
level minimum
density class
safe pattern tags
unsafe pattern tags
grammar features
semantic tags
atomic status
```

FSI transformation should use chunk metadata when available.

Example future metadata:

```json
{
  "chunk_id": "ROUTINE_ACTION_BRUSH_TEETH",
  "text": "brush my teeth",
  "chunk_type": "routine_action",
  "atomic": true,
  "safe_pattern_tags": ["routine_do", "routine_need", "routine_have_to"],
  "unsafe_pattern_tags": ["free_object_replacement"],
  "grammar_features": {
    "verb_base": "brush",
    "object": "my teeth"
  }
}
```

Until chunks_bank exists, slot groups remain the chunk carriers.

## Relationship to Grammar Expansion

The grammar expansion plan defines what grammar belongs at each level.

This FSI policy defines how safely that grammar may be manipulated.

Important distinction:

```text
A grammar point may be listed as a level target.
That does not mean it can be generated through automatic transformation.
```

Example:

```text
Past Simple is an A2/B1 target.
But current generated data should not automatically transform I clean my room into I cleaned my room.
```

A safe past-tense expansion would need:

```text
verb form pairs
time markers
negative forms
question forms
irregular verb controls
tests
manual review
```

## Relationship to User Progression

Future learning logic may unlock FSI modes by user performance.

Example roadmap:

```text
A1:
User practices stable substitution.

A1+:
User unlocks controlled interaction chunks.

A2:
User unlocks controlled question and request frames.

A2+:
User unlocks reason and sequence expansion.

B1:
User unlocks controlled connected frames.
```

Do not implement user-based unlocking until a separate learning-path policy exists.

Possible future document:

```text
docs/learning_path_unlock_policy.md
```

## Implementation Boundary

This document does not authorize immediate engine changes.

Before implementing automatic FSI transformation, create a dedicated implementation plan covering:

```text
generator changes
schema changes
test coverage
UI implications
level controls
semantic constraints
manual review workflow
rollback strategy
```

## Current Recommended Implementation Approach

For the current A1-B1 sentence-bank system:

```text
Use explicit patterns.
Use restricted slot groups.
Use paired slots where needed.
Use full-form teaching language by default.
Avoid automatic grammar mutation.
Avoid free transformation.
Add FSI metadata only after generator and UI behavior are inspected.
```

## Completion Criteria

This policy is accepted when:

```text
1. FSI four-mode model is documented.
2. Level rollout matrix is documented.
3. A1 to B1 FSI boundaries are documented.
4. Transformation priority is documented.
5. Collision rules are documented.
6. Atomic chunk immunity rules are documented.
7. Deferred automatic transformations are documented.
8. Relationship to chunks_bank is documented.
9. Relationship to grammar expansion is documented.
10. The document clearly states that it does not change generator behavior.
```

## Status

Planned.
