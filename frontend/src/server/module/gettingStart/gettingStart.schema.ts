import { object, string, minLength, Output, maxLength, union, literal, email } from "valibot";


export const gettingStartSchema = object({
    id:string(),
    firstName:string([minLength(2),maxLength(20)]),
    lastName:string([minLength(2),maxLength(20)]),
    relationShipStatus:union([literal('اعزب'), literal('متزوج'),literal('مطلق')]),
    workingStatus:union([literal('موظف'), literal('عاطل عن العمل'),literal('طالب')]),
    bestFriendShortIntro:string([minLength(2),maxLength(255)])
})

export type RelationStatus = Output<typeof gettingStartSchema.entries.relationShipStatus>
export type workingStatus = Output<typeof gettingStartSchema.entries.workingStatus>
export type GettingStartParams = Output<typeof gettingStartSchema>