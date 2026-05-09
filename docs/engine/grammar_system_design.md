# Grammar as Gameplay
Grammar should behave like invisible game physics. The learner should feel sentence constraints through action, repetition, and feedback, not through explicit grammar lectures.

Player-facing experience:
- The player sees missions, prompts, chunks, and sentence powers.
- The player combines language pieces to achieve a gameplay goal.
- The player learns what is valid by repeated successful use.

Engine-facing reality:
- The engine still needs precise grammar labels to validate, transform, scale, and track mastery.
- Internal grammar metadata defines which chunks can appear where, which forms agree, and which transformations are allowed.
- Grammar rules create gameplay constraints in the same way physics rules create movement constraints in an action game.

Example:
- Player-facing task: answer an NPC with `I am hungry.`
- Engine-facing interpretation: first person singular subject + present be verb + state slot filled by an allowed adjective chunk

The core design principle is that grammar is not removed. It is relocated from explanation into system behavior.

# Hidden Grammar Design
Formal grammar terms should not appear in child-facing UI by default. The system may use them internally, but the player should interact with intuitive gameplay metaphors.

Suggested hidden-grammar mapping:

| Internal grammar concept | Player-facing metaphor |
| --- | --- |
| Be verb | Identity Magic |
| Pronoun | Character role |
| Possessive | Relationship link |
| Question-answer pattern | Encounter response |
| Sentence pattern | Spell form or sentence power |
| Transformation | Form shift or response shift |

Examples:
- `I am` is not introduced as `first-person singular be verb`; it is introduced as a stable self-introduction pattern.
- `my mother` is not introduced as a `possessive noun phrase`; it is introduced as a family relationship chunk.
- `Are you hungry? -> Yes, I am.` is not labeled as an `interrogative + short answer pair`; it is taught as a response exchange.

Internal metadata should still retain labels such as:
- `be_verb`
- `present_simple`
- `pronoun_first_person`
- `possessive_determiner`
- `family_role`
- `question_form`

This separation lets the product stay accessible to A1 learners while preserving the structure needed for runtime logic and future expansion.

# Pattern Abstraction
Sentence patterns should be treated as reusable templates rather than isolated memorized strings.

Core abstractions:
- Pattern: a reusable sentence template with stable structure
- Slot: a controlled insertion point with typed constraints
- Chunk: a validated phrase unit that can fill a slot
- Transformation: a rule-based variant of a pattern, such as statement to question or answer form

Design rules:
- Patterns should represent the smallest useful repeatable sentence frame.
- Slots should constrain variation so practice stays focused.
- Chunks should be reusable across scenarios whenever structurally valid.
- Transformations should preserve the pattern family while changing grammatical function.

Vertical slice examples:

| Pattern family | Template | Slot type |
| --- | --- | --- |
| Personal state | `I am {state}.` | `state` |
| Personal age | `I am {age}.` | `age` |
| Personal origin | `I am from {place}.` | `place` |
| Question response | `Are you {state}?` | `state` |
| Family identification | `This is my {family_member}.` | `family_member` |

Pattern families should connect where useful:
- `I am {state}.` -> `Are you {state}?` -> `Yes, I am.` / `No, I am not.`
- `This is my {family_member}.` -> `He is my {family_member}.` / `She is my {family_member}.`

The engine should treat these as related forms, not unrelated sentences.

# Sentence Schema
A sentence entry should carry enough structure for validation, substitution, mastery tracking, and unlock logic.

Proposed schema:

```json
{
  "id": "string",
  "scenario_id": "string",
  "level_id": "string",
  "skill_id": "string",
  "grammar_tags": ["string"],
  "pattern": "string",
  "slots": [
    {
      "name": "string",
      "slot_type": "string",
      "required": true,
      "constraints": ["string"]
    }
  ],
  "allowed_chunks": ["string"],
  "distractors": ["string"],
  "expected_answer": ["string"],
  "transformations": [
    {
      "id": "string",
      "type": "string",
      "target_pattern": "string"
    }
  ],
  "validation_rules": {
    "exact_match": true,
    "normalized_match": true,
    "slot_validation": true,
    "grammar_validation": true,
    "semantic_validation": true
  },
  "mastery_metrics": {
    "accuracy_target": 0.9,
    "speed_target_ms": 2000,
    "retention_window": "recent_attempts"
  },
  "unlocks": ["string"]
}
```

Example 1: `I am {state}.`

```json
{
  "id": "a1_1_1_be_state_01",
  "scenario_id": "1_1_personal_info",
  "level_id": "A1",
  "skill_id": "be_state_intro",
  "grammar_tags": ["be_verb", "present_simple", "first_person", "state_expression"],
  "pattern": "I am {state}.",
  "slots": [
    {
      "name": "state",
      "slot_type": "state",
      "required": true,
      "constraints": ["adjective_or_state_chunk"]
    }
  ],
  "allowed_chunks": ["hungry", "tired", "fine"],
  "distractors": ["mother", "Taiwan"],
  "expected_answer": ["I am hungry.", "I am tired.", "I am fine."],
  "transformations": [
    {
      "id": "question_are_you_state",
      "type": "question_shift",
      "target_pattern": "Are you {state}?"
    },
    {
      "id": "short_answer_yes",
      "type": "response_pair",
      "target_pattern": "Yes, I am."
    }
  ],
  "validation_rules": {
    "exact_match": false,
    "normalized_match": true,
    "slot_validation": true,
    "grammar_validation": true,
    "semantic_validation": true
  },
  "mastery_metrics": {
    "accuracy_target": 0.9,
    "speed_target_ms": 2000,
    "retention_window": "recent_attempts"
  },
  "unlocks": ["chunk_hungry", "pattern_are_you_state"]
}
```

Example 2: `This is my {family_member}.`

```json
{
  "id": "a1_1_2_family_intro_01",
  "scenario_id": "1_2_family_friends",
  "level_id": "A1",
  "skill_id": "family_identification",
  "grammar_tags": ["demonstrative", "be_verb", "possessive", "family_role"],
  "pattern": "This is my {family_member}.",
  "slots": [
    {
      "name": "family_member",
      "slot_type": "family_member",
      "required": true,
      "constraints": ["singular_family_role"]
    }
  ],
  "allowed_chunks": ["mother", "brother", "sister"],
  "distractors": ["hungry", "Taiwan"],
  "expected_answer": ["This is my mother.", "This is my brother.", "This is my sister."],
  "transformations": [
    {
      "id": "he_family_statement",
      "type": "pronoun_shift",
      "target_pattern": "He is my {family_member}."
    },
    {
      "id": "she_family_statement",
      "type": "pronoun_shift",
      "target_pattern": "She is my {family_member}."
    }
  ],
  "validation_rules": {
    "exact_match": false,
    "normalized_match": true,
    "slot_validation": true,
    "grammar_validation": true,
    "semantic_validation": true
  },
  "mastery_metrics": {
    "accuracy_target": 0.9,
    "speed_target_ms": 2500,
    "retention_window": "recent_attempts"
  },
  "unlocks": ["chunk_my_mother", "chunk_my_brother", "pattern_he_she_family"]
}
```

# Chunk Slot Rules
Chunks must match their slot type. The engine should reject structurally invalid combinations even when individual words are familiar.

Core slot types for the vertical slice:
- `state`
- `age`
- `place`
- `identity`
- `family_member`
- `possessive`

Slot-rule principles:
- A chunk can only fill slots whose type and constraints it satisfies.
- A chunk may be reusable across multiple patterns if its metadata permits it.
- Multi-word chunks should remain single validated units when that improves fluency training.

Examples:
- `hungry` fits `state`
- `seven years old` fits `age`
- `from Taiwan` may be stored as a reusable origin chunk or split into pattern + `place` depending on engine design
- `mother` fits `family_member`
- `my` fits `possessive`

Chunk metadata should include:

| Field | Purpose |
| --- | --- |
| `text` | Surface form shown or validated |
| `slot_type` | Primary insertion category |
| `grammar_tags` | Internal grammar metadata |
| `difficulty` | Relative instructional complexity |
| `scenario_source` | Where the chunk was introduced |
| `reuse_targets` | Other patterns or scenarios where the chunk may reappear |

Example chunk records:

```json
{
  "text": "hungry",
  "slot_type": "state",
  "grammar_tags": ["adjective", "state_expression"],
  "difficulty": "A1_easy",
  "scenario_source": "1_1_personal_info",
  "reuse_targets": ["I am {state}.", "Are you {state}?"]
}
```

```json
{
  "text": "brother",
  "slot_type": "family_member",
  "grammar_tags": ["noun", "family_role", "male_reference"],
  "difficulty": "A1_easy",
  "scenario_source": "1_2_family_friends",
  "reuse_targets": ["This is my {family_member}.", "He is my {family_member}."]
}
```

# Agreement System
The agreement system ensures that sentence parts fit together in grammatically valid ways. In the A1 slice, this should be tightly constrained so learners practice correct forms without facing unnecessary combinatorial complexity.

Agreement areas:
- Subject-verb agreement
- Pronoun agreement
- Possessive agreement
- Family role consistency

Core examples:

| Subject or phrase | Valid form |
| --- | --- |
| `I` | `I am` |
| `You` | `You are` |
| `He` | `He is` |
| `She` | `She is` |
| relationship phrase | `my mother`, `my brother` |

Engine behavior:
- `I am hungry.` is valid.
- `I is hungry.` is invalid due to subject-verb disagreement.
- `He is my brother.` is valid.
- `She is my brother.` may be structurally valid but semantically inconsistent depending on target meaning and should be flagged when the reference context requires a female family role.

Possessive handling:
- Early patterns should strongly constrain possessives to stable chunks such as `my mother` and `my brother`.
- The engine may represent `my` separately for reuse, but beginner-facing drills should often keep the relationship phrase bundled to reduce cognitive load.

Early A1 constraints:
- Limit active pronoun choices per exercise.
- Limit family-role contrast sets to a small number.
- Avoid mixing too many agreement systems in one round.
- Prefer one agreement target at a time, such as only subject-verb in `I am {state}.`

# Tense Transformation Rules
The first vertical slice should focus almost entirely on present simple be-verb patterns. This keeps the system stable while still allowing the engine to be designed for future expansion.

Current vertical slice focus:
- `I am happy.`
- `Are you hungry?`
- `Yes, I am.`
- `This is my mother.`

Future tense support should be rule-driven, not hardcoded per sentence. The engine should transform a pattern family based on metadata and grammatical rules.

Target future support:
- present simple
- present continuous
- past simple
- future forms

Example transformation path:

| Tense or aspect | Example |
| --- | --- |
| Present simple | `I am happy.` |
| Past simple | `I was happy.` |
| Present continuous | `I am playing.` |
| Past simple lexical verb | `I played.` |

Design implications:
- A pattern should specify which transformation families it supports.
- Chunks may need additional metadata for tense compatibility.
- Verb class data should drive forms such as `am/was` or `play/played`.
- The engine should generate transformed targets through rules, not by storing every possible sentence as a separate independent item.

For the be-verb slice, the main transformation priority is statement-question-answer linking:
- `I am hungry.` -> `Are you hungry?` -> `Yes, I am.` / `No, I am not.`

This gives the product transformation depth without expanding beyond A1 capacity too early.

# Runtime Validation
Runtime validation should determine not only whether an answer is correct, but also what kind of correction or progression response should follow.

Validation layers:
- Exact validation: does the answer match an expected string exactly
- Normalized validation: does it still match after case, punctuation, or spacing normalization
- Slot validation: did the player place a chunk of the correct type in the slot
- Grammar validation: do subject, verb, pronoun, and possessive rules agree
- Semantic validation: does the answer match the intended meaning for the prompt
- Distractor analysis: did the learner choose a plausible but wrong chunk
- Feedback mapping: what hint style should be shown next

Validation output should include:

```json
{
  "is_correct": true,
  "error_type": "none",
  "corrected_answer": "I am hungry.",
  "hint": "Use the be-verb self pattern.",
  "mastery_delta": {
    "accuracy": 0.05,
    "speed": 0.02,
    "retention": 0.00
  },
  "feedback_style": "soft_confirm"
}
```

Suggested error types:
- `wrong_slot_type`
- `agreement_error`
- `missing_chunk`
- `wrong_transformation`
- `semantic_mismatch`
- `timeout`

Example validation cases:

| Prompt target | Player answer | Result |
| --- | --- | --- |
| `I am hungry.` | `I am hungry.` | Correct |
| `I am hungry.` | `I hungry.` | Grammar error: missing be verb |
| `This is my brother.` | `This is my hungry.` | Wrong slot type |
| `Are you hungry?` | `Yes, I am.` | Correct response pair |
| `Are you hungry?` | `I am hungry.` | Semantically acceptable in some contexts, but wrong expected transformation if the task is short-answer drill |

Feedback mapping should be mode-sensitive:
- Learn Mode can provide stronger correction and full model answers.
- Drill Mode should give short hints and immediate retry.
- Rapid Response should track speed and offer recovery without harsh punishment.

# Grammar Difficulty Scaling
Grammar difficulty should rise by expanding sentence operations, not by flooding the learner with terminology.

Stages:

| Stage | Description |
| --- | --- |
| 1. Single fixed pattern | One stable sentence with no meaningful variation |
| 2. Slot substitution | Same pattern with controlled chunk changes |
| 3. Pronoun substitution | Same meaning family with subject changes such as `I` to `he` or `she` |
| 4. Question-answer transformation | Statement linked to question and answer forms |
| 5. Multi-sentence composition | Two or more mastered patterns combined in sequence |
| 6. Cross-scenario synthesis | Patterns and chunks reused across different mission contexts |

Mode mapping:

| Mode | Primary scaling stages |
| --- | --- |
| Learn Mode | 1 -> 2 |
| Drill Mode | 2 -> 3 |
| Rapid Response | 3 -> 4 |
| Boss Mode | 5 -> 6 |
| Review Mode | revisit 2 -> 6 depending on drift |

Vertical slice examples:
- Learn Mode: `I am hungry.`
- Drill Mode: `I am hungry.` / `I am tired.` / `I am from Taiwan.`
- Rapid Response: `Are you hungry? -> Yes, I am.`
- Boss Mode: `I am from Taiwan. This is my mother.`
- Review Mode: mix `1-1 Personal Info` and `1-2 Family & Friends` in short bursts

Scaling rules:
- Introduce one new operation at a time.
- Keep distractor count low in early stages.
- Gate faster timing behind demonstrated accuracy.
- Prefer more repetition of fewer patterns over shallow coverage of many patterns.

# Design Constraints
- Avoid overloading A1 learners.
- Prefer fewer patterns with more repetition.
- Prioritize automaticity before explanation.
- Never expose too many distractors early.
- Every grammar rule should eventually become playable.

The engine should be designed so that any internal grammar feature can later appear as a game action, mission rule, response pattern, or unlockable sentence power.
