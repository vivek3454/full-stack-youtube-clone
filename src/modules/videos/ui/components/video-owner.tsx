import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";

interface VideOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideOwnerProps) => {
  const { userId,isLoaded } = useAuth();
  const {isPending,onClick} = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId:videoId
  });

  return (
    <div className="flex items-center sm:items-start justify-baseline sm:justify-start gap-3 min-w-0">
      <Link prefetch href={`/user/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button variant="secondary" className="rounded-full">
          <Link prefetch href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};
