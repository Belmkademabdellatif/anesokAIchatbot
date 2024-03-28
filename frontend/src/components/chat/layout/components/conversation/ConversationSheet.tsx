import {
    Sheet,
    SheetContent,
  } from "@anesok/components/ui/sheet"

import { create } from "zustand"
import ConversationList from "./ConversationList"
  
  export default function ConversationSheet({ userId }: { userId: string }) {
    const {show,setShow} = useConversationSheet()
    return (
        <Sheet open={show} onOpenChange={setShow}>
        <SheetContent className="min-h-screen px-0">
          <ConversationList isSheet={true} userId={userId}/>
        </SheetContent>
      </Sheet>
      
    )
  }
  

  type ConversationSheet = {
    show:boolean,
    setShow:(show:boolean)=>void
  }

  export const useConversationSheet = create<ConversationSheet>((set)=>({
    show:false,
    setShow(show) {
        set({show})
    },
  }))