import { TRPCError } from "@trpc/server";
import {
  CreateConversationParams,
  GetOneUserConversationListParams,
} from "./conversation.schema";
import { db } from "@anesok/server/db";
import { conversationsTable, messagesTable } from "@anesok/schema";
import { and, asc, count, desc, eq, gt } from "drizzle-orm";
import { GetOneMessage } from "../message/message.handler";

export const createConversationHandler = async (
  params: CreateConversationParams
) => {
  try {
    const { userId, content, isAI } = params;

    const newConversation = await db
      .insert(conversationsTable)
      .values({
        userId,
      })
      .returning({
        id: conversationsTable.id,
        userId: conversationsTable.userId,
        createdAt:conversationsTable.createdAt,
        updatedAt:conversationsTable.updatedAt,
      });

    if(newConversation[0]==undefined)throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})

    const result = {
      conversation: {
        ...newConversation[0],
        messageList: [] as GetOneMessage[],
      },
    };

    if (!!content) {
      const newMessage = await db
        .insert(messagesTable)
        .values({
          content,
          userId,
          isAI,
          conversationId: newConversation.at(0)?.id ?? -1,
        })
        .returning({
          id: messagesTable.id,
          userId:messagesTable.userId,
          content: messagesTable.content,
          conversationId: messagesTable.conversationId,
          isAI: messagesTable.isAI,
          createdAt:messagesTable.createdAt
        });

        const message = newMessage[0]
        if(message==undefined)throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
      result.conversation.messageList.push(message);
      return result;
    }

    return result;
  } catch (err) {
    console.log(err);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
};

export const getOneUserConversationListHandler = async (
  params: GetOneUserConversationListParams
) => {
  try {
    const { userId, page, range, createdAt } = params;

    const length = await db
      .select({ count: count() })
      .from(conversationsTable)
      .where(
        createdAt != undefined
          ? and(
              eq(conversationsTable.userId, userId),
              gt(conversationsTable.createdAt, createdAt)
            )
          : eq(conversationsTable.userId, userId)
      );

    const conversationList = await db.query.conversationsTable.findMany({
      where:
        createdAt != undefined
          ? and(
              eq(conversationsTable.userId, userId),
              gt(conversationsTable.createdAt, createdAt)
            )
          : eq(conversationsTable.userId, userId),
      limit:createdAt != undefined ? undefined:range,
      offset: createdAt != undefined ? 0 : page > 0 ? (page - 1) * range : 0,
      orderBy: desc(conversationsTable.createdAt),
      columns:{
        id: true,
        userId: true,
        createdAt:true,
        updatedAt:true,
      },
      with: {
        messageList: {
          limit: 1,
          orderBy: asc(messagesTable.createdAt),
          columns: {
            id: true,
            userId: true,
            isAI: true,
            createdAt: true,
            conversationId:true,
            content: true,
          },
        },
      },
    });

    return {
      conversationList,
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

export type GetOneUserConversationList = Awaited<
  ReturnType<typeof getOneUserConversationListHandler>
>;

// const getOneConversationMessageListHandler = async (params:type) => {

// }

