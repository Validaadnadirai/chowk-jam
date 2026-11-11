# Batch 1 Report — Foundation + Core Engine
## Built
- Vite + TypeScript + Phaser project scaffold and responsive portrait canvas.
- Capacitor Android configuration and Android sync script.
- Boot → Splash → Home flow and playable grid debug scene.
- Pure grid engine: occupancy validation, exit checks in all four directions, obstacle/vehicle blocking, move counter and win state.
- Undo history, JSON level loader and five starter level JSON files.
- Vitest unit tests and GitHub Actions CI workflow.
## Run locally
1. Install Node.js 22 LTS and npm.
2. Run npm install.
3. Run npm run dev for browser preview.
4. Run npm test, npm run lint and npm run build.
5. Run npx cap add android once, then npm run android:sync. Open android in Android Studio and build a debug APK.
## Verification
Source files have been committed to the batch branch. Commands have not been executed in this environment; do not treat lint, tests, build or APK as passed until CI/local verification is green. Native Android project generation is a local setup step.
## Known limitations
- Phaser scene currently loads the first sample level directly.
- Five JSON files are starter fixtures, not a curated or solver-verified campaign.
- Waiting bay, passengers, signals, progression, art/audio polish and haptics belong to later milestones.
## Needs from owner
- Confirm final application ID (currently com.validaad.chowkjam).
- Confirm final title remains CHOWK JAM.
- Android Studio/emulator or Android device for APK verification.