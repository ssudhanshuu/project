import React from 'react'

export default function Title({text1, text2}) {
  return (
    <h1  className='font-medium text-2xl'>
        {text1}<span className='underline p-2 text-primary'>
            {text2}
        </span>
    </h1>
  )
}
 