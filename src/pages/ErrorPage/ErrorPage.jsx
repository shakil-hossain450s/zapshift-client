import Lottie from 'lottie-react';
import errorAnimation from '../../assets/animations/error.json';
import PrimaryButton from '../../components/PrimaryButton';
import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <section className='mt-4 mb-10 bg-white rounded-2xl p-6 text-center flex flex-col items-center justify-center'>
      <Lottie data-aos="fade-down" animationData={errorAnimation} loop={true} style={{ width: 300, height: 300 }} />
      <h2 data-aos='fade-right' className='text-5xl font-bold text-[#1A1A1A]'>Oops! 404 - Page not found!</h2>
      <Link data-aos='fade-left' to='/' className='mt-8 inline-block'>
        <PrimaryButton>
          Go Home
        </PrimaryButton>
      </Link>
    </section>
  );
};

export default ErrorPage;