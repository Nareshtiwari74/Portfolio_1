"use client";

import { Suspense, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import posthog from "posthog-js";

import {
  consumeReturnPath,
  OAUTH_TOKEN_PARAM,
  setToken,
} from "@/lib/guestbook";
import { API_BASE_URL } from "@/lib/site";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get(OAUTH_TOKEN_PARAM);
    if (!API_BASE_URL || !accessToken) {
      router.replace("/guestbook");
      return;
    }
    setToken(accessToken);

    posthog.capture("auth_login_completed");

    // Determine where to redirect back
    const returnPath = consumeReturnPath();

    // Redirect back to the intended destination at the comments section
    router.replace(`${returnPath}#comments`);
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Completing sign-in...</h2>
        <p className="text-muted-foreground mt-2">Redirecting you back...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
