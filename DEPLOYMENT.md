# Production integrations

The private `.env.local` file stays on your computer and is ignored by Git. Configure these variables in the hosting provider’s production environment. Do not upload the file or paste secret values into source code.

Use a Next.js deployment with server route support. A static host such as GitHub Pages cannot run Spotify, visitor counting, or native guestbook APIs.

## Required production settings

| Feature             | Settings                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Spotify             | `SPOTIFY_ENABLED=true`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`                                       |
| Visitors            | `VISITOR_COUNT_ENABLED=true`, pooled `DATABASE_URL`                                                                                 |
| Guestbook           | `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GUESTBOOK_SESSION_SECRET` (at least 32 characters), `GUESTBOOK_ORIGIN` |
| Database migrations | Direct `DIRECT_URL` for the same database                                                                                           |
| Booking             | Defaults to `naresh-tiwari-vfj1ak/30min`; optional `NEXT_PUBLIC_CAL_LINK` override                                                  |

Copy private values from your local configuration into the provider’s secret environment settings. The Spotify refresh token is required in addition to the client ID and secret. It must belong to the same Spotify app/account used locally.

Set `GUESTBOOK_ORIGIN` to the exact production origin, without a path. For `https://www.nareshdev.space`, register this authorized redirect URI in the Google OAuth web client:

```text
https://www.nareshdev.space/api/auth/google/callback
```

If your deployed hostname is different, use that exact hostname in both places. Sign in and submit comments through the configured origin. Keep `NEXT_PUBLIC_PORTFOLIO_API_URL` empty to use the native guestbook. Keep `NEXT_PUBLIC_BOOKING_URL` empty to use the Cal.com popup; a nonempty value overrides it.

Apply migrations to the configured database before testing:

```sh
npx prisma migrate deploy
```

Rebuild and redeploy after setting the environment variables. `NEXT_PUBLIC_*` settings are embedded during the build. Configure them for Production and, if needed, separately for Preview deployments. Google Meet conferencing and availability are managed on the Cal.com event.

## Verification after deployment

- `/api/spotify/playback`: should return a real current or recently played track when Spotify authorization and history are available. Missing configuration returns `available: false`; upstream request failures return HTTP 502. Inspect server logs for the sanitized status code.
- `/api/guestbook/status`: should return `{ "enabled": true }`.
- `/api/auth/me`: should report enabled authentication; sign in through the browser, post a comment, and reload to check persistence.
- Visitor registration is triggered by the page. Check the browser Network panel for `/api/visitors` responses and reload to verify an existing browser does not increment again. Avoid artificial registrations for deployment checks.
- Book a call should open the 30-minute calendar popup rather than email.

Missing settings and database failures intentionally show unavailable states. These must be fixed in the host configuration, rather than displaying invented activity or counts.
