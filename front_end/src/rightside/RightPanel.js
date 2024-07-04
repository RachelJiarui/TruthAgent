import "./RightSide.css";
import ChatRoom from "./chatroom/ChatRoom";
import { useState, useEffect } from "react";
import WelcomeContextPage from "./WelcomeContextPage";

// TODO: Fetch from database given url and aiAnalysis to retrieve all the messages associated for each alert
// TODO: Once you get all the messages associated for the specific selectedAlertType, set messages to be the first one and set the tabs to be the titles of the other messages
function RightPanel({ selectedAlertType, url, aiAnalysis }) {
  const [messages, setMessages] = useState([]);
  const [focusSentence, setFocusSentence] = useState("");
  const [focusSentenceAIAnalysis, setFocusSentenceAIAnalysis] = useState("");

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "Blatant Misinformation":
        return "red";
      case "Possible Misinformation":
        return "orange";
      case "Bias and Manipulation":
        return "blue";
      default:
        return "black";
    }
  };

  useEffect(() => {
    const selectTypeToKey = {
      "Blatant Misinformation": "red",
      "Possible Misinformation": "orange",
      "Bias and Manipulation": "blue",
    };

    if (url && selectedAlertType) {
      console.log("Setting values in Right Panel");
      const alertTypeKey = selectTypeToKey[selectedAlertType];
      const annotations = aiAnalysis.webpage_annotations?.[alertTypeKey];

      if (annotations && annotations.length > 0) {
        setMessages(annotations[0].messages);
        setFocusSentence(annotations[0].sentence);
        setFocusSentenceAIAnalysis(annotations[0].ai_analysis);
      }
    }
  }, [selectedAlertType, url, aiAnalysis]);

  console.log("Messages Right Panel to Chat Room:", messages);

  return url && selectedAlertType ? (
    <div className="rightpanel-space">
      <div className="top-part">
        <div className="header-grid">
          <div className="navigate">Back</div>
          <div className="header">Logo</div>
          <div className="navigate next">Next</div>
        </div>
        <div className="declaration">
          <span
            className="selected-alert-type-space"
            style={{ color: getAlertTypeColor(selectedAlertType) }}
          >
            {selectedAlertType}
          </span>
          {focusSentence}
        </div>
        <div className="declaration">{focusSentenceAIAnalysis}</div>
      </div>
      <ChatRoom messages={messages} setMessages={setMessages} />
    </div>
  ) : (
    <WelcomeContextPage />
  );
}

export default RightPanel;
