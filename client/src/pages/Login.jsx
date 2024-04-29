import React, { useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import securityPic from '../assets/security.svg'
import logo from '../assets/logo.png'

const Login = () => {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = inputData;

    const handleChange = (e) => {
        setInputData({...inputData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axios.post('/api/login', {
                email,
                password
            });
    
            const data = res.data;
            login(data.token, data.user);
            Swal.fire({
                title: `${data.message}`,
                icon: "success",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            navigate('/schedule');
        } catch(e) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${e.response.data}`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
        }
    }

  return (
    <div className='bg-[#F8F7F4] w-full min-h-screen relative flex items-center justify-center'>
        <div className='bg-[#fefefe] flex flex-wrap justify-center w-[1200px] h-[650px] shadow rounded-2xl divide-x-2 divide-gray-300 max-md:mx-10 max-md:divide-x-0 max-sm:mx-2'>
            <div className='w-1/2 flex items-center max-md:hidden'>
                <img className='object-cover object-center' src={securityPic} alt="Security Photo" />
            </div>
            <div className='w-1/2 flex items-center flex-col justify-center max-md:w-full'>
                <img className='w-[100px] h-[100px]' src={logo} alt="logo" />
                <h1 className='text-2xl mt-6 font-bold text-center text-black flex items-center justify-center select-none'>Welcome back!</h1>
                <p className='text-xs italic mt-2 mb-5 text-center text-black select-none'>Please sign in to continue</p>
                <form onSubmit={handleSubmit} className='mx-auto w-full px-24 max-xl:px-20 max-lg:px-16 max-sm:px-2'>
                    <div className='mt-6'>
                        <label className='label-text font-medium select-none'>Email Address</label>
                        <input className='bg-white p-4 pr-4 text-xs w-full rounded-md border border-solid border-[#e5e7eb] outline-none my-[10px] shadow-sm' type="email" placeholder='Enter your email address' name='email' value={email} onChange={handleChange} />
                    </div>

                    <div className='mt-3'>
                        <label className='label-text font-medium select-none'>Password</label>
                        <input className='bg-white p-4 pr-4 text-xs w-full rounded-md border border-solid border-[#e5e7eb] outline-none my-[10px] shadow-sm' type="password" placeholder='Enter your password' name='password' value={password} onChange={handleChange} autoComplete='off'/>
                    </div>
                    {/* <div>
                        <Link to='/' className='text-sm text-black border-none float-end capitalize max-sm:text-xs'>Forgot password?</Link>
                    </div> */}
                    <button className='btn w-full bg-[#DE7773] hover:opacity-80 duration-300 text-sm text-white rounded-md border-none shadow capitalize mt-5' disabled={isSubmitting}> {isSubmitting ? 'Submitting...' : 'Login'}</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login