import React from 'react';
import Services from '../../components/Home/ServicesSection/Services';
import Banner from '../../components/Home/Banner/Banner';
import BrandMarquee from '../../components/Home/BrandMarquee/BrandMarquee';
import Features from '../../components/Home/Features/Features';
import BeMarcent from '../../components/Home/BeMarcent/BeMarcent';
import FaqSection from '../../components/Home/FaqSection/FaqSection';
import HowItWorks from '../../components/Home/HowItWorks/HowItWorks';
import TestimonialSlider from '../../components/Home/Testimonial/TestimonialSlider';

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <BrandMarquee />
      <Features />
      <BeMarcent />
      <TestimonialSlider />
      <FaqSection />
    </div>
  );
};

export default Home;