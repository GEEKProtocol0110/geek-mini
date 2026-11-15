# Geek HQ family finish

The accepted HQ Arcade styling is adapted to Mini's existing quick-play interface. A final local stylesheet adds restrained teal/purple atmosphere, gold primary actions, crisp headings, illuminated panel edges and larger navigation targets. Existing robot artwork and the actual Kaspa symbol stay in place. The shared finish covers the home, practice, public challenge, result, progress, leaderboard and embed routes.

Only layout's stylesheet import and the new CSS change application source. Question content, scoring, clocks, answer feedback, public-score consent, storage and HQ API behavior are unchanged. No dependency or remote asset is added.

Local validation: all 38 existing tests, ESLint, TypeScript, production build, production dependency audit (zero vulnerabilities) and whitespace checks pass. The managed Next preview runner still passes unsupported Vite flags to Next (`--host`/`--strictPort`); no app script was changed to compensate. Hosted preview/mobile verification is tracked in the PR.
