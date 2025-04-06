"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PlaylistGridCard, PlaylistGridCardSkeleton } from "../components/playlist-grid-card";

export const PlaylistsSection = () => {
  return (
    <Suspense fallback={<PlaylistsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PlaylistsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistsSectionSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <PlaylistGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

const PlaylistsSectionSuspense = () => {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-10">
        {playlists.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <PlaylistGridCard key={playlist.id} data={playlist} />
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
