export const dynamic = "force-dynamic";

import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  // try {
  //   await trpc.categories.getMany.prefetch();
  // } catch (error) {
  //   console.error("Prefetch failed:", error);
  // }

  return (
    <div>
      <HydrateClient>
        <HomeView categoryId={categoryId} />
      </HydrateClient>
    </div>
  );
};

export default Page;
