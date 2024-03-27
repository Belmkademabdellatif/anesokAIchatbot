import React from 'react'
import { Skeleton } from '../ui/sckeleton'

export default function MessageSkeleton() {
  return (
    <div className=' space-y-4 '>
        {Array.from({length:9}).map((_,i)=><Skeleton className='h-2 w-full'/>)}
    </div>
  )
}
