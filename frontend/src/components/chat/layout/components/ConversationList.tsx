import Image from 'next/image'
import React from 'react'
import { Button } from '@anesok/components/ui/button'
import { SignOutButton, useAuth } from '@clerk/nextjs'
import { api } from '@anesok/utils/api'
import Loading from '@anesok/components/ui/loading'
import ConversationCard from './conversation/ConversationCard'
import IllustrationContainer from '@anesok/components/general/IllustrationContainer'
import ConversationSkeleton from './conversation/ConversationSkeleton'
import ProfileDropdown from './ProfileDropdown'
import { useRouter } from 'next/router'

// todo
// extra feature
// add zustand store to load the conversation faster
export default function ConversationList() {
    const ContentText = {
        title:'دردشة جديدة',
        noConversationDesc:'سلام! لم تقم ببدء أي محادثة بعد. ابدأ رحلتك الآن'
    }

    const {userId} = useAuth()
    const {push} = useRouter()

    const {data,error} = api.conversation.oneUser.useQuery({userId:userId??'',page:1,range:50},{enabled:!!userId})
    const {mutate,isLoading} = api.conversation.create.useMutation({
      onSuccess(data) {
          push(`/chat/${data[0]?.id}`)
      },
    })

    return (
    <div className='w-full max-w-sm p-3'>
        <section className='flex gap-x-2 h-[6%]'>
        <Image width={40} height={58} src={`/icons/logo.svg`} alt='logo'/>
        <Button onClick={()=>mutate({userId:userId??''})} disabled={isLoading} variant={'ghost'} className='text-[#DFC590]'>
          {isLoading? <Loading withText={true}/>:ContentText.title}
          </Button>
        </section>
        <section className='h-[88%] overflow-hidden overflow-y-auto'>
        {isLoading &&<div className=' space-y-2'>
         {Array.from({length:12}).map((_,i)=><ConversationSkeleton key={i}/>)}
          </div>
        }
        {data && data.conversationList.length>0 && data.conversationList.map(conversation=><ConversationCard {...conversation}/> )}
        {data && data.conversationList.length==0 && <IllustrationContainer description={ContentText.noConversationDesc} path='noConversation'/>}
        </section>
        <ProfileDropdown />
    </div>
  )
}
