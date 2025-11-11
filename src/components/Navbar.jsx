import { Link, NavLink } from "react-router";
import PrimaryButton from "./PrimaryButton";
import logo from "../assets/images/logo.png";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, signOutUser } = useAuth();

  const links = <>
    <li><NavLink to="/">Home</NavLink></li>
    <li><NavLink to="/services">Services</NavLink></li>
    <li><NavLink to="/coverage">Coverage</NavLink></li>
    <li><NavLink to="/about">About Us</NavLink></li>
    <li><NavLink to="/pricing">Pricing</NavLink></li>
    <li><NavLink to="/be-a-rider">Be a Rider</NavLink></li>
  </>

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully!');
    } catch (err) {
      console.log(err);
      toast.error(err.code)
    }
  }

  return (
    <div data-aos="fade-up" className="navbar bg-base-100 shadow-sm rounded-2xl mt-4 pr-2 md:p-3 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content gap-1 bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <Link to="/" className="text-xl flex items-end relative">
          <img className="w-6 md:w-10" src={logo} alt="" />
          <span className="text-xl md:text-2xl font-bold text-[#303030] absolute left-6">ZapShift</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-[#303030] gap-1">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-4">
        {
          user?.email ? (
            <button onClick={handleSignOut} className='btn btn-outline min-h-12 px-7 text-[#606060] rounded-lg border border-[#DADADA] font-medium hover:-translate-y-0.5 duration-400 text-[16px]'>
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/signin">
                <button className='btn btn-outline min-h-12 px-7 text-[#606060] rounded-lg border border-[#DADADA] font-medium hover:-translate-y-0.5 duration-400 text-[16px]'>
                  Sign In
                </button>
              </Link>
              <span className="hidden md:block">
                <PrimaryButton>Be a Rider</PrimaryButton>
              </span>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;