import React, { useRef, useState } from "react";
import ChatMessage from "./ChatMessage.js";
import getGeminiResp from "../../services/getGeminiResp";
import postMessagesToDatabase from "../../services/postMessagesToDatabase";

function ChatRoom({ url, focusSentence, focusType, messages, setMessages }) {
  const dummy = useRef();
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    console.log("Sent message, got form value:", formValue);
    e.preventDefault();

    let userMessage = formValue;
    const updatedMessages = [
      ...messages,
      {
        id: `${userMessage}-user-${Date.now()}`,
        msg: userMessage,
        actor: "user",
      },
    ];
    setMessages(updatedMessages);

    setFormValue("");

    // send message over to AI
    const prompt =
      userMessage +
      " - Response succinctly, like in a conversation, without any markdown formatting.";
    const aiResponse = await getGeminiResp(prompt);
    if (aiResponse) {
      const updatedMessagesWithAI = [
        ...updatedMessages,
        { id: `${aiResponse}-ai-${Date.now()}`, msg: aiResponse, actor: "ai" },
      ];
      setMessages(updatedMessagesWithAI);
      console.log("retrieved AI response and updated messages list");
    }

    await postMessagesToDatabase(
      url,
      focusType,
      focusSentence,
      userMessage,
      aiResponse,
    );
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  console.log("Chatroom updated: ", messages);
  return (
    <>
      <div className="message-box">
        {messages &&
          messages.map((msg) => (
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
