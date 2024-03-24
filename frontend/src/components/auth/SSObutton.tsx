import { cn } from "@anesok/utils/tailwindHelper"
import React from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { useSignIn } from "@clerk/nextjs"

type ButtonAttributes = {
    sso:'google'|'facebook'|'tiktok'
} & React.HTMLAttributes<HTMLButtonElement>

const SSObutton = React.forwardRef<
  HTMLButtonElement,
  ButtonAttributes
>(({ className,sso, ...props }, ref) => {
  // const {signIn} = useSignIn()
  // const signInWithGoogle = () =>
  //   signIn?.authenticateWithRedirect({
  //     strategy: `oauth_${sso}`,
  //     redirectUrl: '/sso-callback',
  //     redirectUrlComplete: '/'
  //   });


  return<Button
    variant={'secondary'}
    ref={ref}
    // onClick={signInWithGoogle}
    className={cn("w-fit h-fit flex flex-col p-2", className)}
    {...props}
  >
    <Image width={40} height={40} alt="sso_img" src={`/icons/${sso}.svg`}/>
  </Button>
})
SSObutton.displayName = "SSObutton"

export default SSObutton
