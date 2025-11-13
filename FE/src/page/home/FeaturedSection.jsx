import React from 'react'
import FeatureImg from '../../assets/featured.webp'
const FeaturedSection = () => {
  return (
    <div className='overflow-hidden flex md:flex-row flex-col justify-between items-center sm:my-20 my-4 md:gap-20 gap-12 px-5 lg:px-10'>
        <div className='relative'>
            <div className='absolute top-4 left-5 bg-white text-secondary px-3 py- rounded-md
             uppercase tracking-wider'>FR</div>
            <img src={FeatureImg} alt="Featured image" className='rounded-md'/>
        </div>
        <div className='text-start sm:w-1/2'>
                <h2 className='text-3xl font-semibold text-secondary sm:text-5xl '>
                    Pineapple + Smaked Jackfruit Pizza
                </h2>
                <p className="text-1xl mt-4 text-[#5c5c5c]">Lorem ipsum dolor sit ametconsectetur.
                    Preasent mttis nibh vestiblum euismod morbi ullamcorper rutrum. Orci cras in phasellus ultricies.
                </p>
                <div className='lg:mt-0 lg:flex-shrink-0'>
                    <div className='mt-12 inline-flex'>
                        <button className='py-4 px-8 hover:bg-btncolor text-secondary hover:text-white 
                        w-full transition ease-in duration-200 text-center text-base font-semibold border border-[#9c702a]
                        focus:outline-none rounded-lg'>View Recipes</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default FeaturedSection