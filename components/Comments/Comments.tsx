"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { PinIcon } from "lucide-react";
import posthog from "posthog-js";

import { formatDate } from "@/lib/formatDate";
import {
  consumeTokenFromUrl,
  fetchComments,
  fetchGuestbookAvailability,
  fetchCurrentUser,
  type GuestbookComment,
  type GuestbookUser,
  postComment,
  primeCommentsCache,
  startLogin,
  signOut,
} from "@/lib/guestbook";

import Avatar from "./Avatar";
import GoogleMark from "./GoogleMark";

const COMMENTS_PER_PAGE = 10;
/** How many comments the inline (home page) version shows before linking out. */
const PREVIEW_COUNT = 3;
/** Not a DB field: comments by this author are pinned by name match. */
const PINNED_AUTHOR: string | null = null;

const isPinned = (comment: GuestbookComment) =>
  PINNED_AUTHOR !== null && comment.name === PINNED_AUTHOR;

interface CommentsProps {
  showAll?: boolean;
  hideHeader?: boolean;
}

const Comments = ({ showAll = false, hideHeader = false }: CommentsProps) => {
  const [loginAvailable, setLoginAvailable] = useState(false);
  const [currentUser, setCurrentUser] = useState<GuestbookUser | null>(null);
  const [comments, setComments] = useState<GuestbookComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsUnavailable, setCommentsUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    consumeTokenFromUrl();
    const authFailed = new URLSearchParams(window.location.search).has(
      "authError",
    );

    (async () => {
      const [user, list, available] = await Promise.all([
        fetchCurrentUser(),
        fetchComments(),
        fetchGuestbookAvailability(),
      ]);
      if (cancelled) return;
      if (authFailed) {
        setError("Google sign-in could not be completed. Please try again.");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.hash,
        );
      }
      setLoginAvailable(available);
      setCurrentUser(user);
      setComments(list ?? []);
      setCommentsUnavailable(list === null);
      setLoading(false);

      // Identify the returning user so their session stays linked
      if (user) {
        posthog.identify(user.id, {
          name: user.name,
          email: user.email,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      posthog.capture("guestbook_signed_out");
      posthog.reset();
      setCurrentUser(null);
      setError(null);
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setSubmitting(true);
    setError(null);

    try {
      const comment = await postComment(content);
      setComments((prev) => {
        const next = [comment, ...prev];
        primeCommentsCache(next);
        return next;
      });
      setNewComment("");
      posthog.capture("guestbook_comment_submitted", {
        comment_length: content.length,
      });
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Session expired")) {
        setCurrentUser(null);
      }
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      posthog.captureException(err instanceof Error ? err : new Error(message));
    } finally {
      setSubmitting(false);
    }
  };

  // Pinned comments float to the top; the sort is stable, so everything else
  // keeps the order the API returned.
  const orderedComments = [...comments].sort(
    (a, b) => Number(isPinned(b)) - Number(isPinned(a)),
  );
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const displayedComments = showAll
    ? orderedComments.slice(
        (currentPage - 1) * COMMENTS_PER_PAGE,
        currentPage * COMMENTS_PER_PAGE,
      )
    : orderedComments.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="comments"
      className={`${hideHeader ? "" : "mt-15"} mx-auto w-full max-w-200 scroll-mt-24 px-8 md:px-0`}
    >
      {!hideHeader && (
        <>
          <h2 className="text-content-muted mb-2 text-sm font-semibold">
            Guestbook
          </h2>
          <h2 className="mb-6 text-3xl font-bold">Leave a message</h2>
        </>
      )}

      <div className="border-line bg-surface rounded-2xl border p-6">
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
            <p className="text-content-secondary">
              {loginAvailable
                ? "Sign in to leave a comment on my guestbook!"
                : "The guestbook is currently unavailable."}
            </p>
            <button
              disabled={!loginAvailable}
              onClick={() => {
                posthog.capture("guestbook_login_started");
                startLogin();
              }}
              className="btn-chunky border-line-strong text-content flex cursor-pointer items-center gap-2 rounded-md border py-2 ps-3.5 pe-4 text-sm font-medium"
            >
              <GoogleMark />
              Sign in with Google
            </button>
            {error && <p className="text-danger-content text-sm">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={currentUser.picture}
                  alt={currentUser.name}
                  size={32}
                />
                <div>
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-content-muted text-xs">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-content-muted hover:text-danger-content text-xs transition-[color,scale] duration-150 ease-out active:scale-[0.96]"
              >
                Sign out
              </button>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What's on your mind?..."
              className="border-line bg-surface-subtle focus:border-line-strong w-full resize-none rounded-lg border p-3 text-sm focus:outline-none"
              rows={3}
              maxLength={500}
            />
            {error && <p className="text-danger-content text-sm">{error}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="btn-chunky-primary border-line-inverted flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="border-line-inverted h-6 w-6 animate-spin rounded-full border-b-2" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-content-muted text-center">
            {commentsUnavailable
              ? "Guestbook messages are currently unavailable."
              : "No comments yet. Be the first to leave one!"}
          </p>
        ) : (
          <>
            {displayedComments.map((comment) => (
              <div key={comment.id} className="group flex w-full gap-4">
                <div className="flex-shrink-0 pt-1">
                  <Avatar
                    pinned={isPinned(comment)}
                    src={comment.avatar}
                    alt={comment.name}
                    size={40}
                    className="shadow-sm"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-content font-semibold">
                      {comment.name}
                      {isPinned(comment) && (
                        <PinIcon className="text-content-muted ml-2 inline size-4 rotate-18" />
                      )}
                    </span>
                    <span className="text-content-muted text-xs">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <div className="border-line bg-surface-subtle/50 group-hover:bg-surface-raised/50 w-full rounded-2xl rounded-tl-sm border p-4 transition-colors">
                    <p className="text-content-secondary text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {!showAll && comments.length > PREVIEW_COUNT && (
              <div className="mt-4 flex justify-center">
                <Link
                  href="/guestbook"
                  className="text-content-secondary hover:text-content text-sm font-medium transition-colors"
                >
                  View all {comments.length} comments →
                </Link>
              </div>
            )}

            {showAll && totalPages > 1 && (
              <div className="border-line mt-8 flex items-center justify-between border-t pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-content-secondary hover:bg-surface-raised flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-[background-color,scale] duration-150 ease-out enabled:active:scale-[0.96] disabled:opacity-50"
                >
                  ← Previous
                </button>
                <div className="text-content-muted text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="text-content-secondary hover:bg-surface-raised flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-[background-color,scale] duration-150 ease-out enabled:active:scale-[0.96] disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="h-10" />
    </section>
  );
};

export default Comments;
