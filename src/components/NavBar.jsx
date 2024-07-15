// src/components/NavBar.js

import { FaBars, FaSearch } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import SlidingModal from "./SlidingModal";
import SlidingSidebar from "./SlidingModal";

const NavBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <nav className="sticky top-0 z-30 lg:hidden block bg-gray-100 dark:bg-gray-950 text-black dark:text-white lg:py-4 md:py-[14px] py-[10px]  lg:px-8 md:px-8 px-4 lg:grid grid-cols-3 flex justify-between items-center ">
            {/* large and medium device
            <p className="lg:block hidden">
                <span className="bg-red-500 px-[11px] rounded-full "></span>
                <span className="bg-orange-400 px-[11px] rounded-full ml-2"></span>
                <span className="bg-green-400 px-[11px] rounded-full ml-2"></span>
            </p> */}
            {/* small device  */}
            <div className="lg:flex-none flex flex-row items-center md:gap-12 gap-7">
                <div className="lg:hidden visible">
                    <FaBars className="md:text-base text-sm cursor-pointer" onClick={toggleSidebar} />
                    <SlidingSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                </div>
                <h1 className="md:text-xl text-lg font-semibold text-center lg:mx-auto">
                    Telegram
                </h1>
            </div>
            <div className="lg:hidden visible">
                <FaSearch className="text-base" />
            </div>
        </nav>
    );
};

export default NavBar;
