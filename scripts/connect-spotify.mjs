import { randomBytes } from "node:crypto";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parse } from "dotenv";

const PROJECT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_REDIRECT = "http://127.0.0.1:8888/callback";
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];

/** Preserve other integrations and keep the Spotify refresh token private. */
async function saveConnection(projectDir, refreshToken) {
  const envPath = join(projectDir, ".env.local");
  let content = await readFile(envPath, "utf8");
  for (const [key, value] of Object.entries({
    SPOTIFY_REFRESH_TOKEN: refreshToken,
    SPOTIFY_ENABLED: "true",
  })) {
    const pattern = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=.*$`, "gm");
    const line = `${key}=${JSON.stringify(value)}`;
    if (pattern.test(content)) content = content.replace(pattern, () => line);
    else content += `${content.endsWith("\n") ? "" : "\n"}${line}\n`;
  }

  const temporaryPath = `${envPath}.spotify-${randomBytes(8).toString("hex")}.tmp`;
  try {
    await writeFile(temporaryPath, content, { mode: 0o600, flag: "wx" });
    await rename(temporaryPath, envPath);
  } finally {
    await unlink(temporaryPath).catch(() => {});
  }
}

/** Local setup only: no sign-in or token-writing routes are published. */
export async function connectSpotify({
  projectDir = PROJECT_DIR,
  fetchImpl = fetch,
  createServerImpl = createServer,
  log = console.log,
} = {}) {
  let env;
  try {
    env = parse(await readFile(join(projectDir, ".env.local"), "utf8"));
  } catch {
    throw new Error(
      "Create .env.local and add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET privately.",
    );
  }
  const clientId = env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET privately to .env.local, then run this command again.",
    );
  }

  const redirect = new URL(
    env.SPOTIFY_REDIRECT_URI?.trim() || DEFAULT_REDIRECT,
  );
  const port = Number(redirect.port);
  if (
    redirect.protocol !== "http:" ||
    redirect.hostname !== "127.0.0.1" ||
    redirect.pathname !== "/callback" ||
    redirect.search ||
    redirect.hash ||
    redirect.username ||
    redirect.password ||
    !Number.isInteger(port) ||
    port < 1024 ||
    port > 65535
  ) {
    throw new Error(
      "SPOTIFY_REDIRECT_URI must be http://127.0.0.1:PORT/callback with a port from 1024 to 65535.",
    );
  }

  const state = randomBytes(32).toString("hex");
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirect.href,
    scope: SCOPES.join(" "),
    state,
    show_dialog: "true",
  }).toString();

  let exchanging = false;
  let timeout;
  let complete;
  let fail;
  const done = new Promise((resolveDone, rejectDone) => {
    complete = resolveDone;
    fail = rejectDone;
  });
  const finish = (error) => {
    clearTimeout(timeout);
    server.close(() => (error ? fail(error) : complete()));
  };
  const server = createServerImpl(async (request, response) => {
    const url = new URL(request.url, redirect.origin);
    const reply = (status, message) => {
      response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      });
      response.end(message);
    };
    if (request.method !== "GET" || url.pathname !== "/callback") {
      reply(404, "Not found");
      return;
    }
    if (url.searchParams.get("state") !== state) {
      reply(
        400,
        "Invalid sign-in state. Use the sign-in link from the terminal.",
      );
      return;
    }
    if (exchanging) {
      reply(409, "Sign-in is already being processed.");
      return;
    }
    if (url.searchParams.has("error")) {
      reply(
        400,
        "Spotify authorization was declined. You can run the setup again.",
      );
      finish(
        new Error(
          "Spotify authorization was declined; credentials were not changed.",
        ),
      );
      return;
    }
    const code = url.searchParams.get("code");
    if (!code) {
      reply(400, "Missing authorization code.");
      return;
    }
    exchanging = true;

    try {
      const tokenResponse = await fetchImpl(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirect.href,
          }),
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!tokenResponse.ok) {
        throw new Error(
          `Spotify token exchange failed (HTTP ${tokenResponse.status}). Check the app credentials and exact redirect URI, then run setup again.`,
        );
      }
      const tokens = await tokenResponse.json();
      const granted = new Set(tokens.scope?.split(" "));
      if (
        typeof tokens.access_token !== "string" ||
        !tokens.access_token ||
        typeof tokens.refresh_token !== "string" ||
        !tokens.refresh_token ||
        !SCOPES.every((scope) => granted.has(scope))
      ) {
        throw new Error(
          "Spotify did not grant the required playback permissions. Run setup again and approve both scopes.",
        );
      }
      const playback = await fetchImpl(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (playback.status !== 200 && playback.status !== 204) {
        throw new Error(
          `Spotify rejected playback access (HTTP ${playback.status}). Check your app's user allowlist and the app owner's Premium subscription, then run setup again.`,
        );
      }

      await saveConnection(projectDir, tokens.refresh_token);
      reply(
        200,
        "Spotify connected. You can close this tab and restart your portfolio's development server.",
      );
      log(
        "Spotify connected. The refresh token was saved privately in .env.local; other integrations were preserved. Restart npm run dev.",
      );
      finish();
    } catch (error) {
      reply(
        502,
        "Spotify setup failed. See the terminal for next steps; you can run setup again.",
      );
      // Do not print fetch errors, response bodies or tokens.
      finish(
        new Error(
          error instanceof Error && error.message.startsWith("Spotify ")
            ? error.message
            : "Spotify setup failed. Check your connection and try again; credentials were not changed.",
        ),
      );
    }
  });

  await new Promise((resolveListening, rejectListening) => {
    server.once("error", () =>
      rejectListening(
        new Error(
          `Could not listen on 127.0.0.1:${port}. Free this port or change SPOTIFY_REDIRECT_URI and your app's matching redirect URI.`,
        ),
      ),
    );
    server.listen(port, "127.0.0.1", resolveListening);
  });
  timeout = setTimeout(
    () => finish(new Error("Spotify sign-in timed out. Run setup again.")),
    10 * 60_000,
  );
  log(`Register this exact redirect URI in Spotify: ${redirect.href}`);
  log(
    `Open this link and authorize with your own Spotify account:\n${authorizeUrl.href}`,
  );
  await done;
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  connectSpotify().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
