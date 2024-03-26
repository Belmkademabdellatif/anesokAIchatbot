import { GetServerSidePropsContext } from "next";
import { User, getAuth } from "@clerk/nextjs/server";
import { clerkClient } from '@clerk/nextjs';

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@anesok/components/chat/layout/Layout"));
const MessageList = dynamic(() => import("@anesok/components/chat/MessageList"));

export default function ChatPage({
  userId,
  conversationId = -1,
  user,
}: {
  conversationId?: number;
  userId: string;
  user:User,
}) {
  console.log(user)
  return (
    <Layout conversationId={conversationId} userId={userId}>
      <MessageList conversationId={conversationId} userId={userId} />
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);
 
  let user = userId ? await clerkClient.users.getUser(userId) : undefined;

  user = JSON.parse(JSON.stringify(user))


  return {
    props: {
      conversationId: ctx.params?.id?.at(0),
      userId,
      user,
    },
  };
};
