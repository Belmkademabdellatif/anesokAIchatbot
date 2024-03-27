"use client"
import { useEffect, useRef } from 'react'
import { api } from '@anesok/utils/api';
import { useMessageStore } from 'zustandStore/messageStore';
import MessageCard from './MessageCard';
import { usePendingMessageStore } from 'zustandStore/PendingMessage';
import { useConversationStore } from 'zustandStore/conversationStore';

// todo 
// store the retrieved message into the store , scroll up get more data
export default function MessageList({
  conversationId,
  userId,
}: {
  conversationId: number;
  userId: string;
}) {
  const {pendingMessage,setPendingMessage,toSend,setToSend} = usePendingMessageStore()
  const {messageList,getNewestMessageDate,extend,send} = useMessageStore()
  const addMesage = useConversationStore(state=>state.addMessage)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {data,isSuccess} = api.message.onConversation.useQuery({conversationId:Number(conversationId),page:1,range:30},{enabled:!!conversationId})

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const { mutate: sendMessage } =
  api.message.send.useMutation({
    onMutate() {
      setToSend(false)
    },
    onSuccess(data) {
      send(data,conversationId)
      addMesage(conversationId,data.content)
      setPendingMessage('')
    },
  });
  useEffect(() => {
    console.log(data)
    if (isSuccess && data) {
      const newestMessageDate = getNewestMessageDate();
      console.log(newestMessageDate)
      if (!!newestMessageDate) {
        const newMessageList = data.messageList.filter(
          (message) => message.createdAt > newestMessageDate
        );
        extend(newMessageList,conversationId);
      } else {
        extend(data.messageList,conversationId);
      }
    }
  }, [isSuccess, data, extend]);

  useEffect(()=>{
    if(toSend){
      sendMessage({
        userId,
        conversationId:Number(conversationId),
        content:pendingMessage.content,
        isAI:true
      })
      setPendingMessage('')
    }
   
  },[toSend])


  return (
    <div className='w-full p-3 h-full space-y-8 overflow-y-auto px-4 sm:px-12 md:px-20'>
        {messageList.map((message,index)=><MessageCard key={index} message={message}/>)}
        {pendingMessage.content!='' &&<MessageCard message={pendingMessage}/>}
        <div ref={messagesEndRef}/>
    </div>
  )
}