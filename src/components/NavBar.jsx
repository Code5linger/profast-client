import React from 'react';
import { NavLink } from 'react-router';
import ProFastLogo from './ProFastLogo';

const NavBar = () => {
  const subMenu = (
    <>
      <li>
        <NavLink className={'px-5 py-3'} to={'/services'}>
          Services
        </NavLink>
      </li>
      <li>
        <NavLink className={'px-5 py-3'} to={'/coverage'}>
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink className={'px-5 py-3'} to={'/sendParcel'}>
          Send Parcel
        </NavLink>
      </li>
      <li>
        <NavLink className={'px-5 py-3'} to={'/about'}>
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink className={'px-5 py-3'} to={'/pricing'}>
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink className={'px-5 py-3'} to={'/rider'}>
          Be a Rider
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className=" bg-base-100 shadow-sm mb-15 ">
      <div className="max-w-[1500px] mx-auto navbar  ">
        <div className="navbar-start ">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{' '}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {subMenu}
            </ul>
          </div>
          <NavLink to={'/'} className="btn btn-ghost text-xl">
            <ProFastLogo />
          </NavLink>
        </div>
        {/*  */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal m-0 gap-9 ">{subMenu}</ul>
        </div>
        <div className="navbar-end gap-3">
          <NavLink to={'/login'} className={'btn  text-black'}>
            Login
          </NavLink>
          <NavLink to={'/register'} className={'btn  text-black'}>
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
