import { Output, boolean, maxLength, minLength, number, object, string } from "valibot";

export const sendMessageSchema = object({
    userId:string(),
    conversationId:number(),
    content:string([minLength(2),maxLength(200)]),
    isAI:boolean()
})


export type SendMessageParams = Output<typeof sendMessageSchema>
