# Geek Mini

A polished quiz experience for the Geek Protocol ecosystem. Geek Mini offers fast, interactive knowledge games with strong keyboard support, score history, and responsive UI.

## Live Demo

- `https://geek-mini.vercel.app`

## Core Features

- Daily Challenge mode with 5 randomized questions
- Speed Round mode with a 30-second timer and cooldown
- Keyboard-first interactions (`1-4` to answer, `Enter` to continue)
- Local score history with best-performance stats
- Audio feedback and confetti celebration for high scores
- Mobile-friendly, responsive, animated UI

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
src/
  app/
    page.tsx          # Home page
    daily/page.tsx    # Daily Challenge mode
    speed/page.tsx    # Speed Round mode
    result/page.tsx   # Results and share actions
    embed/page.tsx    # Mode redirect entrypoint
    globals.css       # Global styles and animation tokens
    layout.tsx        # Root layout and metadata
  components/
    Confetti.tsx      # Celebration effect
  data/questions/
    kaspa.daily.json  # Question bank
  types/
    quiz.ts           # Shared quiz and stats types
  utils/
    sounds.ts         # Web Audio feedback helpers
    storage.ts        # LocalStorage score utilities
```

## Data Model

Each question follows this shape:

```json
{
  "id": "kaspa_001",
  "question": "What consensus structure does Kaspa use?",
  "choices": ["A", "B", "C", "D"],
  "answer": 1,
  "explain": "Kaspa uses a BlockDAG architecture."
}
```

## Deployment

### Vercel

1. Import this repository in Vercel.
2. Keep default Next.js build settings.
3. Deploy.

Or use CLI:

```bash
npm i -g vercel
vercel
```

## Quality Checklist

- `npm run lint`
- `npm run build`

## License

Maintained by Geek Protocol.
