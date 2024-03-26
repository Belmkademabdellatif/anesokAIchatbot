import { Button } from '@anesok/components/ui/button'
import { GetOneUserConversationList } from '@anesok/server/module/coversation/conversation.handler'
import Link from 'next/link'

export default function ConversationCard({id,messageList}:GetOneUserConversationList['conversationList']['0']) {
  return (
    <div>
        <Button variant={'ghost'} className='w-full text-start'>
        <Link href={`/chat/${id}`} className='text-xs line-clamp-1 w-full'>
            {messageList[0]?.content??'دردشة جديدة'}
        </Link>
        </Button>
    </div>
  )
}
