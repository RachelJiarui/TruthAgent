import "./SideBar.css";
function Alert({
  title,
  count,
  color,
  selectedAlertType,
  setSelectedAlertType,
  setIndex,
}) {
  const alertStyle = {
    color: color,
  };

  function handleClickAlert() {
    setIndex(0);
    setSelectedAlertType(title);
  }

  return (
    <div
      className={`alert ${title === selectedAlertType ? " select-alert" : ""}`}
      onClick={handleClickAlert}
    >
      <div className="alert-title" style={alertStyle}>
        {count} {title}
      </div>
      <div className="learn-more">Learn more on detection methods</div>
    </div>
  );
}

export default Alert;
