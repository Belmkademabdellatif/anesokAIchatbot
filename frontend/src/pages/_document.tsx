import { Html, Head, Main, NextScript } from 'next/document'
import { cn } from '@anesok/utils/tailwindHelper'

export default function Document() {

  return (
    <Html className='dark' lang='ar' dir='rtl'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
