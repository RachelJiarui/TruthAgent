import "./App.css";
import ChatRoom from "./chatroom/ChatRoom.js";
import StartButton from "./StartButton.js";
// import SignIn from './auth/SignIn.js';
// import SignUp from './auth/SignUp.js';

function App() {
  return (
    <div className="App">
      <StartButton />
      <ChatRoom />
    </div>
  );
}

export default App;
