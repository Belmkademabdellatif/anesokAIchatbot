import { Output, boolean, date, maxLength, minLength, number, object, optional, string } from "valibot";
import { commonPaginationSchema } from "../common/common.schema";

export const createConversationSchema = object({
    userId:string(),
    content:optional(string([minLength(2),maxLength(200)])),
    isAI:optional(boolean())
})


export const getOneUserConversationListSchema = object({
    userId:string(),
    createdAt:optional(date()),
    ...commonPaginationSchema.entries
})

export type CreateConversationParams = Output<typeof createConversationSchema>
export type GetOneUserConversationListParams = Output<typeof getOneUserConversationListSchema>