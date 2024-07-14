import "./SideBar.css";
import Alert from "./Alert.js";
import {
  fetchRedAnnotations,
  fetchBlueAnnotations,
  fetchOrangeAnnotations,
} from "../aiAnalysisFunctions/fetchWebpageAnalysis.js";

function SideBar({
  setIndex,
  selectedAlertType,
  setSelectedAlertType,
  aiAnalysis,
  setViewStats,
}) {
  function handleViewStats() {
    setViewStats(true);
  }

  return (
    <div className="side-bar">
      <div className="side-bar-title">Alerts</div>
      <Alert
        title="Blatant Misinformation"
        count={fetchRedAnnotations(aiAnalysis).length}
        color="#FF0000"
        setIndex={setIndex}
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
        setViewStats={setViewStats}
      />
      <Alert
        title="Possible Misinformation"
        count={fetchOrangeAnnotations(aiAnalysis).length}
        color="#FFA500"
        setIndex={setIndex}
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
        setViewStats={setViewStats}
      />
      <Alert
        title="Bias and Manipulation"
        count={fetchBlueAnnotations(aiAnalysis).length}
        color="#004AF9"
        setIndex={setIndex}
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
        setViewStats={setViewStats}
      />
      <div onClick={handleViewStats} className="side-bar-title view-stats">
        View Stats
      </div>
    </div>
  );
}

export default SideBar;
