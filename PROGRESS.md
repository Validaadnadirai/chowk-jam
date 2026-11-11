# CHOWK JAM Progress
## Batch 1 — Foundation + Core Engine
- [x] M1 scaffold: Vite, TypeScript, Phaser, Capacitor config, scripts, CI, responsive portrait canvas and initial scenes.
- [x] M2 grid model, placement validation, four-direction exit checks, obstacles, move counter, undo history, JSON level loader, Phaser debug renderer and unit tests.
- [ ] Run lint, tests and production build in a clean environment.
- [ ] Generate/sync native Android project and verify debug APK on emulator/device.
## Batch 2 — Full Gameplay Rules + Feel (implementation in progress)
- [x] M3 core rules: Waiting Bay, passenger matching/boarding, signal phases, move limit, win/fail and star calculation.
- [x] M3 solver and 10 JSON levels; CI level-validation command added.
- [x] M4 feedback: HUD, pause/retry/next, blocked shake, exit tween, generated WebAudio tones and vibration fallback.
- [ ] Add richer continuous passenger-stream animation and win confetti.
- [ ] Run lint, tests, level validator and production build in CI.
- [ ] Verify performance and haptics on a real Android device.
