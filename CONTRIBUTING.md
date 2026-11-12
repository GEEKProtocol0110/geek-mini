# Contributing to Geek Mini

Thank you for helping improve Geek Mini, the free Kaspa knowledge game from Geek Protocol.

## Before you start

- Use a GitHub issue for a reproducible bug or a clearly scoped change.
- Do not open a public issue for an unpatched vulnerability. Follow [SECURITY.md](SECURITY.md).
- Geek Mini has no account, wallet, or token rewards. Do not add seed-phrase or private-key collection.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development

Requires Node.js 20.9 or newer and npm. Continuous integration uses Node.js 22.

```sh
git clone https://github.com/GEEKProtocol0110/geek-mini.git
cd geek-mini
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Checks

Run the lint, test, and build scripts from `package.json`:

```sh
npm run lint
npm test
npm run build
```

`npm run lint` runs ESLint. `npm test` runs `node --test tests/*.test.cjs`. `npm run build` runs the Next.js production build.

Continuous integration also runs `npx tsc --noEmit` and `npm audit --omit=dev --audit-level=high`. Run those before asking for review.

## Pull requests

1. Branch from current `main`.
2. Keep each pull request focused on one change.
3. Explain what changed and how you checked it.
4. Maintainers squash-merge accepted pull requests.

Questions live in `src/data/questions/kaspa.daily.json`. Keep one underlying fact per question, with a primary source and an honest review date. `reviewedAt` records an internal source check, not an independent audit.

By contributing, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md) and license your contributions under the repository's MIT License.
