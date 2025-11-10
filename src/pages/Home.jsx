import React from 'react';
import Services from '../components/Home/ServicesSection/Services';
import Banner from '../components/Home/Banner/Banner';
import BrandMarquee from '../components/Home/BrandMarquee/BrandMarquee';
import Features from '../components/Home/Features/Features';
import BeMarcent from '../components/Home/BeMarcent/BeMarcent';
import FaqSection from '../components/Home/FaqSection/FaqSection';
import HowItWorks from '../components/Home/HowItWorks/HowItWorks';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <Services></Services>
      <BrandMarquee></BrandMarquee>
      <Features></Features>
      <BeMarcent></BeMarcent>
      <FaqSection></FaqSection>
    </div>
  );
};

export default Home;