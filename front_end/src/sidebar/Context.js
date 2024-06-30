import "./SideBar.css";
function Context({ text }) {
  return (
    <div className="context">
      <span className="context-text">{text}</span>
      <span className="click-for-more"> Click for more</span>
    </div>
  );
}

export default Context;
