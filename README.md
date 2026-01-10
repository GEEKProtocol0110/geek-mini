# 🎮 Geek Mini

> Quick knowledge games powered by Geek Protocol. Test your knowledge with beautiful, engaging quiz experiences!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://geek-mini.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Two Game Modes

- **📅 Daily Challenge** - 5 carefully selected questions to perfect your score
- **⚡ Speed Round** - Answer as many questions as you can in 30 seconds with a cooldown system

### 🎨 Modern UI/UX

- Beautiful gradient backgrounds with glass-morphism effects
- Smooth animations and transitions throughout
- Responsive design that works on all devices
- Visual feedback for correct/wrong answers with animations
- Progress bars and performance indicators
- Letter-labeled answer choices (number keys 1-4)
- Pulsing timer for speed mode tension
- Performance-based result messages (Perfect Score!, Excellent!, etc.)
- Confetti celebration for high scores (≥80%)
- Custom scrollbar and focus styles

### 🚀 Technical Features

- Built with Next.js 16 and React 19
- Tailwind CSS 4 for styling
- TypeScript for type safety
- Sound effects using Web Audio API
- Client-side question shuffling for variety
- LocalStorage for speed mode cooldown & score history
- Fast performance with Turbopack
- Keyboard shortcuts (1-4 for answers, Enter for next)
- Live streak counter with fire emoji 🔥
- Score history tracking (last 20 games)
- Native share API integration
- Full accessibility support (ARIA labels, keyboard navigation)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GEEKProtocol0110/geek-mini.git
cd geek-mini
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
geek-mini/
├── src/
│   ├── app/
│   │   ├── daily/          # Daily challenge mode
│   │   ├── speed/          # Speed round mode
│   │   ├── result/         # Results page
│   │   ├── globals.css     # Global styles and animations
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   └── data/
│       └── questions/      # Question bank ( (or press Enter/Space)
2. Answer 5 questions at your own pace
3. Use keys 1-4 to select answers quickly
4. Get immediate feedback with sound effects
5. Build streaks for consecutive correct answers 🔥
6. Press Enter to move to next question
7. See your final score with confetti if you score ≥80%!

### Speed Round
1. Click "Speed Round" from the home page
2. You have 30 seconds to answer as many questions as possible
3. Quick feedback - correct answers highlighted in green
4. Use keyboard shortcuts (1-4) for rapid answering
5. Track your streak in real-time
6. Complete cooldown required before playing again
7. View your performance stats and share your score!
4. See your final score and accuracy

### Speed Round
1. Click "Speed Round" from the home page
2. You have 30 seconds to answer as many questions as possible
3. Quick feedback - correct answers are highlighted in green
4. Complete cooldown required before playing again
5. View your performance stats at the end

## 🛠️ Built With

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Geist Font](https://vercel.com/font) - Typography

## 🎨 Customization

### Adding Questions

Edit the question bank at `src/data/questions/kaspa.daily.json`:

```json
{
  "id": "unique_id",
  "question": "Your question here?",
  "choices": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "answer": 1,
  "explain": "Explanation for the correct answer"
}
```

### Styling

- Global styles and animations: `src/app/globals.css`
- CSS variables for theming in the `:root` selector
- Tailwind classes for component styling

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GEEKProtocol0110/geek-mini)

Or use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel
vercel
```

## 📄 License

This project is powered by Geek Protocol.

- Sound effects using Web Audio API
- Confetti particles for celebration moments

---

**Made with ❤️ by Geek Protocol** | [Live Demo](https://geek-mini.vercel.app)
## 🙏 Acknowledgments

- Question content focuses on Kaspa blockchain knowledge
- Built with modern web technologies for optimal performance
- Designed for an engaging and educational experience
