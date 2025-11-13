import React from 'react'
import Hero from '../../components/Hero'
import CategoryWraper from '../category/CategoryWraper'
import FeatureSection from './FeaturedSection'
import LatestRecipe from './LatestRecipe'
import NewsAcc from './NewsAcc'

const Home = () => {
  return (
    <div className='container mx-auto'>
      <div className='flex justify-center flex-col items-center w-full py-20'>
          <Hero />
          <CategoryWraper />
      </div>
      <div className='flex justify-center flex-col items-center '>
        <FeatureSection />
        <NewsAcc />
        <LatestRecipe />
      </div>
      
    </div>
  )
}

export default Home