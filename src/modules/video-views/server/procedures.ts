import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      console.log("test video view create 1");

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId))
        );

        
        if (existingVideoView) {
          return existingVideoView;
        }
        
        console.log("test video view create 2");
      const [createVideoView] = await db
        .insert(videoViews)
        .values({ userId, videoId })
        .returning();

      console.log("test video view create 3");

      return createVideoView;
    }),
});
