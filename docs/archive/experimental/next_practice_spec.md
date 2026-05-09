# Next Practice Recommendation Spec

## Status

Planned.

This document defines the first rule-based recommendation API for the English sentence practice system.

The API is not implemented yet.

## Goal

Add a backend API that can answer:

```text
What should this user practice next?
Why are these sentences recommended?
```

The first version should be rule-based only.

Do not implement:

* AI recommendation
* forgetting curve
* mastery score
* adaptive difficulty
* frontend UI
* wrong-answer retry mode
* manifest generation
* database migration

## API

```http
GET /api/users/<id>/next-practice
```

Optional query string:

```text
limit=10
level=A1
pattern=SHOP_PAY
```

## Query Rules

### limit

* Default: `10`
* Use only when it is a valid positive integer.
* If invalid, fall back to `10`.

### level

* If provided, recommend only sentences from that level.
* If omitted, do not restrict by level.

### pattern

* If provided, recommend only sentences from that pattern.
* If omitted, do not restrict by pattern.

### Filter Priority

`level` and `pattern` filters take priority over recommendation logic.

Example:

```text
Request: level=A2
A2 has no available recommendation.
A1 has recent wrong answers.
```

Expected result:

```json
{
  "strategy": "none",
  "is_exhausted": true,
  "recommendations": []
}
```

The API must not ignore the filter and recommend A1 sentences.

## Response Format

### With Recommendations

```json
{
  "user_id": "user_001",
  "strategy": "weak_pattern_not_attempted",
  "is_exhausted": false,
  "limit": 10,
  "filters": {
    "level": "A1",
    "pattern": null
  },
  "recommendations": [
    {
      "sentence_id": "SHOP_TOO_A1_002",
      "level": "A1",
      "pattern": "SHOP_TOO",
      "reason": "weak_pattern_not_attempted"
    }
  ]
}
```

### Without Recommendations

```json
{
  "user_id": "user_001",
  "strategy": "none",
  "is_exhausted": true,
  "limit": 10,
  "filters": {
    "level": null,
    "pattern": null
  },
  "recommendations": []
}
```

## Recommendation Priority

### Priority 1: Unattempted Sentences in Weak Patterns

A pattern is weak when:

```text
total_attempts >= 5
accuracy < 0.7
```

If weak patterns exist and there are unattempted sentences in those patterns, recommend those sentences first.

Strategy:

```text
weak_pattern_not_attempted
```

Reason:

```text
weak_pattern_not_attempted
```

### Multiple Weak Patterns

If multiple weak patterns qualify, sort weak patterns by:

```text
accuracy ASC
wrong_attempts DESC
pattern ASC
```

Then collect recommendations in that order.

Example:

```text
SHOP_TOO accuracy = 0.4, has 3 unattempted sentences
SHOP_PAY accuracy = 0.6, has 10 unattempted sentences
limit = 10
```

Expected behavior:

```text
Take 3 from SHOP_TOO.
Then take 7 from SHOP_PAY.
```

This is weakest-first allocation, not fair distribution.

### Priority 2: General Unattempted Sentences

If Priority 1 has no available recommendation, recommend general unattempted sentences.

Strategy:

```text
not_attempted
```

Reason:

```text
not_attempted
```

### Priority 3: Recent Wrong Attempts

If there are no available unattempted sentences, recommend recent wrong attempts.

Strategy:

```text
recent_wrong_attempt
```

Reason:

```text
recent_wrong_attempt
```

### Priority 4: No Recommendation

If no recommendation is available:

```text
strategy = none
is_exhausted = true
recommendations = []
```

## Limit Semantics

Version 1 uses single-strategy responses.

Do not mix different strategies in one response.

Example:

```text
strategy = weak_pattern_not_attempted
limit = 10
Only 3 weak-pattern unattempted sentences are available.
```

Expected behavior:

```text
Return only 3 recommendations.
Do not fill the remaining 7 with general unattempted sentences.
```

Exception:

Multiple weak patterns still belong to the same strategy, so they may fill the same response up to the limit.

## Sorting Rules

### General Unattempted Sentences

Sort by:

```text
level ASC
pattern ASC
sentence_id ASC
```

### Weak Patterns

Sort by:

```text
accuracy ASC
wrong_attempts DESC
pattern ASC
```

### Sentences Inside a Weak Pattern

Sort by:

```text
level ASC
pattern ASC
sentence_id ASC
```

### Recent Wrong Attempts

Sort by:

```text
created_at DESC
id DESC
```

If the same `sentence_id` has multiple wrong attempts, return only the latest one.

## Metadata Source

The response fields below must come from the sentence bank:

```text
sentence_id
level
pattern
```

Do not use attempt metadata as the primary source.

Reason:

```text
attempts may contain old metadata
sentence bank is the current valid universe
```

## Store Design

Recommended new module:

```text
stores/recommendation_store.py
```

Recommended core function:

```python
def get_next_practice(
    user_id: str,
    sentences: list[dict],
    attempts: list[dict],
    *,
    limit: int = 10,
    level: str | None = None,
    pattern: str | None = None,
) -> dict:
    ...
```

This function should be pure logic:

* no file reads
* no file writes
* no Flask dependency
* no direct sentence_engine dependency
* no JSON path dependency

`app.py` should load the sentence bank and attempts, then pass them into the recommendation function.

## API Error Rules

If user does not exist:

```http
404
```

Response:

```json
{
  "error": "User not found"
}
```

## Test Plan

When implementing this API later, add tests for:

1. User does not exist -> 404.
2. No sentence bank -> `strategy = none`, `is_exhausted = true`.
3. No attempts -> `strategy = not_attempted`.
4. Weak pattern exists and has unattempted sentences -> `strategy = weak_pattern_not_attempted`.
5. Multiple weak patterns are sorted by `accuracy ASC`, `wrong_attempts DESC`, `pattern ASC`.
6. Weak-pattern recommendations fewer than `limit` do not get filled by general unattempted sentences.
7. Weak pattern sentences all attempted -> fallback to general unattempted sentences.
8. All sentences attempted and wrong attempts exist -> fallback to recent wrong attempts.
9. All sentences attempted and no wrong attempts -> `strategy = none`, `is_exhausted = true`.
10. Valid `limit` restricts total recommendations.
11. Invalid `limit` falls back to `10`.
12. `level` filter works.
13. `pattern` filter works.
14. `level + pattern` filters work together.
15. Filters take priority over recommendation logic.
16. Other users' attempts do not affect the result.
17. Multiple attempts for the same `sentence_id` count as attempted only once.
18. Multiple wrong attempts for the same `sentence_id` return only the latest one.
19. Recommendation metadata uses the sentence bank, not attempt metadata.
20. Recommendation sorting is deterministic.

## Next Practice v2: Remediation Mode

## Status

Planned.

This section defines the next version of the rule-based recommendation API. It is not implemented yet.

The purpose of v2 is to prevent the system from pushing new material when a learner is currently struggling.

## Teaching Principle

When recent performance is too low, the system should reduce cognitive load.

Instead of recommending new sentences, it should recommend recent wrong attempts first.

This turns the system from a simple practice recommender into a basic remediation coach.

## Priority Model

| Priority | Mode | Trigger | Recommendation |
|---|---|---|---|
| P0 | Remediation | `total_attempts > 5` and `recent.last_10.accuracy < 0.5` | Recent wrong attempts, max 5 |
| P1 | Reinforce | Weak pattern exists and `accuracy < 0.7` | Unattempted sentences in weak patterns |
| P2 | Progress | Stable performance or no weak pattern | General unattempted sentences |
| P3 | Review | No unattempted sentences, but wrong attempts exist | Recent wrong attempts |
| P4 | None | No available recommendation | Empty recommendations |

## P0 Remediation Mode

### Trigger

P0 should trigger when:

```text
total_attempts > 5
recent.last_10.accuracy < 0.5
```

Notes:

* `recent.last_10.total_attempts` may be fewer than 10.
* `total_attempts` must be greater than 5 to avoid overreacting to the first few attempts.
* This mode protects struggling learners from receiving too much new material.

Example:

```text
total_attempts = 12
recent.last_10.accuracy = 0.3
```

Expected strategy:

```text
remediate_recent_wrong
```

### Recommendation Content

P0 recommends recent wrong attempts.

Rules:

* Return at most 5 recommendations.
* Sort by `created_at DESC`, then `id DESC`.
* If the same `sentence_id` has multiple wrong attempts, return only the latest one.
* Respect `level` and `pattern` filters.
* If no recent wrong attempts are available inside the filter, fall back to the next valid strategy.

### Strategy and Reason

Strategy:

```text
remediate_recent_wrong
```

Reason:

```text
recent_accuracy_low
```

Reason code:

```text
RECENT_ACCURACY_LOW
```

Recommended message:

```text
先複習最近錯題，穩固基礎後再前進。
```

## Response Additions

v2 should add these fields to the existing next-practice response:

```json
{
  "reason_code": "RECENT_ACCURACY_LOW",
  "message": "先複習最近錯題，穩固基礎後再前進。"
}
```

The existing response shape should remain compatible:

```json
{
  "user_id": "user_001",
  "strategy": "remediate_recent_wrong",
  "reason_code": "RECENT_ACCURACY_LOW",
  "is_exhausted": false,
  "limit": 5,
  "filters": {
    "level": null,
    "pattern": null
  },
  "message": "先複習最近錯題，穩固基礎後再前進。",
  "recommendations": [
    {
      "sentence_id": "A1_SHOPPING_SHOP_TRY_004",
      "level": "A1",
      "pattern": "SHOP_TRY",
      "reason": "recent_accuracy_low"
    }
  ]
}
```

## Reason Codes

v2 should use stable machine-readable reason codes:

```text
RECENT_ACCURACY_LOW
WEAK_PATTERN_NEEDS_REINFORCEMENT
PROGRESS_NEW_CONTENT
REVIEW_RECENT_WRONG
NO_RECOMMENDATION
```

Frontend text should rely on `reason_code` or `message`, not on guessing from `strategy`.

## P1 Reinforce Mode

P1 is mostly the same as the current v1 weak-pattern strategy.

Trigger:

```text
weak pattern exists
pattern total_attempts >= 5
pattern accuracy < 0.7
weak pattern has unattempted sentences
```

Strategy:

```text
weak_pattern_not_attempted
```

Reason code:

```text
WEAK_PATTERN_NEEDS_REINFORCEMENT
```

Recommended message:

```text
優先補弱句型的新題。
```

### Deferred Mixed Review

A possible future enhancement is:

```text
weak-pattern new sentences + one old wrong attempt from the same weak pattern
```

Do not implement this in v2.

Reason:

* It would mix strategies in one response.
* It would complicate deterministic testing.
* The current frontend does not yet support selecting specific recommended sentences for practice.
* It is better deferred to v2.1 or a dedicated review mode.

## P2 Progress Mode

Trigger:

```text
No P0 remediation needed
No P1 weak-pattern recommendation available
```

Optional interpretation:

```text
recent.last_10.accuracy >= 0.8
```

Recommendation:

```text
general unattempted sentences
```

Strategy:

```text
not_attempted
```

Reason code:

```text
PROGRESS_NEW_CONTENT
```

Recommended message:

```text
繼續練習還沒做過的新題。
```

## P3 Review Mode

Trigger:

```text
No unattempted sentences are available
Wrong attempts exist
```

Recommendation:

```text
recent wrong attempts
```

Strategy:

```text
recent_wrong_attempt
```

Reason code:

```text
REVIEW_RECENT_WRONG
```

Recommended message:

```text
目前沒有新題建議，先複習最近錯題。
```

## P4 None Mode

Trigger:

```text
No recommendation is available
```

Strategy:

```text
none
```

Reason code:

```text
NO_RECOMMENDATION
```

Recommended message:

```text
目前沒有推薦題目。
```

`is_exhausted` should be `true`.

## Filter Priority

The existing v1 rule remains:

```text
level and pattern filters take priority over recommendation logic
```

Example:

```text
Request: level=A2
A2 has no wrong attempts.
A1 has recent wrong attempts.
recent.last_10.accuracy < 0.5
```

Expected result:

```json
{
  "strategy": "none",
  "is_exhausted": true,
  "recommendations": []
}
```

The API must not ignore the filter and recommend A1 sentences.

## Expected Behavior Examples

### Example A: Struggling Learner

Input state:

```text
total_attempts = 12
overall accuracy = 42%
recent.last_10.accuracy = 30%
weak pattern = SHOP_TRY
```

Expected behavior:

```text
P0 Remediation
Recommend recent wrong attempts.
Do not recommend new SHOP_TRY sentences yet.
```

### Example B: Strong Learner with Local Weakness

Input state:

```text
total_attempts = 60
overall accuracy = 93%
recent.last_10.accuracy = 70%
weak pattern = FOOD_PRICE
```

Expected behavior:

```text
P1 Reinforce
Recommend unattempted FOOD_PRICE sentences.
Do not enter remediation mode.
```

## Test Plan for v2 Implementation

When implementing v2 later, add tests for:

1. `total_attempts > 5` and `recent.last_10.accuracy < 0.5` triggers `remediate_recent_wrong`.
2. Remediation returns at most 5 recommendations.
3. Remediation uses recent wrong attempts.
4. Remediation deduplicates repeated wrong attempts by `sentence_id`, keeping the latest.
5. Remediation respects `level` filter.
6. Remediation respects `pattern` filter.
7. Remediation falls back when no wrong attempts exist inside the filter.
8. Learner with `recent.last_10.accuracy >= 0.5` and weak pattern still uses `weak_pattern_not_attempted`.
9. Response includes `reason_code`.
10. Response includes `message`.
11. `reason_code` is stable and machine-readable.
12. Existing v1 fallback behavior remains valid.
13. Existing next-practice tests remain deterministic.

## Implementation Scope for v2

When implemented later, v2 should modify only:

* `stores/recommendation_store.py`
* `app.py` only if route response wiring is needed
* `static/js/game.js` only to display `message`
* tests

Do not modify:

* attempts schema
* stats API
* weak-patterns API
* wrong-attempts API
* coverage API
* sentence generation
* answer checking

## Suggested Implementation Commit

```text
feat: add remediation mode to next practice
```

## Suggested Implementation Commit

When this spec is implemented later, use:

```text
feat: add next practice API
```

For this documentation-only change, use:

```text
docs: add next practice recommendation spec
```
