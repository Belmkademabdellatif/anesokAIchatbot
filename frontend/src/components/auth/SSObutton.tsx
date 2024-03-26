import { cn } from "@anesok/utils/tailwindHelper"
import React from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server"

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

  const { signIn } = useSignIn();
 
  const signInWith = () => {
    if(!signIn)return
    return signIn.authenticateWithRedirect({
      strategy:`oauth_${sso}`,
      redirectUrl: "/sso-callback",
      continueSignUp:true,
      redirectUrlComplete: "/getting-start",
    });
  };


  return<Button
    variant={'secondary'}
    ref={ref}
    onClick={()=>signInWith()}
    className={cn("w-fit h-fit flex flex-col p-2", className)}
    {...props}
  >
    <Image width={40} height={40} alt="sso_img" src={`/icons/${sso}.svg`}/>
  </Button>
})
SSObutton.displayName = "SSObutton"

export default SSObutton
