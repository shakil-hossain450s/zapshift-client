import React from 'react';

const PrimaryButton = ({ children }) => {
  return (
    <button className='btn min-h-12 bg-[#CAEB66] px-7 rounded-lg text-[#2b2a2a] border-[#CAEB66] shadow-none font-medium hover:-translate-y-0.5 duration-400 text-[16px]'>
      {children}
    </button>
  );
};

export default PrimaryButton;