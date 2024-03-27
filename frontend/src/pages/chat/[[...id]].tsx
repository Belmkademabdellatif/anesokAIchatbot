import { GetServerSidePropsContext } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from '@clerk/nextjs';

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@anesok/components/chat/layout/Layout"));
const MessageList = dynamic(() => import("@anesok/components/chat/MessageList"));

export default function ChatPage({
  userId,
  conversationId = -1,
}: {
  conversationId?: number;
  userId: string;
}) {

  console.log(conversationId)
  return (
    <Layout conversationId={conversationId} userId={userId}>
      <MessageList conversationId={conversationId} userId={userId} />
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);
 
  const id = Array.isArray(ctx.params?.id) ? ctx.params?.id?.at(0) : ctx.params?.id;
  const conversationId = id || -1;

  return {
    props: {
      conversationId,
      userId,
    },
  };
};
