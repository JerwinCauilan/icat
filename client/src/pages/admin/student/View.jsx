import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { HiOutlinePencilSquare, HiOutlineDocumentText } from "react-icons/hi2";

const View = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    unitAddress: '',
    streetAddress: '',
    city: '',
    email: '',
    phone: '',
    zipCode:'',
    school: '',
    schoolAddress: '',
    course: ''
  });
 

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData,5000);
    return () => clearInterval(interval);
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/student/${id}`);
      const data = response.data;
      setStudentData(data);
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

  const handleChange = (e) => {
    setInputData({...inputData, [e.target.name]: e.target.value});
  }

  const handleEdit = async (id) => {
    setInputData({...studentData});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/student/edit/${id}`, inputData).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

        setIsModalOpen(false);
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
  };

  
  const handleViewPDF = async (pdfPath) => {
    try {
      const response = await axios.get(`/api/viewPdf/${pdfPath}`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      window.open(url, '_blank');
    } catch (e) {
      console.error('Error fetching PDF:', e);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please try again later.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
    }
  };


  return (
    <div className='flex bg-[#F4F4F4]'>
      <Sidebar/>

      <div className='bg-gray-50 mt-20 mb-10 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-4 p-2.5 md:p-10'>
          <div className='flex justify-between'>
            <h2 className='text-base font-bold text-[#520000] break-all md:text-lg'>General Information</h2>
            <button className='bg-[#DE7773] hover:opacity-80 flex items-center text-white text-xs rounded-md p-1.5 gap-1' onClick={() => handleEdit(studentData._id)}><HiOutlinePencilSquare size={20} /> Edit</button>
          </div>

          <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Full Name</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.firstName} {studentData.middleName} {studentData.lastName} {studentData.extensionName}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Complete Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.unitAddress}, {studentData.streetAddress}, {studentData.city}, {studentData.zipCode}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Email Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.email}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Phone Number</h3>
              <p className='text-xs md:text-base font-medium text-black'>+63 {studentData.phone}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>School</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.school}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>School Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.schoolAddress}</p>
            </div>
          </div>

          <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-5'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5 mr-10'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Course</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.course}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5 mr-10'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Status</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.studentStatus}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Created At</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.createdAt ? format(new Date(studentData.createdAt),'MMM dd, yyyy | hh:mm a') : 'N/A'}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 mt-3'>
          {studentData.files && studentData.files.map((pdf, i) => (
            <button key={i} className="bg-[#DE7773] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5" onClick={() => handleViewPDF(pdf)}><HiOutlineDocumentText size={20}/> View PDF {i + 1}</button>
          ))}
          </div>
        
      </div>


      <dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="modal">
        <div className='fixed inset-0 bg-black opacity-35'></div>
        <div className="modal-box flex items-center justify-center flex-col w-full lg:max-w-[900px] md:max-w-[700px]">
          <h3 className="font-bold text-lg mt-2">Edit Information</h3>
          <div className="modal-action relative">
            <form onSubmit={handleSubmit} className="p-4" method="dialog">

              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>First Name</label>
                  <input type="text" placeholder='First Name' name='firstName' value={inputData.firstName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Middle Name</label>
                  <input type="text" placeholder='Middle Name' name='middleName' value={inputData.middleName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Last Name</label>
                  <input type="text" placeholder='Last Name' name='lastName' value={inputData.lastName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Suffix</label>
                  <input type="text" placeholder='Suffix' name='extensionName' value={inputData.extensionName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Apartment, unit #</label>
                  <input type="text" placeholder='Apartment, unit #' name='unitAddress' value={inputData.unitAddress} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Street Address</label>
                  <input type="text" placeholder='Street Address' name='streetAddress' value={inputData.streetAddress} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>City</label>
                  <input type="text" placeholder='City' name='city' value={inputData.city} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Zip code</label>
                  <input type="text" placeholder='Zip code' name='zipCode' value={inputData.zipCode} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>School Name</label>
                  <input type="text" placeholder='School Name' name='school' value={inputData.school} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>School Address</label>
                  <input type="text" placeholder='School Address' name='schoolAddress' value={inputData.schoolAddress} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Course</label>
                  <input type="text" placeholder='Course' name='course' value={inputData.course} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Email Address</label>
                  <input type="email" placeholder='Email Address' name='email' value={inputData.email} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-1/2'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Phone Number</label>
                  <input type="number" placeholder='+63' name='phone' value={inputData.phone} onChange={handleChange} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' maxLength={10} />
                </div>
              </div>
              

              <div className='flex justify-end mt-4'>
                <button type='submit' className='bg-green-500 hover:bg-green-400 flex items-center text-white text-xs rounded-md p-1.5 px-3 gap-1'>Save</button>
              </div>
        
            </form>

            <div className='absolute bottom-4 left-2'>
              <button className='bg-[#DE7773] hover:opacity-80 flex items-center text-white text-xs rounded-md p-1.5 gap-1 mr-4' onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
          
        </div>
      </dialog>
    </div>
  )
}

export default View