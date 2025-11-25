// src/pages/CategoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CategoryWraper from './CategoryWraper';
import ListProduct from '../../components/ListProduct';

const CategoryPage = () => {
  const { category } = useParams(); 

  return (
    <div className="px-6 lg:px-12 py-20 min-h-screen bg-gray-50">
      <h1 className="text-center text-4xl md:text-6xl font-bold text-secondary mb-12 capitalize">
        {category.replace(/-/g, ' ')} 
      </h1>
      <CategoryWraper />
      <ListProduct
        apiUrl={`http://localhost:5000/api/categories/${category}`}
        showTitle={false}
        limit={9}
        emptyMessage={`Chưa có công thức nào trong danh mục "${category.replace(/-/g, ' ')}"`}
        className="mt-10"
      />
    </div>
  );
};

export default CategoryPage;