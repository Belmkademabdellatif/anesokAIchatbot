import { TRPCError } from "@trpc/server";
import { SendMessageParams } from "./message.schema";
import { db } from "@anesok/server/db";
import { messagesTable } from "@anesok/schema";


export const sendMessageHandler = async(params:SendMessageParams)=>{
    try{
        const {userId,content,conversationId,isAI} = params
        const newMessage = await db.insert(messagesTable).values({
            userId,
            conversationId,
            content,
            isAI
        }).returning({
            id: messagesTable.id,
            userId:messagesTable.userId,
            content: messagesTable.content,
            conversationId: messagesTable.conversationId,
            isAI: messagesTable.isAI,
            createdAt:messagesTable.createdAt
          })

        if(newMessage[0]==undefined) throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
        return newMessage[0]

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type GetOneMessage = Awaited<ReturnType<typeof sendMessageHandler>>