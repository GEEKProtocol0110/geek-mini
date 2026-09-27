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
- Speed: up to ten randomized questions in 30 seconds, followed by a 30-second local cooldown.
- Keys 1–4 answer a question; Enter advances in Daily after feedback.
- A short explanation appears after every answer. The question set lives at `src/data/questions/kaspa.daily.json`.
- The last result is held in browser session storage and score history in local storage. The result URL contains no editable score. Browser storage can still be edited; nothing is ranked, rewarded, or paid.
- No backend, wallet, tracking, or monetary reward system is involved.

## Development

Requires Node.js 20+ and npm. Run `npm ci`, then `npm run dev`. Open `http://localhost:3000`.

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deploying. Import the repository as a Next.js app in Vercel. The site uses system fonts so the production build does not depend on downloading font files.

The Geek Protocol logo is sourced from the Geek Protocol HQ project's existing asset. Kaspa explanations should be reviewed against [Kaspa's own reference material](https://kaspa.org/lore) before adding questions.
