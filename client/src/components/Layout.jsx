import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import CategoryHeader from './CategoryHeader';

const Layout = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <CategoryHeader/>
          <Outlet />
          <Footer/>
    </div>
  );
}

export default Layout