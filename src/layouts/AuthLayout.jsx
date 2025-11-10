import authImage from '../assets/images/authImage.png';
import logo from '../assets/images/logo.png'
import { Link, Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="bg-[#EAECE9FF]">
      <div className=' min-h-screen max-w-[1600px] w-11/12 mx-auto'>
        <div className='pt-4'>
          <Link to="/" className="text-xl flex items-end relative">
            <img className="w-6 md:w-10" src={logo} alt="" />
            <span className="text-xl md:text-2xl font-bold text-[#303030] absolute left-6">ZapShift</span>
          </Link>
        </div>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className='w-full flex-1'>
            <img src={authImage} />
          </div>
          <div className='flex-1 p-10'>
            <Outlet></Outlet>
          </div>
        </div></div>

    </div>
  );
};

export default AuthLayout;