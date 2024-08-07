import React, { useRef, useState } from "react";
import ChatMessage from "./ChatMessage.js";
import getGeminiResp from "../../services/getGeminiResp";
import postMessagesToDatabase from "../../services/postMessagesToDatabase";

function ChatRoom({
  url,
  focusSentence,
  focusSentenceAIAnalysis,
  focusType,
  messages,
  setMessages,
}) {
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
    let prompt =
      "You are a AI thinking collaborator with the job of helping someone understand whether or not an exerpt from an article is misinformation or not. The exerpt is " +
      focusSentence +
      " and your belief is the following: " +
      focusSentenceAIAnalysis +
      ". Given the following conversation, with the first message being from you and the last message being from the user, either reason with the user to make the user believe your belief or, after challenging their thinking appropriately, agree with the user. Respond succinctly, like in a conversation, without any markdown formatting: \n";
    for (let msg of messages) {
      prompt += msg.actor + ": " + msg.msg + "\n";
    }
    console.log("Prompt sent to AI: ", prompt);

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
