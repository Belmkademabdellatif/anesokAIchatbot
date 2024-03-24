import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async({ input }) => {
      // const user = await db.insert(usersTable).values({
      //   email:'faris12@yahoo.com',
      //   name:'',
      //   imgUrl:''
      // })
      return {
        greeting: `Hello ${JSON.stringify(input)}`,
      };
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.usersTable.findMany();
  }),
});
