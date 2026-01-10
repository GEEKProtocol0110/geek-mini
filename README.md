# 🎮 Geek Mini

Quick knowledge games powered by Geek Protocol. Test your knowledge with beautiful, engaging quiz experiences!

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
- Letter-labeled answer choices (A, B, C, D)
- Pulsing timer for speed mode tension
- Performance-based result messages (Perfect Score!, Excellent!, etc.)

### 🚀 Technical Features

- Built with Next.js 16 and React 19
- Tailwind CSS for styling
- TypeScript for type safety
- Client-side question shuffling for variety
- LocalStorage for speed mode cooldown management
- Fast performance with Turbopack

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
│       └── questions/      # Question bank (JSON)
├── public/                 # Static assets
└── package.json
```

## 🎯 How to Play

### Daily Challenge
1. Click "Daily Challenge" from the home page
2. Answer 5 questions at your own pace
3. Get immediate feedback on each answer
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

## 🙏 Acknowledgments

- Question content focuses on Kaspa blockchain knowledge
- Built with modern web technologies for optimal performance
- Designed for an engaging and educational experience
