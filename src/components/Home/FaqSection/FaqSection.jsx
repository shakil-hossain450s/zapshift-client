import React from 'react';
import SectionHeading from '../../SectionHeading';
import FaqItem from './FaqItem';

const faqData = [
  {
    "question": "How does this posture corrector work?",
    "answer": "A posture corrector works by providing support and gentle alignment to your back and shoulders, helping you maintain proper posture throughout the day. Here’s how it typically functions to improve posture and relieve discomfort caused by poor alignment to your shoulders."
  },
  {
    "question": "Is it suitable for all ages and body types?",
    "answer": "Yes, most posture correctors are designed with adjustable straps and flexible materials, making them suitable for various body types and ages. However, it’s recommended to check the product sizing guidelines before purchasing."
  },
  {
    "question": "Does it really help with back pain and posture improvement?",
    "answer": "When used consistently and correctly, a posture corrector can help reduce back and shoulder pain caused by slouching or poor posture. It supports muscle memory so that, over time, your body naturally maintains a better posture even without the device."
  },
  {
    "question": "Does it have smart features like vibration alerts?",
    "answer": "Some advanced posture correctors include smart sensors that detect slouching and send gentle vibration alerts to remind you to correct your posture. Check the product description for available smart features."
  },
  {
    "question": "How will I be notified when the product is back in stock?",
    "answer": "You can subscribe to restock alerts by entering your email or enabling notifications on the product page. Once the item is available again, you’ll receive an instant email or app notification."
  }
]


const FaqSection = () => {
  return (
    <section data-aos="fade-up" className='my-20'>
      <div className='text-center mb-10'>
        <SectionHeading
          title="Frequently Asked Question (FAQ)"
          description="Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!"
          titleColor="text-[#03373D]"
          descriptionColor="text-[#606060]"
        />
      </div>
      <div className='w-full lg:max-w-5xl mx-auto space-y-4'>
        {faqData.map((faq, i) => (
          <FaqItem key={i + 1} faq={faq} defaultChecked={i === 0}></FaqItem>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;