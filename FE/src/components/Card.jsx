import React from 'react'
import { Link } from 'react-router-dom';
import {GoClock} from 'react-icons/go';
import { FaCreativeCommonsBy } from "react-icons/fa";
const Card = ({item}) => {
  const categoryStyles = {
    Entrees: {backgroundColor: '#f0f5c4', color: '#59871f'},
    Breakfast: {backgroundColor: '#efedfa', color: '#3c3a8f'},
    Lunch: {backgroundColor: '#e5f7f3', color: '#1f8787'},
    Desserts: {backgroundColor: '#e8f5fa', color: '#397a9e'},
    Sides: {backgroundColor: '#feefc9', color: '#d16400'},
    Drinks: {backgroundColor: '#ffeae3', color: '#f0493e'},
    default: {backgroundColor: '#fff', color: '#000'},
  };
  const getCategoryStyle = (category) => {
    return categoryStyles[category] || categoryStyles.default;
  };
  const categoryStyle = getCategoryStyle(item?.category);
  return (
    <div className='container mx-auto flex justify-center md:justify-center'>
      <div className='max-w-sm w-full'> 
        <div className='bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg 
                    h-full flex flex-col'> 

      <img 
        src={item?.thumbnail_image} 
        alt="thumbnail_image" 
        className='rounded-t-lg w-full object-cover h-48' 
      />

      <div className='py-6 px-5 rounded-lg bg-white flex-1 flex flex-col justify-between'>
        <div>
          <Link to={`/item/${item._id}`}>
            <h1 className='text-gray-700 font-bold text-2xl mb-8 hover:text-gray-900 hover:cursor-pointer
                           line-clamp-2 leading-tight'> 
              {item?.name}
            </h1>
          </Link>
        </div>
        <div className='flex justify-between items-center flex-wrap gap-3'>
          <button 
            className='py-2 px-4 font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300'
            style={{
              backgroundColor: categoryStyle.backgroundColor,
              color: categoryStyle.color,
            }}>
            {item?.category}
          </button>

          <div className='flex items-center'>
            <GoClock className='mr-1' />
            <span>{item?.more?.prep_time}</span>
          </div>
        </div>
      </div>

      
      <div className='absolute top-2 right-2 py-2 px-4 bg-white rounded-lg shadow'>
        <span className='font-medium text-sm'>{item?.more?.difficulty}</span>
      </div>
    </div>
  </div>
</div>
  )
}

export default Card