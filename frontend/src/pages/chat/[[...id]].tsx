import { GetServerSidePropsContext } from 'next';

import dynamic from 'next/dynamic';

const Layout = dynamic(()=>import('@anesok/components/chat/layout/Layout'))

export default function ChatPage() {
  return <Layout>
    <h1></h1>
  </Layout>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

    return {
      props:{
        params:ctx.params,
      }
    };
  };