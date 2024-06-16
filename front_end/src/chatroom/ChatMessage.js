
function ChatMessage({ msg, actor }) {
  // actor: str ["ai", "user"]
  return (
    <div className={`message ${actor === 'user' ? 'user-message' : ''}`}>
      {msg}
    </div>
  );
}

export default ChatMessage;
