import { TRPCError } from "@trpc/server";
import {
  GetOneConversationMessageListParams,
  SendMessageParams,
} from "./message.schema";
import { db } from "@anesok/server/db";
import { messagesTable } from "@anesok/schema";
import { and, asc, count, desc, eq, gt, lt } from "drizzle-orm";

export const sendMessageHandler = async (params: SendMessageParams) => {
  try {
    const { userId, content, conversationId, isAI } = params;
    const newMessage = await db
      .insert(messagesTable)
      .values({
        userId,
        conversationId,
        content,
        isAI,
      })
      .returning({
        id: messagesTable.id,
        userId: messagesTable.userId,
        content: messagesTable.content,
        conversationId: messagesTable.conversationId,
        isAI: messagesTable.isAI,
        createdAt: messagesTable.createdAt,
      });

    if (newMessage[0] == undefined)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return newMessage[0];
  } catch (err) {
    console.log(err);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
};

export const getOneConversationMessageListHandler = async (
  params: GetOneConversationMessageListParams
) => {
  try {
    console.log('getOneConversationMessageListHandler')
    const { conversationId, page, range, newestDate, oldestDate } = params;

    const condition = () => {
      return and(
        eq(messagesTable.conversationId, conversationId),
        oldestDate != undefined
          ? lt(messagesTable.createdAt, oldestDate)
          : undefined,
        newestDate != undefined
          ? gt(messagesTable.createdAt, newestDate)
          : undefined
      );
    };

    const length = await db
      .select({ count: count() })
      .from(messagesTable)
      .where(condition());

    const messageList = await db.query.messagesTable.findMany({
      where: condition(),
      limit: newestDate != undefined ? undefined : range,
      offset: newestDate != undefined ? 0 : page > 0 ? (page - 1) * range : 0,
      orderBy: desc(messagesTable.createdAt),
      columns: {
        id: true,
        userId: true,
        content: true,
        conversationId: true,
        isAI: true,
        createdAt: true,
      },
    });

    return {
      messageList,
      pageNumber:
        length[0]?.count ?? 0 > 0
          ? Math.ceil(length[0]?.count ?? 0 / range)
          : 0,
    };
  } catch (err) {
    console.log(err);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
};

export type GetOneMessage = Awaited<ReturnType<typeof sendMessageHandler>>;