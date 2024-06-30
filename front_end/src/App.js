import "./App.css";
import { useState } from "react";
import SideBar from "./sidebar/SideBar.js";
import ChatRoom from "./chatroom/ChatRoom.js";
import UnactivePage from "./unactivePage/UnactivePage.js";
// import StartButton from "./StartButton.js";
// import SignIn from './auth/SignIn.js';
// import SignUp from './auth/SignUp.js';

function App() {
  const [selectedAlertType, setSelectedAlertType] = useState("");
  const [aiAnalysis, setAIAnalysis] = useState("");

  return (
    <div className="App">
      {aiAnalysis === "" ? (
        <UnactivePage setAIAnalysis={setAIAnalysis} />
      ) : (
        <div className="container">
          <div className="left-panel">
            <SideBar
              selectedAlertType={selectedAlertType}
              setSelectedAlertType={setSelectedAlertType}
              aiAnalysis={aiAnalysis}
            />
          </div>
          <div className="right-panel">
            <ChatRoom />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
