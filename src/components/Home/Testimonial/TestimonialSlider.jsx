import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import customerTopImage from '../../../assets/images/customer-top.png'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import TestimonialCard from './TestimonialCard';
import SectionHeading from '../../SectionHeading';

const testimonials = [
  {
    name: "Awlad Hossin",
    position: "Senior Product Designer",
    feedback:
      "Provides support and alignment to shoulders, back, and spine for better posture daily.",
    avatarColor: "#004953",
  },
  {
    name: "Rasel Ahamed",
    position: "CTO",
    feedback:
      "Helps maintain proper posture while working long hours, reducing back pain and improving focus.",
    avatarColor: "#a1b2c3",
  },
  {
    name: "Nasir Uddin",
    position: "CEO",
    feedback:
      "Supports spine alignment gently, encouraging correct posture and reducing discomfort during work hours.",
    avatarColor: "#d1d1d1",
  },
  {
    name: "Sara Khan",
    position: "Marketing Manager",
    feedback:
      "This service improved our delivery efficiency and customer satisfaction within just a few months.",
    avatarColor: "#f4a261",
  },
  {
    name: "Imran Hossain",
    position: "Product Manager",
    feedback:
      "Working with this platform is seamless, professional, and fast, ideal for parcel management.",
    avatarColor: "#2a9d8f",
  },
  {
    name: "Nabila Rahman",
    position: "UX Designer",
    feedback:
      "The platform is intuitive, saving time while managing deliveries and pickups efficiently every day.",
    avatarColor: "#e76f51",
  },
  {
    name: "Jahid Islam",
    position: "Operations Lead",
    feedback:
      "Reliable tracking system makes parcel management effortless and ensures timely deliveries consistently.",
    avatarColor: "#264653",
  },
  {
    name: "Tania Ahmed",
    position: "Customer Success",
    feedback:
      "Excellent support and dashboard usability, making every parcel delivery and pickup completely stress-free.",
    avatarColor: "#f4d35e",
  },
];



const TestimonialSlider = () => {
  return (
    <section data-aos="fade-right" className='my-20'>
      <div className='text-center mb-10'>
        <div data-aos="fade-down" className='flex items-center justify-center mb-8'>
          <img src={customerTopImage} alt="customerTopImage" />
        </div>
        <SectionHeading
          title="What our customers are sayings"
          description="Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!"
          titleColor="text-[#03373D]"
          descriptionColor="text-[#606060]"
        />
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        navigation
        loop={true}
        modules={[Pagination, Navigation]}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="mySwiper"
      >
        {
          testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className='flex justify-between'>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </section>
  );
};

export default TestimonialSlider;