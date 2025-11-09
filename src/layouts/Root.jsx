import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';

const Root = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <header>
        <Navbar></Navbar>
      </header>
      <main className='flex-1'>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default Root;