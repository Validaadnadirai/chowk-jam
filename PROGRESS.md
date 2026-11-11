# CHOWK JAM Progress
## Batch 1 — Foundation + Core Engine
- [x] M1 scaffold: Vite, TypeScript, Phaser, Capacitor config, scripts, CI, responsive portrait canvas and initial scenes.
- [x] M2 grid model, placement validation, four-direction exit checks, obstacles, move counter, undo history, JSON level loader and unit tests.
- [x] GitHub CI: lint, tests and production build passed.
- [ ] Install and verify the generated debug APK on a physical Android device.
## Batch 2 — Full Gameplay Rules + Feel
- [x] M3 Waiting Bay, passenger matching/boarding/departure, signal phases, move limit, win/fail and star calculation.
- [x] M3 BFS solver, level validator CLI, CI validator step and 10 JSON levels.
- [x] M4 placeholder visuals, HUD, pause/retry/next, passenger stream animation, signal feedback, vehicle exit, blocked shake and win confetti.
- [x] M4 generated Web Audio effects, sound toggle and vibration feedback where supported.
- [x] GitHub CI passed for lint, Vitest, level validator and production build.
- [ ] Replace placeholder art/audio with final production assets.
## Batch 3 — Boosters, Economy & App Experience
- [x] M5 versioned local progress save, coins, unlock tracking, completion rewards and booster inventory.
- [x] M5 Hint, Extra Bay, Shuffle and Undo booster actions.
- [x] M6 redesigned Home screen, tutorial overlay, language selection and settings toggles.
- [x] Device-pixel-ratio canvas rendering to improve high-density screen sharpness.
- [ ] Verify persistence, sound/music/vibration settings and visual quality on real Android devices.
- [ ] Replace all primitive placeholder vehicle/obstacle art with final bespoke production illustrations.
## Batch 4 — Premium Visual Overhaul
- [x] First vector-art pass for vehicles, obstacles and board framing.
- [x] GitHub Actions CI passed and PR #4 merged.
- [ ] Real Android device visual review and performance profiling.
## Batch 5 — Android Launch Readiness
- [x] M7 Android project generated in CI, web assets synced, debug APK assembled and artifact uploaded successfully.
- [x] M7 GitHub Android APK workflow now runs for pull requests targeting main.
- [ ] M7 Install and verify APK on a physical Android device; this cannot be confirmed by CI.
- [x] M8 Automated tests cover boosters, level parsing/validation, gameplay and progression.
- [ ] M8 Full manual gameplay, small-screen layout, audio and performance QA on physical Android hardware.

## Batch 6 — Premium Visual Foundation (in progress)
- [x] Added a reusable Phaser vector vehicle-art renderer with separate silhouettes and roof/window treatments for auto-rickshaw, electric rickshaw, tempo and bus.
- [x] Integrated the renderer into the existing gameplay scene without changing vehicle movement, hitboxes, exit rules, progression or save data.
- [x] Expanded the vehicle type model and vector renderer to include hatchback, yellow taxi and mini-truck with distinct roof/cabin/cargo details; existing level JSON fields remain unchanged.
- [x] Added a more layered asphalt junction surface, reflective edge studs and subtle lane-guide markings using lightweight vector primitives.
- [ ] Complete responsive visual review and consider a dedicated HUD layout pass.
- [x] Latest Batch 6 CI and Android debug APK workflows passed on commit `7915450`.
- [ ] Physical Android install, visual review and performance profiling remain outstanding.

## Batch 7 — World Map & Level Selection (CI passed; device QA pending)
- [x] Added a city-map level selection scene with three themed districts and ten level nodes.
- [x] Locked/unlocked/completed level states are driven by existing local progression data.
- [x] Home Play now opens the world map; selecting an unlocked node launches its matching level.
- [ ] Add richer district artwork and verify all navigation states on a physical Android device.
- [x] GitHub CI passed on latest Batch 7 head `e461f42` (lint, tests, level validation and production build are covered by CI).
- [ ] Run/verify the Android APK workflow for this stacked batch after its dependency is integrated into `main`.
- [ ] Verify navigation and responsive layout on a physical Android device.


## Batch 8 — Vehicle, Passenger & Junction Feedback (in progress)
- [x] Added subtle, low-cost idle motion to vehicles while preserving their existing hitboxes and exit logic.
- [x] Added staggered passenger-stream movement and pulse animation.
- [x] Added a compact waiting-bay change pulse so boarding/departure state changes are visually acknowledged.
- [x] Added short camera fade transitions when leaving gameplay and when advancing/retrying after a result.
- [x] Added an animated result-panel entrance and restrained next/retry action pulse.
- [x] Added paired A/B signal lamps that reflect the active lane phase and pulse on phase changes.
- [x] Added restrained idle motion to buffalo and handcart obstacles without changing collision or level data.
- [ ] Run lint, tests, level validation and production build; inspect animation lifecycle and low-end performance.
- [ ] Verify animation quality on a physical Android device; no device QA is claimed yet.
