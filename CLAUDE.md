# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mongo Dojo is a static, dependency-free browser game for practising MongoDB shell CRUD syntax. There is no build step, package manager, linter or test suite. Run it by opening `index.html` or serving the folder (`python -m http.server 5173`). It deploys to Vercel as a static site (framework preset "Other", no build command). This folder is not a git repository.

## Architecture

Three plain scripts, loaded in order by `index.html`, communicate through globals (`window.Engine`, then `window.Course`); there are no modules.

- `js/engine.js` → `window.Engine`: an in-memory imitation of the Mongo shell. `run(src, state)` handles `use`/`show`/`db` by regex, and otherwise evaluates the learner's text as JavaScript via `new Function('db', 'ObjectId', 'ISODate', ...)` against a fake `db` built by `makeDb(state)`. State is `{ dbName, cols }` and is mutated in place. It also provides `equal` (data comparison), `explain` (human-readable diff of wrong results) and `setDeterministic` (predictable ObjectIds). Supported methods and operators are only what the lessons need; adding a lesson that uses a new operator means implementing it here.
- `js/lessons.js` → `window.Course = { chapters, check }`: all course content plus grading. Each chapter has a `seed()` and a list of exercises, which are either `cmd` (learner types a shell command) or `text` (short answer matched against `answers`).
- `js/app.js`: UI, XP/streak/rank scoring, and progress saved to `localStorage` under key `mongo-dojo-v1`.

### Grading model (the non-obvious part)

Exercises are graded by **resulting data, not command text**. `check()` runs the learner's input on a clone of `ex.before`, runs `ex.solution` on another clone, and compares the two states with `equal(..., true)`. Any command producing the same data passes. `must: [{ re, msg }]` adds technique checks (the learner's text must match `re`, otherwise the data is right but the answer is rejected with `msg`). A read-only command that changes nothing returns status `info` and does not count as a miss.

`ex.before` is not authored. At load time `lessons.js` replays every exercise's `solution` in order, in deterministic mode, starting from the chapter's `seed()`, and snapshots the state before each one. So each exercise continues from the data left by the previous exercise's solution. Consequences when editing:

- Changing, reordering or inserting an exercise changes the starting data for all later exercises in that chapter. Check that later `solution`s still work. Failures only show up as `console.error('Solution for <id> failed: ...')` in the browser console.
- Fixed `ID` constants at the top of `lessons.js` are the ObjectIds that deterministic mode and solutions reference. Keep them consistent with the lesson prompts.
- The `final: true` chapter ("Final mission") deliberately has no lesson notes.

The README's chapter and step counts (4 chapters, 33 steps) should be updated if exercises are added or removed.
