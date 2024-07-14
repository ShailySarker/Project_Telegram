// // src/components/ThemeToggle.js
// import { useState, useEffect } from 'react';
// import { MdLightMode, MdNightlight } from 'react-icons/md';

// const ThemeToggle = () => {
//     const [theme, setTheme] = useState('light');

//     useEffect(() => {
//         document.body.className = theme;
//     }, [theme]);

//     const toggleTheme = () => {
//         setTheme(theme === 'light' ? 'dark' : 'light');
//     };

//     return (
//         <button onClick={toggleTheme} className="theme-toggle">
//             {
//                 theme === 'light' ? <MdNightlight className='text-lg -rotate-45' /> : <MdLightMode className='text-lg'/>
//             }
//         </button>
//     );
// };

// export default ThemeToggle;
// src/components/ThemeToggle.js
import React, { useState, useEffect } from 'react';
import { MdNightlight, MdLightMode } from 'react-icons/md';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = (e) => {
        setIsDarkMode(!isDarkMode);

        // Create the ripple element
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');

        // Calculate the size and position of the ripple
        const size = Math.max(window.innerWidth, window.innerHeight) * 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size / 2}px`;
        ripple.style.top = `${e.clientY - size / 2}px`;

        // Append the ripple to the body
        document.body.appendChild(ripple);

        // Remove the ripple after animation completes
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    };

    return (
        <button onClick={toggleTheme} className="relative overflow-hidden">
            {isDarkMode ? (
                <MdNightlight className='lg:text-3xl text-lg -rotate-45 transition-transform duration-500 ease-in-out transform rotate-360' />
            ) : (
                <MdLightMode className='lg:text-3xl text-lg transition-transform duration-500 ease-in-out transform rotate-360' />
            )}
        </button>
    );
};

export default ThemeToggle;
