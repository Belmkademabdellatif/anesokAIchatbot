import { GetOneMessage } from "@anesok/server/module/message/message.handler"
import { create } from "zustand"

type PendingMessage = {
    toSend:boolean,
    setToSend:(toSend:boolean)=>void
    pendingMessage:GetOneMessage,
    setPendingMessage:(content:string)=>void
  }
  
  export const usePendingMessageStore = create<PendingMessage>((set)=>({
    toSend:false,
    setToSend(toSend) {
        if(!toSend){
            set(state=>({toSend,pendingMessage:{...state.pendingMessage,content:``}}))
        }else{
            set({toSend})
        }
    },
    pendingMessage:{
        id:-1,
        userId:'-1',
        conversationId:-1,
        content:'',
        isAI:true,
        createdAt:new Date()
    },
    setPendingMessage(content) {
        if(content==''){
            set(state=>({pendingMessage:{...state.pendingMessage,content:``}}))
        }else{
            set(state=>({pendingMessage:{...state.pendingMessage,content:`${state.pendingMessage.content} ${content}`}}))
        }
    },
  }))