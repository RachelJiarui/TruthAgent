import "./SideBar.css";
import Alert from "./Alert.js";
import Context from "./Context";
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
}) {
  console.log(selectedAlertType);

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
      />
      <Alert
        title="Possible Misinformation"
        count={fetchOrangeAnnotations(aiAnalysis).length}
        color="#FFA500"
        setIndex={setIndex}
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
      />
      <Alert
        title="Bias and Manipulation"
        count={fetchBlueAnnotations(aiAnalysis).length}
        color="#004AF9"
        setIndex={setIndex}
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
      />
    </div>
  );
}

export default SideBar;
