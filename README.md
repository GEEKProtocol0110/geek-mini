# Geek Mini

Geek Mini is a free, small Kaspa knowledge game made by Geek Protocol. Anyone can play a five-question Daily Challenge or a 30-second Speed Round. Kaspa supporters can share a challenge link or place a branded card on their own site.

**Website:** [geek-mini.vercel.app](https://geek-mini.vercel.app) · **Geek Protocol:** [geekprotocol.xyz](https://www.geekprotocol.xyz/)

## For supporters

On the home page, choose **Daily Challenge** or **Speed Round**, check the live card preview, then share the challenge or copy a website embed. The code stays visible and selectable when clipboard access is unavailable. The card at `/embed?mode=daily` opens the game in a new tab; use `/embed?mode=speed` for Speed Round. The share links use the current site origin, so they work on custom domains and preview sites as well.

Example embed (replace the domain with your deployment if needed):

```html
<iframe src="https://geek-mini.vercel.app/embed?mode=daily" title="Geek Mini Daily Challenge" width="420" height="320" style="max-width:100%;border:0;border-radius:18px" loading="lazy"></iframe>
```

Mini links to Geek Protocol after a round and from the embed. Supporters do not need accounts, wallet connections, referral codes, or tokens.

## Play behavior

- Daily: five questions and answer order shared by visitors on the same UTC day. Replay is allowed; scores are practice only.
- Speed: a readiness screen waits for an explicit **Start Speed Round** before the clock begins. Up to ten randomized questions in 30 elapsed seconds, followed by a 30-second local cooldown. Background throttling, sleep and delayed callbacks do not extend the round. The deadline is checked when answering and when returning to the page.
- Keys 1–4 answer a question; Enter advances in Daily after feedback.
- A short explanation appears after every answer. Results review each reached question with the chosen answer, correct answer, explanation and primary source. An unanswered question at the Speed deadline is marked separately and does not inflate the answered count. Review works with the same visit-only storage fallback as results.
- Daily records the UTC date when the round is generated, including rounds that finish after midnight. Share text identifies the mode and that date; the link always opens the current Daily, not an archived date. Branded PNG link-preview art is generated locally at `/opengraph-image` with no remote font or image request.
- The public practice bank contains 52 distinct questions across 12 topics, each with a primary source and editorial review date. The set lives at `src/data/questions/kaspa.daily.json`. `reviewedAt` means an internal source check, not an independent audit. Tests check IDs, unique prompts/choices, answer indices, source hosts and review metadata. Keep one underlying fact per question and recheck sources when changing content. Historical Crescendo questions explicitly identify the upgrade rather than promising future block rates. Programmability roadmap language follows its dated source.
- Review receipts contain question IDs and original choice indices. A content fingerprint prevents a bank update from silently reinterpreting an old receipt. Results without a matching valid review still show their score with a prompt to play a new round for review. Bank updates can also change a day's Daily set; visitors share ordering on the same bank version and UTC day.
- The last result is held in browser session storage and score history in local storage. Those writes are independent: blocked session storage cannot suppress history or cooldown writes. Client-side result navigation also keeps a visit-only receipt when storage is blocked. The result page reports whether history was saved. Reloading or closing the page can lose a visit-only result; a visit-only cooldown cannot survive a new document.
- Invalid/future cooldown records are ignored rather than locking a player out. Invalid result records are not shown. The result URL contains no editable score. Browser storage and clocks can still be edited; nothing is ranked, rewarded, or paid.
- No backend, wallet, tracking, or monetary reward system is involved.

## Development

Requires Node.js 20.9+ and npm (CI uses Node 22). Run `npm ci`, then `npm run dev`. Open `http://localhost:3000`.

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --omit=dev --audit-level=high` before deploying. CI runs these same checks. Utility regression tests cover delayed clocks, sleep, backwards clock changes, shared Daily ordering, storage failures, invalid receipts and bounded history/cooldowns. Their test-only loader uses the existing TypeScript compiler; it is not shipped to the browser.

Next.js and its ESLint configuration are pinned together at 16.4.0 with a committed lockfile. The production dependency audit was clear when this reliability change was verified; this is not an independent security audit. Import the repository as a Next.js app in Vercel. The site uses system fonts so the production build does not depend on downloading font files.

The Geek Protocol logo is sourced from the Geek Protocol HQ project's existing asset. Kaspa explanations should be reviewed against [Kaspa's own reference material](https://kaspa.org/lore) before adding questions.
