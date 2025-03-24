import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type ComentsGetManyOutput =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];
