import React from 'react';

const FeatureCard = ({ feature }) => {
  const { image, title, description } = feature;
  return (
    <div data-aos="fade-right" className='bg-white p-8 rounded-2xl'>
      <div className='flex gap-8 flex-col md:flex-row items-center'>
        <div className='lg:w-[20%] md:border-r pr-10 border-dashed border-[#03464D]'>
          <img className='w-52' src={image} alt={title} />
        </div>
        <div className='lg:w-[80%] space-y-2 text-center md:text-start'>
          <h2 className='text-2xl font-bold text-[#03373D]'>{title}</h2>
          <p className='text-[#606060]'>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;