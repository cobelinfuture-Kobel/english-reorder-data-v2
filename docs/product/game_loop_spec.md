# Core Gameplay Loop
The core loop is a fast, repeatable 15-30 second interaction:

`NPC prompt -> player response -> validation -> feedback -> XP/combo/chunk unlock -> next prompt`

| Layer | Definition |
| --- | --- |
| Player goal | Build the correct sentence fast enough to keep momentum and earn progression. |
| System goal | Deliver high-frequency pattern repetition with slight variation so production becomes automatic. |
| Emotional goal | Replace homework fatigue with a sense of rhythm, streak, and small wins. |
| Learning goal | Train sentence production, not rule explanation, through repeated chunk-based output. |

One round should work like this:
1. An NPC, mission panel, or prompt card asks for a sentence.
2. The player assembles or speaks/types a response from available chunks or guided slots.
3. The system validates pattern, chunk choice, agreement, and allowed variation.
4. Feedback appears immediately in a supportive RPG tone.
5. The player receives XP, combo progress, and possible chunk unlock credit.
6. The next prompt arrives with either the same pattern or a controlled variation.

Example round in `1-1 Personal Info`:
- Prompt: `How are you today?`
- Expected pattern: `I am {state}.`
- Correct response: `I am hungry.`
- Feedback: `Clean cast. "hungry" added to your chunk inventory.`

This supports automaticity because the player is not solving a new problem each turn. The structure stays stable while one meaningful variable changes. That is the core FSI-style behavior: repeat the frame, swap the chunk, reduce hesitation, and make correct production feel increasingly effortless.

# Learn Mode
Learn Mode is the low-pressure tutorial layer for first contact with a sentence pattern. It teaches what the player is trying to say before asking for speed.

Core characteristics:
- A strong visual cue anchors meaning, such as an avatar pointing to a stomach icon for `I am hungry.`
- The target sentence pattern is shown explicitly, such as `I am {state}.`
- A small word or chunk bank is visible, with only relevant options.
- Guided slot filling highlights where each chunk belongs.
- Feedback is confirmatory and corrective without urgency.
- No timer is shown at first.

The intended Learn Mode flow:
1. The game presents a scene and one target meaning.
2. The pattern appears with one or more empty slots.
3. The player drags, taps, or selects chunks into the correct positions.
4. The system confirms the sentence and optionally plays audio.
5. The player repeats the same frame with 2-4 different chunks.

Example for `1-1 Personal Info`:

| Cue | Pattern | Chunk bank | Expected answer |
| --- | --- | --- | --- |
| Tired face icon | `I am {state}.` | `hungry`, `tired`, `fine` | `I am tired.` |
| Birthday cake + age badge | `I am {age}.` | `seven years old`, `eight years old` | `I am seven years old.` |

Low-pressure feedback rules:
- Confirm correct structure immediately.
- If incorrect, highlight the mismatched slot rather than rejecting the whole sentence.
- Replay the target audio and show one model sentence.

Transition rule into Drill Mode:
- A pattern becomes Drill-eligible after the player completes enough guided attempts with confidence.
- Suggested requirement: at least 80% guided accuracy across recent Learn attempts and one successful production without heavy hinting.

# Drill Mode
Drill Mode is the main automaticity engine. It converts a learned pattern into rapid, repeatable sentence production through controlled substitution.

Core characteristics:
- Prompts arrive quickly and focus on one sentence pattern at a time.
- The frame remains stable while chunks change.
- The player answers with less visual scaffolding than in Learn Mode.
- Validation is immediate and strict on pattern, but still supportive in tone.
- Combo rewards encourage consistency.
- Speed gradually increases after demonstrated success.
- A small number of distractors may appear to ensure active retrieval.

Drill structure for `I am {state}.`:
1. Prompt appears: image, cue word, or NPC question.
2. The player must produce the sentence using the active pattern.
3. The system validates chunk choice and full sentence structure.
4. Correct answers preserve combo and may shorten the next response window.
5. Errors trigger a soft correction and quick retry.

Example substitutions:
- `hungry` -> `I am hungry.`
- `tired` -> `I am tired.`
- `from Taiwan` uses a different frame: `I am from Taiwan.`
- `my brother` appears later in `1-2 Family & Friends` inside a family pattern such as `This is my brother.`

Answer validation should check:
- Exact or accepted equivalent sentence pattern
- Correct chunk placement
- Agreement and article rules when relevant
- Allowed punctuation/casing leniency if input is typed

Combo chain behavior:
- Each correct answer adds to streak count.
- Faster correct answers add extra combo value.
- A short run of correct substitutions should feel like maintaining attack tempo in battle.

Increasing speed rules:
- Start with comfortable response windows.
- Reduce visible waiting time only after repeated correct answers.
- Never introduce maximum speed before the player has demonstrated pattern stability.

Limited distractors:
- Distractors should test recognition, not overwhelm beginners.
- Example for `I am {state}.`: `hungry`, `tired`, `fine`, plus one non-fitting distractor like `mother`.

Mastery scoring in Drill Mode should prioritize recent performance. A player clears the mode when they can sustain high accuracy across recent attempts rather than merely accumulating total attempts.

# Boss Mode
Boss Mode is a synthesis mission, not a punitive exam. Its role is to let the player use multiple mastered patterns in a more expressive scene.

Design principles:
- The boss should feel like a meaningful conversation objective.
- The player should combine mastered chunks and patterns rather than recall isolated facts.
- The system should reward partial communication, not just perfect completion.

Example boss mission:
`Introduce Yourself to the Guild`

Required content from the first vertical slice:
- From `1-1 Personal Info`: name, state, age, origin
- From `1-2 Family & Friends`: one or more family relationship chunks

Example acceptable output set:
- `I am hungry.`
- `I am seven years old.`
- `I am from Taiwan.`
- `This is my mother.`

Success conditions:
- The player completes a target number of valid sentences, such as 2-3 in the mini boss or 4-5 in a larger boss.
- Each sentence must match one of the required mastered patterns.
- At least one sentence should come from `1-1` and one from `1-2` once the second scenario is unlocked.

Partial success handling:
- If the player produces enough correct meaning but misses one sentence, the mission can end in a `soft clear`.
- A soft clear grants base progression and sends the player to targeted review rather than hard failure.
- Missed patterns should be clearly identified as next practice targets.

Boss Mode should feel like performance assembly: the player is proving they can combine tools they already own.

# Combo System
The combo system turns repetition into momentum.

| Element | Definition |
| --- | --- |
| Streak | Consecutive correct responses within the active mode. |
| Combo multiplier | A reward multiplier that grows with sustained accurate performance. |
| Speed bonus | Extra combo value for correct responses within the target response band. |
| Accuracy bonus | Extra reward for clean, error-free rounds or mode completion. |
| Combo break | Triggered by incorrect structure, invalid chunk use, or repeated timeout. |
| Recovery | A short grace path that lets the player rebuild momentum after a break. |

Suggested behavior:
- The first few correct answers establish a streak.
- Later answers increase reward efficiency rather than changing the learning target.
- Speed bonus should matter only after the player already knows the pattern.
- A combo break should feel like lost momentum, not punishment.

Recovery rules:
- After a combo break, the next correct answer starts a fresh streak immediately.
- The system may offer one easier follow-up prompt to stabilize confidence.
- Recovery can grant a small `comeback` bonus after 2-3 clean answers.

Why combo supports repetition:
- It gives emotional value to doing the same pattern again.
- It reframes repeated drills as maintaining tempo.
- It rewards consistency, which aligns directly with automaticity training.

# XP and Mastery
XP is visible encouragement, but mastery is the true progression system.

| Metric | Purpose |
| --- | --- |
| XP | Signals progress, effort, and reward cadence. |
| Mastery | Measures whether the learner can produce the pattern accurately, quickly, and repeatedly over time. |

Mastery should combine:
- Accuracy: whether the sentence is structurally and semantically correct
- Speed: whether the learner can respond without long hesitation once trained
- Retention: whether performance remains stable after time or after pattern switching

Suggested thresholds:

| Threshold | Definition |
| --- | --- |
| Learn complete | 80% guided accuracy |
| Drill complete | 90% accuracy over recent attempts |
| Mastered | Error rate below 10% plus stable response speed |

Mastery layers:
- Per-pattern mastery: `I am {state}.`, `I am {age}.`, `This is my {family_member}.`
- Per-chunk mastery: `hungry`, `from Taiwan`, `my mother`, `my brother`
- Scenario mastery: the learner can complete the full scenario loop and boss with stable performance

Important product rule:
- XP can rise from repeated play even before full mastery.
- Unlocking major progression should depend on mastery gates, not XP totals alone.

This keeps the game feeling generous while protecting learning quality.

# Failure Feedback Design
Failure feedback should preserve confidence and immediately point the player back toward success.

Core rules:
- Never use a harsh `Wrong!` rejection as the primary message.
- Use RPG-style soft correction language.
- Show a contrastive hint that reveals what needs repair.
- Keep retries fast so the player stays in flow.

Recommended feedback pattern:
1. Soft fantasy-flavored message
2. Short structural hint
3. Optional model audio or example
4. Immediate retry or simplified follow-up

Examples:
- `Mana unstable...`
- `Try the be verb again.`
- `Listen: I am hungry.`
- `Almost there. Use "my" before the family word.`

Example correction case:
- Prompt target: `This is my brother.`
- Player answer: `This is brother.`
- Feedback: `Mana unstable... add your family tag. Listen: This is my brother.`

Retry behavior:
- First error: give a hint and retry the same intent.
- Second error: reduce complexity, such as re-showing chunk bank or highlighting the missing slot.
- Repeated failure: route the player back into Learn or a slower Drill sequence for that pattern.

The feedback goal is not to label failure. It is to preserve forward motion.

# Chunk Unlock Logic
Chunks are the collectible language units that make progression tangible.

Core definitions:
- Chunks unlock through correct usage, not just passive exposure.
- The chunk bank acts as the player's inventory of usable language pieces.
- Chunks can be reused across scenarios to create a sense of growing expressive power.

Suggested rarity model:

| Rarity | Purpose | Example |
| --- | --- | --- |
| Common | High-frequency beginner chunks learned early | `hungry`, `my mother` |
| Rare | More specific or less frequent but useful chunks | `from Taiwan`, `seven years old` |
| Epic | Memorable multi-word chunks or special mission rewards | future social or story-driven phrases |

Chunk unlock moment:
1. The player uses a chunk correctly in a valid sentence.
2. The system confirms the meaning and pattern match.
3. The chunk is added to inventory with a small celebratory reveal.
4. The game previews where the chunk can appear again.

Example unlocks from the first slice:
- `hungry`
- `seven years old`
- `from Taiwan`
- `my mother`
- `my brother`

Chunk reuse rules:
- A chunk unlocked in `1-1 Personal Info` should remain available in later scenarios when structurally relevant.
- Reuse should be surfaced intentionally so players feel they are building a toolkit, not restarting from zero.
- Family chunks from `1-2 Family & Friends` should later support introductions, social scenes, and quest dialogue.

The chunk bank should feel like an inventory with learning value: each acquired phrase increases the player's expressive range.

# Session Flow
A 5-minute vertical slice session should deliver one complete feeling of learn -> drill -> perform -> unlock.

Suggested flow:
1. Enter `1-1 Personal Info`.
2. Learn Mode: `I am {state}.`
3. Drill Mode: `I am {state}.`
4. Rapid Response: `Are you ...? -> Yes, I am.`
5. Chunk unlock moment
6. Mini boss: create a 2-3 sentence self-introduction
7. Unlock preview for `1-2 Family & Friends`

Example 5-minute session table:

| Step | Time | Player experience | Learning outcome |
| --- | --- | --- | --- |
| Enter scenario | 20-30s | Meet NPC and see objective | Establish context and motivation |
| Learn Mode | 60-90s | Build `I am hungry.` and similar lines with support | Understand pattern meaning and slot structure |
| Drill Mode | 90-120s | Repeat `I am {state}.` with substitutions | Increase speed and retrieval strength |
| Rapid Response | 30-45s | Answer `Are you hungry?` quickly | Build automatic short-form response |
| Chunk unlock | 10-15s | Receive new chunk inventory reward | Reinforce correct production with collection payoff |
| Mini boss | 45-60s | Say 2-3 self-introduction lines | Synthesize learned patterns |
| Next scenario preview | 15-20s | See `my mother` and `my brother` teaser | Create anticipation and continuity |

This session should end with clear momentum rather than exhaustion.

# Rapid Response System
Rapid Response is the automaticity check layer that appears only after enough supported practice.

Core rules:
- It is a timed challenge.
- The target response band should be around 1-2 seconds only after practice.
- It exists to build automaticity, not to punish hesitation.
- It should not appear too early in the learning curve.

Example use:
- Prompt: `Are you hungry?`
- Target answer: `Yes, I am.`
- Later variation: `Are you from Taiwan? -> Yes, I am.`

Timing design:
- Early target windows are forgiving.
- The stricter 1-2 second target should unlock only after Learn and Drill completion.
- The system should record response speed even when it does not surface harsh failure.

Failure and recovery:
- If the player misses the speed target but answers correctly, mark the response as `stable but slow`.
- If the player answers incorrectly, provide a quick hint and another short attempt.
- If repeated failures occur, return the player to a slower Drill sequence rather than blocking progress aggressively.

Rapid Response should feel like a burst of confidence: the learner notices they can answer before thinking too hard.

# State Machine
The scenario state machine defines how a sentence pattern moves from first exposure to long-term review.

| State | Entry condition | Player action | System validation | Exit condition |
| --- | --- | --- | --- | --- |
| Locked | Scenario or pattern not yet unlocked | View locked content or preview | Check progression prerequisites | Unlock requirement met |
| Available | Previous gate cleared | Select scenario or pattern | Confirm access and recommended next step | Player starts Learn |
| Learn | Pattern introduced for first time | Follow guided slot filling and modeled examples | Validate guided accuracy and hint usage | Learn threshold met |
| Drill | Learn completed | Produce repeated substitutions with less support | Validate pattern, chunk choice, and recent accuracy | Drill threshold met |
| Rapid Response | Drill stable enough for speed training | Answer timed prompts quickly | Validate correctness and response speed band | Speed stability reached or fallback triggered |
| Boss | Required component patterns available | Compose multiple valid sentences in a mission | Validate sentence set against mission requirements | Boss clear or soft clear |
| Mastered | Accuracy, speed, and stability thresholds reached | Reuse pattern in future content | Validate retention across sessions and contexts | Scheduled review trigger |
| Review | Time gap, drift, or scenario reuse calls pattern back | Re-answer older patterns in short bursts | Validate retention and refresh status | Returns to Mastered or re-enters Drill |

State progression should be forgiving:
- Failure should usually move the player one step back in support level, not all the way back to Locked or full restart.
- Review is a normal state, not evidence of failure.

# Victory Conditions
Victory should exist at multiple scales so every session feels complete while still serving long-term learning.

| Scope | Victory definition |
| --- | --- |
| Round victory | The player produces one valid target sentence and receives immediate feedback. |
| Mode victory | The player clears the accuracy threshold for Learn, Drill, or Rapid Response in the current pattern. |
| Level victory | The player completes the current scenario slice, such as `1-1 Personal Info`, including its mini boss. |
| Boss victory | The player successfully composes multiple required sentence patterns in a mission context. |
| Long-term product victory | The learner voluntarily repeats sentence patterns because the interaction feels like play. |

Examples from the first two scenarios:
- Round victory: `I am hungry.`
- Mode victory: sustain accurate substitutions for `I am {state}.`
- Level victory: finish a self-introduction in `1-1 Personal Info`
- Boss victory: combine `I am from Taiwan.` with `This is my brother.` in a later social introduction mission

The product succeeds when repetition becomes self-motivating. If the player chooses one more round because the loop feels satisfying, the system is achieving its educational purpose.
