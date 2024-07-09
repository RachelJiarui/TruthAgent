import "./App.css";
import { useState, useEffect } from "react";
import SideBar from "./sidebar/SideBar.js";
import UnactivePage from "./unactivePage/UnactivePage.js";
import RightPanel from "./rightside/RightPanel.js";
import {
  fetchAuthor,
  fetchPublisher,
  fetchOtherSources,
  fetchOtherSourcesSummary,
} from "./aiAnalysisFunctions/fetchParsedInfo.js";

function App() {
  const [selectedAlertType, setSelectedAlertType] = useState("");
  const [aiAnalysis, setAIAnalysis] = useState("");
  const [url, setURL] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Test data set up
    const mockGetData = {
      author: fetchAuthor("mockAnalysis"),
      publisher: fetchPublisher("mockAnalysis"),
      other_sources: fetchOtherSources("mockAnalysis"),
      other_sources_summary: fetchOtherSourcesSummary("mockAnalysis"),
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
          {
            sentence: "Rachel is awesome",
            ai_analysis: "Holy cow",
            messages: [
              {
                id: 1,
                actor: "user",
                msg: "AGHHHH",
              },
            ],
          },
          {
            sentence: "How are you doing",
            ai_analysis: "Mongosh!",
            messages: [
              {
                id: 1,
                actor: "user",
                msg: "Oh god",
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
                msg: "Orange Hi there",
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
            sentence: "domestic governments, and/or international coordination",
            ai_analysis: "Rawr",
            messages: [],
          },
        ],
      },
    };

    // comment this out if you don't want fake test data
    // setURL(
    //   "https://www.rand.org/global-and-emerging-risks/centers/technology-and-security-policy.html",
    // );
    // setAIAnalysis(mockGetData);
  }, []);

  return (
    <div className="App">
      {aiAnalysis === "" || url === "" ? (
        <UnactivePage setAIAnalysis={setAIAnalysis} setURL={setURL} />
      ) : (
        <div className="container">
          <div className="left-panel">
            <SideBar
              setIndex={setIndex}
              selectedAlertType={selectedAlertType}
              setSelectedAlertType={setSelectedAlertType}
              aiAnalysis={aiAnalysis}
              url={url}
            />
          </div>
          <div className="right-panel">
            <RightPanel
              selectedAlertType={selectedAlertType}
              aiAnalysis={aiAnalysis}
              url={url}
              setIndex={setIndex}
              index={index}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
