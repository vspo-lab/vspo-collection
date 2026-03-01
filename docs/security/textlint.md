# textlint Operation Guide

## Purpose

`textlint` is a tool for mechanically detecting inconsistent notation and hard-to-read text in documentation.
In this template, it is used to maintain the readability and maintainability of `docs/`.

## Operation Policy

1. Document quality is ensured by both `textlint` and manual review
2. `textlint` is limited to items that are well-suited for automated detection
3. Domain-specific phrasing is finalized during review

## Check Targets

- `docs/**/*.md`
- `README.md`

## Rule Design Philosophy

Introducing overly strict rules from the start increases correction costs.
Strengthen rules incrementally in the following order:

1. Inconsistent notation and typo detection (initial introduction)
2. Readability (sentence length, verbose expressions)
3. Project-specific dictionary (terminology standardization)

## Configuration for This Project

Dependencies:

```json
"textlint": "^15.x",
"textlint-rule-preset-ja-technical-writing": "^12.x",
"@textlint/textlint-plugin-markdown": "^15.x"
```

Configuration files:

- `.textlintrc.json`
- `.textlintignore`

`package.json` scripts:

```json
{
  "scripts": {
    "textlint": "textlint \"{README.md,docs/**/*.md}\"",
    "textlint:fix": "textlint --fix \"{README.md,docs/**/*.md}\""
  }
}
```

## How to Run

```bash
pnpm textlint
pnpm textlint:fix
```

## Initial Setup Operation

To avoid bulk-fixing existing documents, some rules are disabled in the initial configuration.
These are specified in `.textlintrc.json` and should be incrementally enabled as existing documents are cleaned up.

## Points to Check in PR Reviews

1. The same type of issue is not repeated in new text
2. Rule disabling (`textlint-disable`) includes a documented reason
3. Fixes do not change the intended meaning of the text
