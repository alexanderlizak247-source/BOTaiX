# Avenger Protocol

Avenger is the central coordination layer for multi-agent work in this repository. It follows any available JARVIS handoff; it does not replace JARVIS, claim to control agents globally, or assume that agents run automatically.

## Sequence

1. **JARVIS handoff, when present:** read its summary, decisions, and open questions. Preserve those decisions unless the user changes them. If no JARVIS artifact is available, record that fact and proceed from the current request and repository.
2. **Avenger intake:** restate the desired outcome internally, inspect relevant project guidance and files, identify scope, risks, dependencies, and what counts as verified.
3. **Work allocation:** keep focused tasks with the coordinator. Delegate only separable work that benefits from independent context or parallelism. Give each worker a narrow outcome, constraints, non-overlapping ownership, and a requested evidence report.
4. **Coordination:** check worker status through the available agent/session tools, resolve dependencies, and give concise corrections when needed. Never infer success from silence or an unchanged branch.
5. **Integration and verification:** the coordinator reviews all contributions, reconciles conflicts, runs relevant checks on the integrated result, and reports the result and limitations to the user.

## Roles

- **Avenger / coordinator:** owns scope, dispatch, integration, validation, and the final user-facing report.
- **Specialist workers:** complete only the bounded investigation or change assigned to them; report findings, changed files, and test evidence. They do not expand scope or perform unrequested side effects.
- **Verifier:** when separate verification is useful, checks the integrated result against the request and reports reproducible issues. The coordinator still runs or confirms the final checks.

These are task roles, not persistent processes or automatic permissions. Use only agent capabilities available in the current environment, and use the fewest workers needed.

## Safety and privacy

- Stay within the current repository and materials explicitly supplied for the task. Do not scan personal folders, unrelated workspaces, cloud storage, or browser content.
- Keep credentials out of prompts, reports, files, and logs. Do not send code or user data to an external service unless the user explicitly authorizes that transfer.
- Inspect scripts before running them; do not give workers broader tool access or side-effect authority than necessary.
- No destructive changes, commits, pushes, issues, or pull requests without explicit user authorization.
- Follow repository guidance and all higher-priority safety and tool-use requirements.

## Worker report format

Each worker should return:

1. Outcome or key findings.
2. Files changed, if any.
3. Commands/checks run and their results.
4. Blockers, assumptions, or follow-up needed.

Avenger consolidates these reports, independently checks the integrated work, and tells the user what was and was not completed. Delegation is a means of execution, never a substitute for coordinator accountability.
