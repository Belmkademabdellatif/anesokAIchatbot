import { GetOneMessage } from "@anesok/server/module/message/message.handler";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Message = GetOneMessage

type MessageStore = {
  isLoading:boolean,
  setIsLoading:(isLoading:boolean)=>void
  conversationId:number,
  messageList:Message[] ;
  pendingMessage:Message|null,
  setPendingMessage:(pendingMessage:Message|null)=>void
  send: (newMessage: Message,conversationId:number) => void;
  extend:(messageList:Message[],conversationId:number)=>void
  getNewestMessageDate:()=> Date|undefined
  getOldestMessageDate:()=> Date|undefined
  reset:()=>void
};

export const useMessageStore = create<MessageStore>()(
  // persist(
    (set, get) => ({
      isLoading:false,
      setIsLoading(isLoading) {
          set({isLoading})
      },
        messageList: [],
        conversationId:-1,
        pendingMessage:null,
      send(newMessage,conversationId) {
        if(get().conversationId!=conversationId){
          set({messageList:[newMessage],conversationId})
        }else{
          set({ messageList: [ ...get().messageList,newMessage] });
        }
      },
      extend(messageList,conversationId) {
        const filteredMessages = messageList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        if(get().conversationId!=conversationId){
          set({ messageList:filteredMessages,conversationId });      
        }else{
          set({ messageList: [...get().messageList, ...filteredMessages] });      
        }
      },
      setPendingMessage(pendingMessage) {
          set({pendingMessage})
      },
      getNewestMessageDate() {

        const messageList = get().messageList;
        if (messageList.length === 0) {
          return undefined;
        }

        const newestMessage = messageList.reduce((newest, current) => {
          return current.createdAt > newest.createdAt ? current : newest;
        });
        return new Date(newestMessage.createdAt);

      },
      getOldestMessageDate() {
        const messageList = get().messageList;
        if (messageList.length === 0) {
          return undefined;
        }

        const newestMessage = messageList.reduce((newest, current) => {
          return current.createdAt > newest.createdAt ? current : newest;
        });
        return new Date(newestMessage.createdAt);
      },
      reset() {
          set({pendingMessage:null,conversationId:-1,messageList:[]})
      },
    }
    // ),
    // {
    //   name: "message-list",
    //   storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    // }
  )
);
