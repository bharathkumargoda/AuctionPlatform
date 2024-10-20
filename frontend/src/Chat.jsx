import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


function Chat({ username, room }) {

  const socket = io('http://localhost:5000');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join', { username, room });

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, room]);

  // Send a message
  const sendMessage = () => {
    if (message !== '') {
      socket.emit('sendMessage', { message, room });
      setMessage('');  // Clear input field after sending
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatMessages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <div className="messageInput">
        <input
          type="text"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
