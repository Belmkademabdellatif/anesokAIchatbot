import { Card } from '@anesok/components/ui/card'
import { Skeleton } from '@anesok/components/ui/sckeleton'
import React from 'react'

export default function ConversationSkeleton() {
  return (
    <Card className='p-3'>
        <Skeleton className='h-2 w-20'/>
    </Card>
  )
}
