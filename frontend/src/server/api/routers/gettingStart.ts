import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { gettingStartHandler } from "@anesok/server/module/gettingStart/gettingStart.handler";
import { parse } from "valibot";
import { gettingStartSchema } from "@anesok/server/module/gettingStart/gettingStart.schema";

export const gettingStartRouter = createTRPCRouter({
  gettingFirst: protectedProcedure
  .input(i=>parse(gettingStartSchema,i))
  .mutation(async({ input }) => {
      const result = await gettingStartHandler(input)
      return result;
    }),
});
