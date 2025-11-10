import React from 'react';
import Services from '../components/Home/ServicesSection/Services';
import Banner from '../components/Home/Banner/Banner';
import BrandMarquee from '../components/Home/BrandMarquee/BrandMarquee';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Services></Services>
      <BrandMarquee></BrandMarquee>
    </div>
  );
};

export default Home;