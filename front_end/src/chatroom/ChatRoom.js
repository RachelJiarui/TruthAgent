import React, { useRef, useState } from 'react';
import ChatMessage from './ChatMessage.js';
import getGeminiResp from '.././services/getGeminiResp';

function ChatRoom() {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = formValue;
    setMessages(prevMessages => [...prevMessages, { id: Date.now(), msg: userMessage, actor: 'user' }]);
    
    setFormValue('');

    // send message over to AI
    const aiResponse = await getGeminiResp(userMessage);
    if (aiResponse) {
      setMessages(prevMessages => [...prevMessages, { id: Date.now() + 1, msg: aiResponse, actor: 'ai' }]);
      console.log("retrieved AI response and updated messages list")
    }

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div className="message-box">
        {messages && messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg.msg} actor={msg.actor} />
        ))}
        <span ref={dummy}></span>
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />
        <button type="submit" disabled={!formValue}></button>
      </form>
    </>
  );
}

export default ChatRoom;
