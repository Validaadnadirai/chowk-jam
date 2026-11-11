# Batch 2 Report — Full Gameplay Rules + Feel

## M3 — Gameplay rules
- Added Waiting Bay state with configurable capacity.
- Vehicles board passengers matching their colour; completed vehicles depart and free a bay slot.
- Added cyclic passenger stream, signal lane groups A/B, configurable signal flip interval and current/next signal indicator.
- Added move-limit failure, bay-deadlock failure, full-clear win condition and 1–3 star calculation against par.
- Added BFS solver and `npm run validate:levels`; the validator checks all ten bundled JSON levels.
- Added levels 6–10 and signal/passenger metadata to levels 4–5.

## M4 — Feel and presentation
- Added passenger-stream motion, signal pulse, bay feedback, vehicle exit tween, blocked shake and win confetti.
- Added generated Web Audio tones and a low-volume generated ambient tone, with an in-game sound toggle.
- Added vibration feedback where the browser/device supports it.
- Documented placeholder asset provenance in `docs/ASSETS.md`.

## Verification status
- Tests have been added for boarding, blocked exits, bay deadlock, signal timing/red lanes, stars and solver basics.
- The repository connector environment has not executed npm install, lint, Vitest, the level validator, or the production build.
- CI must be allowed to run on this pull request; no passing result is claimed here.
- Android packaging, frame-rate, audio and haptic behaviour still require a real device/emulator check.

## Known limitations
- Visuals and audio are generated placeholders, not final production assets.
- The solver proves that vehicles can exit in a valid sequence while respecting signal phases. The validator compares configured par values with the solver's minimum exit count; levels without a configured par are only checked for solvability. It does not yet optimise a full passenger-stream schedule.
- The passenger stream is a simple deterministic loop, not a time-based simulation.
- No APK/AAB has been built in this environment.
