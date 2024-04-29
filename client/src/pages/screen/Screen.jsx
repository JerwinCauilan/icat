import React from 'react'
import Header from '../../components/Header'
import Hero from '../../assets/hero.svg'
import { FiAlertOctagon } from "react-icons/fi";


const Screen = () => {
  return (
    <div className='w-full min-h-screen bg-[#F8F7F4]'>
      <Header />
      <section className='flex justify-between items-center px-[9%] max-lg:px-[2%] max-sm:px-[1.5%]'>
        <div className='w-[900px]'>
            <h1 className='font-bold text-6xl text-[#000] mt-44 leading-tight max-md:text-5xl max-md:text-center max-sm:text-2xl'>Online Application for <span className='text-[#520000]'>ISPSC</span> College <span className='text-warning'>Admission</span> Test</h1>
            <h3 className='text-[#000] mt-5 text-xl font-medium max-md:text-center max-md:text-lg'>ISPSC - College Admission Test 1st Term S.Y 2024-2025</h3>
            <div className='bg-[#FEDED6] rounded-xl w-[500px] h-80 pt-6 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                <div className="icon bg-[#520000] w-[70px] h-[70px] rounded-full flex justify-center items-center max-sm:w-[60px] max-sm:h-[60px]">
                    <FiAlertOctagon className='text-[#fefefe] items-center' size={40}/>
                </div>
                <p className='text-[#000] font-bold text-base pt-5 max-sm:text-sm'>Data Privacy Consent for Applicants:</p>
                <p className='text-[#000] font-light text-justify pt-2 max-sm:text-xs'>I understand that by providing my information. I give my full-consent to the Office of the Admission for the
                collection, use, and processing of the information provided above with respect to my admission, enrollment,
                scholarship financial assistance, graduation, and verification of records.</p>
            </div>
        </div>
        <img className='mt-20 max-lg:w-[380px] max-lg:h-[380px] max-md:hidden' src={Hero} alt="" />
      </section>
    </div>
  );
}

export default Screen
