import { TRPCError } from "@trpc/server"
import { CreateConversationParams, GetOneUserConversationListParams } from "./conversation.schema"
import { db } from "@anesok/server/db"
import { conversationsTable, messagesTable } from "@anesok/schema"
import { count, desc, eq, sql } from "drizzle-orm"


export const createConversationHandler = async(params:CreateConversationParams)=>{
    try{
        const {userId} = params

        const newConversation = await db.insert(conversationsTable).values({
            userId
        }).returning({
            id:conversationsTable.id,
            userId:conversationsTable.userId,
        })

        return newConversation

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserConversationListHandler = async (params:GetOneUserConversationListParams) => {
    try{
        const {userId,page,range} = params

        const length = await db.select({count:count()}).from(conversationsTable).where(eq(conversationsTable.userId,userId))

        const conversationList = await db.query.conversationsTable.findMany({
            where:eq(conversationsTable.userId,userId),
            limit:range,
            offset:page>0?(page-1)*range:0,
            orderBy:desc(conversationsTable.createdAt),
            with:{
                messageList:{
                    limit:1,
                    orderBy:desc(messagesTable.createdAt),
                    columns:{
                        content:true
                    }
                }
            },
        })

        return {conversationList,pageNumber:length[0]?.count??0>0 ?Math.ceil(length[0]?.count??0/range):0}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

// const getOneConversationMessageListHandler = async (params:type) => {
    
// }


export type GetOneUserConversationList = Awaited<ReturnType<typeof getOneUserConversationListHandler>>