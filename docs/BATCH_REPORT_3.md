# Batch 3 Report — Boosters, Economy & App Experience

## M5 — Progression and booster foundations
- Added versioned local save schema with safe fallback for unavailable/corrupt storage.
- Added coins, unlocked-level tracking, completed-level records and booster inventory.
- Added repeat-completion reduced rewards and booster shop pricing helpers.
- Added functional in-game Hint, Extra Bay, Shuffle and Undo actions.
- Added coin rewards when a level is cleared and persistent progress.

## M6 — App flow and onboarding
- Reworked Home screen with progress/coin summary, Play, tutorial and Settings.
- Added a five-step How to Play overlay.
- Added English, Hindi and Hinglish UI text selection.
- Added Sound, Music and Vibration preference toggles.
- Increased Phaser canvas render resolution to device pixel ratio (capped at 3) to reduce blurry rendering on high-density mobile screens.

## Verification
- Added unit tests for save normalization, level rewards, booster purchases and inventory consumption.
- GitHub Actions must run lint, Vitest and production build for this PR.
- Real-device visual sharpness, audio preference wiring, haptics and save persistence still require device testing.

## Important art status
This batch improves canvas resolution and the app experience, but it does not yet replace all placeholder vehicle/obstacle artwork with final bespoke production illustrations. That remains a required premium-art task before release. Current game-board vehicle bodies still use Phaser primitive shapes and text labels.
