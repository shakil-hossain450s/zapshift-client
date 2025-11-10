import React from 'react';

const HowItWorksCard = ({info}) => {
  const {icon: Icon, title, description} = info;
  return (
    <div className='bg-white rounded-2xl p-8'>
      <div className='text-4xl mb-4 text-[#03373D]'>
        <Icon />
      </div>
      <div className='space-y-4'>
        <h4 className='text-lg font-bold text-[#03373D]'>{title}</h4>
        <p className='text-[#606060]'>{description}</p>
      </div>
    </div>
  );
};

export default HowItWorksCard;