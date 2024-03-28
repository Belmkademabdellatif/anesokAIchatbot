import { GetOneMessage } from '@anesok/server/module/message/message.handler'
import Image from 'next/image'
import { useClerk } from '@clerk/clerk-react';
import { memo } from 'react';
import Markdown from 'react-markdown'

const MessageCard = ({message}:{message:GetOneMessage}) => {
    const {user} = useClerk()
    return (
    <div className='w-full  flex items-start gap-x-2'>
        <Image className='rounded-full' width={24} height={24}  src={message.isAI?`/icons/logo.svg`:(user?.imageUrl??'/icons/profile.svg')} alt='profile_img'/>
        {/* <h1>{message.content} */}
        <div className=' leading-8'>
        <Markdown>{message.content}</Markdown>
        </div>
        {/* </h1> */}
    </div>
  )
}

export default memo(MessageCard)