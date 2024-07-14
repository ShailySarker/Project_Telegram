// src/components/ChatWindow.js
import React, { useEffect, useState } from 'react';
import { getChatMessages } from '../services/api';
import { FaArrowLeft, FaCircleUser } from 'react-icons/fa6';
import darkBG from "../../src/assets/bg_dark.jpg";
import lightBG from "../../src/assets/bg_light.jpg";
import { FaGhost, FaMicrophone } from 'react-icons/fa';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { MdAttachFile, MdOutlineCall } from 'react-icons/md';
import { RiMicFill } from 'react-icons/ri';
import { IoSearchSharp } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';

const ChatWindow = ({ chatId, chartSelection }) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getChatMessages(chatId);
      setMessages(data?.data);
      console.log("ChatWindow:", data?.data)
    };
    fetchMessages();
  }, [chatId]);

  // back to chat list
  const handleBackClick = () => {
    chartSelection(null);
  };

  // last seen
  const formatLastSeen = (updatedAt) => {
    const date = new Date(updatedAt);
    const currentDate = new Date();

    // Calculate time difference in milliseconds
    const diffTime = currentDate.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    // Today
    if (diffDays === 0) {
      return `Online`;
    }
    // Yesterday
    else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Last week
    else if (diffWeeks > 0) {
      return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Other dates
    else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    // Assuming you want to display the last seen time of the first non-BeyondChat message
    const lastSeenTime = messages?.find(message => message.sender.name !== "BeyondChat")?.sender?.updated_at;
    if (lastSeenTime) {
      setLastSeen(formatLastSeen(lastSeenTime));
    }
  }, [messages]);


  // each message time
  const formatTime = (timestamp) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  // Function to format the message date as MM/DD/YY
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const dateKey = formatDate(message?.created_at);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(message);
    return acc;
  }, {});

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const firstMessage = messages?.find(message => message?.sender?.name !== "BeyondChat");

  const name = firstMessage?.sender?.name ? firstMessage?.sender?.name : "Deleted Account";
  const firstLetter = name.charAt(0).toUpperCase();
  const backgroundColor = getRandomColor();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference);
  }, []);

  return (
    <div className="chat-window dark:text-white text-black dark:bg-gray-800 bg-white" style={{ backgroundImage: `url(${!isDarkMode ? darkBG : lightBG})` }}>
      {/* <img src={isDarkMode ? darkBG : lightBG} alt="Theme based background" /> */}
      <div>
        {/* header info */}
        <div className='flex justify-between items-center lg:px-7 md:px-7 px-4 lg:py-[10px] md:py-3 py-[10px] dark:bg-gray-800 bg-white dark:text-white text-black'>
          <div className='lg:flex-none flex items-center md:gap-7 gap-3'>
            <button
              className="lg:hidden visible"
              onClick={handleBackClick}
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              {firstMessage && (
                <div key={firstMessage.id}>
                  <div className='flex items-center lg:gap-4 gap-3'>
                    {name === "Deleted Account" ? (
                      <FaGhost className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-9 h-9 font-bold lg:text-xl text-lg bg-gray-400 text-white p-2' />
                    ) : (
                      <div
                        style={{ backgroundColor }}
                        className='flex items-center justify-center rounded-full lg:w-10 lg:h-10 w-9 h-9 text-white font-bold text-lg'
                      >
                        {firstLetter}
                      </div>
                    )}
                    <div>
                      <p className='font-semibold lg:text-lg'>{name}</p>
                      <p className='font-medium lg:text-sm text-xs'>Last seen {formatLastSeen(firstMessage?.sender?.updated_at)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex lg:gap-6 md:gap-3 gap-2 items-center'>
            <MdOutlineCall className='lg:text-2xl text-xl' />
            <IoSearchSharp className='lg:text-2xl lg:block hidden' />
            <BsThreeDotsVertical className='lg:text-2xl text-xl' />
          </div>
        </div>
        {/* messages */}
        <div className='lg:px-8 md:px-6 px-4 lg:pt-2 lg:h-[560px] md:h-[835px] h-[480px] overflow-y-scroll'>
          {Object.keys(groupedMessages)?.map(date => (
            <div key={date}>
              <div className="text-center text-sm font-bold lg:py-5 py-3 text-white">
                {date}
              </div>
              {groupedMessages[date]?.map(message => (
                <div key={message?.id}>
                  {message?.sender?.name === "BeyondChat" ?
                    <div className='flex justify-end'>
                      <div className='bg-green-100 dark:bg-violet-500 lg:max-w-[70%] max-w-[85%] py-2 lg:px-4 px-3 lg:my-2 my-[2px] rounded-2xl shadow-md '>
                        <p className='text-justify lg:text-base text-sm'>{message?.message}</p>
                        <p className='text-right lg:text-xs text-size pt-1 dark:text-slate-100 text-slate-800 font-medium'>{formatTime(message?.created_at)}</p>
                      </div>
                    </div> :
                    <div className='flex justify-start my-3'>
                      <div className='bg-white dark:bg-slate-800 lg:max-w-[70%] max-w-[85%] py-2 lg:px-4 px-3 lg:my-2 my-[2px] rounded-2xl shadow-md '>
                        <p className='text-justify lg:text-base text-sm'>{message?.message}</p>
                        <p className='text-right lg:text-xs text-size pt-1 dark:text-slate-100 text-slate-800 font-medium'>{formatTime(message?.created_at)}</p>
                      </div>
                    </div>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* message bar with others*/}
        <div className='lg:h-[79px] py-3 flex items-center justify-center mx-auto'>
          <HiOutlineEmojiHappy className='relative lg:left-12 left-9 -ml-0 lg:text-3xl text-2xl' />
          <input placeholder='Message' className='shadow-lg lg:py-3 py-[10px] lg:px-14 px-12 lg:w-1/2 w-[74%] rounded-[90px] dark:bg-gray-800 bg-white dark:text-white text-black placeholder:font-medium lg:placeholder:text-lg lg:text-lg' type="text" />
          <MdAttachFile className='relative lg:right-10 right-8 lg:-mr-6 -mr-4 lg:text-2xl text-xl' />
          <RiMicFill className='lg:ml-3 lg:text-5xl text-4xl shadow-lg rounded-full lg:p-[14px] p-2 dark:bg-violet-500 ' />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
