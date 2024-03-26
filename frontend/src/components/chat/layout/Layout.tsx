import React, { ReactNode } from 'react'
import Header from './components/Header'
import ConversationList from './components/ConversationList'
import MessageInput from './components/MessageInput'
import { useAuth, useClerk } from '@clerk/clerk-react'

export default function Layout({children}:{children:ReactNode}) {
  const {user} = useClerk()
  
  return (
    <div className='flex w-full h-screen'>
            <ConversationList/>
            {/* conversation list */}
            {/* message view */}
            <div className='w-full bg-slate-900  h-screen max-h-svh'>
                <Header/>
                <div className='w-full h-[80%]'>
                {children}
                </div>
                <MessageInput/>
            <div>
            </div>
            </div>
    </div>
  )
}
