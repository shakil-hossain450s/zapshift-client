const SectionHeading = ({ title, description, titleColor, descriptionColor }) => {
  return (
    <div data-aos="fade-up" className='max-w-2xl mx-auto mb-6'>
      <h2 className={`text-3xl font-bold  mb-4 ${!titleColor ? 'text-white' : titleColor}`}>{title}</h2>
      <p className={`${!descriptionColor ? 'text-[#DADADA]' : descriptionColor}`}>{description}</p>
    </div>
  );
};

export default SectionHeading;