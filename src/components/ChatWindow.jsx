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
      console.log("ChatWindow:", data)
    };
    fetchMessages();
  }, [chatId]);

  // back to chat list
  const handleBackClick = () => {
    chartSelection(null);
  };

  // last seen find out
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

    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const timeString = date.toLocaleTimeString([], optionsTime);

    // Online
    if (diffSeconds < 60) {
      return 'Online';
    }
    // Today
    else if (diffDays === 0) {
      return `Today at ${timeString}`;
    }
    // Yesterday
    else if (diffDays === 1) {
      return `Yesterday at ${timeString}`;
    }
    // Last week
    else if (diffWeeks === 0) {
      return `${date.toLocaleDateString([], { weekday: 'long' })} at ${timeString}`;
    }
    // Last year
    else if (date.getFullYear() === currentDate.getFullYear()) {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeString}`;
    }
    // Other dates
    else {
      return `${date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} at ${timeString}`;
    }
  };

  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    const filteredMessages = messages.filter(message => message.sender_id !== 1);

    // Find the latest message timestamp among filtered messages
    let lastMessageDate = null;
    if (filteredMessages.length > 0) {
      // Sort filteredMessages by created_at in descending order to get the latest message first
      filteredMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Extract the created_at date from the latest message
      lastMessageDate = filteredMessages[0].created_at;
    }
    if (lastMessageDate) {
      setLastSeen(formatLastSeen(lastMessageDate));
    }
  }, [messages]);

  // each message time
  const formatTime = (timestamp) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    if (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else if (dateObj >= lastWeek) {
      return dateObj.toLocaleDateString(undefined, { weekday: 'long' });
    } else {
      return dateObj.toLocaleDateString(undefined, options);
    }
  };

  // Group the messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const dateKey = formatDate(message?.created_at);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(message);
    return acc;
  }, {});


  // color for name first letter
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


  // mode
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
                <div key={firstMessage?.id}>
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
                      <p className='font-medium lg:text-sm text-xs'>Last seen {lastSeen}</p>
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
          <div>
            {Object.keys(groupedMessages)?.map(date => (
              <div key={date}>
                <div className="sticky top-0 z-10 text-center text-sm font-bold text-white py-2 flex">
                  <p className='mx-auto dark:bg-violet-950 bg-blue-950 lg:py-2 py-2 px-5 rounded-3xl'>{date}</p>
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
        </div>
        {/* message bar with others*/}
        <div className='lg:h-[79px] py-3 flex items-center justify-center mx-auto' >
          <HiOutlineEmojiHappy className='relative lg:left-12 left-9 -ml-0 lg:text-3xl text-2xl' />
          <input placeholder='Message' className='shadow-lg lg:py-3 py-[10px] lg:px-14 px-12 lg:w-1/2 w-[74%] rounded-[90px] dark:bg-gray-800 bg-white dark:text-white text-black placeholder:font-medium lg:placeholder:text-lg lg:text-lg' type="text" />
          <MdAttachFile className='relative lg:right-10 right-8 lg:-mr-6 -mr-4 lg:text-2xl text-xl' />
          <RiMicFill className='lg:ml-3 lg:text-5xl text-4xl shadow-lg rounded-full lg:p-[14px] p-2 dark:bg-violet-500 bg-blue-500 text-white ' />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
