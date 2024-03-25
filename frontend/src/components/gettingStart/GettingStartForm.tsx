import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { GettingStartParams, gettingStartSchema } from '@anesok/server/module/gettingStart/gettingStart.schema'
import { parse } from 'valibot'
import { api } from '@anesok/utils/api'
import { Input } from '@anesok/components/ui/input'
import { Button } from '../ui/button'

// todo
export default function GettingStartForm() {
  const [form,setForm] = useState<GettingStartParams>({firstName:'',lastName:'',email:'',workingStatus:'employed',relationShipStatus:'unmarried',bestFriendShortIntro:''})
  const [disbaled,setDisabled] = useState(true)
  const {mutate,isLoading} = api.gettingStart.gettingFirst.useMutation({
    onSuccess(data, variables, context) {
        // todo...
    },
  })
  const TextContent = {
    title:['اهلاوسهلا في ','انيسُك'],
    description:'رحلتك الشخصية تبدأ هنا!',
    firstNamePlaceholder:'الاسم الاول...',
    lastNamePlaceholder:'الاسم الاخير...',
    relationShipStatus:'الحالة الاجتماعية',
    workingStatus:'الحالة المهنية',
    friendIntro:'اخبرنا عن اقرب الاصدقاء اليك ، ما هي الهوايات المشتركة بينكم...',
    confirm:'تأكيد'
  }

  useEffect(()=>{
    try{
      parse(gettingStartSchema,form)
      setDisabled(false)
    }catch{
      setDisabled(true)
    }
  },[form])

  return (
    <div className='w-full min-h-screen flex items-center justify-center px-6'>
      <Card className='p-4 w-full max-w-lg text-center py-10 space-y-6'>
        <h1 className='text-3xl font-tajawal '>{TextContent.title[0]} <span className=' font-almarai font-bold text-primary'>{TextContent.title[1]}</span></h1>
        <p>{TextContent.description}</p>
        <Input value={form.firstName} onChange={(firstName)=>setForm(prevs=>({...prevs,firstName:firstName.target.value}))} placeholder={TextContent.firstNamePlaceholder} />
        <Input value={form.lastName} onChange={(lastName)=>setForm(prevs=>({...prevs,lastName:lastName.target.value}))} placeholder={TextContent.lastNamePlaceholder} />
        <Input/>
        <Button disabled={disbaled} className='w-full'>{TextContent.confirm}</Button>
      </Card>
    </div>
  )
}
