import React from 'react';
import { NavLink, Outlet } from 'react-router';
import authImg from '../assets/authImage.png';
import ProFastLogo from '../components/ProFastLogo';

const AuthLayout = () => {
  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      <NavLink to={'/'} className="p-12">
        <ProFastLogo />
      </NavLink>
      <div className="hero-content flex-col lg:flex-row-reverse flex-1 flex items-center justify-center">
        <div className="flex-1">
          <img src={authImg} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
