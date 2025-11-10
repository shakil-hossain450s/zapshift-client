import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import bannerImage1 from '../../../assets/images/banner/banner1.png';
import bannerImage2 from '../../../assets/images/banner/banner2.png';
import bannerImage3 from '../../../assets/images/banner/banner3.png';

const Banner = () => {
  return (
    <section data-aos="fade-down">
      <Carousel className='mt-10 rounded-2xl'
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        interval={3000}
        showStatus={false}
      >
        <div>
          <img src={bannerImage1} />
        </div>
        <div>
          <img src={bannerImage2} />
        </div>
        <div>
          <img src={bannerImage3} />
        </div>
      </Carousel>
    </section>

  );
};

export default Banner;