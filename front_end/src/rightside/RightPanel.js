import "./RightSide.css";
import ChatRoom from "./chatroom/ChatRoom";
import { useState, useEffect } from "react";
import WelcomeContextPage from "./WelcomeContextPage";
import getMessagesFromDatabase from "../services/getMessagesFromDatabase";

// TODO: Fetch from database given url and aiAnalysis to retrieve all the messages associated for each alert
// TODO: Once you get all the messages associated for the specific selectedAlertType, set messages to be the first one and set the tabs to be the titles of the other messages
function RightPanel({ index, setIndex, selectedAlertType, url, aiAnalysis }) {
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

  const selectTypeToKey = {
    "Blatant Misinformation": "red",
    "Possible Misinformation": "orange",
    "Bias and Manipulation": "blue",
  };
  const alertTypeKey = selectTypeToKey[selectedAlertType];

  useEffect(() => {
    const fetchMessages = async () => {
      if (url && selectedAlertType) {
        console.log("Setting values in Right Panel");
        const annotations = aiAnalysis.webpage_annotations?.[alertTypeKey];

        if (annotations && annotations.length > 0) {
          setMessages(annotations[index].messages);
          setFocusSentence(annotations[index].sentence);
          setFocusSentenceAIAnalysis(annotations[index].ai_analysis);

          const fetchedMessages = await getMessagesFromDatabase(
            url,
            alertTypeKey,
            focusSentence,
          );
          setMessages(fetchedMessages);
        }
      }
    };

    fetchMessages();
  }, [selectedAlertType, url, aiAnalysis, index, alertTypeKey, focusSentence]);

  function goBack() {
    console.log("Go back called:", index);
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function goNext() {
    console.log(
      "Go next called:",
      index,
      aiAnalysis.webpage_annotations?.[alertTypeKey].length,
    );
    if (index < aiAnalysis.webpage_annotations?.[alertTypeKey].length - 1) {
      setIndex(index + 1);
    }
  }

  return (
    <div className="rightpanel-space">
      {url && selectedAlertType ? (
        aiAnalysis.webpage_annotations?.[alertTypeKey].length > 0 ? (
          <>
            <div className="top-part">
              <div className="header-grid">
                <div className="navigate" onClick={goBack}>
                  Back
                </div>
                <div className="header">Logo</div>
                <div className="navigate next" onClick={goNext}>
                  Next
                </div>
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
            <ChatRoom
              url={url}
              focusType={alertTypeKey}
              focusSentence={focusSentence}
              messages={messages}
              setMessages={setMessages}
              focusSentenceAIAnalysis={focusSentenceAIAnalysis}
            />
          </>
        ) : (
          <div>Hi</div>
        )
      ) : (
        <WelcomeContextPage aiAnalysis={aiAnalysis} />
      )}
    </div>
  );
}

export default RightPanel;
