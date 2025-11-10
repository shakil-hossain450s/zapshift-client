import React from 'react';
import Services from '../components/Home/ServicesSection/Services';
import Banner from '../components/Home/Banner/Banner';
import BrandMarquee from '../components/Home/BrandMarquee/BrandMarquee';
import Features from '../components/Home/Features/Features';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Services></Services>
      <BrandMarquee></BrandMarquee>
      <Features></Features>
    </div>
  );
};

export default Home;