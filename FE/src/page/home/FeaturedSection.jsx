import React from 'react'
import FeatureImg from '../../assets/featured.webp'
import { Link } from 'react-router-dom'
const FeaturedSection = () => {
  return (
    <div className='overflow-hidden flex md:flex-row flex-col justify-between items-center sm:my-20 my-4 md:gap-20 gap-12 px-5 lg:px-10'>
        <div className='relative'>
            <img src={FeatureImg} alt="Featured image" className='rounded-md'/>
        </div>
        <div className='text-start sm:w-1/2'>
                <h2 className='text-3xl font-semibold text-secondary sm:text-5xl '>
                    Pizza Dứa + Xông Khói 
                </h2>
                <p className="text-1xl mt-4 text-[#5c5c5c]">Khi mít chín tới ngọt lừa tình gặp khói xông khói thơm nồng, rồi nằm chung đế pizza giòn tan và phô mai kéo sợi… 
      bạn sẽ hiểu tại sao cả thế giới đang phát cuồng vì món ăn “lạ mà quen” này! 
      Chỉ 30 phút là có ngay bữa tiệc Hawaii phiên bản Việt Nam trong bếp nhà mình.
                </p>
                <div className='lg:mt-0 lg:flex-shrink-0'>
                    <div className='mt-12 inline-flex'>
                        <Link to="/recipes">
                        <button className='py-4 px-8 hover:bg-btncolor text-secondary hover:text-white 
                        w-full transition ease-in duration-200 text-center text-base font-semibold border border-[#9c702a]
                        focus:outline-none rounded-lg'>Xem Thêm</button>
                        </Link>
                        
                    </div>
                </div>
            </div>
    </div>
  )
}

export default FeaturedSection