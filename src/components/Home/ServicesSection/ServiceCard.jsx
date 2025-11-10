import React from 'react';

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className='bg-white px-6 py-8 rounded-xl hover:bg-[#CAEB66] hover:-translate-y-0.5 duration-300 flex flex-col text-center items-center transition-all'>
      <div className='flex items-center justify-center w-20 h-20 text-4xl bg-linear-to-t from-[#EEEDFC00] to-[#EEEDFC] rounded-full text-[#03373D] mb-6'>
        <Icon />
      </div>
      <div>
        <h3 className='text-[#03373D] font-bold text-2xl mb-3'>{title}</h3>
        <p className='text-[#606060]'>{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;