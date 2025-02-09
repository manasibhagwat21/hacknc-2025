import React, { useState } from 'react';
import axios from 'axios';
import "./Chatbot.css";

const Chatbot = ({ closeChat }) => {
  const [inputText, setInputText] = useState('');
  const [chat, setChat] = useState([]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add user message to chat history
    const userMessage = { text: inputText, sender: 'user' };
    setChat([...chat, userMessage]);
    setInputText('');

    try {
      // Send user message to backend API
      const response = await axios.post('http://localhost:8000/chatbot/get-response', { text: inputText });

      // Add chatbot's response to chat history
      const botMessage = { text: response.data.response, sender: 'bot' };
      setChat(prevChat => [...prevChat, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      // Handle error state or alert user
    }
  };

  return (
    <div className="chatbot-overlay" style={{ position: 'fixed', bottom: '80px', right: '20px', width: '300px', height: '400px', zIndex: 1001 }}>
      <div className="chatbot-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button className="close-button" onClick={closeChat} style={{ float: 'right' }}>Close</button>
        <div className="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {chat.map((message, index) => (
            <div key={index} className={`message ${message.sender}`} style={{ marginBottom: '10px' }}>
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="message-input" style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            style={{ width: '70%', marginRight: '5%' }}
          />
          <button type="submit" style={{ width: '25%' }}>Send</button>
        </form>
      </div>
    </div>
  );
};
export default Chatbot;
