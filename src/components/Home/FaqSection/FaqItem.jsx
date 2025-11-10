import React from 'react';

const FaqItem = ({ faq, defaultChecked }) => {
  const { question, answer } = faq;
  return (
    <div data-aos="fade-right" className="collapse collapse-arrow bg-base-100 border border-base-300 ">
      <input defaultChecked={defaultChecked} type="radio" name="my-accordion-2" />
      <div className="collapse-title font-semibold">{question}</div>
      <div className="collapse-content text-sm">
        <div className='border-b border-[#067a8733] mb-4'></div>
        {answer}</div>
    </div>
  );
};

export default FaqItem;