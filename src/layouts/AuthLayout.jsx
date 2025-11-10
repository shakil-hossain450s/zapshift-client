import authImage from '../assets/images/authImage.png';
import logo from '../assets/images/logo.png'
import { Link, Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className='md:flex min-h-screen'>
      <div className='flex-1'>
        <div className='lg:max-w-[800px] w-11/12 mx-auto'>
          <div data-aos="fade-right" className='pt-4'>
            <Link to="/" className="text-xl flex items-end relative">
              <img className="w-6 md:w-10" src={logo} alt="" />
              <span className="text-xl md:text-2xl font-bold text-[#303030] absolute left-6">ZapShift</span>
            </Link>
          </div>
          <div data-aos="fade-up" className='px-4 pt-10 md:p-10'>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <div data-aos="fade-left" className='flex-1 hidden md:block bg-[#FAFDF0]'>
        <div className='lg:max-w-[800px] w-11/12 mx-auto flex justify-center items-center min-h-screen'>
          <img className='w-full' src={authImage} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;