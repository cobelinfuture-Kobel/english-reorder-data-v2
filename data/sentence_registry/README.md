# Sentence Registry

This folder uses a sentence-first annotation structure as the source of truth.

Each CEFR level contains 15 scenarios.

The learning order is:

A1 -> A1+ -> A2 -> A2+ -> B1 -> B1+

Work proceeds level by level. Complete all 15 A1 scenarios before moving to A1+, then complete all 15 A1+ scenarios before moving to A2, and so on.

Original annotated sentences are the primary data source. Future `pattern_bank`, `chunk_bank`, and `word_bank` assets can be derived from the `sentence_registry`.

The `generator` layer should not freely compose raw words directly. It should prefer chunk-based and slot-based substitution using `chunks` and `slots`.

Folder naming uses `A1_plus`, `A2_plus`, and `B1_plus`, while JSON `metadata.level` uses `A1+`, `A2+`, and `B1+`.
