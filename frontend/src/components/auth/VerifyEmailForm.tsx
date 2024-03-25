import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@anesok/components/ui/input-otp";
import { Button } from "../ui/button";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Loading from "@anesok/components/ui/loading";

export default function VerifyEmailForm({email}:{email:string}) {
  const [code, setCode] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const {isLoaded,signUp,setActive} = useSignUp()
  const {push} = useRouter()



  const handleCodeVerification = async () => {

    if (!isLoaded) {
      return;
    }
 
    setIsLoading(true)
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        push("/getting-start");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
    setIsLoading(false)
  };

  const TextContent = {
    title:'تأكيد الحساب',
    descritpion:`لقد تم بعث كود التحقق على بريدك الإلكتروني : ${email}`,
  }
  return (
    <div className=" space-y-8 text-center px-8">
        <h1 className="text-3xl text-primary">{TextContent.title}</h1>
        <p className="text-sm">{TextContent.descritpion}</p>
      <div dir="ltr" className="w-full flex  justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button onClick={handleCodeVerification} disabled={code.length!=6} className="w-full">
        {isLoading ? <Loading withText={true}/>: TextContent.title}
        </Button>
    </div>
  );
}
