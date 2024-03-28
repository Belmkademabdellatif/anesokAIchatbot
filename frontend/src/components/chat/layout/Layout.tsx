import { ReactNode, memo } from "react";
import Header from "./components/Header";
import ConversationList from "./components/conversation/ConversationList";
import MessageInput from "./components/MessageInput";
import ConversationSheet from "./components/conversation/ConversationSheet";
import { OneUser } from "@anesok/server/module/auth/auth.handler";

export type User = {
  id:string
  name:string
  emailAddress:string
  image:string

}
const Layout = ({
  children,
  conversationId,
  userId,
  user
}: {
  children: ReactNode;
  conversationId: number;
  userId: string;
  user:OneUser
}) => {
  return (
    <div className="flex h-screen w-full">
      <ConversationList userId={userId} />
      <div className="h-screen max-h-svh  w-full bg-slate-900">
        <ConversationSheet userId={userId}/>
        <Header />
        <div className="h-[80%] w-full">{children}</div>
        <MessageInput user={user} userId={userId} conversationId={conversationId} />
      </div>
    </div>
  );
};

export default memo(Layout);
