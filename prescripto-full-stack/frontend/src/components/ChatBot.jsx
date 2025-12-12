import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBodyRef = useRef(null);
  const apiKey = 'AIzaSyClAFzEfz9ctUpVSTmRIT6Bds7_dz9wJ54';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      text: inputMessage,
      type: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: inputMessage }]
          }]
        })
      });

      const data = await response.json();
      const botResponse = {
        text: data.candidates[0].content.parts[0].text,
        type: 'bot'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again later.',
        type: 'bot'
      }]);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          <div className="bg-blue-500 p-4 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">ChatBot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-3 max-w-[80%] ${
                  message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;