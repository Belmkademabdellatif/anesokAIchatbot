import { clerkClient,getAuth } from '@clerk/nextjs/server';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic'

const GettingStartForm = dynamic(()=>import('@anesok/components/gettingStart/GettingStartForm'))

export default function index() {
  return <GettingStartForm/>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const { userId } = getAuth(ctx.req);
  const user = await clerkClient.users.getUser(userId??'');

  // if the user first name exist means he/she already did 
  //the getting start step , redirect the user to chat page
  if(user.firstName!=null&&user.firstName!=''){
    return {
      redirect: {
        destination: '/chat',
        permanent: false,
      },
    };
  }
 
  return {
    props:{}
  };
};