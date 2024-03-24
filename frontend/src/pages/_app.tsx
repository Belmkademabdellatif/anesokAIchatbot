import { type AppType } from "next/app";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { api } from "../utils/api";
import { SessionProvider } from "next-auth/react"

import "../styles/globals.css";

import localFont from '@next/font/local'
import { Session } from "next-auth";
import Head from "next/head";

const Almarai = localFont({
  src:[
    {
    path: '../../public/fonts/almarai/Almarai-Bold.ttf',
    weight: '700',
    },{
      path: '../../public/fonts/almarai/Almarai-ExtraBold.ttf',
      weight: '800',
    },
    {
      path: '../../public/fonts/almarai/Almarai-Light.ttf',
      weight: '300',
    },{
      path: '../../public/fonts/almarai/Almarai-Regular.ttf',
      weight: '400', 
    }
],
  variable:'--font-almarai'
})

const Tajawal = localFont({
  src:[
    {
      path: '../../public/fonts/tajawal/Tajawal-ExtraBold.ttf',
      weight: '800',    
    },
    {
      path: '../../public/fonts/tajawal/Tajawal-Bold.ttf',
      weight: '700',
    },
    {
      path: '../../public/fonts/tajawal/Tajawal-Medium.ttf',
      weight: '500',    
    },
    {
      path: '../../public/fonts/tajawal/Tajawal-Regular.ttf',
      weight: '400',    
    },
    {
      path: '../../public/fonts/tajawal/Tajawal-Light.ttf',
      weight: '300',
    }
  ],
  variable:'--font-tajawal'
})

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
const HeaderContent = {
  title:'انيسّك',
  description:'انيسّك ، هي فكرة لربوت دردشة ، مدعوم بالذكاء الاصطناعي ، موصول بالانترنت  ببعض اهم المواقع العربية الطبية الموثوقة . يقوم بتحليل وضع ونفسية المستخدم ، ثم يقدم حلول لتخفيف الآلام للمستخدم اذا كان من مصابي حالات الاكتئاب او الضغوط النفسية ، ليس بديل للطبيب ، ولكن لسد الفجوة بين الواقع العربي و العار حول المشاكل النفسية'
}
  return (
    <ClerkProvider {...pageProps}>
        <Head>
        <title>{HeaderContent.title}</title>
        <meta name="description" content={HeaderContent.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <SessionProvider session={session}>
      <main className={` ${Almarai.variable} ${Tajawal.variable}`}>
      <Component {...pageProps} />
      </main>
      </SessionProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
