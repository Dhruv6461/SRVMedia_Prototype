Accessibility test runner (Playwright + axe-core)

Prereqs:
- Node.js (14+)

Install:

```bash
npm install
```

Run accessibility checks (creates `accessibility-results/` with JSON and screenshots):

```bash
npm run test:accessibility
```

Notes:
- The script loads the local file `assets/index.html` via `file://` URL. If your page requires a local server (e.g., for relative imports), start a static server and edit `test/accessibility.js` to use `http://localhost:PORT`.
- To emulate reduced-motion in DevTools: open Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.
- Share the `accessibility-results/*.json` files and I can triage the violations and patch fixes.
