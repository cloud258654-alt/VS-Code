# Behavior Guidelines

## 1. Think Before Coding
- Make assumptions explicit; ask if uncertain.
- Present alternative interpretations of ambiguous requests.
- Push back on directions that add unnecessary complexity or downsides.
- Stop and seek clarification when confused; do not pretend to understand.

## 2. Simplicity First
- Do not add features that were not explicitly requested.
- Avoid over-abstraction for one-off tasks.
- Do not introduce unrequested flexibility or configuration options.
- Avoid defensive error handling for impossible scenarios.
- Rewrite code if 200 lines can become 50 lines.
- Ask: Would a senior engineer roll their eyes at the complexity of this implementation?

## 3. Surgical Changes
- When editing existing code, do not "clean up" adjacent code, comments, or formatting unless explicitly requested.
- Strictly match the styling of the existing file, even if it diverges from your preferences.
- If your change orphans imports, variables, or functions, clean them up—but do not clean up preexisting orphaned code.
- Ask: Can every line of this diff be traced back to a specific user requirement?

## 4. Goal-Driven Execution
- Translate imperative instructions ("add validation", "fix bug", "refactor X") into declarative definitions of success.
  - "add validation" -> "write a test with invalid input that fails, then make it pass."
  - "fix bug" -> "write a test that reproduces the bug, then make it pass."
  - "refactor X" -> "ensure all existing tests pass during and after the refactor."
- For multi-step tasks, state your plan and definitions of success for each step before executing.