// src/components/ChatList.js
import { useEffect, useState } from 'react';
import { getAllChats, getChatMessages } from '../services/api';
import SlidingSidebar from './SlidingModal';
import { FaBars, FaCircleUser, FaPencil } from 'react-icons/fa6';
import { SlGhost } from 'react-icons/sl';
import { FaGhost } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  // chat data
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

  // message data
 
  const [lastMessages, setLastMessages] = useState([]);

  const fetchLastMessages = async (chatId) => {
    try {
      const data = await getChatMessages(chatId);
      const lastMessage = data?.data?.[data?.data?.length - 1]; // Assuming last message is at the end of the array
      console.log(lastMessage);
      return lastMessage;
    } catch (error) {
      console.error("Error fetching last message for chat:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLastMessagesForChats = async () => {
      const promises = chats?.map(async (chat) => {
        const lastMessage = await fetchLastMessages(chat?.id);
        return { chatId: chat?.id, lastMessage: lastMessage };
      });

      const allLastMessages = await Promise.all(promises);
      setLastMessages(allLastMessages);
    };

    fetchLastMessagesForChats();
  }, [chats]);

  // Function to format time
  const formatTime = (timestamp) => {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);

    // Calculate time difference in milliseconds
    const diffTime = currentDate.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const timeString = messageDate.toLocaleTimeString([], optionsTime);

    // Today
    if (diffDays === 0) {
      return timeString;
    }
    // Yesterday
    else if (diffDays === 1) {
      return 'Yesterday';
    }
    // Last week
    else if (diffDays <= 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    }
    // Last year
    else if (messageDate.getFullYear() === currentDate.getFullYear()) {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    // Other dates
    else {
      const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
      return messageDate.toLocaleDateString('en-GB', optionsDate);
    }
  };

  const truncateMessage = (message, maxLength) => {
    if (message?.length > maxLength) {
      return message?.substring(0, maxLength) + '...';
    }
    return message;
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
          <IoSearchSharp className='relative left-9 text-xl' />
          <input className='w-full py-[10px] px-12 rounded-3xl dark:bg-black bg-gray-100 placeholder:font-medium dark:placeholder:text-white placeholder:text-slate-900' type="text" name="" id="" placeholder='Search' />
        </div>
      </div>
      <div className='lg:px-4 px-2 lg:pb-6 pb-4'>
        {chats?.map(chat => {
          const name = chat?.creator?.name ? chat?.creator?.name : "Deleted Account";
          const firstLetter = name.charAt(0).toUpperCase();
          const backgroundColor = chatColors[chat?.id]; // Replace with your chat color logic
          const lastMessage = lastMessages.find(msg => msg.chatId === chat.id)?.lastMessage;

          return (
            <div
              key={chat?.id}
              className={`flex items-center justify-between py-3 lg:mt-3 px-3 shadow-lg rounded-xl cursor-pointer ${selectedChatId === chat?.id ? 'bg-blue-500 dark:bg-violet-500 text-white shadow-md' : ''}`}
              onClick={() => onSelectChat(chat?.id)}
            >
              <div>
                {/* Name and avatar */}
                <div className='flex items-center lg:gap-4 md:gap-5 gap-3'>
                  <div className='lg:w-10 w-12'>
                    {name === "Deleted Account" ? (
                      <FaGhost className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-12 h-12 font-bold text-xl bg-gray-400 text-white p-2' />
                    ) : (
                      <div
                        style={{ backgroundColor }}
                        className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-12 h-12 text-white font-bold lg:text-lg md:text-2xl text-xl'
                      >
                        {firstLetter}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className='font-medium lg:text-lg text-base'>{name}</h2>
                    <div className='flex items-start gap-1'>
                      <p className='font-medium'>{lastMessage?.sender?.name}: </p>
                      <p>{truncateMessage(lastMessage?.message, 10)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* Last message sender and time */}
                <div>
                  <p>{formatTime(lastMessage?.created_at)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className='rounded-full flex justify-end'>
          <FaPencil className="text-5xl shadow-lg p-[14px] dark:bg-violet-500 bg-blue-500 absolute lg:bottom-7 bottom-4 rounded-2xl text-white " />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
