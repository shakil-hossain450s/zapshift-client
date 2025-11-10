import React from 'react';
import locationMarcent from '../../../assets/images/location-merchant.png';
import marcentBg from '../../../assets/images/be-a-merchant-bg.png';
import PrimaryButton from '../../PrimaryButton';

const BeMarcent = () => {
  return (
    <section
      data-aos="fade-up"
      style={{
        backgroundImage: `url(${marcentBg})`,
      }}
      className="hero bg-[#03373D] p-3 lg:p-20 rounded-4xl my-10 bg-contain bg-no-repeat bg-top"

    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={locationMarcent}
          className="w-full md:max-w-sm"
        />
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white md:leading-12 mb-4">Merchant and Customer Satisfaction is Our First Priority</h1>
          <p className="mb-6 text-[#DADADA]">
            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
          </p>
          <PrimaryButton className='rounded-full px-16'>
            Be a Marcent
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default BeMarcent;