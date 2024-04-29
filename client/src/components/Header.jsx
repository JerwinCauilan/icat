import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

  return (
    <header className="navbar px-[9%] py-[1%] bg-[#520000] max-lg:px-[1%] max-md:px-[0] shadow-sm">
        <div className="navbar-start">
            <h1 className="text-5xl text-[#fefefe] font-bold max-md:text-3xl max-sm:text-xl">ICAT Application</h1>
        </div>

       
          <div className="navbar-end max-md:pr-2 max-sm:pr-1">
            <div className="dropdown dropdown-bottom dropdown-end">
            {location.pathname === '/' &&
              <div tabIndex={0} role="button" className="btn btn-md rounded-sm text-lg font-semibold bg-[#FEDED6] text-[#000] border-none outline-none max-sm:btn-sm max-md:btn-md max-lg:btn-lg">Apply for ICAT</div>
            }
                <ul tabIndex={0} className="dropdown-content z-[1] menu mt-3 py-2 shadow bg-[#FEDED6] rounded-sm w-52 divide-y">
                  <li><Link to='/freshmen' className='rounded-sm w-full mb-3 text-base font-medium'>Freshmen</Link></li>
                  <li><Link to='/transferee' className='rounded-sm text-base font-medium'>Transferee</Link></li>
                </ul>
            </div>
          </div>
        
    </header>
  )
}

export default Header
