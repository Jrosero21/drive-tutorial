"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const SuspendedPostHogPageView = dynamic(() => import("./pageview-tracker"), {
  ssr: false,
});

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Missing NEXT_PUBLIC_POSTHOG_KEY");
      }
      return;
    }

    const apiHost =
      process.env.NODE_ENV === "development" ? "/ingest" : "https://us.posthog.com";

    posthog.init(key, {
      api_host: apiHost,
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}
