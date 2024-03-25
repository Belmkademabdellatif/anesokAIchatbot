import React from 'react'

export default function Header() {
    const ContentText = {
        title:'انيسُك',
    }
  return (
    <div className='w-full h-[10%] p-4'>
        <h1 className='text-primary font-tajawal font-bold text-3xl'>{ContentText.title}</h1>
    </div>
  )
}
