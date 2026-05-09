# 🎵 Music Personality App

A cinematic, AI-powered music analysis platform that turns your Spotify listening habits into a unique "Music Archetype." Built with Next.js 15, Gemini 1.5 Flash, and Framer Motion.

![App Screenshot](https://raw.githubusercontent.com/lavanyagandepalli07/Music_personality_app/main/public/og-preview.png)

## 🚀 Features

- **Spotify OAuth Integration**: Securely connect your Spotify account via Auth.js.
- **Deterministic Metrics Engine**: Analyzes your top 50 artists and tracks to calculate:
  - **Mainstream Score**: Are you a trendsetter or a chart-topper?
  - **Genre Entropy**: Measures the diversity of your musical palette.
  - **Era Bias**: Identifies which decade defines your soul.
- **Gemini AI Personalities**: Uses Google's Gemini 1.5 Flash to generate a cinematic profile, including a custom "Aura," a "Music DNA" breakdown, and a witty "Roast & Praise" section.
- **Music Compatibility**: Compare your music DNA with friends to see your "Vibe Match" score and shared obsessions.
- **Viral Sharing**: Generate dynamic Open Graph images and shareable public profile links.
- **Explore Gallery**: Discover trending archetypes from the community.
- **Privacy First**: GDPR-compliant "Delete My Data" functionality.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini 1.5 Flash
- **Database**: Prisma with SQLite (Development) / PostgreSQL (Production)
- **Auth**: Auth.js (NextAuth v5)
- **Styling**: Tailwind CSS v4 & Framer Motion
- **Testing**: Vitest & Playwright

## 🚦 Getting Started

1. **Clone the repo**:
   ```bash
   git clone https://github.com/lavanyagandepalli07/Music_personality_app.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file and add the following:
   ```env
   SPOTIFY_CLIENT_ID=your_id
   SPOTIFY_CLIENT_SECRET=your_secret
   AUTH_SECRET=your_secret
   GEMINI_API_KEY=your_key
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://127.0.0.1:3000"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 License

MIT License. Created by [Lavanya Gandepalli](https://github.com/lavanyagandepalli07).
