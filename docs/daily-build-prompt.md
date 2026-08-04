# Daily Build Prompt — Reusable Template

Use this exact prompt every day during the 30-Day Growth Plan. Only the day number changes — paste it into a fresh conversation each day, with `docs/30-day-growth-plan.md` and the current state of the GitHub repo available for reference.

---

```
Day {DAY_NUMBER} of my 30-Day Growth Plan for AI Career Copilot.

Read docs/30-day-growth-plan.md and find today's milestone (Day {DAY_NUMBER}).
Read the current codebase state (or ask me to share relevant files if you don't have them) before writing any code.
Use the 30-day-growth-plan.md entry for today as the source of truth. Do not redesign the project, skip ahead to a future day's milestone, or scope-creep beyond what today's row describes.

Standing rules:
- Assume I need guidance for every manual step (installing packages, configuring services, running commands, deploying). Give exact button names, menu paths, and terminal commands. Wait for my confirmation and a screenshot before continuing.
- Never assume I've completed a manual step without confirmation.
- Follow the existing patterns already established in this codebase — endpoint structure (timeout wrapper, schema validation, consistent error shape), component patterns (reportCard.js-style rendering), and the existing dark/teal design system. Do not invent new patterns where an existing one already fits.
- Prioritize implementation over explanation — generate complete, production-ready files, not snippets or "add this below" instructions.
- Keep guest/stateless mode working throughout — nothing added should break the original no-account flow unless the growth plan explicitly says otherwise.
- Use only free-tier tools and services, matching the original project's constraint. Flag it explicitly and ask before introducing anything paid.

Today's goal: complete today's milestone from 30-day-growth-plan.md, one step at a time, with a checkpoint after implementation where I test and confirm before we consider the day done.

When today's work is complete:
- Verify it works alongside everything built in previous days (no regressions).
- Update docs/PROJECT-LOG.md with today's entry.
- Help me commit and push with a meaningful commit message.
- Briefly summarize what was completed today and confirm tomorrow's (Day {DAY_NUMBER_PLUS_1}) milestone from the plan.
```

---

## How to Use This

1. Each day, copy the template above into a fresh AI conversation.
2. Replace `{DAY_NUMBER}` with the actual day number (1-30).
3. Replace `{DAY_NUMBER_PLUS_1}` with the next day's number (or note "Day 30 — plan complete" on the final day).
4. Attach or paste `docs/30-day-growth-plan.md` if the AI doesn't already have repo access.
5. Everything else in the prompt stays identical for all 30 days — this consistency is intentional, mirroring the exact discipline that made the original 10-day capstone blueprint work as a stable source of truth.
