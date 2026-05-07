# Cambridge Food & Drink Scope (American English)

This document defines how the `food_drink` scenario can be expanded from Cambridge-style A1 through B1 using American English only.

It is a scope and design reference document. It does not change generator code, slot banks, pattern banks, or generated sentence data by itself.

---

## 1. Language Standard

All `food_drink` content in this project should use American English.

Preferred vocabulary:

- restaurant
- cafe
- coffee shop
- diner
- fast-food restaurant
- food court
- server
- waiter / waitress
- check
- takeout
- to go
- soda
- fries
- appetizer
- entree
- dessert
- restroom

Avoid British-English or mixed-region vocabulary such as:

- bill
- takeaway
- fizzy drink
- chips
- starter
- main course
- pudding
- toilet

Preferred alternatives:

| Avoid | Use |
|---|---|
| bill | check |
| takeaway | takeout / to go |
| fizzy drink | soda |
| chips | fries |
| starter | appetizer |
| main course | entree |
| pudding | dessert |
| toilet | restroom |

Note: `waiter` and `waitress` are understandable in American English, but `server` is more neutral and broadly useful.

---

## 2. Purpose

The `food_drink` scenario should help learners handle everyday eating, drinking, ordering, and simple restaurant communication.

The target is not just to generate many food-related sentences, but to generate sentences that are:

- grammatically correct
- semantically natural
- level-appropriate
- useful for real food and restaurant communication
- suitable for sentence rearrangement, substitution drills, and later short-dialogue tasks

---

## 3. Core Semantic Rules

The same semantic rules from the shopping scenario apply here.

Do not judge a slot by itself. Judge:

```text
pattern + slot + level + context
```

For example, `water` is valid in:

```text
I want some water.
Can I have some water?
```

But it is not natural in:

```text
I want to eat some water.
```

Similarly, `pizza` is valid in:

```text
I want a slice of pizza.
I would like a pizza.
```

But it is not always valid in:

```text
I want a cup of pizza.
```

Therefore, broad slots such as `food_items` and `drink_items` should not be blindly reused across all patterns.

---

## 4. Current Design Principles to Reuse

Food and drink generation should reuse the successful design principles from shopping:

- Use restricted slots when the context is narrow.
- Use paired slots when two fields must be semantically compatible.
- Do not force every pattern to generate 30 sentences.
- Add level-specific counts for narrow patterns.
- Review every generated sentence manually before considering a level complete.
- Add regression tests after fixing semantic issues.
- Use American English consistently.

---

## 5. Level Expansion Overview

## 5.1 A1

A1 should focus on short, direct, high-frequency food and drink sentences.

### Target functions

Students should be able to:

```text
name common food and drinks
say what they want
say what they like
ask for food or drink
ask simple prices
say they are hungry or thirsty
say something is too hot, cold, sweet, or spicy
```

### Recommended vocabulary

Food:

```text
rice
bread
pizza
hamburger
sandwich
salad
soup
egg
chicken
fish
cake
cookie
apple
banana
ice cream
```

Drinks:

```text
water
milk
juice
tea
coffee
soda
hot chocolate
```

### Recommended adjectives

```text
hot
cold
sweet
spicy
salty
good
bad
big
small
fresh
delicious
```

### Recommended A1 patterns

```text
I want some water.
I want a sandwich.
I like pizza.
I like apple juice.
Can I have some water?
Can I have a cookie?
How much is this sandwich?
I am hungry.
I am thirsty.
This soup is too hot.
This drink is too cold.
```

### A1 slot rules

Use separate slots for:

```text
countable_food_items
uncountable_food_items
drink_items
simple_meal_items
```

Do not freely mix food and drink with all quantifiers.

Bad examples:

```text
I want a water.
I want some hamburger.
Can I have a cup of pizza?
This water is too spicy.
```

Better examples:

```text
I want some water.
I want a hamburger.
Can I have a cup of tea?
This soup is too hot.
```

### Avoid at A1

```text
allergic
vegetarian
gluten-free
reservation
recommend
receipt
check
split the check
calories
ingredients
```

---

## 5.2 A1+

A1+ may add polite markers and simple ordering language.

### Target functions

Students should be able to:

```text
order simple food and drinks politely
say they want to eat or drink something
ask if a restaurant has an item
say what they want for breakfast, lunch, or dinner
ask for food to go
```

### Recommended additions

```text
please
to eat
to drink
for breakfast
for lunch
for dinner
to go
```

### Recommended A1+ patterns

```text
I want to eat a sandwich.
I want to drink some juice.
Can I have a hamburger, please?
Can I have some water, please?
Do you have chicken soup?
Do you have apple juice?
I want rice for lunch.
I want eggs for breakfast.
Can I get this to go?
```

### A1+ slot rules

Use meal-specific slots when using meal contexts.

Good:

```text
I want eggs for breakfast.
I want rice for lunch.
I want soup for dinner.
```

Weak or unnatural:

```text
I want soda for breakfast.
I want ice cream for breakfast.
```

Therefore, use restricted slots such as:

```text
breakfast_food_items
lunch_food_items
dinner_food_items
to_go_items
```

---

## 5.3 A2

A2 may introduce polite restaurant requests, menu questions, and simple preferences.

### Target functions

Students should be able to:

```text
order food politely
ask for the menu
ask for the check
ask about price
ask about food availability
ask for no ice or less sugar
ask for a table
ask where the restroom is
describe simple food problems
```

### Recommended vocabulary

```text
menu
check
table
server
restroom
water
ice
sugar
salt
pepper
fork
spoon
knife
napkin
straw
takeout
to go
```

### Recommended A2 patterns

```text
I would like a hamburger, please.
I would like some soup, please.
Could I have the menu, please?
Could I have the check, please?
Could I have a fork, please?
Could I have some water, please?
Do you have any apple juice?
Do you have any vegetarian dishes?
Can I get this to go?
Can I have this with no ice?
Can I have this with less sugar?
Where is the restroom?
This soup is too salty.
This coffee is too hot.
```

### A2 slot rules

Use restricted slots for:

```text
restaurant_request_items
utensil_items
drink_customization_items
food_problem_pairs
```

Do not freely combine all food/drink items with all complaints.

Bad examples:

```text
This fork is too salty.
This water is too dry.
This pizza is too thirsty.
```

Better examples:

```text
This soup is too salty.
This coffee is too hot.
This soda is too sweet.
```

Use paired slots for food problem descriptions:

```json
"food_problem_pairs": [
  {"item": "This soup", "problem": "too salty"},
  {"item": "This coffee", "problem": "too hot"},
  {"item": "This soda", "problem": "too sweet"}
]
```

---

## 5.4 A2+

A2+ may introduce short reason clauses, dietary preferences, and simple recommendations.

### Target functions

Students should be able to:

```text
explain food preferences
ask for simple recommendations
ask about ingredients in simple terms
say they cannot eat or drink something
make simple substitutions
compare two food or drink options
```

### Recommended vocabulary

```text
vegetarian
spicy
sweet
salty
fresh
healthy
light
heavy
popular
ingredient
peanuts
milk
eggs
seafood
```

### Recommended A2+ patterns

```text
I like this salad because it is fresh.
I want this soup because it is warm.
I do not want this soda because it is too sweet.
What do you recommend?
What do you recommend for lunch?
Does this have peanuts?
Does this have milk?
Can I have rice instead of fries?
Can I have tea instead of soda?
This salad is healthier than that sandwich.
This soup is hotter than that soup.
```

### A2+ slot rules

Use paired slots for reason clauses and comparison.

Good:

```text
I like this salad because it is fresh.
I want this soup because it is warm.
I do not want this soda because it is too sweet.
```

Weak or unnatural:

```text
I want this soda because it is warm.
I like this cake because it is salty.
I do not want this water because it is too dry.
```

Recommended paired slots:

```text
food_positive_reason_pairs
food_negative_reason_pairs
food_comparison_pairs
substitution_pairs
```

---

## 5.5 B1

B1 should expand into practical restaurant communication and problem-solving.

### Target functions

Students should be able to:

```text
make a reservation
order politely with details
ask about ingredients
explain allergies
ask for substitutions
complain politely about a problem
ask for the check
split the check
ask for takeout
explain that an order is wrong
ask for a replacement
ask for a recommendation
```

### Recommended vocabulary

```text
reservation
table for two
server
menu
ingredient
allergy
allergic
vegetarian
gluten-free
dairy-free
peanut allergy
seafood allergy
replacement
order
wrong order
undercooked
overcooked
burnt
stale
spoiled
check
tip
split the check
takeout
```

### Recommended B1 patterns

```text
I'd like to make a reservation for two.
Do you have a table for four?
I'd like to order the chicken sandwich.
Could I have this without onions?
Could I have rice instead of fries?
I'm allergic to peanuts.
Does this dish have any seafood in it?
I'm vegetarian. What do you recommend?
This is not what I ordered.
My order is wrong.
This chicken is undercooked.
This bread is stale.
Could I get a replacement, please?
Could we get the check, please?
Can we split the check?
I'd like this to go.
```

### B1 slot rules

Use paired slots for problem descriptions.

Recommended paired slots:

```json
"restaurant_problem_pairs": [
  {"item": "This chicken", "problem": "is undercooked"},
  {"item": "This steak", "problem": "is overcooked"},
  {"item": "This bread", "problem": "is stale"},
  {"item": "This soup", "problem": "is cold"},
  {"item": "My order", "problem": "is wrong"}
]
```

Use restricted slots for allergies.

Good:

```text
I'm allergic to peanuts.
I'm allergic to seafood.
I'm allergic to milk.
```

Avoid:

```text
I'm allergic to water.
I'm allergic to rice.
```

Use restricted allergy slots:

```text
allergy_items
```

Use restricted slots for substitutions.

Good:

```text
Could I have rice instead of fries?
Could I have tea instead of soda?
Could I have salad instead of fries?
```

Weak:

```text
Could I have soup instead of a fork?
Could I have pizza instead of water?
```

---

## 6. Recommended Slot Categories

Future `food_drink` expansion may require the following slot categories.

### General item slots

```text
countable_food_items
uncountable_food_items
drink_items
simple_meal_items
```

### Meal-specific slots

```text
breakfast_food_items
lunch_food_items
dinner_food_items
```

### Restaurant request slots

```text
restaurant_request_items
utensil_items
table_request_items
to_go_items
```

### Customization slots

```text
drink_customization_pairs
food_customization_pairs
substitution_pairs
```

### Reason and comparison slots

```text
food_positive_reason_pairs
food_negative_reason_pairs
food_comparison_pairs
```

### Problem and allergy slots

```text
food_problem_pairs
restaurant_problem_pairs
allergy_items
ingredient_items
```

### B1 restaurant interaction slots

```text
reservation_party_sizes
wrong_order_pairs
replacement_request_items
check_payment_phrases
recommendation_contexts
```

---

## 7. Patterns That Require Paired Slots

The following pattern types should usually use paired slots.

### 7.1 Food or drink problem patterns

```text
{item} is too {adjective}.
```

Use paired slots.

Good:

```text
This soup is too salty.
This coffee is too hot.
This soda is too sweet.
```

Bad:

```text
This fork is too salty.
This water is too dry.
This pizza is too thirsty.
```

### 7.2 Reason clauses

```text
I like {item} because it is {reason}.
I want {item} because it is {reason}.
```

Use paired slots or restricted positive reason slots.

Good:

```text
I like this salad because it is fresh.
I want this soup because it is warm.
```

Bad:

```text
I want this soda because it is warm.
I like this cake because it is salty.
```

### 7.3 Substitution patterns

```text
Could I have {item_a} instead of {item_b}?
```

Use paired slots.

Good:

```text
Could I have rice instead of fries?
Could I have tea instead of soda?
Could I have salad instead of fries?
```

Bad:

```text
Could I have soup instead of a fork?
Could I have pizza instead of water?
```

### 7.4 Allergy and ingredient patterns

Use restricted slots.

Good:

```text
I'm allergic to peanuts.
Does this dish have any seafood in it?
```

Bad:

```text
I'm allergic to water.
Does this soda have chicken in it?
```

### 7.5 Restaurant problem patterns

Use paired slots.

Good:

```text
This chicken is undercooked.
This bread is stale.
My order is wrong.
```

Bad:

```text
This water is undercooked.
This fork is stale.
```

---

## 8. Count Per Pattern

Do not force every `food_drink` pattern to generate 30 sentences.

Patterns that may support 30 examples:

```text
I want...
I like...
Can I have...?
How much is...?
Do you have...?
```

Patterns that should use lower counts:

```text
allergy patterns
substitution patterns
restaurant problem patterns
food problem pairs
reservation patterns
check / payment patterns
reason-clause patterns
comparison patterns
```

The goal is semantic quality, not uniform sentence count.

---

## 9. Manual Review Checklist

After generating a `food_drink` sentence bank, review by level and pattern.

### A1 Checklist

A1 must not contain:

```text
allergic
reservation
ingredient
undercooked
overcooked
replacement
split the check
instead of
because
```

### A1+ Checklist

A1+ may contain:

```text
please
to eat
to drink
for breakfast
for lunch
for dinner
to go
```

But meal contexts should use meal-appropriate slots.

### A2 Checklist

Check:

```text
American English: check, not bill
American English: takeout / to go, not takeaway
drink customization uses drink items only
food problems use semantic pairs
```

### A2+ Checklist

Check:

```text
reason clauses are natural
substitution pairs are natural
ingredient questions use plausible ingredient slots
comparison pairs are natural
```

### B1 Checklist

Check:

```text
allergy items are plausible
restaurant problems use semantic pairs
wrong order patterns are natural
substitution patterns do not mix unrelated items
check / split the check uses American English
```

---

## 10. Regression Test Ideas

After `food_drink` passes manual review, add scenario-specific regression tests.

Suggested tests:

```python
def test_food_drink_no_british_terms(sentences):
    forbidden = ["bill", "takeaway", "fizzy drink", "chips", "starter", "main course", "pudding", "toilet"]
    assert not any(term in s["target_sentence"].lower() for s in sentences for term in forbidden)

def test_food_drink_a1_has_no_b1_structures(sentences):
    forbidden = ["allergic", "reservation", "ingredient", "undercooked", "overcooked", "replacement", "split the check", "instead of", "because"]
    for s in sentences:
        if s["level"] == "A1" and "FOOD" in s["sentence_id"]:
            assert not any(term in s["target_sentence"].lower() for term in forbidden)

def test_food_drink_problem_pairs(sentences):
    # Verify food problem patterns come from approved food_problem_pairs.
    pass

def test_food_drink_substitution_pairs(sentences):
    # Verify substitution patterns come from approved substitution_pairs.
    pass
```

---

## 11. Recommended Expansion Order

Recommended implementation sequence:

```text
1. Stabilize A1 basic food and drink patterns.
2. Add A1+ polite ordering and meal-context patterns.
3. Add A2 menu, check, restroom, to-go, and simple customization patterns.
4. Add A2+ reason, recommendation, ingredient, and substitution patterns.
5. Add B1 reservation, allergy, wrong order, replacement, and split-check patterns.
6. Generate and manually review every level.
7. Add regression tests.
```

---

## 12. Summary

The `food_drink` scenario should grow from simple wants and likes into practical restaurant communication.

The main rule is:

```text
Do not expand sentence quantity before semantic constraints are stable.
```

American English should remain the default standard across all future `food_drink` content in this project.
