import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

// todo 
// onClick create new Chat and redirec to it
export default function MessageList({
  conversationId,
  userId,
}: {
  conversationId: number;
  userId: string;
}) {
    const ContentText = {
        title:'دردشة جديدة',
    }
  return (
    <div className='w-full max-w-sm p-3'>
        <h1>{JSON.stringify(conversationId)+' '+userId}</h1>
    </div>
  )
}
