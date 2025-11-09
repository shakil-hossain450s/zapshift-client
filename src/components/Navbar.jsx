import { Link, NavLink } from "react-router";
import PrimaryButton from "./PrimaryButton";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const links = <>
    <li><NavLink to="/">Home</NavLink></li>
    <li><NavLink to="/services">Services</NavLink></li>
    <li><NavLink to="/coverage">Coverage</NavLink></li>
    <li><NavLink to="/about-us">About Us</NavLink></li>
    <li><NavLink to="/pricing">Pricing</NavLink></li>
    <li><NavLink to="/be-a-rider">Be a Rider</NavLink></li>
  </>
  return (
    <div className="navbar bg-base-100 shadow-sm rounded mt-4 p-3">
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
        <Link className="text-xl flex items-end relative">
          <img className="w-10" src={logo} alt="" />
          <span className="text-2xl font-bold text-[#303030] absolute left-6">ZapShift</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-[#303030] gap-1">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <button className='btn btn-outline min-h-12 px-7 text-[#606060] rounded-lg border border-[#DADADA] font-medium hover:-translate-y-0.5 duration-400 text-[16px]'>
          Sign In
        </button>
        <PrimaryButton>Be a Rider</PrimaryButton>
      </div>
    </div>
  );
};

export default Navbar;