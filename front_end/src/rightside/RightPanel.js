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

  const selectTypeToKey = {
    "Blatant Misinformation": "red",
    "Possible Misinformation": "orange",
    "Bias and Manipulation": "blue",
  };

  // mock data: Let's say we retrieve this data from our backend (in the case that the URL has already been processed and we want to retrieve the previous chats we've had)
  const mockGetData = {
    "https://www.rand.org/global-and-emerging-risks/centers/technology-and-security-policy.html":
      {
        author: fetchAuthor(aiAnalysis),
        publisher: fetchPublisher(aiAnalysis),
        other_sources: fetchOtherSources(aiAnalysis),
        other_sources_summary: fetchOtherSourcesSummary(aiAnalysis),
        webpage_annotations: {
          red: [
            {
              sentence:
                "Identifying where relevant technologies are produced or housed and how they are moved around the world, including the entirety of their supply chain or development stack.",
              ai_analysis: "This is bad",
              messages: [
                {
                  id: 1,
                  actor: "user",
                  msg: "Red Hi there",
                },
              ],
            },
          ],
          orange: [
            {
              sentence: "policymakers to develop or deploy such defenses",
              ai_analysis: "Rawr",
              messages: [
                {
                  id: 2,
                  actor: "user",
                  msg: "Ornage Hi there",
                },
                {
                  id: 3,
                  actor: "ai",
                  msg: "Hello there!",
                },
              ],
            },
          ],
          blue: [
            {
              sentence:
                "domestic governments, and/or international coordination",
              ai_analysis: "Rawr",
              messages: [],
            },
          ],
        },
      },
  };

  useEffect(() => {
    if (url && selectedAlertType) {
      const alertTypeKey = selectTypeToKey[selectedAlertType];
      const annotations = mockGetData[url]?.webpage_annotations?.[alertTypeKey];

      if (annotations && annotations.length > 0) {
        setMessages(annotations[0].messages);
        setFocusSentence(annotations[0].sentence);
        setFocusSentenceAIAnalysis(annotations[0].ai_analysis);
      }
    }
  }, [selectedAlertType, url]);

  console.log("Messages:", messages);

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
