# CHOWK JAM

An India-first hybrid-casual puzzle game set around a busy Indian chowk and bus stand. Players clear vehicles from the grid one tap at a time.

## Stack
- Vite + TypeScript
- Phaser 3
- Capacitor Android wrapper
- Vitest + ESLint
- GitHub Actions CI

## Requirements
- Node.js 22 LTS
- npm
- Android Studio + Android SDK only for native Android builds

## Run in browser
1. Clone the repository.
2. Run npm install.
3. Run npm run dev.
4. Open the local Vite URL shown in the terminal.

## Quality checks
- npm run lint
- npm test
- npm run build

## Android
The app ID is currently provisional: com.validaad.chowkjam.
After installing dependencies, generate the native Android project once with npx cap add android.
Then run npm run android:sync and open the android folder in Android Studio.

## Batch 1 gameplay controls
- Tap a vehicle to attempt its exit.
- A blocked vehicle stays in place and does not consume a move.
- Select test levels 1–5 from the level selector.
- Use Undo to restore the previous successful move.

## Project status
See PROGRESS.md and docs/BATCH_REPORT_1.md. The initial five levels are engine fixtures, not final campaign content.
