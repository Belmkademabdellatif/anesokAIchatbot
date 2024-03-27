import { Output, boolean, date, minLength, number, object, optional, string } from "valibot";
import { commonPaginationSchema } from "../common/common.schema";

export const sendMessageSchema = object({
    userId:string(),
    conversationId:number(),
    content:string([minLength(2)]),
    isAI:boolean()
})

export const getOneConversationMessageListSchema = object({
    conversationId:number(),
    newestDate:optional(date()),
    oldestDate:optional(date()),
    ...commonPaginationSchema.entries
})



export type SendMessageParams = Output<typeof sendMessageSchema>
export type GetOneConversationMessageListParams = Output<typeof getOneConversationMessageListSchema>
