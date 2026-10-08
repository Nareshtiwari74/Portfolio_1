import { createMemoryCache } from "@/lib/memoryCache";
import { API_BASE_URL } from "@/lib/site";

/**
 * Guestbook transport. Everything that talks to the comments backend — token
 * storage, auth, reads, writes — lives here so the component is left holding
 * only UI state.
 */

const GUESTBOOK_URL = API_BASE_URL;
const USE_EXTERNAL_BACKEND = Boolean(API_BASE_URL);

const STORAGE_NAMESPACE = `nareshPortfolio:${API_BASE_URL || "unconfigured"}`;
const TOKEN_KEY = `${STORAGE_NAMESPACE}:accessToken`;
const RETURN_PATH_KEY = `${STORAGE_NAMESPACE}:returnPath`;
export const OAUTH_TOKEN_PARAM = "accessToken";

export interface GuestbookUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  googleId: string;
}

export interface GuestbookComment {
  id: string;
  name: string;
  content: string;
  avatar: string;
  date: string;
}

const commentsCache = createMemoryCache<GuestbookComment[]>(60_000);

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const consumeReturnPath = () => {
  const returnPath = localStorage.getItem(RETURN_PATH_KEY) || "/";
  localStorage.removeItem(RETURN_PATH_KEY);
  return returnPath;
};

const authHeaders = (): Record<string, string> => {
  if (!USE_EXTERNAL_BACKEND) return {};
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Google OAuth hands the token back on the query string. Consume it once on
 * mount and strip it from the URL so a refresh doesn't re-import a stale token.
 */
export const consumeTokenFromUrl = () => {
  if (!USE_EXTERNAL_BACKEND) return;
  const token = new URLSearchParams(window.location.search).get(
    OAUTH_TOKEN_PARAM,
  );
  if (!token) return;
  setToken(token);
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const startLogin = () => {
  if (USE_EXTERNAL_BACKEND)
    localStorage.setItem(RETURN_PATH_KEY, window.location.pathname);
  window.location.href = `${GUESTBOOK_URL}/api/auth/google/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
};

/** Returns the signed-in user, or `null` when there is no valid session. */
export async function fetchCurrentUser(): Promise<GuestbookUser | null> {
  if (USE_EXTERNAL_BACKEND && !getToken()) return null;

  try {
    const res = await fetch(`${GUESTBOOK_URL}/api/auth/me`, {
      headers: authHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401 && USE_EXTERNAL_BACKEND) clearToken();
      return null;
    }

    const data = await res.json();
    if (USE_EXTERNAL_BACKEND && data.accessToken) setToken(data.accessToken);
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Returns the comment list, or `null` when it could not be loaded. */
export async function fetchComments(): Promise<GuestbookComment[] | null> {
  const cached = commentsCache.get();
  if (cached) return cached;

  try {
    const res = await fetch(`${GUESTBOOK_URL}/api/comments`, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    if (!res.ok) return null;

    const body = await res.json();
    if (!Array.isArray(body?.comments)) return null;
    const list: GuestbookComment[] = body.comments;
    commentsCache.set(list);
    return list;
  } catch {
    return null;
  }
}

/**
 * Posts a comment and returns the stored record. Throws with a message the UI
 * can render directly; a 401 also clears the dead session.
 */
export async function postComment(content: string): Promise<GuestbookComment> {
  const res = await fetch(`${GUESTBOOK_URL}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (USE_EXTERNAL_BACKEND) clearToken();
      throw new Error("Session expired. Please sign in again.");
    }
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body?.message === "string"
        ? body.message
        : "Failed to post comment",
    );
  }

  const comment: GuestbookComment | undefined = (await res.json()).commentDb;
  if (!comment) throw new Error("Failed to post comment");
  return comment;
}

/** Keeps the cache in step after a local insert, so a remount doesn't lose it. */
export const primeCommentsCache = (comments: GuestbookComment[]) =>
  commentsCache.set(comments);

/** Native sign-in keeps its session in an HttpOnly cookie. */
export async function signOut() {
  if (USE_EXTERNAL_BACKEND) {
    clearToken();
    return;
  }
  const response = await fetch("/api/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error("Unable to sign out. Please try again.");
}

export async function fetchGuestbookAvailability(): Promise<boolean> {
  if (USE_EXTERNAL_BACKEND) return true;
  try {
    const response = await fetch("/api/guestbook/status", {
      cache: "no-store",
    });
    return response.ok && (await response.json()).enabled === true;
  } catch {
    return false;
  }
}
