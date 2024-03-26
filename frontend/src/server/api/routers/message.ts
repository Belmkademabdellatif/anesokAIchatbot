import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { sendMessageHandler } from "@anesok/server/module/message/message.handler";
import { sendMessageSchema } from "@anesok/server/module/message/message.schema";

export const messageRouter = createTRPCRouter({
  send: protectedProcedure
  .input(i=>parse(sendMessageSchema,i))
  .mutation(async({ input }) => {
      const newMessage = await sendMessageHandler(input)
      return newMessage;
    }),
});
