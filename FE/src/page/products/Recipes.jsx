import React, { useState,useEffect } from 'react'
import axios from 'axios';
import CategoryWraper from '../category/CategoryWraper';
import Card from '../../components/Card';
const Recipes = () => {
    const [item, setItems] = useState([]);
    useEffect(() => {
        const getLatestItems = async () => {
            const response = await axios.get("http://localhost:5000/api/all-items");
            setItems(response.data);
        }
        getLatestItems();
    }, [])
  return (
    <div className='px-6 lg:px-12 py-20'>
        <h1 className='text-3xl text-center mb-8 font-semibold text-secondary sm:text-5xl sm:leading-relaxed'>
            All Recipes
        </h1>
        <CategoryWraper/>
        <ul className='mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {
                item.map((item)=>(
                    <Card key={item._id} item={item}/>
                ))
            }
        </ul>
    </div>
  )
}

export default Recipes