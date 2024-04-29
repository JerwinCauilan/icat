import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import image from '../assets/404.svg';
import { FiCheck } from "react-icons/fi";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const Verification = () => {
    const [loading, setLoading] = useState(true);
    const [verifyStatus, setVerifyStatus] = useState(null);
    const { token, id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token || !id) {
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 10000);
                return;
            }
    
            try {
                setTimeout(async () => {
                    const response = await axios.get(`/api/application/verify/${token}/${id}`);
                    const data = response.data;

                    setVerifyStatus(data);
                    setLoading(false);
                    if (data && data.success) {
                        console.log('Verification success');
                    } else {
                        console.log('Verification failed');
                        setTimeout(() => {
                            navigate('/');
                        }, 10000);
                    }
                }, 3000);
            } catch (e) {
                setVerifyStatus({ success: false, message: 'Error verifying token.' });
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 10000);
            }
        };
    
        verifyToken(); 
    }, [id, token, navigate]);

    return (
        <div className='bg-[#F8F7F4] overflow-y-hidden w-full h-screen flex justify-center items-center'>
            {loading ? (
                <LoadingComponent />
            ) : verifyStatus && verifyStatus.success ? (
                <VerifiedComponent />
            ) : (
                <ErrorComponent />
            )}
        </div>
    )
}

const LoadingComponent = () => (
    <div className='flex items-center justify-center text-gray-600'>
        <CgSpinnerTwoAlt className='animate-spin h-10 w-10 text-[#520000]' />
    </div>
);

const VerifiedComponent = () => (
    <div className='flex flex-col items-center shadow rounded-xl bg-[#FEDED6] px-60 py-20'>
        <div className='w-28 h-28 rounded-full flex items-center justify-center bg-[#520000] text-white'>
            <FiCheck size={70} />
        </div>
        <h1 className='text-2xl font-bold mt-10 mb-2 select-none'>Verified!</h1>
        <p className='font-medium text-base text-gray-500 mb-10 select-none'>You have successfully verified account.</p>
        <Link to='/' className='btn bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize px-5'>Home Page</Link>
    </div>
);

const ErrorComponent = () => (
    <div className='flex flex-col items-center'>
        <img className='object-cover object-center object' src={image} alt='Error' />
    </div>
);

export default Verification
