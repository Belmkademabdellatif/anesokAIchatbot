import {object,string,minLength} from 'valibot'

export const signInSchema = object({
    email:string(),
    password:string([minLength(8)])
})
