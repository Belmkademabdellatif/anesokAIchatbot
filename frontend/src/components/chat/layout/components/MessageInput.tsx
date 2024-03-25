import { Button } from '@anesok/components/ui/button'
import { Input } from '@anesok/components/ui/input'
import { SendIcon } from 'lucide-react'
import React from 'react'

export default function MessageInput() {
    //           "flex h-10 w-full font-tajawal rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

  return (
    <div className='p-2 px-4 h-[10%]'>
    <div className='relative'>
        <SendIcon className='w-4 h-4 hover:cursor-pointer hover:text-orange-300 absolute top-1/2 -translate-y-1/2 end-3'/>
        <Input className='border-orange-500 focus-visible:ring-1 focus-visible:ring-orange-500 pe-10'/>
    </div>
    </div>
  )
}
