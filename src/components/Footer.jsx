import { Link, NavLink } from "react-router";
import logo from "../assets/images/logo.png";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer dat-aos="fade-up" className="footer footer-horizontal footer-center bg-[#0B0B0B] text-[#DADADA] p-4 md:p-10 mb-4 rounded-2xl">
      <aside className="max-w-2xl mx-auto">
        <Link to="/" className="text-xl flex items-end relative -left-10">
          <img className="w-10" src={logo} alt="" />
          <span className="text-2xl font-bold absolute left-6">ZapShift</span>
        </Link>
        <p className="my-3">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
        </p>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
      <div className="border border-dashed border-[#03464D] w-full"></div>
      <div className="flex gap-4 list-none -my-10">
        <li className="hover:underline"><Link to="/services">Services</Link></li>
        <li className="hover:underline"><Link to="/coverage">Coverage</Link></li>
        <li className="hover:underline"><Link to="/about-us">About Us</Link></li>
        <li className="hover:underline"><Link to="/pricing">Pricing</Link></li>
      </div>
      <div className="border border-dashed border-[#03464D] w-full"></div>
      <div className="flex gap-6">
        <span className="text-2xl cursor-pointer md:text-4xl hover:-translate-y-1 duration-200">
          <FaFacebook />
        </span>
        <span className="text-2xl cursor-pointer md:text-4xl hover:-translate-y-1 duration-200">
          <FaTwitter />
        </span>
        <span className="text-2xl cursor-pointer md:text-4xl hover:-translate-y-1 duration-200">
          <FaYoutube />
        </span>
        <span className="text-2xl cursor-pointer md:text-4xl hover:-translate-y-1 duration-200">
          <FaLinkedin />
        </span>
      </div>
    </footer>
  );
};

export default Footer;