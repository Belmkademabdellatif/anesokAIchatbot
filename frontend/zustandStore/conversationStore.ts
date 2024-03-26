import { GetOneUserConversationList } from "@anesok/server/module/coversation/conversation.handler";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Conversation = GetOneUserConversationList["conversationList"][0]
type ConversationStore = {
  isEmpty:boolean,
  conversationList:Conversation[] ;
  add: (
    newConversation: Conversation
  ) => void;
  extend:(conversationList:Conversation[])=>void
  getNewestConversationDate:()=> Date|undefined
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      isEmpty:true,
      conversationList: [],
      add(newConversation) {
        set({ isEmpty:false,conversationList: [newConversation, ...get().conversationList] });
      },
      extend(conversationList) {
        set({ isEmpty:false,conversationList: [...conversationList, ...get().conversationList] });
      },
      getNewestConversationDate() {
        const conversationList = get().conversationList;
        if (conversationList.length === 0) {
          return undefined;
        }
        const newestConversation = conversationList.reduce((newest, current) => {
          return current.createdAt > newest.createdAt ? current : newest;
        });
        return new Date(newestConversation.createdAt);
      },
    }),
    {
      name: "conversation-list",
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
