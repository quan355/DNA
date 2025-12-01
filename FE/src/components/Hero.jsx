import React from 'react'
import {IoSearchOutline} from 'react-icons/io5'
const Hero = () => {
  return (
    <div className='px-5 xl:px-10 md:w-1/2 mb-10'>
        <h1 className='mt-6 mb-10 text-5xl xl:text-6xl text-center font-bold text-[#2A3342]
        leading-normal xl:leading-relaxed'> <span className='text-orange-400'>Dạy Nấu Ăn</span></h1>
        <form action={"/search"} className='bg-white p-4 rounded relative flex items-center'>
            <IoSearchOutline className='w-5 h-5 mr-2 text-neutral-300'/>
            <input className='outline-none a recipe' type="search" name="query" placeholder='Tìm kiếm...' id="search" required=""/>
        </form>
    </div>
  )
}

export default Hero