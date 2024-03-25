import Image from 'next/image'
import React from 'react'
import { Button } from '@anesok/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'

// todo 
// onClick create new Chat and redirec to it
export default function ConversationList() {
    const ContentText = {
        title:'دردشة جديدة',
    }
  return (
    <div className='w-full max-w-sm p-3'>
        <div className='flex gap-x-2'>
        <Image width={40} height={58} src={`/icons/logo.svg`} alt='logo'/>
        <Button variant={'ghost'} className='text-[#DFC590]'>{ContentText.title}</Button>
        </div>
        <SignOutButton/>
    </div>
  )
}
