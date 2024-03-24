import React, { useEffect, useState } from 'react'
import { Card } from '@anesok/components/ui/card'
import Image from 'next/image'
import { Input } from '@anesok/components/ui/input'
import { Button } from '@anesok/components/ui/button'
import { SignUpParams, signUpSchema } from '@anesok/server/module/auth/auth.schema'
import { Password } from '../ui/password'
import { SignOutButton, useSignUp } from "@clerk/nextjs";
import { parse } from 'valibot'
import Loading from '../ui/loading'
import VerifyEmailForm from './VerifyEmailForm'

export default function SignUpForm() {
  const [credentials,setCredentials] = useState<SignUpParams>({email:'',password:'',firstName:'',lastName:''})
  const [disable,setDisable] = useState(true)
  const [isLoading,setIsLoading] = useState(false)
  const [showVerification,setShowVerification] = useState(false)
  const { isLoaded, signUp } = useSignUp();

  const TextContent = {
    title:'انيسُك',
    subTitle:[
      'مرحباً بك في روبرت الدردشة ','انيسُك  ','مساحتك الآمنة للعناية بالصحة النفسية ',
    ],
    emailPlaceholder:'بريدك الإلكتروني ...',
    passwordPlaceholder:'كلمة المرور ... ',
    firstNamePlaceholder:'الاسم الأول...',
    lastNamePlaceholder:'الاسم الأخير...',
    signUp:'إنشاء حساب جديد',
    noAccont:'ليس لديك حساب؟  انشئ حساب جديد من هنا'
  }

  useEffect(()=>{
    try{
      parse(signUpSchema,credentials)
      setDisable(false)
    }catch{
      setDisable(true)
    }
  },[credentials])

  const handleSignIn = async()=>{
    if(!isLoaded)return

    setIsLoading(true)
     
    try {
        await signUp.create({
        emailAddress:credentials.email,
        password:credentials.password,
        firstName:credentials.firstName,
        lastName:credentials.lastName
        });
    
        // send the email.
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    
        // change the UI to our pending section.
        setShowVerification(true);
    } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
    }
    setIsLoading(false)

  }
 

  return (
    <Card className='w-full min-h-svh flex items-center'>
      <div className='w-full flex items-center justify-center'>
      {showVerification ? <VerifyEmailForm email={credentials.email}/>:<div className='max-w-lg  px-6  space-y-3'>
        <h1 className='text-3xl sm:text-6xl font-tajawal font-bold text-primary pb-4'>{TextContent.title}</h1>
        {TextContent.subTitle.map((content,index)=><span key={content} className={`text-xl sm:text-2xl font-almarai ${index==1 && 'text-primary'}`}>{content}</span>)}
        <Input value={credentials.email} onChange={(email)=>setCredentials(prevs=>({...prevs,email:email.target.value}))} placeholder={TextContent.emailPlaceholder}/>
        <Password value={credentials.password} onChange={(password)=>setCredentials(prevs=>({...prevs,password:password.target.value}))} placeholder={TextContent.passwordPlaceholder}/>
        <Input value={credentials.firstName} onChange={(firstName)=>setCredentials(prevs=>({...prevs,firstName:firstName.target.value}))} placeholder={TextContent.firstNamePlaceholder}/>
        <Input value={credentials.email} onChange={(lastName)=>setCredentials(prevs=>({...prevs,lastName:lastName.target.value}))} placeholder={TextContent.lastNamePlaceholder}/>
        <SignOutButton/>
        <Button onClick={handleSignIn} disabled={disable} className='w-full'>
          {isLoading ? <Loading withText={true}/>:TextContent.signUp}
          </Button>
      </div>}
      </div>
      <div className='hidden sm:flex items-center justify-center w-full h-screen bg-slate-800'>
      <Image width={300} height={300} className=' w-4/6' src={`/illustrations/ai-doctor.png`} alt='ai_doctor_img'/>
      </div>
    </Card>
  )
}
