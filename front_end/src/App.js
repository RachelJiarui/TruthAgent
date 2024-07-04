import "./App.css";
import { useState } from "react";
import SideBar from "./sidebar/SideBar.js";
import UnactivePage from "./unactivePage/UnactivePage.js";
import RightPanel from "./rightside/RightPanel.js";
// import StartButton from "./StartButton.js";
// import SignIn from './auth/SignIn.js';
// import SignUp from './auth/SignUp.js';

function App() {
  const [selectedAlertType, setSelectedAlertType] = useState("");
  const [aiAnalysis, setAIAnalysis] = useState("");
  const [url, setURL] = useState("");

  return (
    <div className="App">
      {aiAnalysis === "" || url === "" ? (
        <UnactivePage setAIAnalysis={setAIAnalysis} setURL={setURL} />
      ) : (
        <div className="container">
          <div className="left-panel">
            <SideBar
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
