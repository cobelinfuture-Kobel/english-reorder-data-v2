目的：
建立 Shopping A1 → B1 的完整 grammar-pattern mapping 文件，作為後續 data/slot_bank、data/pattern_bank、data/generated/shopping_sentence_bank.json 的上位設計規範。

```text
docs/shopping_grammar_pattern_mapping.md
```

---

# Shopping Grammar-Pattern Mapping

## Status

```text
Status: Draft v1.0
Scenario: Shopping
Levels: A1, A1+, A2, A2+, B1
Purpose:
Convert Cambridge / CEFR grammar and tense targets into shopping-specific fixed chunks, controlled patterns, slot banks, and sentence-bank generation rules.
```

This document defines the Shopping-specific grammar-pattern layer.

It does not replace the global grammar documents:

```text
docs/grammar_mapping_spec.md
docs/grammar_expansion_pronoun_possessive_number_plan.md
```

It maps:

```text
global grammar target
→ shopping communicative function
→ fixed chunk / controlled pattern
→ restricted slot / paired slot
→ generated sentence_bank
```

---

# 1. Core Principle

Grammar must be:

```text
level-specific
explicitly controlled
testable
scenario-appropriate
safe for FSI substitution
```

Do not rely on implicit grammar emergence.

Do not generate sentences directly from grammar labels.

Correct pipeline:

```text
level
→ grammar target
→ tense / mood target
→ shopping function
→ pattern
→ chunks
→ slot / paired slot
→ generated sentence
→ QA validation
```

Bad pipeline:

```text
grammar label
→ free sentence generation
```

---

# 2. Global Shopping Grammar Responsibilities

Shopping is a strong carrier for:

```text
this / that / these / those
singular / plural item agreement
a / an / the
it / they pronoun reference
want / wants
can / could / may requests
would like
need
comparatives
superlatives
shopping advice
store rules
returns
exchanges
refunds
payment language
condition / result language
product descriptions
```

Shopping should not be forced to carry every grammar point.

Defer or tightly control:

```text
broad past simple generation
broad present perfect generation
free present continuous generation
free passive transformation
free relative clauses
free conditionals
broad subject replacement
multi-turn dialogue
paragraph writing
```

---

# 3. Pattern Metadata Schema

Every Shopping pattern should use this schema.

```json
{
  "pattern_id": "SHOP_A2_PAST_QUESTION_DID",
  "scenario": "shopping",
  "level": "A2",
  "function": "ask_past_purchase",
  "template": "Did {subject} {base_verb} {object_phrase}?",
  "chunks": ["Did", "{subject}", "{base_verb}", "{object_phrase}?"],
  "grammar_focus": [
    "past_simple_question",
    "did_auxiliary",
    "base_verb_after_did"
  ],
  "tense_aspect": ["past_simple_question"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "past_question_pair": "shopping_past_question_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": [
    "item_number_agreement"
  ],
  "time_marker_policy": {
    "allowed_tense": "past_simple",
    "allowed_markers": ["yesterday", "last week"],
    "blocked_markers": ["already", "yet", "right now"]
  },
  "generation_scope": "limited_production",
  "review_required": true
}
```

---

# 4. Required Metadata Fields

Required:

```text
pattern_id
scenario
level
function
template
grammar_focus
tense_aspect
tense_control
morphology_generation
slot_refs
slot_control
generation_scope
review_required
```

Recommended:

```text
chunks
mood_modal
agreement_controls
time_marker_policy
invalid_examples
pattern_family_id
notes
min_count
```

---

# 5. Tense Control Types

Use these values:

```text
fixed
fixed_chunk
controlled_chunk
paired_slot
grammar_semantic_paired
deferred
```

## 5.1 fixed

No slot replacement.

Example:

```text
I will take it.
```

## 5.2 fixed_chunk

A fixed grammar structure with limited lexical substitution.

Example:

```text
I am looking for {item}.
```

## 5.3 controlled_chunk

Controlled grammar structure with restricted substitutions.

Example:

```text
I bought this {item} yesterday.
```

## 5.4 paired_slot

Grammar agreement is controlled by paired slot entries.

Example:

```text
Did {subject} {base_verb} {object_phrase}?
```

## 5.5 grammar_semantic_paired

Both grammar and meaning must be paired.

Example:

```text
This {item} is too {problem_adj}.
```

## 5.6 deferred

The grammar is recognized as part of a future roadmap but not generated.

---

# 6. Slot Control Types

## 6.1 Restricted slot

Safe substitution within a limited semantic group.

Example:

```text
I want {item}.
```

Slot:

```text
shopping_items_with_article
```

Outputs:

```text
I want a bag.
I want a notebook.
I want a pen.
```

---

## 6.2 Grammar paired slot

Required for agreement.

Example slot:

```json
{
  "shopping_item_number_agreement_pairs": [
    {
      "display_demonstrative": "This",
      "item_noun": "shirt",
      "item_phrase": "this shirt",
      "article_phrase": "a shirt",
      "number": "singular",
      "be": "is",
      "pronoun_subject": "it",
      "pronoun_object": "it",
      "return_pronoun": "it"
    },
    {
      "display_demonstrative": "These",
      "item_noun": "shoes",
      "item_phrase": "these shoes",
      "article_phrase": "shoes",
      "number": "plural",
      "be": "are",
      "pronoun_subject": "they",
      "pronoun_object": "them",
      "return_pronoun": "them"
    }
  ]
}
```

Valid:

```text
This shirt is cheap.
These shoes are expensive.
I bought this shirt. I would like to return it.
I bought these shoes. I would like to return them.
```

Invalid:

```text
These shirt is cheap.
This shoes are expensive.
I bought these shoes. I would like to return it.
```

---

## 6.3 Semantic paired slot

Required when meaning must be constrained.

Example:

```json
{
  "shopping_item_problem_adj_pairs": [
    {
      "item_phrase": "this shirt",
      "be": "is",
      "problem_adj": "too small",
      "pronoun_subject": "it"
    },
    {
      "item_phrase": "these shoes",
      "be": "are",
      "problem_adj": "too tight",
      "pronoun_subject": "they"
    },
    {
      "item_phrase": "this bag",
      "be": "is",
      "problem_adj": "too heavy",
      "pronoun_subject": "it"
    }
  ]
}
```

Valid:

```text
This shirt is too small.
These shoes are too tight.
This bag is too heavy.
```

Invalid:

```text
This receipt is too tight.
This pen is too heavy.
These shoes is too tight.
```

---

# 7. Level Overview

## A1

Focus:

```text
Present Simple
Present Be
have / like / want
Can requests
Imperatives
basic article control
this / that
basic wh-questions
```

Shopping function:

```text
identify item
want item
have item
ask price
ask location
make simple request
understand simple instruction
```

---

## A1+

Focus:

```text
Present Continuous fixed chunks
Must fixed rule
going to fixed future
like / don't like
basic adjectives
color adjectives
there is / there are
degree adverbs
```

Shopping function:

```text
look for item
describe item simply
express preference
state simple rule
state simple buying plan
```

---

## A2

Focus:

```text
Past Simple fixed / controlled
will fixed future
should / could / may
would like
need
do questions
plural item agreement
comparatives
simple contrast with but
Present Perfect ever / never as recognition-level fixed chunk
```

Shopping function:

```text
ask availability
make polite request
state past purchase
ask past purchase question
state past negative
compare items
choose option
give simple advice
```

---

## A2+

Focus:

```text
Past Continuous fixed chunk
Present Perfect just / yet / already
First Conditional controlled
Zero Conditional fixed rule
because clauses
cannot because
too + adjective
not adjective enough
controlled permission with condition
```

Shopping function:

```text
explain choice
describe product problem
state payment completion
state not received
state buying condition
describe shopping limitation
```

---

## B1

Focus:

```text
Present Perfect Continuous
Passive Voice
Second Conditional
Past Perfect fixed high-level chunk
should / must / have to
superlatives
return / exchange / refund language
payment language
condition / result
complaint language
```

Shopping function:

```text
complain politely
describe product origin
describe material
give advice
state store rule
return item
exchange item
request refund
ask payment method
explain past sequence
```

---

# 8. A1 Pattern Set

## A1-1 Present Be: identify item

```json
{
  "pattern_id": "SHOP_A1_PRESENT_BE_THIS_IS_ITEM",
  "scenario": "shopping",
  "level": "A1",
  "function": "identify_item",
  "template": "This is {item}.",
  "chunks": ["This", "is", "{item}."],
  "grammar_focus": ["present_be", "demonstrative_this", "singular_noun", "article_control"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
This is a bag.
This is a shirt.
This is a notebook.
```

Related:

```text
That is {item}.
```

---

## A1-2 Present Simple: want item

```json
{
  "pattern_id": "SHOP_A1_PRESENT_SIMPLE_I_WANT_ITEM",
  "scenario": "shopping",
  "level": "A1",
  "function": "want_item",
  "template": "I want {item}.",
  "chunks": ["I", "want", "{item}."],
  "grammar_focus": ["present_simple", "first_person", "want", "article_control"],
  "tense_aspect": ["present_simple"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I want a pen.
I want a notebook.
I want a bag.
```

---

## A1-3 Present Simple: have item

```json
{
  "pattern_id": "SHOP_A1_PRESENT_SIMPLE_I_HAVE_ITEM",
  "scenario": "shopping",
  "level": "A1",
  "function": "state_possession",
  "template": "I have {item}.",
  "chunks": ["I", "have", "{item}."],
  "grammar_focus": ["present_simple", "first_person", "have", "article_control"],
  "tense_aspect": ["present_simple"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I have a bag.
I have a receipt.
I have a book.
```

---

## A1-4 Can request

```json
{
  "pattern_id": "SHOP_A1_CAN_I_HAVE_ITEM",
  "scenario": "shopping",
  "level": "A1",
  "function": "request_item",
  "template": "Can I have {item}?",
  "chunks": ["Can", "I", "have", "{item}?"],
  "grammar_focus": ["modal_can", "can_request", "yes_no_question", "article_control"],
  "tense_aspect": ["modal_can"],
  "mood_modal": ["can"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_request_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Can I have a bag?
Can I have a receipt?
Can I have a pen?
```

---

## A1-5 Price question

```json
{
  "pattern_id": "SHOP_A1_HOW_MUCH_IS_ITEM",
  "scenario": "shopping",
  "level": "A1",
  "function": "ask_price",
  "template": "How much is {item}?",
  "chunks": ["How much", "is", "{item}?"],
  "grammar_focus": ["wh_question_basic", "present_be", "price_question", "singular_noun"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_price_items_singular"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
How much is this pen?
How much is this notebook?
How much is this bag?
```

A1 should avoid plural price questions until plural agreement is active.

---

## A1-6 Location question

```json
{
  "pattern_id": "SHOP_A1_WHERE_IS_PLACE",
  "scenario": "shopping",
  "level": "A1",
  "function": "ask_location",
  "template": "Where is {place}?",
  "chunks": ["Where", "is", "{place}?"],
  "grammar_focus": ["wh_question_basic", "present_be", "location_question"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "place": "shopping_location_places"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Where is the cashier?
Where is the fitting room?
Where is the exit?
```

---

## A1-7 Imperative fixed instruction

```json
{
  "pattern_id": "SHOP_A1_IMPERATIVE_FIXED",
  "scenario": "shopping",
  "level": "A1",
  "function": "store_instruction",
  "template": "{instruction}.",
  "chunks": ["{instruction}."],
  "grammar_focus": ["imperative", "fixed_instruction"],
  "tense_aspect": ["imperative"],
  "mood_modal": [],
  "tense_control": "fixed_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "instruction": "shopping_a1_imperatives"
  },
  "slot_control": "restricted",
  "generation_scope": "controlled_production",
  "review_required": true
}
```

Examples:

```text
Look here.
Try again.
Wait here.
```

Avoid:

```text
Open the book.
```

unless the shopping context is specifically books or school supplies.

---

## A1 Restrictions

Avoid:

```text
because
before / after
comparatives
superlatives
plural demonstratives
broad he / she substitution
past tense
present perfect
return / exchange / refund
```

Invalid:

```text
These shirt is cheap.
I bought this bag yesterday.
I want this bag because it is cheaper.
Could I exchange this item?
```

---

# 9. A1+ Pattern Set

## A1+-1 Present Continuous fixed: looking for

```json
{
  "pattern_id": "SHOP_A1P_PRESENT_CONT_LOOKING_FOR",
  "scenario": "shopping",
  "level": "A1+",
  "function": "look_for_item",
  "template": "I am looking for {item}.",
  "chunks": ["I", "am looking for", "{item}."],
  "grammar_focus": ["present_continuous", "fixed_chunk", "shopping_request"],
  "tense_aspect": ["present_continuous_fixed"],
  "mood_modal": [],
  "tense_control": "fixed_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article_or_purpose"
  },
  "slot_control": "restricted",
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I am looking for a bag.
I am looking for a gift.
I am looking for a notebook.
```

Do not freely generate:

```text
He is looking for ...
They are looking for ...
I am buying ...
I am paying ...
```

---

## A1+-2 Like item

```json
{
  "pattern_id": "SHOP_A1P_I_LIKE_THIS_ITEM",
  "scenario": "shopping",
  "level": "A1+",
  "function": "express_preference",
  "template": "I like this {item}.",
  "chunks": ["I", "like", "this {item}."],
  "grammar_focus": ["present_simple", "like", "demonstrative_this", "singular_noun"],
  "tense_aspect": ["present_simple"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_singular_item_nouns"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I like this shirt.
I like this bag.
I like this notebook.
```

---

## A1+-3 Don’t like item

```json
{
  "pattern_id": "SHOP_A1P_I_DONT_LIKE_THIS_ITEM",
  "scenario": "shopping",
  "level": "A1+",
  "function": "express_dislike",
  "template": "I don't like this {item}.",
  "chunks": ["I", "don't like", "this {item}."],
  "grammar_focus": ["present_simple_negative", "do_negative", "like", "demonstrative_this"],
  "tense_aspect": ["present_simple_negative"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_singular_item_nouns"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I don't like this shirt.
I don't like this bag.
I don't like this color.
```

---

## A1+-4 Basic adjective description

```json
{
  "pattern_id": "SHOP_A1P_THIS_ITEM_IS_ADJ",
  "scenario": "shopping",
  "level": "A1+",
  "function": "describe_item",
  "template": "This {item} is {adj}.",
  "chunks": ["This {item}", "is", "{adj}."],
  "grammar_focus": ["present_be", "basic_adjective", "demonstrative_this"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_adj_pair": "shopping_item_basic_adj_pairs"
  },
  "slot_control": "semantic_paired",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This shirt is nice.
This bag is big.
This notebook is small.
```

Avoid:

```text
This receipt is beautiful.
This pen is heavy.
```

unless intentionally allowed.

---

## A1+-5 Color description

```json
{
  "pattern_id": "SHOP_A1P_THIS_ITEM_IS_COLOR",
  "scenario": "shopping",
  "level": "A1+",
  "function": "describe_color",
  "template": "This {item} is {color}.",
  "chunks": ["This {item}", "is", "{color}."],
  "grammar_focus": ["present_be", "color_adjective", "demonstrative_this"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_colorable_singular_items",
    "color": "basic_colors"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
This shirt is blue.
This bag is black.
This notebook is red.
```

---

## A1+-6 Must fixed rule

```json
{
  "pattern_id": "SHOP_A1P_MUST_FIXED_RULE",
  "scenario": "shopping",
  "level": "A1+",
  "function": "store_rule",
  "template": "{must_rule}.",
  "chunks": ["{must_rule}."],
  "grammar_focus": ["modal_must", "fixed_rule"],
  "tense_aspect": ["modal_must"],
  "mood_modal": ["must"],
  "tense_control": "fixed_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "must_rule": "shopping_a1p_must_rules"
  },
  "slot_control": "restricted",
  "generation_scope": "recognition_or_limited_production",
  "review_required": true
}
```

Examples:

```text
You must pay here.
You must keep the receipt.
You must wait here.
```

---

## A1+-7 Going to future fixed

```json
{
  "pattern_id": "SHOP_A1P_GOING_TO_BUY_FIXED",
  "scenario": "shopping",
  "level": "A1+",
  "function": "state_plan",
  "template": "I am going to buy {item}.",
  "chunks": ["I", "am going to buy", "{item}."],
  "grammar_focus": ["going_to_future", "fixed_chunk", "buying_plan"],
  "tense_aspect": ["future_going_to_fixed"],
  "mood_modal": [],
  "tense_control": "fixed_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I am going to buy a bag.
I am going to buy a notebook.
I am going to buy a shirt.
```

Do not generate:

```text
He is going to buys a bag.
They is going to buy shoes.
I am going to bought a shirt.
```

---

## A1+-8 There is / There are controlled

```json
{
  "pattern_id": "SHOP_A1P_THERE_IS_ARE_ITEM",
  "scenario": "shopping",
  "level": "A1+",
  "function": "state_availability",
  "template": "{there_be} {item_phrase}.",
  "chunks": ["{there_be}", "{item_phrase}."],
  "grammar_focus": ["there_is_there_are", "singular_plural_agreement"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "there_item_pair": "shopping_there_is_are_item_pairs"
  },
  "slot_control": "grammar_paired",
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
There is a sale.
There is a fitting room.
There are bags.
There are notebooks.
```

Invalid:

```text
There are a sale.
There is bags.
```

---

## A1+ Notes

`shall` is not recommended for active American English Shopping output.

Possible recognition-only phrase:

```text
Shall I help you?
```

Preferred American English:

```text
Can I help you?
May I help you?
```

---

# 10. A2 Pattern Set

## A2-1 Would like item

```json
{
  "pattern_id": "SHOP_A2_I_WOULD_LIKE_ITEM",
  "scenario": "shopping",
  "level": "A2",
  "function": "polite_request_item",
  "template": "I would like {item}.",
  "chunks": ["I", "would like", "{item}."],
  "grammar_focus": ["would_like", "polite_request", "article_control"],
  "tense_aspect": ["modal_would"],
  "mood_modal": ["would"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I would like a bag.
I would like a receipt.
I would like a notebook.
```

---

## A2-2 Need item for purpose

```json
{
  "pattern_id": "SHOP_A2_I_NEED_ITEM_FOR_PURPOSE",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_need_with_purpose",
  "template": "I need {item} for {purpose}.",
  "chunks": ["I", "need", "{item}", "for {purpose}."],
  "grammar_focus": ["present_simple", "need", "prepositional_phrase_for_purpose"],
  "tense_aspect": ["present_simple"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_purpose_pair": "shopping_item_purpose_pairs"
  },
  "slot_control": "semantic_paired",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
I need a notebook for school.
I need a backpack for school.
I need a gift for my friend.
I need a shirt for work.
```

Invalid:

```text
I need a receipt for school.
I need shoes for homework.
```

---

## A2-3 Do you have any plural items?

```json
{
  "pattern_id": "SHOP_A2_DO_YOU_HAVE_ANY_ITEMS",
  "scenario": "shopping",
  "level": "A2",
  "function": "ask_availability",
  "template": "Do you have any {plural_item}?",
  "chunks": ["Do", "you", "have", "any {plural_item}?"],
  "grammar_focus": ["do_question", "any", "plural_noun"],
  "tense_aspect": ["present_simple_question"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "plural_item": "shopping_plural_items"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Do you have any notebooks?
Do you have any bags?
Do you have any shirts?
```

---

## A2-4 Do you have this in option?

```json
{
  "pattern_id": "SHOP_A2_DO_YOU_HAVE_THIS_IN_OPTION",
  "scenario": "shopping",
  "level": "A2",
  "function": "ask_option_availability",
  "template": "Do you have this in {option}?",
  "chunks": ["Do", "you", "have", "this", "in {option}?"],
  "grammar_focus": ["do_question", "demonstrative_this", "prepositional_phrase"],
  "tense_aspect": ["present_simple_question"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "option": "shopping_color_size_options"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Do you have this in blue?
Do you have this in black?
Do you have this in a small size?
Do you have this in a larger size?
```

---

## A2-5 Demonstrative item agreement

```json
{
  "pattern_id": "SHOP_A2_ITEM_NUMBER_BE_ADJ",
  "scenario": "shopping",
  "level": "A2",
  "function": "describe_item_or_items",
  "template": "{display_demonstrative} {item_noun} {be} {adj}.",
  "chunks": ["{display_demonstrative} {item_noun}", "{be}", "{adj}."],
  "grammar_focus": ["demonstrative_agreement", "singular_plural_agreement", "present_be"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_item_number_agreement_pairs",
    "adj": "shopping_safe_basic_adjectives"
  },
  "slot_control": "grammar_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This shirt is cheap.
That bag is big.
These shoes are expensive.
Those notebooks are small.
```

Invalid:

```text
These shirt is cheap.
This shoes are expensive.
Those notebook are small.
```

---

## A2-6 Simple contrast with but

```json
{
  "pattern_id": "SHOP_A2_ITEM_IS_ADJ_BUT_ADJ",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_contrast",
  "template": "This {item} is {adj1}, but it is {adj2}.",
  "chunks": ["This {item}", "is", "{adj1},", "but", "it is", "{adj2}."],
  "grammar_focus": ["and_but_connector", "present_be", "contrast"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "contrast_pair": "shopping_item_adj_contrast_pairs"
  },
  "slot_control": "semantic_paired",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This shirt is nice, but it is expensive.
This bag is big, but it is heavy.
This notebook is small, but it is useful.
```

---

## A2-7 Basic comparative

```json
{
  "pattern_id": "SHOP_A2_THIS_IS_COMPARATIVE_THAN_THAT",
  "scenario": "shopping",
  "level": "A2",
  "function": "compare_items",
  "template": "This {item} is {comparative} than that one.",
  "chunks": ["This {item}", "is", "{comparative} than", "that one."],
  "grammar_focus": ["comparative_controlled", "present_be", "demonstrative_reference"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_comparative_pair": "shopping_item_comparative_pairs"
  },
  "slot_control": "semantic_paired",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This shirt is cheaper than that one.
This bag is bigger than that one.
This notebook is smaller than that one.
```

Invalid:

```text
This receipt is bigger than that one.
This pen is more delicious than that one.
```

---

## A2-8 Past Simple affirmative: bought

```json
{
  "pattern_id": "SHOP_A2_PAST_SUBJECT_BOUGHT_OBJECT",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_past_purchase",
  "template": "{subject} {past_verb} {object_phrase}.",
  "chunks": ["{subject}", "{past_verb}", "{object_phrase}."],
  "grammar_focus": ["past_simple", "subject_past_pair", "item_number_agreement"],
  "tense_aspect": ["past_simple"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "purchase_pair": "shopping_subject_past_purchase_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I bought this shirt.
I bought these shoes.
She bought this bag.
They bought these shoes.
```

Invalid:

```text
She buy this bag.
They bought this shoe.
I buys these shoes.
```

---

## A2-9 Past Simple with time marker

```json
{
  "pattern_id": "SHOP_A2_PAST_SIMPLE_BOUGHT_TIME",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_past_purchase_with_time",
  "template": "I bought {item_phrase} {time_marker}.",
  "chunks": ["I", "bought", "{item_phrase}", "{time_marker}."],
  "grammar_focus": ["past_simple", "past_time_marker", "item_number_agreement"],
  "tense_aspect": ["past_simple"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_item_number_agreement_pairs",
    "time_marker": "past_simple_time_markers"
  },
  "slot_control": "grammar_paired",
  "agreement_controls": ["item_number_agreement", "time_marker_compatibility"],
  "time_marker_policy": {
    "allowed_tense": "past_simple",
    "allowed_markers": ["yesterday", "last week"],
    "blocked_markers": ["already", "yet", "right now"],
    "position": "sentence_final"
  },
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I bought this shirt yesterday.
I bought these shoes last week.
```

Invalid:

```text
I bought this shirt already.
I have bought this shirt yesterday.
I buy this shirt last week.
```

---

## A2-10 Past Simple negative

```json
{
  "pattern_id": "SHOP_A2_PAST_NEGATIVE_DID_NOT",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_past_negative",
  "template": "{subject} did not {base_verb} {object_phrase}.",
  "chunks": ["{subject}", "did not", "{base_verb}", "{object_phrase}."],
  "grammar_focus": ["past_simple_negative", "did_auxiliary", "base_verb_after_did"],
  "tense_aspect": ["past_simple_negative"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "past_negative_pair": "shopping_past_negative_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I did not buy this shirt.
I did not keep the receipt.
She did not pay for this bag.
They did not buy these shoes.
```

Invalid:

```text
I did not bought this shirt.
She did not paid for this bag.
They did not buys these shoes.
```

Optional contraction pattern:

```text
{subject} didn't {base_verb} {object_phrase}.
```

---

## A2-11 Past Simple question

```json
{
  "pattern_id": "SHOP_A2_PAST_QUESTION_DID",
  "scenario": "shopping",
  "level": "A2",
  "function": "ask_past_purchase",
  "template": "Did {subject} {base_verb} {object_phrase}?",
  "chunks": ["Did", "{subject}", "{base_verb}", "{object_phrase}?"],
  "grammar_focus": ["past_simple_question", "did_auxiliary", "base_verb_after_did"],
  "tense_aspect": ["past_simple_question"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "past_question_pair": "shopping_past_question_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
Did you buy this shirt?
Did you keep the receipt?
Did she pay for this bag?
Did they buy these shoes?
```

Invalid:

```text
Did you bought this shirt?
Did she paid for this bag?
Did they buys these shoes?
```

---

## A2-12 Will fixed decision

```json
{
  "pattern_id": "SHOP_A2_WILL_TAKE_IT",
  "scenario": "shopping",
  "level": "A2",
  "function": "purchase_decision",
  "template": "I will take it.",
  "chunks": ["I", "will take", "it."],
  "grammar_focus": ["will_future", "decision"],
  "tense_aspect": ["future_will_fixed"],
  "mood_modal": ["will"],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "core_production",
  "review_required": false
}
```

Related:

```text
I will buy it.
I will take this one.
I will buy this one.
```

---

## A2-13 Could request

```json
{
  "pattern_id": "SHOP_A2_COULD_I_HAVE_ITEM",
  "scenario": "shopping",
  "level": "A2",
  "function": "polite_request",
  "template": "Could I have {item}?",
  "chunks": ["Could", "I", "have", "{item}?"],
  "grammar_focus": ["could_request", "polite_request"],
  "tense_aspect": ["modal_could"],
  "mood_modal": ["could"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_request_items_with_article"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Could I have a receipt?
Could I have a bag?
Could I have a smaller size?
```

---

## A2-14 Should advice

```json
{
  "pattern_id": "SHOP_A2_SHOULD_ACTION",
  "scenario": "shopping",
  "level": "A2",
  "function": "shopping_advice",
  "template": "You should {action}.",
  "chunks": ["You", "should", "{action}."],
  "grammar_focus": ["should_advice", "modal_should"],
  "tense_aspect": ["modal_should"],
  "mood_modal": ["should"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "action": "shopping_should_actions"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
You should keep the receipt.
You should check the size.
You should try it on.
```

---

## A2-15 May permission

```json
{
  "pattern_id": "SHOP_A2_MAY_I_TRY_THIS_ON",
  "scenario": "shopping",
  "level": "A2",
  "function": "ask_permission",
  "template": "May I try this on?",
  "chunks": ["May", "I", "try this on?"],
  "grammar_focus": ["may_permission", "polite_request"],
  "tense_aspect": ["modal_may"],
  "mood_modal": ["may"],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "limited_production",
  "review_required": false
}
```

Examples:

```text
May I try this on?
May I see another one?
```

---

## A2-16 Present Perfect ever / never recognition fixed

```json
{
  "pattern_id": "SHOP_A2_PRESENT_PERFECT_NEVER_BRAND_FIXED",
  "scenario": "shopping",
  "level": "A2",
  "function": "state_experience",
  "template": "I have never bought this brand before.",
  "chunks": ["I", "have never bought", "this brand", "before."],
  "grammar_focus": ["present_perfect_ever_never", "fixed_chunk"],
  "tense_aspect": ["present_perfect_fixed"],
  "mood_modal": [],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "recognition_or_limited_production",
  "review_required": true
}
```

Notes:

```text
Shopping A2 Present Perfect should remain recognition-level or very limited.
Do not open broad present perfect generation.
```

---

# 11. A2+ Pattern Set

## A2+-1 Too + adjective problem

```json
{
  "pattern_id": "SHOP_A2P_ITEM_TOO_ADJ",
  "scenario": "shopping",
  "level": "A2+",
  "function": "describe_product_problem",
  "template": "{display_demonstrative} {item_noun} {be} too {problem_adj}.",
  "chunks": ["{display_demonstrative} {item_noun}", "{be}", "too {problem_adj}."],
  "grammar_focus": ["too_adjective", "problem_description", "item_number_agreement"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_problem_pair": "shopping_item_problem_adj_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This shirt is too small.
This bag is too heavy.
This jacket is too expensive.
These shoes are too tight.
```

Invalid:

```text
This receipt is too tight.
These shoes is too small.
```

---

## A2+-2 Not adjective enough

```json
{
  "pattern_id": "SHOP_A2P_ITEM_NOT_ADJ_ENOUGH",
  "scenario": "shopping",
  "level": "A2+",
  "function": "describe_product_problem",
  "template": "{display_demonstrative} {item_noun} {be} not {adj} enough.",
  "chunks": ["{display_demonstrative} {item_noun}", "{be}", "not {adj} enough."],
  "grammar_focus": ["not_adjective_enough", "problem_description", "item_number_agreement"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_enough_adj_pair": "shopping_item_enough_adj_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This bag is not big enough.
This jacket is not warm enough.
This notebook is not thick enough.
These shoes are not comfortable enough.
```

---

## A2+-3 Preference with because

```json
{
  "pattern_id": "SHOP_A2P_I_LIKE_THIS_BECAUSE_IT_IS_ADJ",
  "scenario": "shopping",
  "level": "A2+",
  "function": "explain_preference",
  "template": "I like {item_phrase} because {pronoun_subject} {be} {adj}.",
  "chunks": ["I", "like", "{item_phrase}", "because", "{pronoun_subject} {be} {adj}."],
  "grammar_focus": ["because_reason_clause", "pronoun_reference", "item_number_agreement"],
  "tense_aspect": ["present_simple", "present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_reason_adj_pair": "shopping_item_reason_adj_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement", "pronoun_reference"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
I like this bag because it is light.
I like this shirt because it is comfortable.
I like these shoes because they are cheap.
```

Invalid:

```text
I like this receipt because it is comfortable.
I like these shoes because it is cheap.
```

---

## A2+-4 Cannot because

```json
{
  "pattern_id": "SHOP_A2P_CANNOT_BUY_BECAUSE_REASON",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_limitation",
  "template": "I cannot buy {item_phrase} because {pronoun_subject} {be} {reason}.",
  "chunks": ["I", "cannot buy", "{item_phrase}", "because", "{pronoun_subject} {be} {reason}."],
  "grammar_focus": ["cannot_because", "because_reason_clause", "pronoun_reference"],
  "tense_aspect": ["modal_can_negative", "present_be"],
  "mood_modal": ["can"],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_cannot_reason_pair": "shopping_item_cannot_reason_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement", "pronoun_reference"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
I cannot buy this bag because it is too expensive.
I cannot buy this shirt because it is too small.
I cannot buy these shoes because they are too tight.
```

---

## A2+-5 Present Perfect already paid

```json
{
  "pattern_id": "SHOP_A2P_PRESENT_PERFECT_ALREADY_PAID",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_payment_completed",
  "template": "I have already paid.",
  "chunks": ["I", "have already paid."],
  "grammar_focus": ["present_perfect", "already", "payment"],
  "tense_aspect": ["present_perfect_already"],
  "mood_modal": [],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "time_marker_policy": {
    "allowed_tense": "present_perfect",
    "allowed_markers": ["already"],
    "blocked_markers": ["yesterday", "last week"],
    "position": "mid_position"
  },
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
I have already paid.
I have already paid for this.
I have already paid for this item.
```

Invalid:

```text
I have paid yesterday.
I paid already.
```

---

## A2+-6 Present Perfect not yet received

```json
{
  "pattern_id": "SHOP_A2P_PRESENT_PERFECT_NOT_YET_RECEIVED",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_not_received",
  "template": "I have not received {item} yet.",
  "chunks": ["I", "have not received", "{item}", "yet."],
  "grammar_focus": ["present_perfect", "yet", "negative"],
  "tense_aspect": ["present_perfect_negative_yet"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_not_received_items"
  },
  "slot_control": "restricted",
  "time_marker_policy": {
    "allowed_tense": "present_perfect_negative",
    "allowed_markers": ["yet"],
    "blocked_markers": ["yesterday", "last week", "already"],
    "position": "sentence_final"
  },
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I have not received my receipt yet.
I have not received my change yet.
```

---

## A2+-7 Present Perfect just bought

```json
{
  "pattern_id": "SHOP_A2P_PRESENT_PERFECT_JUST_BOUGHT",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_recent_purchase",
  "template": "I have just bought {item_phrase}.",
  "chunks": ["I", "have just bought", "{item_phrase}."],
  "grammar_focus": ["present_perfect", "just", "recent_purchase"],
  "tense_aspect": ["present_perfect_just"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_item_number_agreement_pairs"
  },
  "slot_control": "grammar_paired",
  "agreement_controls": ["item_number_agreement"],
  "time_marker_policy": {
    "allowed_tense": "present_perfect",
    "allowed_markers": ["just"],
    "blocked_markers": ["yesterday", "last week"],
    "position": "mid_position"
  },
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I have just bought this shirt.
I have just bought these shoes.
```

Invalid:

```text
I have just bought this shirt yesterday.
```

---

## A2+-8 First Conditional controlled

```json
{
  "pattern_id": "SHOP_A2P_FIRST_CONDITIONAL_BUY",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_purchase_condition",
  "template": "If {condition}, {result}.",
  "chunks": ["If", "{condition},", "{result}."],
  "grammar_focus": ["first_conditional", "will_future", "condition_result"],
  "tense_aspect": ["first_conditional_controlled"],
  "mood_modal": ["will"],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "condition_result_pair": "shopping_first_conditional_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
If it is cheaper, I will buy it.
If it fits, I will take it.
If it is on sale, I will buy it.
```

Invalid:

```text
If it was cheaper, I will bought it.
If it fits, I bought it.
```

---

## A2+-9 Zero Conditional fixed rule

```json
{
  "pattern_id": "SHOP_A2P_ZERO_CONDITIONAL_RECEIPT_RULE",
  "scenario": "shopping",
  "level": "A2+",
  "function": "state_store_rule",
  "template": "If you lose the receipt, you cannot return it.",
  "chunks": ["If", "you lose the receipt,", "you cannot return it."],
  "grammar_focus": ["zero_conditional", "store_rule", "modal_can_negative"],
  "tense_aspect": ["zero_conditional_fixed"],
  "mood_modal": ["can"],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "recognition_or_limited_production",
  "review_required": true
}
```

---

## A2+-10 Past Continuous fixed

```json
{
  "pattern_id": "SHOP_A2P_PAST_CONTINUOUS_WAITING",
  "scenario": "shopping",
  "level": "A2+",
  "function": "describe_past_background",
  "template": "I was waiting in line.",
  "chunks": ["I", "was waiting", "in line."],
  "grammar_focus": ["past_continuous", "fixed_chunk"],
  "tense_aspect": ["past_continuous_fixed"],
  "mood_modal": [],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "recognition_or_limited_production",
  "review_required": true
}
```

Related fixed chunk:

```text
I was looking for my receipt.
```

Do not generate:

```text
They was waiting.
I was bought.
I were looking.
```

---

# 12. B1 Pattern Set

## B1-1 Could you help me find item?

```json
{
  "pattern_id": "SHOP_B1_COULD_YOU_HELP_FIND_ITEM",
  "scenario": "shopping",
  "level": "B1",
  "function": "ask_for_help",
  "template": "Could you help me find {item}?",
  "chunks": ["Could", "you", "help me find", "{item}?"],
  "grammar_focus": ["could_request", "polite_request"],
  "tense_aspect": ["modal_could"],
  "mood_modal": ["could"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "item": "shopping_items_with_article_or_specific"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": false
}
```

Examples:

```text
Could you help me find a backpack?
Could you help me find a gift?
Could you help me find the fitting room?
```

---

## B1-2 Recommendation

```json
{
  "pattern_id": "SHOP_B1_WHICH_ONE_DO_YOU_RECOMMEND",
  "scenario": "shopping",
  "level": "B1",
  "function": "ask_recommendation",
  "template": "Which one do you recommend?",
  "chunks": ["Which one", "do you recommend?"],
  "grammar_focus": ["wh_question", "do_question", "recommendation_language"],
  "tense_aspect": ["present_simple_question"],
  "mood_modal": [],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "core_production",
  "review_required": false
}
```

Controlled variants:

```text
Which bag do you recommend?
Which size do you recommend?
Which color do you recommend?
```

---

## B1-3 Superlative

```json
{
  "pattern_id": "SHOP_B1_SUPERLATIVE_ITEM",
  "scenario": "shopping",
  "level": "B1",
  "function": "identify_best_option",
  "template": "This is the {superlative} {item} in the store.",
  "chunks": ["This is", "the {superlative} {item}", "in the store."],
  "grammar_focus": ["superlative_controlled", "present_be", "shopping_comparison"],
  "tense_aspect": ["present_be"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "superlative_item_pair": "shopping_superlative_item_pairs"
  },
  "slot_control": "semantic_paired",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
This is the cheapest shirt in the store.
This is the best bag for school.
This is the largest size in the store.
```

Invalid:

```text
This is the most delicious receipt in the store.
This is the cheapest cashier in the store.
```

---

## B1-4 Store rule with must

```json
{
  "pattern_id": "SHOP_B1_YOU_MUST_ACTION",
  "scenario": "shopping",
  "level": "B1",
  "function": "state_store_rule",
  "template": "You must {action}.",
  "chunks": ["You", "must", "{action}."],
  "grammar_focus": ["modal_must", "store_rule"],
  "tense_aspect": ["modal_must"],
  "mood_modal": ["must"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "action": "shopping_must_actions"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
You must show your receipt.
You must pay before you leave.
You must keep the tag on.
```

---

## B1-5 Have to requirement

```json
{
  "pattern_id": "SHOP_B1_YOU_HAVE_TO_ACTION",
  "scenario": "shopping",
  "level": "B1",
  "function": "state_requirement",
  "template": "You have to {action}.",
  "chunks": ["You", "have to", "{action}."],
  "grammar_focus": ["have_to", "store_rule"],
  "tense_aspect": ["semi_modal_have_to"],
  "mood_modal": ["have_to"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "action": "shopping_have_to_actions"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
You have to keep the receipt.
You have to show your card.
You have to try it on in the fitting room.
```

---

## B1-6 Return item

```json
{
  "pattern_id": "SHOP_B1_I_WOULD_LIKE_TO_RETURN_ITEM",
  "scenario": "shopping",
  "level": "B1",
  "function": "request_return",
  "template": "I would like to return {item_phrase}.",
  "chunks": ["I", "would like to return", "{item_phrase}."],
  "grammar_focus": ["would_like_to", "return_language", "item_number_agreement"],
  "tense_aspect": ["modal_would"],
  "mood_modal": ["would"],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_returnable_item_number_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
I would like to return this shirt.
I would like to return this bag.
I would like to return these shoes.
```

Invalid:

```text
I would like to return this cashier.
I would like to return this receipt.
```

---

## B1-7 Bought and return pronoun

```json
{
  "pattern_id": "SHOP_B1_BOUGHT_AND_RETURN_PRONOUN",
  "scenario": "shopping",
  "level": "B1",
  "function": "state_purchase_and_request_return",
  "template": "I bought {item_phrase}. I would like to return {return_pronoun}.",
  "chunks": ["I", "bought", "{item_phrase}.", "I would like to return", "{return_pronoun}."],
  "grammar_focus": ["past_simple", "pronoun_reference", "return_language", "item_number_agreement"],
  "tense_aspect": ["past_simple"],
  "mood_modal": ["would"],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_item_number_agreement_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement", "pronoun_reference"],
  "generation_scope": "limited_production",
  "review_required": true
}
```

Examples:

```text
I bought this shirt. I would like to return it.
I bought these shoes. I would like to return them.
```

Invalid:

```text
I bought these shoes. I would like to return it.
I bought this shirt. I would like to return them.
```

---

## B1-8 Exchange item

```json
{
  "pattern_id": "SHOP_B1_COULD_I_EXCHANGE_ITEM",
  "scenario": "shopping",
  "level": "B1",
  "function": "request_exchange",
  "template": "Could I exchange {item_phrase} for another one?",
  "chunks": ["Could", "I", "exchange", "{item_phrase}", "for another one?"],
  "grammar_focus": ["could_request", "exchange_language", "item_number_agreement"],
  "tense_aspect": ["modal_could"],
  "mood_modal": ["could"],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "item_number_pair": "shopping_returnable_item_number_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["item_number_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
Could I exchange this shirt for another one?
Could I exchange this bag for another one?
```

For plural items, consider a separate natural pattern:

```text
Could I exchange these shoes for another pair?
```

---

## B1-9 Refund request

```json
{
  "pattern_id": "SHOP_B1_COULD_I_GET_REFUND",
  "scenario": "shopping",
  "level": "B1",
  "function": "request_refund",
  "template": "Could I get a refund?",
  "chunks": ["Could", "I", "get", "a refund?"],
  "grammar_focus": ["could_request", "refund_language"],
  "tense_aspect": ["modal_could"],
  "mood_modal": ["could"],
  "tense_control": "fixed",
  "morphology_generation": false,
  "slot_refs": {},
  "slot_control": "fixed",
  "generation_scope": "core_production",
  "review_required": false
}
```

Controlled expansion:

```text
Could I get a refund for this item?
Could I get a refund for this shirt?
```

---

## B1-10 Payment phrase

```json
{
  "pattern_id": "SHOP_B1_COULD_I_PAY_PHRASE",
  "scenario": "shopping",
  "level": "B1",
  "function": "ask_payment_method",
  "template": "Could I pay {payment_phrase}?",
  "chunks": ["Could", "I", "pay", "{payment_phrase}?"],
  "grammar_focus": ["could_request", "payment_language", "preposition_control"],
  "tense_aspect": ["modal_could"],
  "mood_modal": ["could"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "payment_phrase": "shopping_payment_phrase_pairs"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
Could I pay by card?
Could I pay in cash?
Could I pay with a gift card?
```

Invalid:

```text
Could I pay by cash?
Could I pay in card?
```

---

## B1-11 Present Perfect Continuous complaint

```json
{
  "pattern_id": "SHOP_B1_PRESENT_PERFECT_CONT_WAITING",
  "scenario": "shopping",
  "level": "B1",
  "function": "complain_waiting",
  "template": "I have been waiting for {duration}.",
  "chunks": ["I", "have been waiting", "for {duration}."],
  "grammar_focus": ["present_perfect_continuous", "complaint", "duration"],
  "tense_aspect": ["present_perfect_continuous"],
  "mood_modal": [],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "duration": "short_duration_phrases"
  },
  "slot_control": "restricted",
  "time_marker_policy": {
    "allowed_tense": "present_perfect_continuous",
    "allowed_markers": ["for 20 minutes", "for half an hour", "for a long time"],
    "blocked_markers": ["yesterday", "last week", "already"]
  },
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
I have been waiting for 20 minutes.
I have been waiting for half an hour.
I have been waiting for a long time.
```

---

## B1-12 Passive: made in

```json
{
  "pattern_id": "SHOP_B1_PASSIVE_MADE_IN",
  "scenario": "shopping",
  "level": "B1",
  "function": "describe_product_origin",
  "template": "{pronoun_subject} {be} made in {place}.",
  "chunks": ["{pronoun_subject}", "{be}", "made in", "{place}."],
  "grammar_focus": ["passive_voice", "product_description", "be_agreement"],
  "tense_aspect": ["present_passive"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "passive_origin_pair": "shopping_passive_origin_pairs"
  },
  "slot_control": "grammar_paired",
  "agreement_controls": ["pronoun_be_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
It is made in Italy.
It is made in Japan.
They are made in the USA.
```

Invalid:

```text
They is made in Italy.
It are made in Japan.
```

---

## B1-13 Passive: made of

```json
{
  "pattern_id": "SHOP_B1_PASSIVE_MADE_OF",
  "scenario": "shopping",
  "level": "B1",
  "function": "describe_material",
  "template": "{pronoun_subject} {be} made of {material}.",
  "chunks": ["{pronoun_subject}", "{be}", "made of", "{material}."],
  "grammar_focus": ["passive_voice", "material", "be_agreement"],
  "tense_aspect": ["present_passive"],
  "mood_modal": [],
  "tense_control": "paired_slot",
  "morphology_generation": false,
  "slot_refs": {
    "passive_material_pair": "shopping_passive_material_pairs"
  },
  "slot_control": "grammar_semantic_paired",
  "agreement_controls": ["pronoun_be_agreement"],
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
It is made of cotton.
It is made of leather.
It is made of plastic.
They are made of cotton.
```

---

## B1-14 Second Conditional advice

```json
{
  "pattern_id": "SHOP_B1_SECOND_CONDITIONAL_ADVICE",
  "scenario": "shopping",
  "level": "B1",
  "function": "give_advice",
  "template": "If I were you, I would {action}.",
  "chunks": ["If", "I were you,", "I would", "{action}."],
  "grammar_focus": ["second_conditional", "advice", "would"],
  "tense_aspect": ["second_conditional_fixed"],
  "mood_modal": ["would"],
  "tense_control": "controlled_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "action": "shopping_second_conditional_advice_actions"
  },
  "slot_control": "restricted",
  "generation_scope": "core_production",
  "review_required": true
}
```

Examples:

```text
If I were you, I would buy this one.
If I were you, I would choose the cheaper one.
If I were you, I would keep the receipt.
```

---

## B1-15 Past Perfect fixed high-level sequence

```json
{
  "pattern_id": "SHOP_B1_PAST_PERFECT_FIXED_SEQUENCE",
  "scenario": "shopping",
  "level": "B1",
  "function": "explain_past_sequence",
  "template": "{past_perfect_sequence}.",
  "chunks": ["{past_perfect_sequence}."],
  "grammar_focus": ["past_perfect", "past_sequence", "fixed_chunk"],
  "tense_aspect": ["past_perfect_fixed"],
  "mood_modal": [],
  "tense_control": "fixed_chunk",
  "morphology_generation": false,
  "slot_refs": {
    "past_perfect_sequence": "shopping_b1_past_perfect_sequences"
  },
  "slot_control": "restricted",
  "generation_scope": "b1_high_limited_production",
  "review_required": true
}
```

Examples:

```text
I had already paid before I noticed the problem.
I had left the store before I saw the damage.
```

Notes:

```text
Past Perfect is B1-high.
Use sparingly.
Do not open broad past perfect generation.
```

---

# 13. Grammar-Safe Tense Control Layer

This layer is required before Shopping can safely generate past, perfect, conditional, and passive structures.

Required controls:

```text
subject-past pairs
past-negative pattern
past-question pattern
item-number agreement
time-marker compatibility
```

---

## 13.1 subject-past pairs

Purpose:

```text
control subject + past verb + object phrase
```

Slot:

```json
{
  "shopping_subject_past_purchase_pairs": [
    {
      "subject": "I",
      "past_verb": "bought",
      "base_verb": "buy",
      "object_phrase": "this shirt",
      "object_number": "singular",
      "pronoun_object": "it",
      "possessive": "my"
    },
    {
      "subject": "I",
      "past_verb": "bought",
      "base_verb": "buy",
      "object_phrase": "these shoes",
      "object_number": "plural",
      "pronoun_object": "them",
      "possessive": "my"
    },
    {
      "subject": "she",
      "past_verb": "bought",
      "base_verb": "buy",
      "object_phrase": "this bag",
      "object_number": "singular",
      "pronoun_object": "it",
      "possessive": "her"
    },
    {
      "subject": "they",
      "past_verb": "bought",
      "base_verb": "buy",
      "object_phrase": "these shoes",
      "object_number": "plural",
      "pronoun_object": "them",
      "possessive": "their"
    }
  ]
}
```

Valid:

```text
I bought this shirt.
She bought this bag.
They bought these shoes.
```

Invalid:

```text
She buy this bag.
They bought this shoe.
I buys these shoes.
```

---

## 13.2 past-negative pairs

Purpose:

```text
control did not / didn't + base verb
```

Slot:

```json
{
  "shopping_past_negative_pairs": [
    {
      "subject": "I",
      "aux": "did not",
      "short_aux": "didn't",
      "base_verb": "buy",
      "object_phrase": "this shirt",
      "object_number": "singular",
      "pronoun_object": "it"
    },
    {
      "subject": "I",
      "aux": "did not",
      "short_aux": "didn't",
      "base_verb": "keep",
      "object_phrase": "the receipt",
      "object_number": "singular",
      "pronoun_object": "it"
    },
    {
      "subject": "she",
      "aux": "did not",
      "short_aux": "didn't",
      "base_verb": "pay for",
      "object_phrase": "this bag",
      "object_number": "singular",
      "pronoun_object": "it"
    },
    {
      "subject": "they",
      "aux": "did not",
      "short_aux": "didn't",
      "base_verb": "buy",
      "object_phrase": "these shoes",
      "object_number": "plural",
      "pronoun_object": "them"
    }
  ]
}
```

Valid:

```text
I did not buy this shirt.
I didn't keep the receipt.
She did not pay for this bag.
They didn't buy these shoes.
```

Invalid:

```text
I did not bought this shirt.
She didn't paid for this bag.
They didn't buys these shoes.
```

---

## 13.3 past-question pairs

Purpose:

```text
control Did + subject + base verb
```

Slot:

```json
{
  "shopping_past_question_pairs": [
    {
      "aux": "Did",
      "subject": "you",
      "base_verb": "buy",
      "object_phrase": "this shirt",
      "object_number": "singular",
      "expected_short_answer": "Yes, I did."
    },
    {
      "aux": "Did",
      "subject": "you",
      "base_verb": "keep",
      "object_phrase": "the receipt",
      "object_number": "singular",
      "expected_short_answer": "Yes, I did."
    },
    {
      "aux": "Did",
      "subject": "she",
      "base_verb": "pay for",
      "object_phrase": "this bag",
      "object_number": "singular",
      "expected_short_answer": "Yes, she did."
    },
    {
      "aux": "Did",
      "subject": "they",
      "base_verb": "buy",
      "object_phrase": "these shoes",
      "object_number": "plural",
      "expected_short_answer": "Yes, they did."
    }
  ]
}
```

Valid:

```text
Did you buy this shirt?
Did you keep the receipt?
Did she pay for this bag?
Did they buy these shoes?
```

Invalid:

```text
Did you bought this shirt?
Did she paid for this bag?
Did they buys these shoes?
```

---

## 13.4 item-number agreement

Purpose:

```text
control this / that / these / those + item + is / are + it / they + return it / them
```

Slot:

```json
{
  "shopping_item_number_agreement_pairs": [
    {
      "demonstrative": "this",
      "display_demonstrative": "This",
      "item_noun": "shirt",
      "item_phrase": "this shirt",
      "article_phrase": "a shirt",
      "number": "singular",
      "be": "is",
      "pronoun_subject": "it",
      "pronoun_object": "it",
      "one_phrase": "this one",
      "return_pronoun": "it"
    },
    {
      "demonstrative": "that",
      "display_demonstrative": "That",
      "item_noun": "bag",
      "item_phrase": "that bag",
      "article_phrase": "a bag",
      "number": "singular",
      "be": "is",
      "pronoun_subject": "it",
      "pronoun_object": "it",
      "one_phrase": "that one",
      "return_pronoun": "it"
    },
    {
      "demonstrative": "these",
      "display_demonstrative": "These",
      "item_noun": "shoes",
      "item_phrase": "these shoes",
      "article_phrase": "shoes",
      "number": "plural",
      "be": "are",
      "pronoun_subject": "they",
      "pronoun_object": "them",
      "one_phrase": "these ones",
      "return_pronoun": "them"
    },
    {
      "demonstrative": "those",
      "display_demonstrative": "Those",
      "item_noun": "notebooks",
      "item_phrase": "those notebooks",
      "article_phrase": "notebooks",
      "number": "plural",
      "be": "are",
      "pronoun_subject": "they",
      "pronoun_object": "them",
      "one_phrase": "those ones",
      "return_pronoun": "them"
    }
  ]
}
```

Valid:

```text
This shirt is cheap.
These shoes are expensive.
I bought this shirt. I would like to return it.
I bought these shoes. I would like to return them.
```

Invalid:

```text
These shirt is cheap.
This shoes are expensive.
They is cheap.
It are expensive.
I bought these shoes. I would like to return it.
```

---

## 13.5 time-marker compatibility

Purpose:

```text
prevent tense/time mismatches
```

Slot:

```json
{
  "shopping_time_marker_compatibility": [
    {
      "time_marker": "yesterday",
      "compatible_tense_aspect": ["past_simple"],
      "position": "sentence_final",
      "example": "I bought this shirt yesterday."
    },
    {
      "time_marker": "last week",
      "compatible_tense_aspect": ["past_simple"],
      "position": "sentence_final",
      "example": "I bought this bag last week."
    },
    {
      "time_marker": "already",
      "compatible_tense_aspect": ["present_perfect"],
      "position": "mid_position",
      "example": "I have already paid."
    },
    {
      "time_marker": "just",
      "compatible_tense_aspect": ["present_perfect"],
      "position": "mid_position",
      "example": "I have just bought this shirt."
    },
    {
      "time_marker": "yet",
      "compatible_tense_aspect": ["present_perfect_negative", "present_perfect_question"],
      "position": "sentence_final",
      "example": "I have not received my receipt yet."
    },
    {
      "time_marker": "now",
      "compatible_tense_aspect": ["present_continuous"],
      "position": "sentence_final",
      "example": "I am waiting now."
    },
    {
      "time_marker": "right now",
      "compatible_tense_aspect": ["present_continuous"],
      "position": "sentence_final",
      "example": "I am looking for a bag right now."
    },
    {
      "time_marker": "for 20 minutes",
      "compatible_tense_aspect": ["present_perfect_continuous"],
      "position": "sentence_final",
      "example": "I have been waiting for 20 minutes."
    }
  ]
}
```

Invalid:

```text
I have bought this shirt yesterday.
I bought this shirt already.
I am buying this shirt yesterday.
I buy this shirt last week.
I have been waiting yesterday.
```

---

# 14. Pattern Families

Pattern families group related patterns and shared grammar safety rules.

---

## 14.1 A2 Past Purchase Family

```json
{
  "pattern_family_id": "SHOP_PAST_PURCHASE_FAMILY_A2",
  "scenario": "shopping",
  "level": "A2",
  "tense_aspect": ["past_simple"],
  "patterns": [
    "SHOP_A2_PAST_SUBJECT_BOUGHT_OBJECT",
    "SHOP_A2_PAST_SIMPLE_BOUGHT_TIME",
    "SHOP_A2_PAST_NEGATIVE_DID_NOT",
    "SHOP_A2_PAST_QUESTION_DID"
  ],
  "shared_slots": [
    "shopping_subject_past_purchase_pairs",
    "shopping_past_negative_pairs",
    "shopping_past_question_pairs",
    "shopping_item_number_agreement_pairs",
    "shopping_time_marker_compatibility"
  ],
  "blocked_outputs": [
    "did bought",
    "did paid",
    "did kept",
    "did returned",
    "did exchanged",
    "did wanted",
    "did liked",
    "did had",
    "have bought yesterday",
    "have paid yesterday",
    "bought already",
    "this shoes",
    "these shirt"
  ]
}
```

---

## 14.2 A2+ Present Perfect Shopping Family

```json
{
  "pattern_family_id": "SHOP_PRESENT_PERFECT_FAMILY_A2P",
  "scenario": "shopping",
  "level": "A2+",
  "tense_aspect": ["present_perfect"],
  "patterns": [
    "SHOP_A2P_PRESENT_PERFECT_ALREADY_PAID",
    "SHOP_A2P_PRESENT_PERFECT_NOT_YET_RECEIVED",
    "SHOP_A2P_PRESENT_PERFECT_JUST_BOUGHT"
  ],
  "shared_slots": [
    "shopping_not_received_items",
    "shopping_item_number_agreement_pairs",
    "shopping_time_marker_compatibility"
  ],
  "blocked_outputs": [
    "have paid yesterday",
    "have bought yesterday",
    "have just bought yesterday",
    "paid already",
    "bought already"
  ]
}
```

---

## 14.3 B1 Return / Exchange / Refund Family

```json
{
  "pattern_family_id": "SHOP_RETURN_EXCHANGE_REFUND_FAMILY_B1",
  "scenario": "shopping",
  "level": "B1",
  "patterns": [
    "SHOP_B1_I_WOULD_LIKE_TO_RETURN_ITEM",
    "SHOP_B1_BOUGHT_AND_RETURN_PRONOUN",
    "SHOP_B1_COULD_I_EXCHANGE_ITEM",
    "SHOP_B1_COULD_I_GET_REFUND"
  ],
  "shared_slots": [
    "shopping_returnable_item_number_pairs",
    "shopping_item_number_agreement_pairs",
    "shopping_return_problem_pairs"
  ],
  "blocked_outputs": [
    "return this cashier",
    "return this receipt",
    "exchange this cashier",
    "I bought these shoes. I would like to return it.",
    "I bought this shirt. I would like to return them."
  ]
}
```

---

## 14.4 B1 Passive Product Description Family

```json
{
  "pattern_family_id": "SHOP_PASSIVE_PRODUCT_DESCRIPTION_FAMILY_B1",
  "scenario": "shopping",
  "level": "B1",
  "patterns": [
    "SHOP_B1_PASSIVE_MADE_IN",
    "SHOP_B1_PASSIVE_MADE_OF"
  ],
  "shared_slots": [
    "shopping_passive_origin_pairs",
    "shopping_passive_material_pairs"
  ],
  "blocked_outputs": [
    "They is made",
    "It are made",
    "It is made of Italy",
    "It is made in cotton"
  ]
}
```

---

# 15. Required Slot Banks

Suggested file:

```text
data/slot_bank/shopping_slots.json
```

Required slot groups:

```text
shopping_items_with_article
shopping_items_with_article_or_purpose
shopping_request_items_with_article
shopping_price_items_singular
shopping_location_places
shopping_a1_imperatives
shopping_singular_item_nouns
shopping_item_basic_adj_pairs
shopping_colorable_singular_items
basic_colors
shopping_a1p_must_rules
shopping_there_is_are_item_pairs
shopping_item_purpose_pairs
shopping_plural_items
shopping_color_size_options
shopping_item_number_agreement_pairs
shopping_safe_basic_adjectives
shopping_item_adj_contrast_pairs
shopping_item_comparative_pairs
shopping_subject_past_purchase_pairs
shopping_past_negative_pairs
shopping_past_question_pairs
past_simple_time_markers
shopping_should_actions
shopping_item_problem_adj_pairs
shopping_item_enough_adj_pairs
shopping_item_reason_adj_pairs
shopping_item_cannot_reason_pairs
shopping_not_received_items
shopping_first_conditional_pairs
shopping_superlative_item_pairs
shopping_must_actions
shopping_have_to_actions
shopping_returnable_item_number_pairs
shopping_payment_phrase_pairs
short_duration_phrases
shopping_passive_origin_pairs
shopping_passive_material_pairs
shopping_second_conditional_advice_actions
shopping_b1_past_perfect_sequences
shopping_time_marker_compatibility
```

---

# 16. Required Pattern Bank

Suggested file:

```text
data/pattern_bank/shopping_patterns.json
```

All patterns should include:

```text
pattern_id
scenario
level
function
template
grammar_focus
tense_aspect
tense_control
morphology_generation
slot_refs
slot_control
generation_scope
review_required
```

Generated output must include:

```text
scenario
level
pattern_id
grammar_focus
tense_aspect
target_sentence
chunks
```

Example output:

```json
{
  "scenario": "shopping",
  "level": "A2",
  "pattern_id": "SHOP_A2_PAST_QUESTION_DID",
  "grammar_focus": [
    "past_simple_question",
    "did_auxiliary",
    "base_verb_after_did"
  ],
  "tense_aspect": ["past_simple_question"],
  "target_sentence": "Did you buy this shirt?",
  "chunks": ["Did", "you", "buy", "this shirt?"]
}
```

---

# 17. QA Rules

## 17.1 Grammar invalid phrase checks

Block:

```text
did bought
did paid
did kept
did returned
did exchanged
did wanted
did liked
did had
Do you has
He want
She want
They wants
They is
It are
There are a
There is bags
```

---

## 17.2 Item-number invalid checks

Block:

```text
this shoes
this notebooks
this pants
these shirt
these bag
these jacket
that shoes
those shirt
those notebook
These shirt
This shoes
Those notebook
```

Context-aware checks required:

```text
return it
return them
```

Because:

```text
I bought this shirt. I would like to return it.     OK
I bought these shoes. I would like to return them.  OK
I bought these shoes. I would like to return it.    BAD
```

---

## 17.3 Time-marker compatibility checks

Block:

```text
have bought yesterday
have paid yesterday
has bought yesterday
has paid yesterday
have just bought yesterday
bought already
paid already
buy last week
am buying yesterday
have been waiting yesterday
```

---

## 17.4 Payment preposition checks

Block:

```text
pay by cash
pay in card
pay with cash
pay by gift card
```

Allow:

```text
pay by card
pay in cash
pay with a gift card
```

---

## 17.5 Passive checks

Block:

```text
They is made
It are made
It is made of Italy
They are made of Japan
It is made in cotton
```

Allow:

```text
It is made in Italy.
They are made in Japan.
It is made of cotton.
They are made of leather.
```

---

# 18. Level Coverage Matrix

## A1

| Grammar / Tense | Shopping Carrier | Pattern                                       |
| --------------- | ---------------- | --------------------------------------------- |
| Present Be      | identify item    | This is a bag.                                |
| Present Simple  | want / have      | I want a bag. / I have a receipt.             |
| Can             | request          | Can I have a bag?                             |
| Wh-question     | price / location | How much is this pen? / Where is the cashier? |
| Imperative      | instruction      | Wait here.                                    |

---

## A1+

| Grammar / Tense          | Shopping Carrier | Pattern                            |
| ------------------------ | ---------------- | ---------------------------------- |
| Present Continuous fixed | looking for      | I am looking for a gift.           |
| Present Simple negative  | dislike          | I don't like this shirt.           |
| Basic adjective          | description      | This bag is big.                   |
| Color adjective          | description      | This shirt is blue.                |
| Must                     | store rule       | You must pay here.                 |
| Going to fixed           | plan             | I am going to buy a bag.           |
| There is / are           | availability     | There is a sale. / There are bags. |

---

## A2

| Grammar / Tense              | Shopping Carrier | Pattern                                  |
| ---------------------------- | ---------------- | ---------------------------------------- |
| Would like                   | polite request   | I would like a receipt.                  |
| Need + purpose               | purpose          | I need a notebook for school.            |
| Do question                  | availability     | Do you have any shirts?                  |
| Demonstrative agreement      | item description | These shoes are expensive.               |
| But connector                | contrast         | This shirt is nice, but it is expensive. |
| Comparative                  | comparison       | This shirt is cheaper than that one.     |
| Past Simple affirmative      | past purchase    | I bought this shirt.                     |
| Past Simple negative         | did not          | I did not buy this shirt.                |
| Past Simple question         | Did              | Did you buy this shirt?                  |
| Will                         | decision         | I will take it.                          |
| Could                        | polite request   | Could I have a receipt?                  |
| Should                       | advice           | You should keep the receipt.             |
| May                          | permission       | May I try this on?                       |
| Present Perfect ever / never | recognition      | I have never bought this brand before.   |

---

## A2+

| Grammar / Tense         | Shopping Carrier   | Pattern                                            |
| ----------------------- | ------------------ | -------------------------------------------------- |
| Too + adjective         | problem            | This shirt is too small.                           |
| Not adjective enough    | problem            | This bag is not big enough.                        |
| Because                 | reason             | I like this bag because it is light.               |
| Cannot because          | limitation         | I cannot buy this bag because it is too expensive. |
| Present Perfect already | payment            | I have already paid.                               |
| Present Perfect yet     | not received       | I have not received my receipt yet.                |
| Present Perfect just    | recent purchase    | I have just bought this shirt.                     |
| First Conditional       | purchase condition | If it fits, I will take it.                        |
| Zero Conditional        | store rule         | If you lose the receipt, you cannot return it.     |
| Past Continuous         | past background    | I was waiting in line.                             |

---

## B1

| Grammar / Tense            | Shopping Carrier    | Pattern                                          |
| -------------------------- | ------------------- | ------------------------------------------------ |
| Could request              | help                | Could you help me find a backpack?               |
| Recommendation             | advice              | Which one do you recommend?                      |
| Superlative                | best option         | This is the cheapest shirt in the store.         |
| Must                       | store rule          | You must show your receipt.                      |
| Have to                    | requirement         | You have to keep the receipt.                    |
| Return                     | return item         | I would like to return this shirt.               |
| Exchange                   | exchange item       | Could I exchange this shirt for another one?     |
| Refund                     | refund              | Could I get a refund?                            |
| Payment                    | payment phrase      | Could I pay by card?                             |
| Present Perfect Continuous | complaint           | I have been waiting for 20 minutes.              |
| Passive Voice              | product description | It is made in Italy.                             |
| Second Conditional         | advice              | If I were you, I would buy this one.             |
| Past Perfect               | sequence            | I had already paid before I noticed the problem. |

---

# 19. Implementation Phases

Do not implement everything at once.

Recommended order:

```text
Phase S1:
A1 core shopping patterns
Present Simple / Present Be / Can / price / location

Phase S2:
A1+ fixed chunks
Present Continuous looking for / basic adjectives / color / going to / must

Phase S3:
A2 agreement and comparison
this / these / do questions / comparatives / would like / need

Phase S4:
A2 past-simple safety layer
subject-past pairs / did negative / did question / time-marker compatibility

Phase S5:
A2+ reasons and perfect chunks
because / cannot because / too / enough / already / yet / just / first conditional

Phase S6:
B1 shopping service language
return / exchange / refund / payment / superlative / recommendation

Phase S7:
B1 advanced fixed grammar
present perfect continuous / passive / second conditional / past perfect fixed
```

---

# 20. Completion Criteria

This Shopping grammar-pattern mapping is ready for data implementation when:

```text
1. Every level from A1 to B1 has explicit grammar targets.
2. Every grammar target maps to at least one shopping function.
3. Every shopping function maps to one or more controlled patterns.
4. Every tense-bearing pattern declares tense_aspect and tense_control.
5. No pattern relies on free morphology generation.
6. Item-number agreement uses paired slots.
7. Past simple uses subject-past / base-verb-after-did controls.
8. Present perfect uses time-marker compatibility.
9. Passive voice uses be-agreement paired slots.
10. Payment language uses full payment phrase slots.
11. QA invalid phrase checks are defined.
12. Human review is required for semantic paired patterns.
```

---


