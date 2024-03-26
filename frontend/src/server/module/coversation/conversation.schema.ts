import { Output, object, string } from "valibot";
import { commonPaginationSchema } from "../common/common.schema";

export const createConversationSchema = object({
    userId:string()
})


export const getOneUserConversationListSchema = object({
    userId:string(),
    ...commonPaginationSchema.entries
})

export type CreateConversationParams = Output<typeof createConversationSchema>
export type GetOneUserConversationListParams = Output<typeof getOneUserConversationListSchema>