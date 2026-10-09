# Naresh Tiwari - Developer Portfolio

A developer portfolio for Naresh Tiwari, Software Developer.

See [PERSONALIZATION.md](PERSONALIZATION.md) for confirmed content, missing details, and account setup. See [CREDITS.md](CREDITS.md) for design attribution.

[Portfolio](https://www.nareshdev.space/) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Structure](#project-structure)

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

---

## ✨ Features

### 🎨 Design & UI

- Theme toggle (dark/light) with system preference detection and localStorage persistence
- Responsive mobile-first design with smooth animations (Framer Motion)
- Custom typography (Geist, Hanken Grotesk) and playful handwritten fonts
- Asset preloading for critical images and theme-aware hero backgrounds

### 👤 Hero Section

- Animated profile avatar with Easter egg click effects
- Live Spotify activity display with fallback states
- Interactive tech stack icons with tooltips
- Social links and personal stats (experience, projects)

### 💼 Experience & Projects

- Interactive career timeline with animated achievements
- Clickable project grid with expandable modal details
- Project cards with tech stacks, status indicators, and live links

### 📊 GitHub Integration

- Contribution calendar and counter (GitHub GraphQL API)
- Public pull-request activity, including own repositories; a GitHub token is optional
- Accurate empty-tab messages with a featured-project link and retry on errors
- Direct GitHub profile link

### 💬 Engagement Features

- Guestbook page with OAuth-protected comments
- SEO-optimized pages with dynamic metadata
- Theme-consistent UI components and transitions

### 🔍 SEO & Performance

- Auto-generated sitemap and robots.txt
- Open Graph/Twitter Cards and structured data
- Vercel Analytics and Speed Insights integration

---

## 🛠️ Tech Stack

### Core Frameworks

| Tech       | Version | Role        |
| ---------- | ------- | ----------- |
| Next.js    | 16.2.0  | App Router  |
| React      | 19.2.4  | UI Library  |
| TypeScript | 5.x     | Type Safety |

### Styling & UI

| Tech           | Purpose                |
| -------------- | ---------------------- |
| TailwindCSS v4 | Utility-first CSS      |
| Radix UI       | Headless UI components |
| Lucide React   | Icon library           |
| Framer Motion  | Animations             |

### Data & APIs

| Tech                  | Purpose                    |
| --------------------- | -------------------------- |
| Axios                 | HTTP client                |
| react-github-calendar | Contribution visualization |

### Tools

| Tool                            | Purpose                 |
| ------------------------------- | ----------------------- |
| ESLint/Prettier                 | Code quality/formatting |
| Husky/lint-staged               | Git hooks               |
| Vercel Analytics/Speed Insights | Performance monitoring  |

---

## 📁 Project Structure

```
next_portfolio/
├── app/               # Next.js App Router
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
├── types/             # TypeScript types
└── config files       # Project configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9+ (see the installed Next.js requirements)
- Docker (optional)

### Installation

```bash
# From this project directory
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure only the integrations you want:

```env
GITHUB_TOKEN=your_github_token
# Other personal integrations remain disabled until configured.
PORTFOLIO_ACTIVITY_ENABLED=false
```

### Run Locally

```bash
npm run dev
# Visit http://localhost:3000
```

### Connect the visitor counter

1. Create a fresh Neon PostgreSQL database for this portfolio. Save its runtime connection string as `DATABASE_URL` and its direct connection string as `DIRECT_URL` privately in `.env.local`.
2. Run `npx prisma migrate deploy` from this project directory to apply the existing database tables. Prisma loads `.env.local`; the first counted browser initializes the total automatically.
3. Set `VISITOR_COUNT_ENABLED=true` in `.env.local`. This enables visitor counts independently of Spotify and WakaTime. The legacy global activity switch is also supported.

The footer counts returning browsers once using a stored random visitor ID. Fresh databases begin with fresh counts. Duplicate mounts share one request, registration and increment are transactional, and database failures leave the count unavailable.

### Guestbook setup

The guestbook now runs inside this Next.js project when `NEXT_PUBLIC_PORTFOLIO_API_URL` is empty. It shares the fresh PostgreSQL database with the visitor counter and stores only verified Google identities and real visitor messages.

1. Configure `DATABASE_URL` and `DIRECT_URL`, then run `npx prisma migrate deploy` as described above.
2. In [Google Auth Platform](https://console.cloud.google.com/auth/clients), configure the consent screen and create an OAuth client of type **Web application**. Add your Google account as a test user while the app is in Testing.
3. Register these exact authorized redirect URIs: `http://localhost:3000/api/auth/google/callback` and `https://www.nareshdev.space/api/auth/google/callback`. Google requires the redirect URI to match exactly; see [Google's web-server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server).
4. Save `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` privately in `.env.local`. `GUESTBOOK_SESSION_SECRET` has been generated privately for this workspace; retain it, or generate a fresh random secret of at least 32 characters for another environment. It has no `NEXT_PUBLIC` prefix.
5. Use `GUESTBOOK_ORIGIN=http://localhost:3000` locally. For production, set `GUESTBOOK_ORIGIN=https://www.nareshdev.space`. Set `VISITOR_COUNT_ENABLED=true` after database migration, then restart the dev server if necessary.
6. Verify Google sign-in, posting a message, refreshing to read it, signing out, and revisiting without an extra visitor increment. The browser cookie lasts seven days. Comments allow 1–500 characters and a 20-second cooldown per author. The guestbook lists the latest 200 comments; public responses exclude email addresses and Google IDs.

Google authorization state and PKCE protect the login callback; signed HttpOnly cookies hold the site session. POST requests require the configured portfolio origin. Database errors produce neutral responses. No Google access token is saved in localStorage or included in the return URL for the native flow.

The optional legacy external backend remains supported when `NEXT_PUBLIC_PORTFOLIO_API_URL` is set. It must implement `/api/auth/google/login`, `/api/auth/me`, `/api/comments`, and the `/auth/success?accessToken=...` return flow. That URL also controls RAG chat; the featured file-storage API is unrelated.

### Connect Spotify

1. Create a Web API app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), using your own Spotify account. Spotify currently requires development app owners to have [Premium](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).
2. Add `http://127.0.0.1:8888/callback` to the app's Redirect URIs. Spotify requires an explicit [loopback IP address](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri), so use `127.0.0.1` rather than `localhost`.
3. Save `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` privately in `.env.local`. Keep these out of chat, public variables and Git. Ensure the Spotify account you authorize is allowed in the app's Users and Access settings.
4. From this project directory, run `node scripts/connect-spotify.mjs` and open the sign-in link it prints. Authorize with your own account. The helper requests only `user-read-currently-playing` and `user-read-recently-played` using Spotify's [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow).
5. After authorization and a successful playback-access check, the helper saves `SPOTIFY_REFRESH_TOKEN` privately in `.env.local` and sets `SPOTIFY_ENABLED=true`. It preserves other integrations and uses owner-only file permissions; tokens are never printed. Restart `npm run dev`.

The existing song card shows your current song while playing and your recently played song otherwise. `SPOTIFY_ENABLED` enables Spotify independently of the global activity setting. The authorization helper listens only on your computer; it adds no public sign-in routes. To use a different local port, change `SPOTIFY_REDIRECT_URI` in `.env.local` and register that exact URI in your Spotify app.

### Docker Deployment

```bash
docker build -t next_portfolio .
docker run -p 3000:3000 next_portfolio
```

---

## 📜 Available Scripts

| Command          | Action                  |
| ---------------- | ----------------------- |
| `npm run dev`    | Development server      |
| `npm run build`  | Production build        |
| `npm run start`  | Start production server |
| `npm run lint`   | Code linting            |
| `npm run format` | Code formatting         |

---

## 🎨 Theme Configuration

- System preference detection with localStorage persistence
- Theme-aware background images and CSS variables
- Smooth transitions with `prefers-reduced-motion` support

Custom variables in `globals.css`:

```css
:root {
  /* light theme variables */
}
.dark {
  /* dark theme overrides */
}
```

---

## 🔧 Customization

### Add Projects

Edit `components/Projects/projectsData.ts` with confirmed project metadata.

### Update Tech Stack

Modify `lib/personal-content.ts` with confirmed skills.

### Social Links

Edit `lib/site.ts` for confirmed social links and optional integrations.

---

## 🌐 Deployment

### Vercel (Recommended)

Deployment is pending. Use your own project and the account configuration in [PERSONALIZATION.md](PERSONALIZATION.md) when ready.

### Other Platforms

- Netlify
- Railway
- AWS Amplify
- Self-hosted (Node.js/Docker)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 📬 Contact

**Naresh Tiwari** - Software Developer

- [Website](https://www.nareshdev.space/)
- [Email](mailto:nareshtiwarilog@gmail.com)
- [LeetCode](https://leetcode.com/u/tnaresh/)
- [Twitter/X](https://x.com/NareshTiwai)
- [GitHub](https://github.com/Nareshtiwari74)

### Google Meet call booking

The existing Book a call button supports a Google Calendar appointment booking-page link through `NEXT_PUBLIC_BOOKING_URL`. Create an appointment schedule in Google Calendar, choose Google Meet as the conferencing location, and copy the schedule's public booking-page link. Save it as `NEXT_PUBLIC_BOOKING_URL` in `.env.local` and in the hosting environment before a future deployment. The button opens the booking page in a new tab using its original styling and hover animation. The footer heading remains unchanged. Booking links take precedence over the optional legacy Cal.com event path. Until a booking link is supplied, the existing email fallback remains; Google guestbook OAuth credentials do not grant calendar scheduling access.
