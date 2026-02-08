# Python 花園 － 零到英雄

A no-auth React static webapp for learning Python from zero to hero. Built for a retired mom: intuitive, fun, CLT-aligned curriculum. Progress is stored in localStorage (no account required). Deployable to GitHub Pages.

## Features

- **8 stages, 87 lessons** — From "理解電腦的思維方式" to "綜合專案"
- **Traditional Chinese** explanations with **English** keywords and jargon
- **派姨** persona — gentle, encouraging tone
- **Progress** — completed lessons and last visited saved in localStorage
- **Hash router** — works on GitHub Pages without server config

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173/vibe-python/ (or the URL Vite prints).

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to GitHub Pages

1. **Enable GitHub Pages (Actions)**  
   In the repo: **Settings → Pages → Build and deployment**  
   - Source: **GitHub Actions**.

2. **Push to `main`**  
   The workflow `.github/workflows/deploy.yml` runs on push to `main`: it builds the app and deploys to GitHub Pages.

3. **Site URL**  
   If the repo is `username/vibe-python`, the site will be:
   - `https://username.github.io/vibe-python/`

   The app uses `base: '/vibe-python/'` in Vite, so the built assets load correctly at that path.

## Tech stack

- React 18, TypeScript, Vite
- React Router (HashRouter)
- No backend; progress in localStorage only

## Curriculum

Content lives in `src/content/`:

- `curriculum.ts` — stage and lesson index; imports stage JSON files
- `stage-1.json` … `stage-8.json` — full lesson content (引入 / 概念 / 示範 / 實作 / 總結)

Lesson structure: title, concept goal, optional `noCode` badge, sections (intro, concept, demo, practice, summary).

## License

Private / use as you like.
