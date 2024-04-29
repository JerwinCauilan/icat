import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const {userData } = useAuth();
  const [inputData, setInputData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    conPassword: '',
  });

  const clearInputData = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      conPassword: '',
    });
}

  const { firstName, lastName, email, phone } = inputData;
  const { oldPassword, newPassword, conPassword } = passwordData;

  const id = userData._id;

  useEffect(() => {
    fetchData();
  },[id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/getUser/${id}`);
      const data = response.data;
      setInputData(data);
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
    }
  };


  const handleChange  = (e) => {
    setInputData({...inputData, [e.target.name]: e.target.value});
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/editUser/${id}`, inputData).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

        fetchData();
      });
    } catch(e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${e.response.data}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password must have at least 8 characters.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    if (newPassword !== conPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New password and Confirm password does not match!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    if (!/^[A-Z]/.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'First letter must be uppercase!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    try {
      await axios.put(`/api/user/password/${id}`, {
        oldPassword,
        newPassword,
      }).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

        clearInputData();
      });
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${e.response.data}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
    }
  };



  return (
    <div className='flex bg-[#F4F4F4]'>
      <Sidebar/>

      <div className='bg-gray-50 mt-20 mb-10 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-4 p-2.5 md:p-10'>
          <div className='flex justify-between'>
            <h2 className='text-base font-bold text-[#520000] break-all md:text-lg'>Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>First Name</h3>
                <input type='text' placeholder='First Name' name='firstName' value={firstName} onChange={handleChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Last Name</h3>
                <input type='text' placeholder='Last Name' name='lastName' value={lastName} onChange={handleChange} required/>
              </div>
            </div>


            <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Email</h3>
                <input type='text' placeholder='Email Address' name='email' value={email} onChange={handleChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Phone</h3>
                <input type='text' placeholder='Phone' name='phone' value={phone} onChange={handleChange} required/>
              </div>
            </div>

            <button type='submit' className="bg-[#DE7773] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">Save Changes</button>
          </form>

          <div className='flex justify-between mt-20'>
            <h2 className='text-base font-bold text-[#520000] break-all md:text-lg'>Security</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} >
            <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Old Password</h3>
                <input type='password' placeholder='Old Password' name='oldPassword' value={oldPassword} onChange={handlePasswordChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>New Password</h3>
                <input type='password' placeholder='New Password' name='newPassword' value={newPassword} onChange={handlePasswordChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Confirm Password</h3>
                <input type='password' placeholder='Confirm Password' name='conPassword' value={conPassword} onChange={handlePasswordChange} required/>
              </div>
            </div>

            <button type='submit' className="bg-[#DE7773] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">Change password</button>
          </form>
        
      </div>
    </div>
  )
}

export default Profile