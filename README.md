# DevOverflow

A full-stack Q&A platform inspired by Stack Overflow, built with Next.js. Developers can ask questions, post answers, vote on content, and get AI-generated answers — all in a clean, modern interface.

**Live demo:** [devoverflowpro.vercel.app](https://devoverflowpro.vercel.app/)

## Features

- Ask and answer technical questions
- Vote on questions and answers
- Tag-based filtering and search
- AI-powered answer generation (OpenAI, DeepSeek, Groq)
- GitHub and Google OAuth authentication
- MDX-powered rich text editor
- Dark/light mode

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js (GitHub & Google OAuth)
- **AI:** Vercel AI SDK with OpenAI, DeepSeek, and Groq
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- GitHub OAuth app credentials
- Google OAuth app credentials

### Installation

1. Clone the repository:

```bash
git clone git@github.com:Rabinagurung/Devoverflow.git
cd Devoverflow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root of the project and add the required environment variables (see below).

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# NextAuth
AUTH_SECRET=
AUTH_TRUST_HOST=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# GitHub OAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# MongoDB
MONGODB_URI=

# App URLs
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SITE_URL=

# Clerk (if used)
NEXT_PUBLIC_ORG_ID=

# RapidAPI
RAPID_API_KEY=

# AI Providers
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
GROQ_API_KEY=
```

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Random secret for NextAuth — generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Set to `true` when running behind a proxy or on Vercel |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | From [Google Cloud Console](https://console.cloud.google.com/) OAuth credentials |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | From [GitHub Developer Settings](https://github.com/settings/developers) OAuth app |
| `MONGODB_URI` | MongoDB connection string (e.g. `mongodb+srv://...`) |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for internal API calls (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site |
| `RAPID_API_KEY` | API key for the JSearch job-listings API from [RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) |
| `OPENAI_API_KEY` | From [OpenAI Platform](https://platform.openai.com/) |
| `DEEPSEEK_API_KEY` | From [DeepSeek Platform](https://platform.deepseek.com/) |
| `GROQ_API_KEY` | From [Groq Console](https://console.groq.com/) |

## Deploy

The easiest way to deploy is with [Vercel](https://vercel.com/). Add all environment variables in the Vercel project settings.
