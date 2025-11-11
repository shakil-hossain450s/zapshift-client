import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import BangladeshMap from '../../components/Coverage/BangladeshMap';

const Coverage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();

    const searchText = e.target.search.value;
    setSearchTerm(searchText);
  }
  return (
    <section className='mt-4 mb-10 bg-white rounded-2xl p-6 md:p-10 lg:p-20'>
      <h1 data-aos='fade-right' className='text-2xl md:text-4xl lg:text-5xl font-bold text-[#03373D]'>We are available in 64 districts</h1>
      <form data-aos='fade-up' onSubmit={handleSearch} className='flex mt-8'>
        <div className='max-w-sm flex items-center gap-3 bg-[#CBD5E14D] rounded px-3 py-1 rounded-l-full'>
          <span className='text-sm text-[#1F1F1F]'><FaSearch /></span>
          <input
            type='text'
            placeholder='Search'
            className='text-[#1F1F1F] outline-none'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className='-ml-3 cursor-pointer bg-[#CAEB66] text-[#2b2a2a] border border-[#CAEB66] font-bold shadow-none rounded-full px-4 py-1'>Search</button>
      </form>
      <div className='border-b border-[#0000001A] w-full my-8'></div>
      <div className='space-y-4'>
        <h3 data-aos='fade-right' className='text-2xl font-bold text-[#03373D]'>We deliver almost all over Bangladesh</h3>
        <BangladeshMap searchTerm={searchTerm} />
      </div>
    </section>
  );
};

export default Coverage;