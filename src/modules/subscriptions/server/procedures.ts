import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ creatorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;
      const { id: userId } = ctx.user;

      if (creatorId === userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({ viewerId: userId, creatorId: creatorId })
        .returning();

      return createdSubscription;
    }),
  remove: protectedProcedure
    .input(z.object({ creatorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;
      const { id: userId } = ctx.user;

      if (creatorId === userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, userId),
            eq(subscriptions.creatorId, creatorId)
          )
        )
        .returning();

      return deletedSubscription;
    }),
});
