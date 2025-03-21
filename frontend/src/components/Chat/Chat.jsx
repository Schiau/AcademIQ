import React, { useState } from 'react';
import './Chat.css'; 
import { chat } from '../../services/ChatService';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSend = async () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isBot: false }]);
      setMessage('');
  
      setIsBotTyping(true);
      try {
        const botResponse = await chat(message); 
        setIsBotTyping(false);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: botResponse, isBot: true }
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setIsBotTyping(false);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
            {msg.isBot && 
            <div className="icon">
              <img src="robot.svg" alt="robot icon" />
            </div>}
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        
        {isBotTyping && (
          <div className="message bot">
            <div className="icon">
              <img src="robot.svg" alt="robot icon" />
            </div>
            <div className="message-bubble typing">
              Robot is typing...
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Start typing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSend}>
          <img src="send.svg" alt="send icon" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
