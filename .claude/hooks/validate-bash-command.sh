#!/bin/bash
set -euo pipefail

input="$(cat)"
tool_name="$(echo "$input" | jq -r '.tool_name // ""')"
command="$(echo "$input" | jq -r '.tool_input.command // ""')"

if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{
    decision: "block",
    reason: $reason
  }'
  exit 0
}

# Block push to main/master.
if echo "$command" | grep -Eq 'git[[:space:]]+push[[:space:]]+.*(main|master)([[:space:];|&]|$)'; then
  deny "Do not push to main/master. Create a PR instead."
fi

# Block bare --force push. Allow --force-with-lease on feature branches (not main/develop).
if echo "$command" | grep -Eq 'git[[:space:]]+push[[:space:]]+--force'; then
  if echo "$command" | grep -Eq 'git[[:space:]]+push[[:space:]]+--force-with-lease'; then
    # Block --force-with-lease to protected branches.
    if echo "$command" | grep -Eq 'git[[:space:]]+push[[:space:]]+--force-with-lease[[:space:]]+origin[[:space:]]+(main|master|develop)([[:space:];|&]|$)'; then
      deny "Do not force push to main/master/develop."
    fi
    # --force-with-lease to other branches is allowed.
  else
    deny "Use --force-with-lease instead of --force."
  fi
fi

# Allow only push to vk/* branches on origin.
# Flags like --force-with-lease or -u may appear between "push" and "origin vk/".
if echo "$command" | grep -Eq '(^|[[:space:];|&])git[[:space:]]+push'; then
  if ! echo "$command" | grep -Eq 'git[[:space:]]+push[[:space:]]+(--?[a-zA-Z-]+[[:space:]]+)*origin[[:space:]]+vk/'; then
    deny "Push only to vk/* branches on origin. Example: git push -u origin vk/xxxx-topic"
  fi
fi

# Block broad staging patterns that are easy to misuse.
if echo "$command" | grep -Eq '(^|[[:space:];|&])git[[:space:]]+add[[:space:]]+(-A|--all|\.)([[:space:];|&]|$)'; then
  deny "Avoid broad git add. Stage explicit paths only."
fi

# Block destructive history rewrite by default.
if echo "$command" | grep -Eq '(^|[[:space:];|&])git[[:space:]]+reset[[:space:]]+--hard([[:space:];|&]|$)'; then
  deny "Do not run git reset --hard from Claude."
fi

exit 0
