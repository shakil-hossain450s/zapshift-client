const SectionHeading = ({ title, description }) => {
  return (
    <div className='max-w-2xl mx-auto mb-6'>
      <h2 className='text-3xl font-bold text-white mb-4'>{title}</h2>
      <p className='text-[#DADADA]'>{description}</p>
    </div>
  );
};

export default SectionHeading;