import {object,string,minLength,email,Output, custom} from 'valibot'

export const signInSchema = object({
    email:string([email()]),
    password:string([minLength(8)])
})

export const signUpSchema = object({
    ...signInSchema.entries,
    confirmPassword:string([minLength(8)]),
},
[
    custom(
      ({ password, confirmPassword }) => password === confirmPassword,
      'The passwords do not match.'
    ),
])

export type SignInParams = Output<typeof signInSchema>
export type SignUpParams = Output<typeof signUpSchema>