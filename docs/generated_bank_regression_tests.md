# Generated Bank Regression Tests

This document defines regression test expectations for generated sentence banks.

## Purpose

Generated sentence banks can break even when grammar remains correct.

Regression tests protect against:

- semantic drift
- cross-level contamination
- slot misuse
- duplicate target sentences
- British / American English inconsistency
- unsafe free slot recombination

## Core Tests for All Scenarios

Every generated bank should check:

- all `target_sentence` values are unique
- `sentence_id` level prefix matches `level`
- no lowercase sentence starts
- low levels do not contain high-level structures
- scenario-specific forbidden phrases do not appear

## Shopping-Specific Tests

Shopping currently checks:

- no `pay by`
- no British English terms
- A1 has no advanced structures
- A2+ `SHOP_TAKE` avoids weak needed-it objects
- A1+ / A2 / A2+ `SHOP_TOO` uses approved semantic pairs

## When to Add New Tests

Add tests whenever a bug is found and fixed.

Examples:

- if `pay by` appeared once, add a test for it
- if `this pencil is too tight` appeared once, add a semantic-pair test
- if `A2+` sentence IDs were generated with `A2` level, add a prefix-level consistency test

## Rule

Every fixed semantic bug should become a regression test.
