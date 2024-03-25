import React, { useEffect, useState } from 'react'
import { Card } from '@anesok/components/ui/card'
import Image from 'next/image'
import { Input } from '@anesok/components/ui/input'
import { Button } from '@anesok/components/ui/button'
import SSObutton from './SSObutton'
import { SignInParams, signInSchema } from '@anesok/server/module/auth/auth.schema'
import { Password } from '../ui/password'
import { useSignIn } from "@clerk/nextjs";
import { parse } from 'valibot'
import { useRouter } from 'next/router'
import Loading from '../ui/loading'
import Link from 'next/link'

export default function SignInForm() {
  const [credentials,setCredentials] = useState<SignInParams>({email:'',password:''})
  const [disable,setDisable] = useState(true)
  const [isLoading,setIsLoading] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn();
  const {push} = useRouter()

  const TextContent = {
    title:'انيسُك',
    subTitle:[
      'مرحباً بك في روبرت الدردشة ','انيسُك  ','مساحتك الآمنة للعناية بالصحة النفسية ',
    ],
    emailPlaceholder:'بريدك الإلكتروني ...',
    passwordPlaceholder:'كلمة المرور … ',
    signIn:'تسجيل الدخول ',
    noAccont:'ليس لديك حساب؟  انشئ حساب جديد من هنا'
  }

  useEffect(()=>{
    try{
      parse(signInSchema,credentials)
      setDisable(false)
    }catch{
      setDisable(true)
    }
  },[credentials])

  const handleSignIn = async()=>{
    if(!isLoaded)return

    setIsLoading(true)

    try {
      const result = await signIn?.create({
        identifier: credentials.email,
        password:credentials.password,
      });
 
      if (result?.status === "complete") {
        console.log(result);
        if(!setActive)return
        await setActive({ session: result.createdSessionId });
        push("/getting-start")
      }else {
        /*Investigate why the sign-in hasn't completed */
        console.log(result);
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage)
    }
    setIsLoading(false)

  }


  return (
    <Card className='w-full h-svh flex items-center'>
      <div className='w-full flex items-center justify-center'>
      <div className='max-w-lg  px-6  space-y-3'>
        <h1 className='text-3xl sm:text-6xl font-tajawal font-bold text-primary pb-4'>{TextContent.title}</h1>
        {TextContent.subTitle.map((content,index)=><span key={content} className={`text-xl sm:text-2xl font-almarai ${index==1 && 'text-primary'}`}>{content}</span>)}
        <div className='flex items-center  justify-center gap-x-8 py-8'>
          <SSObutton sso='facebook'/>
          <SSObutton sso='google'/>
          <SSObutton sso='tiktok'/>
        </div>
        <Input value={credentials.email} onChange={(email)=>setCredentials(prevs=>({...prevs,email:email.target.value}))} placeholder={TextContent.emailPlaceholder}/>
        <Password value={credentials.password} onChange={(password)=>setCredentials(prevs=>({...prevs,password:password.target.value}))} placeholder={TextContent.passwordPlaceholder}/>
        <Button onClick={handleSignIn} disabled={disable} className='w-full'>
          {isLoading ? <Loading withText={true}/>:TextContent.signIn}
          </Button>
          <div className='w-full flex justify-center'>
          <Link className='text-xs text-center font-tajawal underline text-blue-500' href={`/sign-up`}>{TextContent.noAccont}</Link>
          </div>
      </div>
      </div>
      <div className='hidden sm:flex items-center justify-center w-full h-screen bg-slate-800'>
      <Image width={300} height={300} className=' w-4/6' src={`/illustrations/ai-doctor.png`} alt='ai_doctor_img'/>
      </div>
    </Card>
  )
}
