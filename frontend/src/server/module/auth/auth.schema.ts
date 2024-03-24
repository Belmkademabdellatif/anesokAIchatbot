import {object,string,minLength,email,Output} from 'valibot'

export const signInSchema = object({
    email:string([email()]),
    password:string([minLength(8)])
})

export type SignInParams = Output<typeof signInSchema>