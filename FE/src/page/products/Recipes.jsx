import React from 'react';
import CategoryWraper from '../category/CategoryWraper';
import ListProduct from '../../components/ListProduct';

const Recipes = () => {
  return (
    <div className='px-6 lg:px-12 py-20 min-h-screen bg-gray-50'>
      <h1 className='text-3xl text-center mb-8 font-semibold text-secondary sm:text-5xl sm:leading-relaxed'>
        Tất cả công thức
      </h1>
      <CategoryWraper />
      <ListProduct 
        apiUrl="http://localhost:5000/api/all-items"
        showTitle={false}
        limit={9}
        emptyMessage="Hiện chưa có công thức nào được đăng tải"
        className="mt-10"
      />
    </div>
  );
};

export default Recipes;