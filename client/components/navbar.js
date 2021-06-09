import  {useEffect, useState} from 'react';
import Amplify, {Auth} from 'aws-amplify';
import awsExports from '../src/aws-exports';
import {AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Link from 'next/link';
import CartIcon from './cart-icon';
import { useSelector } from 'react-redux';
import CartDropdown from './cart-dropdown';



export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(true);
  const hidden = useSelector((state) => state.cart.hidden);
  const currentUser = useSelector((state) => state.user.currentUser);

  const name = useSelector((state) => {
    if(currentUser) {
      return state.user.currentUser.attributes.name
    } else {
      return null
    }});


    const links = [
      !currentUser && { label: 'menu', href: '/menu'},
      !currentUser && { label: 'sign in', href: '/user'},
      !currentUser && { label: 'cart', href: '/cart'},
      currentUser && { label: 'menu', href: '/menu'},
      currentUser && { label: `${name}`, href: '/user'},
      currentUser && { label: 'sign out', href: '/user/signout'},
      currentUser && { label: 'cart', href: '/cart'},
    ]
    // Filter out all non-truthy values)
    .filter((linkConfig) => linkConfig)
    .map(({label, href}) => {
      return (
        <div key={href}>
          <Link href={href}>
            <a className="nav-item">{label}</a>
          </Link>
        </div>
      )
    });

    const mobileLinks = [
      !currentUser && { label: 'menu', href: '/menu'},
      !currentUser && { label: 'signin/signup', href: '/user'},
      !currentUser && { label: 'cart', href: '/cart'},
      currentUser && { label: 'cart', href: '/cart'},
      currentUser && { label: 'menu', href: '/menu'},
      currentUser && { label: `${name}`, href: '/user'},
    ]
    .filter((linkConfig) => linkConfig)
    .map(({label, href}) => {
      return (
        <div className="row-span-1" key={href}>
          <Link href={href}>
            <a onClick={handleOpenMenu} className="mobile-nav-item">{label}</a>
          </Link>
        </div>
      )
    })

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    // Later, add 'fixed' back
    <nav className="fixed z-50 w-full top-0 bg-default-background-opaque">
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button onClick={handleOpenMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {/* <!-- Icon when menu is closed. --> */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open. */}
              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Menu Bar */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo Goes here */}
              <div className="font-extralight text-lg block">
                <Link href='/'>
                  <a>
                    <img src='/coffee.svg' alt='logo' className=""/>
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:ml-6 justify-center items-center text-center">
              <div className="flex space-x-4">
                {links}
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <CartIcon />
            {hidden ? null : <CartDropdown />}
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle classNamees based on menu state. */}
      <div className={`${openMenu ? '' : 'hidden'} sm:hidden h-2/5 w-full fixed z-10 bg-mobile-nav-bg text-md`}>
        {/* Removed 'px-2 pt-2 pb-3 space-y-1 ' */}
        <div className="w-full h-full grid grid-rows-4 text-center items-center">
          {mobileLinks}
        </div>
      </div>
    </nav>
  )
};