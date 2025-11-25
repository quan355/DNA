import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CommentSection from '../../components/Comment.jsx';

const SingleProduct = () => {
    const item = useLoaderData();
    const [activeTab, setActiveTab] = useState('Preparation time'); 
    const parseInstructions = (text) => {
    if (!text) return [];
    return text
      .split(/\d+\.\s+/)
      .filter(step => step.trim())
      .map(step => step.replace(/\.$/, '').trim());
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
                                Preparation time
                            </button>
                            <button 
                                role="tab" 
                                aria-selected={activeTab === 'Ingredients'} 
                                className={`border-b-2 ${activeTab === 'Ingredients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'} px-4 py-2 text-sm font-medium transition-colors hover:text-gray-700`}
                                onClick={() => setActiveTab('Ingredients')}
                            >
                                Ingredients
                            </button>
                            <button 
                                role="tab" 
                                aria-selected={activeTab === 'Instructions'} 
                                className={`border-b-2 ${activeTab === 'Instructions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'} px-4 py-2 text-sm font-medium transition-colors hover:text-gray-700`}
                                onClick={() => setActiveTab('Instructions')}
                            >
                                Instructions
                            </button>
                        </div>
                    </div>

                    {/* Nội dung tab */}
                    {activeTab === 'Preparation time' && (
                        <div role="tabpanel" className="mt-4">
                            <ul className='list-disc mt-3 ml-8 text-lg marker:text-orange-500'>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Total:</span> <span>{totalTimeMinutes} minutes</span>
                                    </p>
                                </li>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Preparation:</span> <span>{item?.more.prep_time}</span>
                                    </p>
                                </li>
                                <li className='pl-3 mt-3'>
                                    <p>
                                        <span>Cooking:</span> <span>{item?.more.cook_time}</span>
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
                        <div role="tabpanel" className="mt-4">
                            <ul className="list-decimal marker:text-red-500 mt-4 ml-6 text-secondary marker:align-middle">
                            {steps.map((step, index) => (
                            <li key={index} className="pl-4 mt-3 leading-relaxed">
                            {step}
                            </li>
                            ))}
                            </ul>
                        </div>
                    )}
                    <CommentSection productId={item._id} />
                </div>
            </article>
        </section>
    );
};

export default SingleProduct;