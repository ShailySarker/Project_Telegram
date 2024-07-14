// src/components/ChatList.js
import { useEffect, useState } from 'react';
import { getAllChats } from '../services/api';
import SlidingSidebar from './SlidingModal';
import { FaBars, FaCircleUser, FaPencil } from 'react-icons/fa6';
import { SlGhost } from 'react-icons/sl';
import { FaGhost } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getAllChats();
        console.log("ChatList:", data?.data?.data);
        setChats(data?.data?.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, []);

  // Function to format time
  const formatTime = (timestamp) => {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);

    const diffTime = currentDate.getTime() - messageDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 7) {
      // Message from last week, show day name
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (diffDays <= 365) {
      // Message from last year, show date and month
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      // Message from previous years, show full date
      return messageDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [chatColors, setChatColors] = useState({});

  useEffect(() => {
    const colors = {};
    chats.forEach(chat => {
      colors[chat?.id] = getRandomColor();
    });
    setChatColors(colors);
  }, [chats]);

  return (
    <div className="chat-list dark:bg-gray-800 bg-white dark:text-white text-black lg:h-[717px] md:h-screen h-[615px] overflow-y-hidden overflow-y-scroll">
      {/* menu and search */}
      <div className='lg:block hidden lg:flex items-center gap-2 sticky top-0 dark:bg-gray-800 bg-white dark:text-white text-black px-5 pt-3 pb-2 '>
        <div>
          <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
          <SlidingSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
        <div className='w-full flex items-center'>
          <IoSearchSharp className='relative left-9 text-xl'/>
          <input className='w-full py-[10px] px-12 rounded-3xl dark:bg-black bg-gray-100 placeholder:font-medium dark:placeholder:text-white placeholder:text-slate-900' type="text" name="" id="" placeholder='Search' />
        </div>
      </div>
      {/* chat list */}
      <div className='lg:px-4 px-2 lg:pb-6 pb-4'>
        {chats?.map(chat => {
          const name = chat?.creator?.name ? chat?.creator?.name : "Deleted Account";
          const firstLetter = name.charAt(0).toUpperCase();
          const backgroundColor = chatColors[chat?.id];

          return (
            <div
              key={chat?.id}
              className={`flex items-center justify-between py-3 lg:mt-3 px-3 shadow-lg rounded-xl cursor-pointer ${selectedChatId === chat?.id ? 'bg-blue-500 dark:bg-violet-500 text-white shadow-md' : ''}`}
              onClick={() => onSelectChat(chat?.id)}
            >
              <div className='flex items-center gap-4'>
                {name === "Deleted Account" ? (
                  <FaGhost className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-12 h-12 font-bold text-xl bg-gray-400 text-white p-2' />
                ) : (
                  <div
                    style={{ backgroundColor }}
                    className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-12 h-12 text-white font-bold lg:text-lg text-2xl'
                  >
                    {firstLetter}
                  </div>
                )}
                <div>
                  <h2 className='font-medium'>{name}</h2>
                </div>
              </div>
              <div>
                <p className='lg;text-base text-sm'>{formatTime(chat?.updated_at)}</p>
              </div>
            </div>
          );
        })}
        <div className='rounded-full flex justify-end'>
          <FaPencil className="text-5xl shadow-lg p-[14px] dark:bg-violet-500 bg-blue-500 absolute lg:bottom-7 bottom-4 rounded-2xl text-white "/>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
