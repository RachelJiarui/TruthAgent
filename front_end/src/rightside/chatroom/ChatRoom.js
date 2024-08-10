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
      "You are a AI thinking collaborator with the job of talking to someone about an article, what it means, and whether some parts of it is misinformation or manipulative or not. The exerpt from the article you two are analyzing is " +
      focusSentence +
      " and your initial stance is the following: " +
      focusSentenceAIAnalysis +
      ". I will give you the conversation you two have had with the first message being from you and the last message being from the user, continue the conversation. The user may ask you to explain your initial stance and ask for additional information outside of the article. Respond succinctly, with your knowledge not limited to the article or anything else, like in a conversation, without any markdown formatting: \n";
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
