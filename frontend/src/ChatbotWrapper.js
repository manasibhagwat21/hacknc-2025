import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { BsFillChatFill } from "react-icons/bs";

const ChatbotWrapper = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px',
          borderRadius: '50%',
          backgroundColor: '#fe6f6f',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          width: '50px',   // Set a fixed width
          height: '50px',  // Set a fixed height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <BsFillChatFill size={30} color="white" />
      </button>
      {isChatOpen && <Chatbot closeChat={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default ChatbotWrapper;
