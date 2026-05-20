# AAKON VENTURES LIMITED

React + Vite admin UI for AAKON VENTURES LIMITED.

## Local development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

## Deployment

This repository includes a GitHub Actions workflow that builds the site and deploys the `dist` output to GitHub Pages on pushes to `main`.

Expected Pages URL:

https://Amosnicholaskobina.github.io/AAKON-VENTURES-LIMITED/

If the site returns a 404, open the repository's **Actions** tab and check the `Deploy to GitHub Pages` workflow run for errors. You may also need to enable Pages in the repository settings if required.

## Notes

Workflows:
- `.github/workflows/ci.yml` — build on push/PR
- `.github/workflows/pages.yml` — build & publish to Pages

If you want, I can verify the workflow run or help troubleshoot any publish errors.