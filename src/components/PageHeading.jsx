const PageHeading = ({ title, description }) => {
  return (
    <>
      <div className='max-w-2xl'>
        <h1 data-aos='fade-right' className='text-2xl mb-4 md:text-4xl lg:text-5xl font-bold text-[#03373D]'>{title}</h1>
        <p data-aos='fade-right' className='text-[#606060]'>{description}</p>
      </div>
      <div className='border-b border-[#0000001A] w-full my-8'></div>
    </>
  );
};

export default PageHeading;