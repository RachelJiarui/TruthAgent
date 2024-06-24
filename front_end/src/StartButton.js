import "./App.css";
import React, { useState } from "react";
/* global chrome */

function StartButton() {
  const [aiInfo, setAiInfo] = useState("");

  async function handleButtonClick() {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage(
        { action: "runBackgroundTask" },
        (response) => {
          if (response.status === "success") {
            const resp = response.data;
            setAiInfo(resp);
            // console.log("Web info from AI: " + JSON.stringify(aiInfo));
          } else {
            console.log("Error:", response.message);
          }
        },
      );
    } else {
      const errorMessage = "Chrome runtime is not available";
      console.log(errorMessage);
    }
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Read over my shoulder</button>
      <p>{aiInfo === "" ? "Loading info" : JSON.stringify(aiInfo)}</p>
    </div>
  );
}

export default StartButton;
