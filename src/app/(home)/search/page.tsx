export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { query, categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <HydrateClient>
        <SearchView query={query} categoryId={categoryId} />
      </HydrateClient>
    </div>
  );
};

export default Page;
