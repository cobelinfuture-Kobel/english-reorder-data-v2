# Gameplay Feedback Spec v1

## Purpose

This document defines gameplay rhythm and interaction feedback for the Sentence Combat RPG runtime.

The core goal is automatic sentence production through fast, low-friction repetition. The system should prioritize flow, momentum, and voluntary replay over explicit grammar explanation.

## 1. Core Gameplay Rhythm

The core loop is:

`prompt -> response -> feedback -> progression -> next prompt`

Desired emotional feel:

- fast
- rhythmic
- low friction
- momentum-based

Avoid:

- excessive reading
- modal interruptions
- unnecessary clicks
- grammar-heavy terminology

## 2. Answer Resolution Flow

### Correct Answer

Flow:

Player selects answer
-> validation success
-> combo increase
-> XP gain
-> mastery update
-> feedback display
-> optional chunk unlock
-> auto-advance after 0.8s

Notes:

- no Next click required
- maintain rhythm

### Wrong Answer

Flow:

Player selects answer
-> validation fail
-> combo reset
-> mastery decrease
-> feedback display
-> remain on current prompt
-> retry allowed

Notes:

- no harsh punishment
- encourage immediate retry

### Timeout Resolution

Applicable only during `RAPID_RESPONSE`.

Flow:

timer reaches zero
-> combo reset
-> timeout feedback
-> temporary input lock
-> retry same prompt

## 3. Feedback Language

### Correct Feedback Pool

Examples:

- Hit!
- Nice Flow!
- Chain!
- Pattern Mastery!
- Perfect!

### Wrong Feedback Pool

Examples:

- Mana unstable...
- Not quite.
- Try again.
- That pattern doesn't fit.

### Timeout Feedback Pool

Examples:

- Too Slow!
- Chain broken!
- Focus!

Rule:

Avoid academic grammar terminology during gameplay.

## 4. Auto-Advance Rules

Auto-advance only when:

- answer is correct
- not timeout
- not final prompt

Do not auto-advance:

- wrong answer
- timeout retry
- boss mission interactions

Default delay:

- 0.8 seconds

## 5. Timer Pressure Spec

### LEARN

No timer.

### DRILL

Optional future timer support.

### RAPID_RESPONSE

3-second timer.

At 1 second remaining:

- timer becomes visually urgent
- larger typography
- warning color emphasis

Goal:

Encourage reflexive chunk recall instead of translation.

## 6. Interaction Locking

During feedback delay:

- answer buttons temporarily disabled

Goal:

Prevent accidental double submissions and preserve gameplay rhythm.

## 7. Session Feel Goals

Desired player feeling:

`Just one more prompt.`

Primary KPI:

- voluntary repetition rate

Secondary goals:

- combo momentum
- low cognitive friction
- fast recovery after mistakes
- visible progression

## 8. Non-Goals

This system is not intended to:

- explicitly teach grammar terminology
- simulate exams
- maximize information density
- require long reading during drills

## 9. Future Expansion Notes

Possible future systems:

- audio feedback
- animation polish
- adaptive pacing
- streak systems
- scenario world map
- boss escalation
- spaced review
