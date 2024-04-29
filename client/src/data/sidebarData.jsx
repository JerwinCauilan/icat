import { HiOutlineClock, HiOutlineUserGroup, HiOutlineIdentification, HiOutlineSquares2X2 } from "react-icons/hi2";

export const sidebarData = [
    // {
    //     id: 1,
    //     title: 'Dashboard',
    //     url: '/dashboard',
    //     icon: <HiOutlineSquares2X2 size={20}/>,
    // },
    {
        id: 1,
        title: 'Schedule',
        url: '/schedule',
        icon: <HiOutlineClock size={20}/>,
    },
    {
        id: 2,
        title: 'Profile',
        url: '/profile',
        icon: <HiOutlineIdentification size={20}/>,
    },
    {
        id: 3,
        title: 'Student Applicant',
        url: '/student',
        icon: <HiOutlineUserGroup size={20}/>,
    },
];