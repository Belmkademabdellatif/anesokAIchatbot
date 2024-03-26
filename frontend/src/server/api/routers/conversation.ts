import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { createConversationSchema, getOneUserConversationListSchema } from "@anesok/server/module/coversation/conversation.schema";
import { createConversationHandler, getOneUserConversationListHandler } from "@anesok/server/module/coversation/conversation.handler";

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input((i)=>parse(createConversationSchema,i))
    .mutation(async({ input }) => {
        const newConversation = await createConversationHandler(input)
        return newConversation
    }),
oneUser:protectedProcedure
.input((i)=>parse(getOneUserConversationListSchema,i))
.query(async({ input }) => {
    const conversationList = await getOneUserConversationListHandler(input)
    return conversationList
}),
});
