import { useEffect, useState } from "react";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import NavBar from "../../components/NavBar";
import ThemeToggle from "../../components/ThemeToggle";

import darkBG from "../../../src/assets/bg_dark.jpg";
import lightBG from "../../../src/assets/bg_light.jpg";
const HomePage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference);
  }, [isDarkMode]);
  return (
    <div className="homepage h-screen">
      <NavBar />

      <div className="lg:flex flex-row lg:block hidden">
        <div className="lg:w-1/3 w-full">
          <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        </div>
        <div className="lg:w-2/3 w-full" style={{ backgroundImage: `url(${!isDarkMode ? darkBG : lightBG})` }}>
        {/* <div className="lg:w-2/3 w-full"> */}
          {selectedChatId && <ChatWindow chatId={selectedChatId} />}
        </div>
      </div>
      <div className="lg:hidden visible">
        {selectedChatId ? (
          <div className="lg:w-2/3 w-full relative" style={{ backgroundImage: `url(${!isDarkMode ? darkBG : lightBG})` }}>
          {/* // <div className="lg:w-2/3 w-full relative"> */}
            <ChatWindow chatId={selectedChatId} chartSelection={setSelectedChatId}/>
          </div>
        ) : (
          <div className="lg:w-1/3 w-full">
            <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;