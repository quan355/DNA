import React from 'react'

const NewsLeller = () => {
  return (
    <div className='w-full md:w-2/3 mx-auto flex flex-col items-center'>
        <h3 className='text-secondary font-semibold text-center text-4xl'>
            Sign up for Create new Recipes
        </h3>
        <p className='mt-6 text-gray-600 text-lg text-center leading-normal font-light'>Share the recipes, cooking
         tip and tricks and product 
         recommendations with everyone !</p>
         <div className='mt-6 flex flex-col items-center md:px-8  mb-20'>
            <button className='py-4 px-8 bg-btncolor text-white hover:text-white 
                w-full transition ease-in duration-200 text-center text-base font-semibold border border-[#9c702a]
                focus:outline-none rounded-lg'>
                Sign Up
            </button>
         </div>
    </div>
  )
}

export default NewsLeller