import "./App.css";
import React, { useState } from "react";
/* global chrome */

function StartButton() {
  const [parsedWebpage, setParsedWebpage] = useState("");

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
            const webpageContent = response.data.data;
            console.log("Parsed webpage data:", webpageContent);
            setParsedWebpage(webpageContent);
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
      <p>{parsedWebpage}</p>
    </div>
  );
}

export default StartButton;
