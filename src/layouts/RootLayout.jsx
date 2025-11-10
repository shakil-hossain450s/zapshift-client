import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';

const RootLayout = () => {
  return (
    <div className='bg-[#EAECE9FF]' >
      <div className='flex flex-col min-h-screen max-w-[1600px] w-11/12 mx-auto'>
        <header>
          <Navbar />
        </header>
        <main className='flex-1 min-h-[70vh]'>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>

  );
};

export default RootLayout;