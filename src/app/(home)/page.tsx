import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.hello.prefetch({ text: "Vivek" });

  return (
    <div>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <PageClient />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
