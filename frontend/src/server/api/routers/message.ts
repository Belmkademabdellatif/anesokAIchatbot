import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { getOneConversationMessageListHandler, sendMessageHandler } from "@anesok/server/module/message/message.handler";
import { getOneConversationMessageListSchema, sendMessageSchema } from "@anesok/server/module/message/message.schema";

export const messageRouter = createTRPCRouter({
  send: protectedProcedure
  .input(i=>parse(sendMessageSchema,i))
  .mutation(async({ input }) => {
      const newMessage = await sendMessageHandler(input)
      return newMessage;
    }),
  onConversation:protectedProcedure
  .input(i=>parse(getOneConversationMessageListSchema,i))
  .query(async({ input }) => {
      const messageList = await getOneConversationMessageListHandler(input)
      return messageList;
    }),
});
