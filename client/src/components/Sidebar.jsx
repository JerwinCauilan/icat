import React, { useState } from 'react'
import { HiBars3BottomRight, HiOutlineArrowLeftEndOnRectangle } from "react-icons/hi2"
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarData } from '../data/sidebarData'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredLogout, setHoveredLogout] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

  return (
    <div className='bg-[#0e0e0e] min-h-screen w-28 duration-500 text-gray-100 flex flex-col items-center'>
        <div className='flex justify-center py-3'>
            <h1 className='drop-shadow select-none text-2xl font-bold mb-6 mt-2 text-center uppercase whitespace-pre duration-500'>ICAT</h1>
        </div>
        
        <div className='flex flex-col ms-1 gap-5 relative'>
            {sidebarData.map((item, i) => (
                <NavLink to={item.url} key={i} className={`flex items-center text-base gap-3.5 p-2 hover:bg-[#DE7773] rounded-md ${location.pathname === item.url ? 'bg-[#DE7773]' : ''}`} onMouseEnter={() => setHoveredItem(i)} onMouseLeave={() => setHoveredItem(null)}>
                    <div>{item.icon}</div>
                    {hoveredItem === i && (
                        <h2 className='absolute z-[1] left-[58px] drop-shadow-lg bg-[#DE7773] font-medium rounded-md whitespace-pre duration-500 px-2 py-1'>{item.title}</h2>
                    )}
                </NavLink>
            ))}
            <button className='flex items-center text-base gap-3.5 font-medium p-2 hover:bg-[#DE7773] rounded-md' onClick={logout} onMouseEnter={() => setHoveredLogout(true)} onMouseLeave={() => setHoveredLogout(false)}>
                <div>
                    <HiOutlineArrowLeftEndOnRectangle size={20}/>
                </div>
                {hoveredLogout && (
                    <span className='absolute z-[1] left-[58px] drop-shadow-lg bg-[#DE7773] font-medium rounded-md whitespace-pre duration-500 px-2 py-1'>Logout</span>
                )}
            </button>
        </div>
    </div>
  )
}

export default Sidebar