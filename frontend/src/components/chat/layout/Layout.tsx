import { ReactNode, memo } from "react";
import Header from "./components/Header";
import ConversationList from "./components/conversation/ConversationList";
import MessageInput from "./components/MessageInput";

const Layout = ({
  children,
  conversationId,
  userId,
}: {
  children: ReactNode;
  conversationId: number;
  userId: string;
}) => {
  return (
    <div className="flex h-screen w-full">
      <ConversationList userId={userId} />
      <div className="h-screen max-h-svh  w-full bg-slate-900">
        <Header />
        <div className="h-[80%] w-full">{children}</div>
        <MessageInput userId={userId} conversationId={conversationId} />
        <div></div>
      </div>
    </div>
  );
};

export default memo(Layout);
