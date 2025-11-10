import React from 'react';

const PrimaryButton = ({ children, className, widthFull }) => {
  return (
    <button className={`btn ${widthFull && 'w-full'}  min-h-12 bg-[#CAEB66] ${!className ? 'rounded-lg px-7' : className} text-[#2b2a2a] border border-[#CAEB66] text-xl font-bold shadow-none hover:-translate-y-0.5 duration-400 text-[16px] transition-all`}>
      {children}
    </button>
  );
};

export default PrimaryButton;