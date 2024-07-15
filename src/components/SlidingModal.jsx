// src/components/SlidingSidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { FaRegQuestionCircle, FaUser } from 'react-icons/fa';
import { FaAngleDown, FaCircleUser, FaRegCircleUser, FaUserGroup, FaUsersViewfinder } from 'react-icons/fa6';
import ThemeToggle from './ThemeToggle';
import { FiBookmark, FiUser, FiUserPlus, FiUsers } from 'react-icons/fi';
import { MdOutlineCall } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import logo from "../assets/BeyondChats_company_logo.png";
const SlidingSidebar = ({ isOpen, onClose }) => {
    const [translateX, setTranslateX] = useState(isOpen ? 0 : -100);
    const [isDragging, setIsDragging] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTranslateX(0);
        } else {
            setTranslateX(-100);
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        sidebarRef.current.startX = e.clientX;
        sidebarRef.current.startTranslateX = translateX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const diff = e.clientX - sidebarRef.current.startX;
        let newTranslateX = sidebarRef.current.startTranslateX + (diff / window.innerWidth) * 100;
        if (newTranslateX > 0) newTranslateX = 0;
        if (newTranslateX < -100) newTranslateX = -100;
        setTranslateX(newTranslateX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (translateX > -50) {
            setTranslateX(0);
        } else {
            setTranslateX(-100);
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-3/4 md:w-2/5 lg:w-1/4 shadow-xl lg:py-12 md:px-8 py-8 px-5 transform transition-transform duration-300 ease-in-out ${isDragging ? 'transition-none' : ''} bg-white dark:bg-gray-800`}
                style={{ transform: `translateX(${translateX}%)` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className='text-black dark:text-white'>
                    <div>
                        <div className='flex justify-between items-center'>
                            <div>
                                <img className='lg:w-[74px] lg:h-[74px] w-14 h-14' src={logo} alt="logo" />
                                {/* <FaCircleUser className='lg:text-6xl md:text-5xl text-6xl' /> */}
                            </div>
                            <div className=''>
                                <ThemeToggle />
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h4 className='font-semibold lg:text-xl text-lg lg:mt-4 mt-3'>BeyondChats</h4>
                                <h4 className='lg:mt-1 text-slate-700 dark:text-slate-200 text-base'>contact@beyondchat.com</h4>
                            </div>
                            <div>
                                <FaAngleDown />
                            </div>
                        </div>
                    </div>

                    <div className='mt-6'>
                        {/* <h2 className="text-xl font-bold">Menu</h2> */}
                        <ul>
                            <li className="py-2 flex items-center gap-3">
                                <span><FaRegCircleUser className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>My Profile</span>
                            </li>
                            <li className="py-2 mt-5 flex items-center gap-3">
                                <span><FiUsers className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>New Group</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><FiUser className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Contacts</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><MdOutlineCall className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Calls</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><FaUsersViewfinder className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>People Nearby</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><FiBookmark className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Saved Massages</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><IoSettingsOutline className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Settings</span>
                            </li>
                            <li className="py-2 mt-5 flex items-center gap-3">
                                <span><FiUserPlus className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Invite Friends</span>
                            </li>
                            <li className="py-2 flex items-center gap-3">
                                <span><FaRegQuestionCircle className='text-xl text-slate-700 dark:text-slate-100' /></span>
                                <span className='font-semibold text-base'>Telegram Features</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex justify-end lg:mt-6 '>
                    <button onClick={onClose} className="dark:bg-violet-500 bg-blue-500 text-white mt-4 font-semibold px-4 py-2 rounded-xl ">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlidingSidebar;
