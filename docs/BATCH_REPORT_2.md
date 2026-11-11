# Batch 2 Report — Full Gameplay Rules + Feel

## M3 — Gameplay rules
- Added Waiting Bay state with configurable capacity.
- Vehicles board passengers matching their colour; completed vehicles depart and free a bay slot.
- Added cyclic passenger stream, signal lane groups A/B, configurable signal flip interval and current/next signal indicator.
- Added move-limit failure, bay-deadlock failure, full-clear win condition and 1–3 star calculation against par.
- Added BFS solver and `npm run validate:levels`; the validator checks all ten bundled JSON levels and compares configured par values with minimum exit moves.
- Added levels 6–10 and signal/passenger metadata to levels 4–5.

## M4 — Feel and presentation
- Added passenger-stream motion, signal pulse, bay feedback, vehicle exit tween, blocked shake and win confetti.
- Added generated Web Audio tones and a low-volume generated ambient tone, with an in-game sound toggle.
- Added vibration feedback where the browser/device supports it.
- Documented placeholder asset provenance in `docs/ASSETS.md`.

## Verification status
- GitHub Actions passed on Batch 2 head `45eb37b`: npm install, ESLint, Vitest, the 10-level validator and production build.
- Batch 1 CI also passed: lint, tests and production build.
- The validator confirmed all ten bundled levels are solvable; configured par values matched the solver's minimum exit count.
- Android packaging, frame-rate, audio and haptic behaviour still require a real device/emulator check.

## Known limitations
- Visuals and audio are generated placeholders, not final production art.
- The solver proves that vehicles can exit in a valid sequence while respecting signal phases. It does not yet optimise passenger-stream timing.
- The passenger stream is a deterministic loop, not a time-based simulation.
- No APK/AAB has been built in this environment.
