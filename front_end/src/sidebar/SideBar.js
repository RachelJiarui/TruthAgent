import "./SideBar.css";
import Logo from "./Logo.js";
import Alert from "./Alert.js";
import Context from "./Context";
import {
  fetchRedAnnotations,
  fetchBlueAnnotations,
  fetchOrangeAnnotations,
} from "../aiAnalysisFunctions/fetchWebpageAnalysis.js";

function SideBar({ selectedAlertType, setSelectedAlertType, aiAnalysis }) {
  console.log(selectedAlertType);

  return (
    <div className="side-bar">
      <Logo />
      <div className="side-bar-title">Context</div>
      <Context text="This author is really cool and this takes place in a cool place..." />
      <div className="side-bar-title">Alerts</div>
      <Alert
        title="Blatant Misinformation"
        count={fetchRedAnnotations(aiAnalysis).length}
        color="#FF0000"
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
      />
      <Alert
        title="Possible Misinformation"
        count={fetchOrangeAnnotations(aiAnalysis).length}
        color="#FFA500"
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
      />
      <Alert
        title="Bias and Manipulation"
        count={fetchBlueAnnotations(aiAnalysis).length}
        color="#004AF9"
        selectedAlertType={selectedAlertType}
        setSelectedAlertType={setSelectedAlertType}
      />
    </div>
  );
}

export default SideBar;
