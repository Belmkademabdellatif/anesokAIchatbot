import { Button } from '@anesok/components/ui/button'
import { GetOneUserConversationList } from '@anesok/server/module/coversation/conversation.handler'
import Link from 'next/link'
import { useMessageStore } from 'zustandStore/messageStore'

export default function ConversationCard({id,messageList}:GetOneUserConversationList['conversationList']['0']) {
  const setConversationId = useMessageStore(state=>state.setConversationId)
  return (
    <div>
        <Button variant={'ghost'} className='w-full text-start' onClick={()=>setConversationId(id)}>
        <Link href={`/chat/${id}`} className='text-xs line-clamp-1 w-full'>
            {messageList[0]?.content??'دردشة جديدة'}
        </Link>
        </Button>
    </div>
  )
}
