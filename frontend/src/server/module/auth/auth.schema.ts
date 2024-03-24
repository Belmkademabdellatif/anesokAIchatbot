import {object,string,minLength,email,Output, custom, maxLength} from 'valibot'

export const signInSchema = object({
    email:string([email()]),
    password:string([minLength(8)])
})

export const signUpSchema = object({
    ...signInSchema.entries,
    firstName:string([minLength(1),maxLength(20)]),
    lastName:string([minLength(1),maxLength(20)]),
})

export type SignInParams = Output<typeof signInSchema>
export type SignUpParams = Output<typeof signUpSchema>