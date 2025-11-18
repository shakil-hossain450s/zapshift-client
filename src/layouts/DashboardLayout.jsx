import { Link, NavLink, Outlet } from 'react-router';
import logo from '../assets/images/logo.png'
import { FaBox, FaMoneyCheckAlt, FaMapMarkerAlt, FaUserEdit, FaUserCheck, FaUserClock, FaUserShield, FaMotorcycle } from 'react-icons/fa';
import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {
  const { role, isAdmin, loading } = useUserRole();
  const links = <>
    <li className="mb-2">
      <NavLink to='/dashboard/my-parcels'>
        <FaBox className="text-blue-500" />
        My Parcels
      </NavLink>
    </li>

    <li className="mb-2">
      <NavLink to='/dashboard/payment-history'>
        <FaMoneyCheckAlt className="text-green-500" />
        Payment History
      </NavLink>
    </li>

    <li className="mb-2">

      <NavLink to='/dashboard/track-parcel'>
        <FaMapMarkerAlt className="text-yellow-500" />
        Track a Package
      </NavLink>
    </li>

    <li className="mb-2">

      <NavLink to='/dashboard/update-profile'>
        <FaUserEdit className="text-purple-500" />
        Update Profile
      </NavLink>
    </li>

    {
      !loading && role === 'admin' && isAdmin &&
      <>
        <li className="mb-2">
          <NavLink to='/dashboard/assign-rider'>
            <FaMotorcycle className="text-teal-500" />
            Assign Rider
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to='/dashboard/active-riders'>
            <FaUserCheck className="text-teal-500" />
            Active Riders
          </NavLink>
        </li>

        <li className="mb-2">
          <NavLink to='/dashboard/pending-riders'>
            <FaUserClock className="text-orange-500" />
            Pending Riders
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to='/dashboard/make-admin'>
            <FaUserShield className="text-orange-500" />
            Make Admin
          </NavLink>
        </li>
      </>
    }

  </>
  return (
    <section className='bg-[#EAECE9FF]'>
      <div className='flex flex-col min-h-screen max-w-[1600px]  mx-auto'>
        <div className="drawer md:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}

            {/* Navbar */}
            <div className="navbar bg-base-300 w-full md:hidden">
              <div className="flex-none md:hidden">
                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <Link to="/" className="text-xl flex items-end relative">
                <img className="w-6 md:w-10" src={logo} alt="" />
                <span className="text-xl md:text-2xl font-bold text-[#303030] absolute left-6">ZapShift</span>
              </Link>
            </div>
            {/* Page content here */}
            <div className='py-2 px-3 md:p-4'>
              <Outlet />
            </div>

          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 min-h-full w-56 p-4">
              {/* Sidebar content here */}
              <div>
                <Link to="/" className="mb-6 text-xl flex items-end relative">
                  <img className="w-6 md:w-10" src={logo} alt="" />
                  <span className="text-xl md:text-2xl font-bold text-[#303030] absolute left-6 ">ZapShift</span>
                </Link>
                <div className='mb-2 md:mb-4'>
                  <h3 className='text-xl font-bold text-[#303030]'>Dashboard</h3>
                </div>
              </div>
              {links}
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
};

export default DashboardLayout;