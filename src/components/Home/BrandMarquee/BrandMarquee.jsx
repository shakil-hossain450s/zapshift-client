import React from 'react';
import Marquee from "react-fast-marquee";
import amazon from '../../../assets/images/brands/amazon.png'
import casio from '../../../assets/images/brands/casio.png'
import moonStar from '../../../assets/images/brands/moonstar.png'
import randstad from '../../../assets/images/brands/randstad.png'
import star from '../../../assets/images/brands/start.png'

const brands = [amazon, casio, moonStar, randstad, star];

const BrandMarquee = () => {
  return (
    <section className='my-20 max-w-7xl mx-auto rounded'>
      <h2 className='text-center mb-8 text-3xl font-bold text-[#03373D]'>We've helped thousands of sales teams</h2>
      <Marquee>
        <div className='flex justify-between items-center'>
          {
            brands.map((brand, index) => (
              <div key={index} className='mx-10 md:mx-20'>
                <img className='h-6 object-contain' src={brand} alt={`client logo ${index + 1}`} />
              </div>
            ))
          }
        </div>
      </Marquee>
    </section>

  );
};

export default BrandMarquee;