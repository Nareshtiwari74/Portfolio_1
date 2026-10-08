# Naresh Tiwari portfolio configuration

The layout, themes, fonts, spacing, animations and responsive behaviour are preserved. Identity and social URLs are defined in `lib/site.ts`; introduction and skills are defined in `lib/personal-content.ts`.

## Confirmed content

- Name: Naresh Tiwari. Role: Software Developer. Hero greeting: I’m Naresh.
- Introduction: I build backend systems and full-stack applications using Java, Spring Boot, React, and SQL, with a strong focus on REST APIs, Performance, and User Experience.
- Full tech stack: Java, Python, JavaScript, SQL, Kotlin, Bash, React, HTML5, CSS3, Spring Boot, Spring Security, Hibernate, FastAPI, PostgreSQL, MySQL, MongoDB, Redis, Kafka, Docker, Kubernetes, Git, GitHub, Linux, Jenkins, Postman, Swagger.
- Zynkly — AI/ML Engineer Intern, Apr–Jul 2026, Jalandhar. Supplied KYC, prototype presentation and LLM workflow highlights are stored in `components/Experience/experienceData.tsx`.
- Mphasis — Software Development Intern, Jan–Apr 2026, Pune. Supplied REST API, database, validation and Agile highlights are stored in the same file.
- Distributed File Storage System: Secure File Storage; upload, manage and securely access files, with deduplication to reduce storage usage. Live: https://storage.nareshdev.space. API: https://api1.nareshdev.space. Code: https://github.com/Nareshtiwari74/distributed-file-storage.
- Project stack: Java, Spring Boot, React, PostgreSQL, Docker. Cards show the first two and a clickable +3 to reveal the rest.
- Achievement: Top 3 among 500+ participants in the GeeksforGeeks × LPU coding contest. The supplied certificate link is in `components/Achievments/AchievmentCard.tsx`.
- Email: nareshtiwarilog@gmail.com. GitHub: https://github.com/Nareshtiwari74. LeetCode: https://leetcode.com/u/tnaresh/. X: https://x.com/NareshTiwai. Instagram: https://www.instagram.com/naresh_tiwarioff/. Portfolio: https://www.nareshdev.space/.
- Instagram is removed from the hero social row. The footer retains the confirmed account link. Social screenshots are supplied static images, not live statistics.
- Footer copyright: © 2026 Naresh Tiwari. Design provenance is documented in `CREDITS.md`.

## Supplied assets

- Résumé view/download: `public/Naresh_Tiwari_Resume.pdf`.
- Default avatar: `public/naresh-avatar.jpg`; shared OG avatar: `app/og/assets/logo.jpg`.
- Clicked avatar portrait: `public/Logo_easter.webp`, converted losslessly from the supplied PNG. The portrait is centered without the previous image zoom or top padding.
- Browser favicon: supplied orange image in `app/favicon.ico`, with RGBA PNG frames at 16, 32, 48 and 64 pixels.
- Project screenshot: `public/project-img/distributed-file-storage.png`.
- X, Instagram and LeetCode preview screenshots: `public/social-x.png`, `public/social-instagram.png` and `public/social-leetcode.png`.

## Account integrations

Secrets are stored privately in `.env.local` with owner-only permissions and must not be committed. `.env.example` lists supported settings.

- Discord/Lanyard targets numeric ID 1170972441590378551. Presence refreshes every two minutes. Offline displays OFFLINE with a gray dot; online, idle and do-not-disturb use their corresponding status. Missing or failed responses show Status unavailable.
- WakaTime is independently enabled with a private API key and Asia/Kolkata timezone. Coding time is real API data.
- Spotify is independently enabled with private OAuth credentials. Playing tracks appear as Now Playing; paused or stopped playback shows the verified last-played track. The server’s credential-scoped last-track cache lasts 24 hours. Browser refresh without available history/cache may have no previous track to show. Reauthorize if the refresh token expires.
- GitHub public PR activity targets Nareshtiwari74. Public PRs work without a token; `GITHUB_TOKEN` optionally raises request limits and enables GraphQL calendar features. Own public repository PRs appear in activity, while the external-contribution filter applies only to experience panels.
- Neon PostgreSQL is connected through private pooled `DATABASE_URL` and direct `DIRECT_URL`. All three migrations were applied. `VISITOR_COUNT_ENABLED=true` enables visitor counting independently of other activity. Registration and increment are transactional; returning browsers retain a local ID and do not create another registration. Clearing browser storage causes a new registration. Live checks confirmed persisted IDs and totals matching registrations; temporary test registrations were removed.
- Native guestbook routes handle Google login/callback, session lookup, logout and comment reads/writes. Private Google credentials, a random signing secret and `GUESTBOOK_ORIGIN=http://localhost:3000` are configured. Login redirects correctly with state, PKCE and an HttpOnly cookie. Full Google consent and authenticated posting require browser verification. Comments are 1–500 characters, with a serialized 20-second cooldown per author; the newest 200 comments are available. Public responses exclude email addresses and Google IDs.
- Google OAuth callback URLs: `http://localhost:3000/api/auth/google/callback` and `https://www.nareshdev.space/api/auth/google/callback`. Set `GUESTBOOK_ORIGIN=https://www.nareshdev.space` in a future production environment.
- The optional external guestbook/RAG backend is unset. RAG chat requires a dedicated backend and confirmed portfolio corpus; the file-storage API is unrelated.
- Book a call uses `NEXT_PUBLIC_CAL_LINK=naresh-tiwari-vfj1ak/30min` with the month-view popup. The supplied alternative is https://cal.com/naresh-tiwari-vfj1ak/15min. The 30-minute event page identifies Naresh and Google Meet. Availability and conferencing settings are managed in Cal.com. The optional Google Calendar booking-page override remains unset.
- Analytics are opt-in and must use Naresh’s own project credentials.

## Content awaiting confirmation

Education, additional projects, side projects, additional articles, testimonials, company logos and project metrics have not been supplied. Empty content collections stay empty; no personal achievements or activity are invented. Social Proof / Featured On is removed from the homepage. No historical article source, personal-asset archive or analytics report is retained. Unpublished article paths return the normal 404 response.

## Verification and publishing

Behavioral checks cover visitor deduplication, signed-cookie tampering and expiry, OAuth state/PKCE, safe redirects, comment author validation, message length, origin protection, cooldown, logout, neutral errors and native frontend session handling. Lint, TypeScript and formatting checks have passed for the integration changes. Live visitor/comment reads and the Google authorization redirect have been checked. A real authenticated browser sign-in/post still needs verification.

No push or deployment is authorized. Keep private credentials out of source control and configure the corresponding environment variables separately when publishing is later requested.

History cleanup verification: archived personal files, old article route files, historical reports and unused OG PNG were deleted. The earlier production output containing outdated footer/route data was also removed; the current dev server was restarted with a fresh cache. Source searches find prior-author identity only in `CREDITS.md`. All six current portfolio pages, sitemap and llms.txt return 200 with no prior personal content. All five retired article URLs and the old résumé/avatar URLs return 404. ESLint, TypeScript and formatting pass. No Git history directory exists in this workspace.

Blog publication: the supplied article “Behind the Pay Button: Why Payment Routing and Orchestration Are Interesting” is available locally at `/blogs/behind-the-pay-button`, dated October 9, 2026. It uses the existing Article/Section/Prose/Figure layout. The two supplied diagrams are copied unchanged, displayed without cropping and labelled with explanatory captions. Figure 1 identifies the diagram’s Juspay layer as an example. A standalone SVG graph shows the hypothetical 900 initial successes and 960 after eligible fallback from 1,000 payments, with a zero-based axis and an explicit illustrative-data label. An SVG cover supplies the blog thumbnail. The entry appears in the blog listing, sitemap and llms.txt, with Naresh’s author schema and canonical/share metadata. Runtime checks verify all pages and assets; lint and TypeScript pass. No deployment or push occurred.
