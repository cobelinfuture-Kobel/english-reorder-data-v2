# Learning Feedback System

## Status

Completed MVP.

This document describes the current user learning feedback system.

The system is considered temporarily complete for the current phase.

It supports:

- username-based users
- JSON-based persistence
- attempt tracking
- learning statistics
- weak pattern detection
- wrong attempt lookup
- coverage tracking
- rule-based next-practice recommendation
- remediation mode
- frontend learning summary display

This system does not yet include:

- password authentication
- teacher dashboard
- class management
- chart-based analytics
- clickable recommended practice
- full wrong-answer retry flow
- error tagging
- audio hint tracking
- forgetting curve

## Current Architecture

The system uses JSON-based persistence.

Primary files:

```text
data/users.json
data/user_sentence_attempts.json
```

Main backend modules:

```text
stores/users_store.py
stores/attempts_store.py
stores/coverage_store.py
stores/recommendation_store.py
app.py
```

Frontend files:

```text
templates/index.html
static/js/game.js
static/css/style.css
```

Design rule:

```text
app.py handles routes and wiring.
stores/* handle data and pure logic.
sentence generation and answer checking are not mixed with user feedback logic.
```

## Users

Users are minimal.

Each user has:

```json
{
  "id": "user_001",
  "username": "UserA",
  "last_login": "2026-05-01T10:00:00",
  "role": "student",
  "created_at": "2026-05-01T10:00:00"
}
```

Rules:

* `username` is unique.
* Login creates a user if the username does not exist.
* Login updates `last_login` if the username already exists.
* `role` defaults to `student`.
* There is no password system in the current MVP.

API:

```http
POST /api/users/login
GET /api/users/<id>
```

## Attempts

Each submitted answer creates an attempt.

Example:

```json
{
  "id": "attempt_001",
  "user_id": "user_001",
  "sentence_id": "A1_SHOPPING_SHOP_TRY_001",
  "level": "A1",
  "pattern": "SHOP_TRY",
  "user_answer": "Can I try on this jacket?",
  "correct_answer": "Can I try on this jacket?",
  "is_correct": true,
  "created_at": "2026-05-01T10:05:00"
}
```

Rules:

* Attempts are tied to `user_id`.
* Attempts store `sentence_id`, `level`, `pattern`, answer text, correctness, and timestamp.
* Attempt storage failure should not block the exercise flow.
* Attempts are stored in `data/user_sentence_attempts.json`.

API:

```http
POST /api/attempts
GET /api/users/<id>/attempts
```

## Stats

Stats summarize user performance.

API:

```http
GET /api/users/<id>/stats
```

Main fields:

```json
{
  "user_id": "user_001",
  "total_attempts": 45,
  "correct_attempts": 29,
  "wrong_attempts": 16,
  "accuracy": 0.64,
  "recent": {
    "last_10": {
      "total_attempts": 10,
      "correct_attempts": 10,
      "wrong_attempts": 0,
      "accuracy": 1.0
    },
    "last_20": {
      "total_attempts": 20,
      "correct_attempts": 16,
      "wrong_attempts": 4,
      "accuracy": 0.8
    }
  },
  "by_level": {},
  "by_pattern": {}
}
```

Rules:

* Overall accuracy uses all attempts.
* Recent accuracy uses attempts sorted by `created_at DESC`, then `id DESC`.
* `last_10` uses at most the latest 10 attempts.
* `last_20` uses at most the latest 20 attempts.
* Stats do not mix attempts from different users.

Purpose:

```text
Overall accuracy shows long-term performance.
Recent accuracy shows current learning state.
```

## Weak Patterns

Weak patterns identify sentence patterns that need reinforcement.

API:

```http
GET /api/users/<id>/weak-patterns
```

Default rules:

```text
min_attempts = 5
threshold = 0.7
```

A pattern is weak when:

```text
total_attempts >= min_attempts
accuracy < threshold
```

Example:

```json
{
  "user_id": "user_001",
  "min_attempts": 5,
  "threshold": 0.7,
  "weak_patterns": [
    {
      "pattern": "FOOD_TOO",
      "total_attempts": 11,
      "correct_attempts": 2,
      "wrong_attempts": 9,
      "accuracy": 0.18
    }
  ]
}
```

Purpose:

```text
Weak patterns show long-term or repeated structural weaknesses.
```

## Wrong Attempts

Wrong attempts provide a list of incorrect answers.

API:

```http
GET /api/users/<id>/wrong-attempts
```

Optional filters:

```text
level=A1
pattern=SHOP_TRY
limit=20
```

Rules:

* Only `is_correct = false` attempts are returned.
* Results are sorted by `created_at DESC`, then `id DESC`.
* Results do not include other users' attempts.
* `total_wrong_attempts` is counted after filters and before limit.

Purpose:

```text
Wrong attempts support review and future error diagnosis.
```

## Coverage

Coverage tracks how much of the sentence bank the user has attempted.

API:

```http
GET /api/users/<id>/coverage
```

Example:

```json
{
  "user_id": "user_001",
  "total_sentences": 1520,
  "attempted_sentences": 21,
  "not_attempted_sentences": 1499,
  "coverage_rate": 0.015,
  "by_level": {},
  "by_pattern": {}
}
```

Rules:

* Sentence bank is the universe.
* Attempts determine which `sentence_id` values have been attempted.
* Multiple attempts on the same sentence count once for coverage.
* Attempt metadata is not used as the main source for coverage grouping.
* Sentence bank metadata is the source of truth.

Purpose:

```text
Coverage answers:
- What has the user done?
- What has not been attempted yet?
```

## Next Practice v2

Next Practice recommends what the user should do next.

API:

```http
GET /api/users/<id>/next-practice
```

Optional filters:

```text
limit=5
level=A1
pattern=FOOD_TOO
```

Response includes:

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
  "recommendations": []
}
```

## Next Practice Priority Model

### P0 Remediation

Trigger:

```text
total_attempts > 5
recent.last_10.accuracy < 0.5
```

Strategy:

```text
remediate_recent_wrong
```

Reason code:

```text
RECENT_ACCURACY_LOW
```

Recommendation:

```text
recent wrong attempts, max min(query_limit, 5)
```

Purpose:

```text
When recent performance is low, reduce cognitive load and repair recent errors before adding new material.
```

### P1 Reinforce

Trigger:

```text
weak pattern exists
weak pattern has unattempted sentences
recent accuracy is not below remediation threshold
```

Strategy:

```text
weak_pattern_not_attempted
```

Reason code:

```text
WEAK_PATTERN_NEEDS_REINFORCEMENT
```

Recommendation:

```text
unattempted sentences from weak patterns
```

Purpose:

```text
When the learner is stable enough but still has structural weaknesses, reinforce weak patterns with new examples.
```

### P2 Progress

Trigger:

```text
no remediation needed
no weak-pattern recommendation available
```

Strategy:

```text
not_attempted
```

Reason code:

```text
PROGRESS_NEW_CONTENT
```

Recommendation:

```text
general unattempted sentences
```

Purpose:

```text
Move the learner forward when no immediate repair or weak-pattern reinforcement is needed.
```

### P3 Review

Trigger:

```text
no unattempted sentences available
wrong attempts exist
```

Strategy:

```text
recent_wrong_attempt
```

Reason code:

```text
REVIEW_RECENT_WRONG
```

Recommendation:

```text
recent wrong attempts
```

### P4 None

Trigger:

```text
no recommendation available
```

Strategy:

```text
none
```

Reason code:

```text
NO_RECOMMENDATION
```

Recommendation:

```text
empty recommendations
```

## Frontend Learning Summary Panel

The frontend displays learning feedback in `learning-summary-panel`.

It shows:

* Total Attempts
* Accuracy
* Recent 10 Accuracy
* Coverage
* Not Attempted
* Weak Patterns
* Next Practice

Frontend behavior:

* If no `user_id` exists, the panel is cleared and hidden.
* When a user logs in, the panel loads data for that user.
* When an attempt is saved successfully, the panel refreshes.
* API failures should not block the exercise flow.
* Each panel section handles failure independently.

## Observed Behavior

Example: User with low recent accuracy

```text
Total Attempts: 32
Accuracy: 59%
Recent 10 Accuracy: 40%
Weak Patterns: FOOD_TOO, SHOP_TRY
```

Expected recommendation:

```text
P0 Remediation
Recommend recent wrong attempts.
Do not push new content yet.
```

Example: User recovered after recent success

```text
Total Attempts: 45
Accuracy: 64%
Recent 10 Accuracy: 100%
Weak Patterns: FOOD_TOO, SHOP_TRY
```

Expected recommendation:

```text
P1 Reinforce
Recommend unattempted weak-pattern sentences.
```

## Current Phase Completion

The user learning feedback system is temporarily complete for the current phase.

It now supports:

```text
login
attempt tracking
learning stats
recent performance
weakness detection
coverage tracking
wrong attempt lookup
next-practice recommendation
remediation protection
frontend summary display
```

The next phase should not start until the current behavior has been tested with real users or realistic practice sessions.

## Deferred Future Work

Possible future work:

* pattern label localization
* clickable recommended practice
* full wrong-answer retry mode
* error tagging
* audio hint tracking
* teacher dashboard
* class grouping
* chart-based progress reports
* forgetting curve
* mastery score
* data migration from JSON to SQLite if user count grows

## Recommended Next Step

Do not add more learning feedback features immediately.

Instead:

1. Test with a few users.
2. Review whether the remediation threshold is appropriate.
3. Review whether weak-pattern recommendations feel useful.
4. Only then decide whether to implement clickable recommendation practice or error tagging.
