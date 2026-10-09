# Geek Mini

Geek Mini is a free, small Kaspa knowledge game made by Geek Protocol. Anyone can play a five-question Daily Challenge or a 30-second Speed Round. Kaspa supporters can share a challenge link or place a branded card on their own site.

**Website:** [geek-mini.vercel.app](https://geek-mini.vercel.app) · **Geek Protocol:** [geekprotocol.xyz](https://www.geekprotocol.xyz/)

## For supporters

On the home page, use **Share the challenge** to send the current Daily Challenge or **Copy website embed** to copy an iframe for your site. The card at `/embed?mode=daily` opens the game in a new tab; use `/embed?mode=speed` for Speed Round. The share links use the current site origin, so they work on custom domains and preview sites as well.

Example embed (replace the domain with your deployment if needed):

```html
<iframe src="https://geek-mini.vercel.app/embed?mode=daily" title="Geek Mini Kaspa challenge" width="420" height="280" style="max-width:100%;border:0;border-radius:18px" loading="lazy"></iframe>
```

Mini links to Geek Protocol after a round and from the embed. Supporters do not need accounts, wallet connections, referral codes, or tokens.

## Play behavior

- Daily: five questions and answer order shared by visitors on the same UTC day. Replay is allowed; scores are practice only.
- Speed: up to ten randomized questions in 30 elapsed seconds, followed by a 30-second local cooldown. Background throttling, sleep and delayed callbacks do not extend the round. The deadline is checked when answering and when returning to the page.
- Keys 1–4 answer a question; Enter advances in Daily after feedback.
- A short explanation appears after every answer. The question set lives at `src/data/questions/kaspa.daily.json`.
- The last result is held in browser session storage and score history in local storage. Those writes are independent: blocked session storage cannot suppress history or cooldown writes. Client-side result navigation also keeps a visit-only receipt when storage is blocked. The result page reports whether history was saved. Reloading or closing the page can lose a visit-only result; a visit-only cooldown cannot survive a new document.
- Invalid/future cooldown records are ignored rather than locking a player out. Invalid result records are not shown. The result URL contains no editable score. Browser storage and clocks can still be edited; nothing is ranked, rewarded, or paid.
- No backend, wallet, tracking, or monetary reward system is involved.

## Development

Requires Node.js 20.9+ and npm (CI uses Node 22). Run `npm ci`, then `npm run dev`. Open `http://localhost:3000`.

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --omit=dev --audit-level=high` before deploying. CI runs these same checks. Utility regression tests cover delayed clocks, sleep, backwards clock changes, shared Daily ordering, storage failures, invalid receipts and bounded history/cooldowns. Their test-only loader uses the existing TypeScript compiler; it is not shipped to the browser.

Next.js and its ESLint configuration are pinned together at 16.4.0 with a committed lockfile. The production dependency audit was clear when this reliability change was verified; this is not an independent security audit. Import the repository as a Next.js app in Vercel. The site uses system fonts so the production build does not depend on downloading font files.

The Geek Protocol logo is sourced from the Geek Protocol HQ project's existing asset. Kaspa explanations should be reviewed against [Kaspa's own reference material](https://kaspa.org/lore) before adding questions.
