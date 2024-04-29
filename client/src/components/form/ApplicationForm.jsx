import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

const ApplicationForm = () => {
    const form = useRef();
    const clearInputFile = useRef(null);
    const clearInputFile2 = useRef(null);
    const clearInputFile3 = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('/api/application/schedule');
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const availableSchedule = response.data.filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate >= currentDate && schedule.maxStudent > schedule.studentId.length;
            });
            
            availableSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));
            setSchedules(availableSchedule);
        } catch (e) {
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

    const handleScheduleSelect = (schedule, e) => {
        e.preventDefault();
        setSelectedSchedule(schedule);
        setSelectedButton(schedule._id);
    };


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

    const [inputFile, setInputFile] = useState({
        fileOne: null,
        fileTwo: null,
        fileThree: null
    });

    const { firstName, middleName, lastName, extensionName, unitAddress, streetAddress, city, zipCode, email, phone, school, schoolAddress, course } = inputData;

    const { fileOne, fileTwo, fileThree } = inputFile;

    const clearInputData = () => {
        setInputData({
            firstName: '',
            middleName: '',
            lastName: '',
            extensionName: '',
            unitAddress: '',
            streetAddress: '',
            city: '',
            zipCode: '',
            email: '',
            phone: '',
            school: '',
            schoolAddress: '',
            course: ''
        });
    }

    const handleChange = (e) => {
        setInputData({...inputData, [e.target.name]: e.target.value});
    }

    const handleFileChange = (e) => {
        setInputFile({...inputFile, [e.target.name]: e.target.files[0]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        if(fileOne) {
            formData.append('files', fileOne);
        }
        if(fileTwo) { 
            formData.append('files', fileTwo);
        }
        if(fileThree) {
            formData.append('files', fileThree);
        }

        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('extensionName', extensionName);
        formData.append('unitAddress', unitAddress);
        formData.append('streetAddress', streetAddress);
        formData.append('city', city);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('zipCode', zipCode);
        formData.append('school', school);
        formData.append('schoolAddress', schoolAddress);
        formData.append('course', course);
        formData.append('studentStatus', 'Freshmen');

        try {
            const response = await axios.post('/api/application', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const studentId = response.data.id;

            if (selectedSchedule) {
                await axios.put(`/api/application/select/${selectedSchedule._id}`, { studentId: studentId });
            }

            let timerInterval;
            Swal.fire({
                title: 'Application is Submitting',
                html: 'Please wait for a moment...',
                timer: 5000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector('b');
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title: `${response.data.message}`,
                        text: `Please verify your email address. We sent an email on this address: ${response.data.email}`,
                        icon: 'success',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        confirmButtonColor: '#22C55E',
                    });
                }
            });
    
            clearInputData();
            if (clearInputFile.current) {
                clearInputFile.current.value = '';
            }
            if (clearInputFile2.current) {
                clearInputFile2.current.value = '';
            }
            if (clearInputFile3.current) {
                clearInputFile3.current.value = '';
            }
            setIsSubmitting(false);
            fetchSchedules();
        } catch(e){
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
    <div className='w-full min-h-screen bg-[#F8F7F4]'>
        <Header />
    
            <div className="p-5 w-full">
                <form ref={form} onSubmit={handleSubmit} className='bg-white max-w-5xl p-12 shadow rounded-lg mt-16 mx-auto max-sm:px-5'>
                    <h2 className='text-3xl uppercase font-bold mb-10 text-[#520000]  max-sm:text-xl'>APPLICATION FORM</h2>    

                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='First Name' name='firstName' value={firstName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black-700 font-bold select-none'>opt.</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Middle Name' name='middleName' value={middleName} onChange={handleChange}/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Last Name' name='lastName' value={lastName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black-700 font-bold select-none'>opt.</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Suffix' name='extensionName' value={extensionName} onChange={handleChange}/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Apartment, suite, or unit #' name='unitAddress' value={unitAddress} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Street Address' name='streetAddress' value={streetAddress} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='City' name='city' value={city} onChange={handleChange} required/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-12 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="email" placeholder='Email Address' name='email' value={email} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="number" placeholder='+63' name='phone' value={phone} onChange={handleChange} maxLength={10} required/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-red-700 font-bold select-none'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Zip code' name='zipCode' value={zipCode} onChange={handleChange} required/>
                        </div>
                        
                    </div>



                    <div className="flex items-start justify-center mb-12 max-sm:flex-col">
                        <div className="w-1/2 max-sm:w-full">
                            <h2 className='text-2xl font-bold text-[#520000] break-all text-center max-sm:text-lg'>FOR SENIOR HIGH SCHOOL GRADUATE AND/OR HIGH SCHOOL GRADUATE OF OLD BASIC CURRICULUM</h2>
                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Name of Secondary School where you are currently enrolled/graduated(Do not abbreviate).</p>
                            <span className='label-text text-red-700 font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Do not leave it blank.' name='school' value={school} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Address of Secondary School where you currently enrolled/graduated</p>
                            <span className='label-text text-red-700 font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Do not leave it blank.' name='schoolAddress' value={schoolAddress} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Strand Taken (Write in full)</p>
                            <span className='label-text text-red-700 font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-[#000] rounded-md border-2 border-solid border-gray-200 outline-none' type="text" placeholder='Do not leave it blank.' name='course' value={course} onChange={handleChange}/>
                        </div>
                    </div>


                    <h2 className='text-xl font-bold text-[#520000] break-all max-sm:text-lg'>Requirements for Senior High Graduate Requirements/High School Graduate of Old Basic Curriculum/Transferees</h2>
                    <p className='mt-3 label-text font-normal max-sm:text-xs'>Note: Include your full name in the filename of the requirements;</p>
                    <p className='label-text font-normal max-sm:text-xs'>Incomplete entry of personal information, tampered documents, erasures, and incomplete documents will not be processed.</p>

                    <div className='flex items-start justify-center gap-[30px] mb-20 mt-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <p className='text-lg font-medium text-[#520000] max-sm:text-base'>Upload ISPSC-CAT Form 1a</p>
                            <p className='label-text text-justify mt-2 max-sm:text-xs'>(Dully filled up application form (ISPSC CAT Form 1a with attached picture)Note: Documents should be readable and completely scanned)</p>                   
                            <input ref={clearInputFile} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileOne' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>2 pieces Identical Photograph, Passport size with name tag, white background, and taken within the last six months.</p>
                            <input ref={clearInputFile2} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileTwo' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>For graduating Senior High School students, grades for the first, second and third grading periods, duly signed by the school principal.<br/>(Note: Documents schould be readable and completely scanned)</p>
                            <input ref={clearInputFile3} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileThree' onChange={handleFileChange} accept='.pdf' required/>
                        </div>
                    </div>

                    
                    <div className="mt-6 mb-20">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Available Schedules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {schedules.map(schedule => (
                                <div key={schedule._id} className="border border-gray-200 rounded p-4">
                                    <div>Date: {format(new Date(schedule.date),'MMM dd, yyyy')}</div>
                                    <div>Time: {format(new Date(schedule.time),'hh:mm a')}</div>
                                    <button onClick={(e) => handleScheduleSelect(schedule, e)} disabled={selectedButton === schedule._id} className={`mt-2 bg-[#DE7773] hover:opacity-80 text-white text-sm rounded-md p-1.5 ${selectedButton === schedule._id ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        {selectedButton === schedule._id ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    

                    <div className="flex justify-between">
                        <Link to='/' className='btn bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs'><FiArrowLeft size={20}/>back</Link>
                        <button className='btn bg-green-500 hover:bg-green-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs' disabled={isSubmitting || schedules.length === 0}>{isSubmitting ? 'Submitting...' : 'Submit'}<FiSend size={20}/></button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default ApplicationForm
