import './App.css';
import ChatRoom from './chatroom/ChatRoom.js';
import SignIn from './auth/SignIn.js';
import SignUp from './auth/SignUp.js';

function App() {
  return (
    <div className="App">
      <SignIn/>
      <SignUp/>
      <ChatRoom />
    </div>
  );
}

export default App;
