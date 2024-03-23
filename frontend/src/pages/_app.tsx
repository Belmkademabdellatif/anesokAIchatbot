import { type AppType } from "next/app";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { api } from "../utils/api";

import "../styles/globals.css";

import localFont from '@next/font/local'

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

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <main className={` ${Almarai.variable} ${Tajawal.variable}`}>
      <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
