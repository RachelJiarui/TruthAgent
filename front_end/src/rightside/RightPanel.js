import {
  fetchAuthor,
  fetchOtherSources,
  fetchOtherSourcesSummary,
  fetchPublisher,
} from "../aiAnalysisFunctions/fetchParsedInfo";
import ChatRoom from "./chatroom/ChatRoom";
import { useState, useEffect } from "react";
import WelcomeContextPage from "./WelcomeContextPage";

// TODO: Fetch from database given url and aiAnalysis to retrieve all the messages associated for each alert
// TODO: Once you get all the messages associated for the specific selectedAlertType, set messages to be the first one and set the tabs to be the titles of the other messages
function RightPanel({ selectedAlertType, url, aiAnalysis }) {
  const [messages, setMessages] = useState([]);
  const [focusSentence, setFocusSentence] = useState("");
  const [focusSentenceAIAnalysis, setFocusSentenceAIAnalysis] = useState("");

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
    <>
      <h2>{focusSentence}</h2>
      <p>{focusSentenceAIAnalysis}</p>
      <ChatRoom messages={messages} setMessages={setMessages} />
    </>
  ) : (
    <WelcomeContextPage />
  );
}

export default RightPanel;
