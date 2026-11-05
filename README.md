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

## Play behavior (personal practice)

- Daily: five questions and answer order shared by visitors on the same UTC day. Replay is allowed; scores are practice only.
- Speed: choose **All Kaspa topics**, **Kaspa basics**, **The network**, **Wallets and payments**, or **Tokens and builders** on the readiness screen. Each focused pool contains at least ten questions; ten distinct prompts and shuffled choices are drawn when Start is pressed. Daily stays mixed and shared on the same bank version/date. Topic links such as `/speed?focus=wallets` preselect the topic; unknown values fall back to mixed. A readiness screen waits for an explicit **Start Speed Round** before the clock begins. Up to ten randomized questions in 30 elapsed seconds, followed by a 30-second local cooldown. Background throttling, sleep and delayed callbacks do not extend the round. The deadline is checked when answering and when returning to the page.
- Keys 1–4 answer a question; Enter advances in Daily after feedback.
- A short explanation appears after every answer. Results review each reached question with the chosen answer, correct answer, explanation and primary source. An unanswered question at the Speed deadline is marked separately and does not inflate the answered count. Review works with the same visit-only storage fallback as results.
- Daily records the UTC date when the round is generated, including rounds that finish after midnight. Share text identifies the mode and that date; the link always opens the current Daily, not an archived date. Branded PNG link-preview art is generated locally at `/opengraph-image` with no remote font or image request.
- The public practice bank contains 100 distinct questions across 12 topics, each with a primary source and editorial review date. The set lives at `src/data/questions/kaspa.daily.json`. `reviewedAt` means an internal source check, not an independent audit. Tests check IDs, unique prompts/choices, answer indices, source hosts and review metadata. Keep one underlying fact per question and recheck sources when changing content. Historical Crescendo questions explicitly identify the upgrade rather than promising future block rates. Programmability roadmap language follows its dated source.
- Review receipts contain question IDs and original choice indices. A content fingerprint prevents a bank update from silently reinterpreting an old receipt. Results without a matching valid review still show their score with a prompt to play a new round for review. Bank updates can also change a day's Daily set; visitors share ordering on the same bank version and UTC day.
- The last result is held in browser session storage and score history in local storage. Those writes are independent: blocked session storage cannot suppress history or cooldown writes. Client-side result navigation also keeps a visit-only receipt when storage is blocked. The result page reports whether history was saved. Reloading or closing the page can lose a visit-only result; a visit-only cooldown cannot survive a new document.
- Invalid/future cooldown records are ignored rather than locking a player out. Invalid result records are not shown. The result URL contains no editable score. Browser storage and clocks can still be edited; nothing is ranked, rewarded, or paid.
- Personal practice uses no backend, wallet, tracking, or monetary reward system. The opt-in public challenge described below uses shared server scoring.

## Your progress

Open **Progress** in the navigation or **View your saved progress** after a round. The page shows the last 20 valid scores in this browser, with Daily/Speed filters, best scores within that history, and today's saved Daily best. New Speed records show the chosen topic; older records say “Topic not recorded” rather than guessing. Speed best compares all saved Speed topics and ranks by number correct, then accuracy and recency; one correct answer out of one does not outrank eight correct in a full round. Percentages are recalculated from correct/answered counts.

New Daily scores retain the round's UTC generation date, even across midnight. Older scores remain visible but are not assumed to be today's set. The homepage shows a returning-player link when valid history exists. Focus, cross-tab storage changes and a minute check refresh the view and UTC date.

**Clear Mini records** asks for confirmation, then removes only Mini's score history, local Speed cooldown and this tab's last result. Other keys and the HQ account remain untouched. Each deletion is attempted independently; blocked storage reports incomplete deletion with browser-settings guidance. Other open tabs can still hold their own result until closed. Nothing is synced or sent to HQ, and these editable browser scores remain unranked practice.

## Development

Requires Node.js 20.9+ and npm (CI uses Node 22). Run `npm ci`, then `npm run dev`. Open `http://localhost:3000`.

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --omit=dev --audit-level=high` before deploying. CI runs these same checks. Utility regression tests cover delayed clocks, sleep, backwards clock changes, shared Daily ordering, storage failures, invalid receipts and bounded history/cooldowns. Their test-only loader uses the existing TypeScript compiler; it is not shipped to the browser.

Next.js and its ESLint configuration are pinned together at 16.4.0 with a committed lockfile. The production dependency audit was clear when this reliability change was verified; this is not an independent security audit. Import the repository as a Next.js app in Vercel. The site uses system fonts so the production build does not depend on downloading font files.

The Geek Protocol logo is sourced from the Geek Protocol HQ project's existing asset. Kaspa explanations should be reviewed against [Kaspa's own reference material](https://kaspa.org/lore) before adding questions.

## Continue learning in HQ

Answer review links each topic to the existing A.C.E. lesson. Results suggest up to three distinct lessons for missed or unanswered topics. Only the topic and level enter the link; Mini scores, question receipts and device history are not sent to HQ. Mini remains separate, unranked practice. The October 11 additions cover value accounting, base units, wallet lifecycle and transaction readers, with primary sources and dated internal editorial checks.

## October 14 variety update

The bank grew from 76 to 100 questions with 24 original prompts checked against the current Kaspa integration guides and Kasplex Kiwi examples/documentation. Additions cover wallet secrets/events/storage, RPC connections/encoding, node setup, accepted-transaction processing, HD/multisignature wallets and KRC-20 receipt/inscription basics. These are dated internal source checks, not independent editorial review. Existing question IDs and answers were retained. The content fingerprint changes for the expanded bank, so older score receipts still display but their old answer review may become unavailable after reloading.

Speed result pages, PNG cards, replay links and share messages identify and retain a valid selected topic. Only the topic enters the shared URL; scores and history stay local. The existing 30-second clock and cooldown apply to all Speed topics; switching topics does not grant a separate cooldown. No sign-in, wallet connection, backend or token payment is added.

## November 5, 2026 homepage artwork

Replace the mirrored text K in the decorative homepage preview with the actual Kaspa symbol. `public/kaspa-symbol.svg` preserves the emblem path/polygon and colors from the official https://kaspa.org/kaspa-logo.svg read on November 5; only the surrounding wordmark and whitespace are omitted. The mark is not generated or mirrored. See also https://kaspa.org/wp-content/uploads/2023/08/Kaspa-Brand-Guidelines-Final.pdf.

`public/mini-learning-scene.webp` is a generated adaptation of the founder-supplied neon learning-robot reference: brain, stylus, tablet, stars, cyan/magenta outlines and gold constellations, with typography and the floating checkmark removed for background use. It is a local 1100-square WebP (~99 KB), served through Next Image. The logo is a separate foreground asset; the question sits on a dark translucent panel with a solid-color fallback. Both images are decorative and excluded from screen-reader output with the existing preview. No runtime remote image request or gameplay change.

Validation and the exact preview/release result are recorded in the associated PR. Local browser preview could not start because the managed runner passed unsupported Vite flags (`--host`/`--strictPort`) to `next dev`; no application dev script was changed to work around that infrastructure mismatch. Rendered/mobile acceptance remains separate.

Local checks: all 33 existing tests pass, zero failures/skips; TypeScript, ESLint, production build and whitespace checks pass. Production dependency audit reports zero vulnerabilities at this check. Generated homepage HTML includes both assets and the question text. The optimized WebP is 100,534 bytes. No gameplay code, question bank, storage or dependency inputs changed.

## Public leaderboard and challenge (November 5, 2026 candidate)

`/leaderboard` shows **Mini players only**. HQ's separate public `/leaderboard/` can show the same Mini standings beside its own mode/category boards. Scores are never added across different games. Home's main play links lead to `/compete?mode=daily` or `/compete?mode=speed`, which explicitly asks the visitor to start a public challenge. `/daily`, `/speed` and `/progress` remain personal practice; old local results are not imported. Supporter embeds and existing shared practice links continue working.

The same-origin Next `/api/competition` proxy calls only `https://www.geekprotocol.xyz/api/mini`. **Release the matching HQ API first.** No Mini environment secret or database credential is needed: HQ uses its existing Redis in an isolated Mini namespace, and Mini stores the random identity bearer in an HttpOnly, Secure production, SameSite=Lax cookie. Writes require a matching Origin; the bearer is stripped from browser JSON. Generated public nicknames avoid unmoderated free-text names. Scores, ordering, one-Daily-attempt slots, 30-second Speed deadlines, topic separation and best-score updates are server controlled. Exactly equal scores share a rank. User-initiated resume handles interrupted submissions; failed requests do not trigger an automatic retry loop.

Starting a public challenge opts into publishing the generated nickname/result. The board can be viewed without a cookie or account. Public identity has a 90-day inactivity retention, Daily boards 35 days and Speed boards 90 days without new results. The board offers removal of this cookie identity's public scores, serialized against late score writes. Losing the cookie loses control of that identity; this is not account recovery or a person-per-profile guarantee. Clearing personal practice records does not clear the public board.

The Mini bank is already public. Server grading prevents a client from sending an edited total; it does not prevent answer lookup, automation, or repeated browser identities. These are public practice standings, not intelligence scores, private-ranked-season acceptance or token rewards. No HQ account/wallet data is shared with Mini. The paired HQ design and tests are documented in `GEEKProtocol0110/geek-protocol-hq/docs/PUBLIC-LEADERBOARD.md`.

Verification: 38 Mini tests pass, including fixed-upstream proxy routing, cookie secrecy/attributes, same-origin writes, forged-field rejection, unavailable-service errors and removal behavior; TypeScript, ESLint, production build and production dependency audit pass. A paired in-process rehearsal exercised the actual Mini proxy, actual HQ handler and real isolated Redis: explicit Daily start, all five server-graded answers, matching public standings, self-removal and an unchanged unrelated HQ-profile sentinel. This is a local rehearsal, not provider/device acceptance. Managed Next browser preview has the runner flag mismatch recorded above; the separate HQ static preview browser navigation was interrupted and was not retried. Rendered/mobile acceptance remains open.
