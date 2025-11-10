import React from 'react';
import featureImage1 from '../../../assets/images/features/live-tracking.png'
import featureImage2 from '../../../assets/images/features/safe-delivery.png'
import FeatureCard from './FeatureCard';

const featuresData = [
  {
    image: featureImage1,
    title: "Live Parcel Tracking",
    description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind."
  },
  {
    image: featureImage2,
    title: "100% Safe Delivery",
    description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time."
  },
  {
    image: featureImage2,
    title: "24/7 Call Center Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us."
  }
]

const Features = () => {
  return (
    <section className='my-20'>
      <div className="border border-dashed my-20 border-[#03464D] w-full"></div>

      <div className='grid grid-cols-1 gap-8'>
        {
          featuresData.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))
        }
      </div>

      <div className="border border-dashed my-20 border-[#03464D] w-full"></div>
    </section>
  );
};

export default Features;