---
name: Quality Check
description: Run the project quality checks and report only the failures that need attention. Use when the user requests a check run, code change verification, or identification of the first failing gate.
---

# Trigger Conditions

- When the user requests a check run or code verification
- When you need to confirm the quality gate status after a code change
- When you need to quickly identify the first failing check

# Execution Checklist

1. Run `./scripts/post-edit-check.sh`
2. If it fails, identify the first failing command and its root cause
3. Suggest a minimal, safe fix
4. Do not commit automatically
