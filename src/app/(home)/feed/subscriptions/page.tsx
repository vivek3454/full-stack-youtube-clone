export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import { SubscriptionsView } from "@/modules/home/ui/views/subscriptions-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <HydrateClient>
        <SubscriptionsView />
      </HydrateClient>
    </div>
  );
};

export default Page;
