import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CommentSection from '../../components/Comment.jsx';

const SingleProduct = () => {
    const item = useLoaderData();
    const [activeTab, setActiveTab] = useState('Preparation time'); 
    const parseInstructions = (data) => {
  if (!data) return [];

  let text = '';
  if (Array.isArray(data)) {
    text = data.join('. ');
  } else if (typeof data === 'string') {
    text = data;
  } else {
    return [];
  }

  return text
    .split(/(?:\d+\.\s*|\d+\)\s*|\d+\s+-?\s*)/)
    .map(step => step.trim())
    .filter(step => step.length > 5)
    .map(step => {
      let cleaned = step
        .replace(/^\d+[\.\)]\s*|\s*[:\-–—]\s*/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\.$/, '')
        .trim();
      if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
      return cleaned;
    })
    .filter(step => step.length > 0);
};
    const steps = parseInstructions(item?.instructions);

    const extraNumber = (timeString) => {
        if (!timeString) return 0;
        const match = timeString.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const prepTimeMinutes = extraNumber(item?.more?.prep_time);
    const cookTimeMinutes = extraNumber(item?.more?.cook_time);
    const totalTimeMinutes = prepTimeMinutes + cookTimeMinutes;
    if (!item?.more) {
    item.more = { prep_time: '', cook_time: '', serving_time: '', difficulty: '', source: '' };
    }
    return (
        <section className='min-h-dvh md:flex justify-center items-center md:bg-eggshell'>
            <article className='bg-white md:my-[5rem] md:py-8 md:rounded-xl'>
                <picture>
                    <img 
                        src={item.thumbnail_image} 
                        alt={item.name} 
                        className='md:max-w-[90%] w-full md:h-[570px] md:rounded-xl md:mx-auto' 
                    />
                </picture>

                <div className='px-8'>
                    <h1 className='text-4xl mt-12 text-secondary'>{item.name}</h1>

                    <div className="-mb-px border-b border-gray-200">
                        <div role="tablist" className="flex gap-1">
                            <button 
                                role="tab" 
                                aria-selected={activeTab === 'Preparation time'} 
                                className={`border-b-2 ${activeTab === 'Preparation time' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'} px-4 py-2 text-sm font-medium transition-colors hover:text-blue-700`}
                                onClick={() => setActiveTab('Preparation time')}
                            >
                                Thời gian chuẩn bị
                            </button>
                            <button 
                                role="tab" 
                                aria-selected={activeTab === 'Ingredients'} 
                                className={`border-b-2 ${activeTab === 'Ingredients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'} px-4 py-2 text-sm font-medium transition-colors hover:text-gray-700`}
                                onClick={() => setActiveTab('Ingredients')}
                            >
                                Nguyên liệu
                            </button>
                            <button 
                                role="tab" 
                                aria-selected={activeTab === 'Instructions'} 
                                className={`border-b-2 ${activeTab === 'Instructions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'} px-4 py-2 text-sm font-medium transition-colors hover:text-gray-700`}
                                onClick={() => setActiveTab('Instructions')}
                            >
                                Hướng dẫn
                            </button>
                        </div>
                    </div>

                    {/* Nội dung tab */}
                    {activeTab === 'Preparation time' && (
                        <div role="tabpanel" className="mt-4">
                            <ul className='list-disc mt-3 ml-8 text-lg marker:text-orange-500'>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Tổng:</span> <span>{totalTimeMinutes} phút</span>
                                    </p>
                                </li>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Chuẩn bị:</span> <span>{item?.more.prep_time}</span>
                                    </p>
                                </li>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Nấu:</span> <span>{item?.more.cook_time}</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    )}
                    {activeTab === 'Ingredients' && (
                        <div role="tabpanel" className="mt-4">
                            <ul className='list-disc marker:text-blue-500 mt-4 ml-6 text-secondary marker:align-middle'>
                                        {
                                            item?.ingredients.map((ingredient, index) => (
                                                <li key={index} className='pl-4 mt-2'>
                                                    <span>{ingredient?.name}</span> : <span>{ingredient?.quantity}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                        </div>
                    )}
                    {activeTab === 'Instructions' && (
                        <div role="tabpanel" className="mt-8">
  <div className="space-y-7">
    {steps.map((step, index) => (
      <div key={index} className="flex gap-5 items-start group">
        <div className="  text-secondary  flex items-center justify-center font-bold text-xl shadow-lg">
          {index + 1}
        </div>
        <p className="flex-1  pt-2 text-lg text-secondary leading-relaxed font-medium">
          {step}
        </p>
      </div>
    ))}
  </div>
</div>
                    )}
                    <CommentSection productId={item._id} />
                </div>
            </article>
        </section>
    );
};

export default SingleProduct;