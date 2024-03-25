import { object, string, minLength, Output, maxLength, union, literal, email } from "valibot";


export const gettingStartSchema = object({
    email:string([email()]),
    firstName:string([minLength(2),maxLength(20)]),
    lastName:string([minLength(2),maxLength(20)]),
    relationShipStatus:union([literal('unmarried'), literal('married'),literal('divorced')]),
    workingStatus:union([literal('employed'), literal('unemployed'),literal('student')]),
    bestFriendShortIntro:string([maxLength(255)])
})


export type GettingStartParams = Output<typeof gettingStartSchema>