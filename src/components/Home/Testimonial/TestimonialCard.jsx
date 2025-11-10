import { FaQuoteRight } from 'react-icons/fa';

const TestimonialCard = ({ testimonial }) => {
  const { feedback, name, position, avatarColor } = testimonial;
  return (
    <div className='bg-white rounded-xl p-8 max-w-sm min-h-[280px] flex flex-col justify-between'>
      <div>
        <span className='text-3xl text-[#03464D] opacity-30'>
          <FaQuoteRight />
        </span>
        <p className='text-[#606060] mt-4'>{feedback}</p>
      </div>
      <div>
        <div className='border-b border-dashed border-[#606060] my-4'></div>
        <div className='flex gap-3 items-center'>
          <div className=' h-12 w-12 rounded-full' style={{ backgroundColor: avatarColor }}></div>
          <div>
            <h3 className='text-lg text-[#03464D] font-bold'>{name}</h3>
            <p className='text-[#606060]'>{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;