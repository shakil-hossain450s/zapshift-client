import { FaBuilding, FaExchangeAlt, FaGlobeAsia, FaMoneyBillWave, FaTruck, FaWarehouse } from 'react-icons/fa';
import SectionHeading from '../../SectionHeading';
import ServiceCard from './ServiceCard';

const servicesData = [
  {
    icon: FaTruck,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    icon: FaGlobeAsia,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    icon: FaWarehouse,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: FaBuilding,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    icon: FaExchangeAlt,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const Services = () => {
  return (
    <section data-aos="fade-up" className='bg-[#03373D] py-10 md:py-20 px-4 md:px-10 my-20 rounded-2xl'>
      <div className='text-center'>
        <SectionHeading title="Our Services" description="Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time."></SectionHeading>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10'>
        {
          servicesData.map(service => (
            <ServiceCard key={service.title} service={service} />
          ))
        }
      </div>
    </section>
  );
};

export default Services;