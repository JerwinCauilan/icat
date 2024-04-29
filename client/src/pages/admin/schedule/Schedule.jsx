import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import { HiOutlineClipboardDocumentList, HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { format } from 'date-fns';

const Schedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [inputData, setInputData] = useState({
    date: new Date(),
    time: '09:00',
    maxStudent: '',
  });
 

  const { date, time, maxStudent } = inputData;

  const handleChange = (name, value) => {
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours);
      selectedTime.setMinutes(minutes);

      const dataPass = { ...inputData, time: selectedTime };

      await axios.post('/api/schedule/create', dataPass).then((res) => {
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
      })

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
      setIsModalOpen(false);
    }
  }


  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData,5000);
    return () => clearInterval(interval);
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/schedule');
      const data = response.data;
      setScheduleData(data);
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


  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to recover it",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22C55E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    if(confirm.isConfirmed) {
      try {
        const response = await axios.delete(`/api/schedule-delete/${id}`);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        fetchData();
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
    } 
  };
  

  return (
    <div className='flex bg-[#F4F4F4]'>
      <Sidebar/>
      
        <div className="bg-white mt-20 mb-20 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-5">

          <div className='bg-[#DE7773] justify-end flex items-center h-20'>
            {/* <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-md p-2 w-52 md:w-64 text-xs md:text-sm focus:outline-none focus:border-[#DE7773] mx-2 my-4" /> */}
            <button className='flex px-4 mx-3 gap-1.5 p-2.5 bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize' onClick={() => setIsModalOpen(true)}><HiOutlinePlusCircle size={20}/> Add</button>
          </div>
        
          <div className='overflow-x-auto'>
            <table className="table-auto table sm:table divide-y text-sm text-left">
              <thead className='bg-gray-200'>
                <tr className='text-gray-600 font-bold'>
                  <th scope="col">#</th> 
                  <th scope="col">Date</th> 
                  <th scope="col">Time</th> 
                  <th scope="col" className="hidden md:table-cell">Max applicant</th>  
                  <th scope="col" className="px-2 sm:px-5">Actions</th>
                </tr>
              </thead> 
              <tbody>
                {scheduleData.map((data, i) => ( 
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{format(new Date(data.date),'MMM dd, yyyy')}</td>
                  <td>{format(new Date(data.time),'hh:mm a')}</td>
                  <td className='hidden md:table-cell'>{data.maxStudent}</td>
                  <td className='flex gap-3.5 px-2 sm:px-5 py-2 whitespace-nowrap text-sm text-gray-500'>
                    <Link to={`/schedule/${data._id}`}><button className='bg-[#DE7773] hover:opacity-80 flex items-center text-white text-xs rounded-md p-1.5 gap-1'><HiOutlineClipboardDocumentList size={20}/> View</button></Link>
                    <button className='bg-[#DE7773] hover:opacity-80 flex items-center text-white text-xs rounded-md p-1.5 gap-1' onClick={() => handleDelete(data._id)}><HiOutlineTrash size={20} /> Delete</button>
                  </td>
                </tr>
                ))}
              </tbody> 
            </table>
          </div>

        </div>

      <dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="modal">
        <div className='fixed inset-0 bg-black opacity-35'></div>
        <div className="modal-box px-10">
          <h3 className="font-bold text-lg mt-2 text-center">Add New Schedule?</h3>
          <div className="modal-action relative">
            <form onSubmit={handleSubmit} className="p-4 w-full" method="dialog">
                <div className='mb-4'>
                  <div className='label-text text-red-700 font-bold select-none'>*</div>
                  <DatePicker className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' selected={date} onChange={(date) => handleChange('date', date)} required/>
                </div>

                <div className='mb-4'>
                  <div className='label-text text-red-700 font-bold select-none'>*</div>
                  <TimePicker className='w-full py-2 h-12 text-sm text-[#000] rounded-md border-none outline-none' value={time} onChange={(time) => handleChange('time', time)} required/>
                </div>

                <div className='mb-4'>
                  <div className='label-text text-red-700 font-bold select-none'>*</div>
                  <input type="number" placeholder='Max Student' name='maxStudent' value={maxStudent} onChange={(e) => handleChange('maxStudent', e.target.value)} className='w-full py-2 px-3 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' required/>
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

export default Schedule