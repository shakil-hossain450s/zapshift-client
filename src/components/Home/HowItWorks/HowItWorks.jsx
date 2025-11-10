import React from 'react';
import {
  FaClipboardCheck,   // Booking
  FaPeopleCarryBox,   // Pickup
  FaWarehouse,        // Hub Processing
  FaMoneyCheckDollar, // Cash on Delivery
} from "react-icons/fa6";
import HowItWorksCard from './HowItWorksCard';

const howItWorksData = [
  {
    icon: FaClipboardCheck,
    title: "Booking & Order Placement",
    description: "Easily book your parcel online with complete delivery details.",
  },
  {
    icon: FaPeopleCarryBox,
    title: "Pickup from Sender",
    description: "Our delivery agent collects parcels safely from your doorstep.",
  },
  {
    icon: FaWarehouse,
    title: "Hub Sorting & Dispatch",
    description: "Parcels are sorted at the nearest hub for faster delivery.",
  },
  {
    icon: FaMoneyCheckDollar,
    title: "Cash on Delivery",
    description: "We collect payment securely and transfer it back to you quickly.",
  },
];

const HowItWorks = () => {
  return (
    <section data-aos="fade-up" className='my-20'>
      <h2 className="text-3xl font-bold mb-4 text-[#03373D]">How it Works</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {
          howItWorksData.map((info, index) => (
            <HowItWorksCard key={index + 1} info={info} />
          ))
        }
      </div>
    </section>
  );
};

export default HowItWorks;