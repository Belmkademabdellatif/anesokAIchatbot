import { cn } from "@anesok/utils/tailwindHelper"
import React from "react"
import { Button } from "../ui/button"
import Image from "next/image"

type ButtonAttributes = {
    sso:'google'|'facebook'|'tiktok'
} & React.HTMLAttributes<HTMLButtonElement>

const SSObutton = React.forwardRef<
  HTMLButtonElement,
  ButtonAttributes
>(({ className,sso, ...props }, ref) => {
  
  return<Button
    variant={'secondary'}
    ref={ref}
    className={cn("w-fit h-fit flex flex-col p-2", className)}
    {...props}
  >
    <Image width={40} height={40} alt="sso_img" src={`/icons/${sso}.svg`}/>
  </Button>
})
SSObutton.displayName = "SSObutton"

export default SSObutton
