import { useState } from "react";
import { TaskbarManager } from "../lib/main";
import "./App.css";
import DemoModal from "./DemoModal";

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [count, setCount] = useState(1);
  const [customUI, setCustomUI] = useState(false);
  const arrayFromCount = Array(count)
    .fill(null)
    .map((_, index) => index + 1);

  const customTaskbarStyle = {
    backgroundColor: "#2d2d2d",
    color: "#e0e0e0"
  };

  const customButtonTaskbarStyle = {
    backgroundColor: "#2d2d2d",
    color: "#e0e0e0"
  };

  return (
    <div style={{
      position: "relative",
      backgroundColor: customUI ? "#2d2d2d" : "#fff",
      height: "calc(100vh - 0px)",
      width: "100vw",
      overflow: "hidden",
      color: customUI ? "#e0e0e0" : "#000",
    }}>
      <TaskbarManager
        targetKey=""
        canDrag={false}
        taskButtonStyle={customUI ? customButtonTaskbarStyle : {}}
        style={{ ...(customUI ? customTaskbarStyle : {}), margin: 20 }}
      />
      <TaskbarManager
        targetKey="0"
        style={{ flexDirection: "column", ...(customUI ? customTaskbarStyle : {}) }}
        taskButtonStyle={customUI ? customButtonTaskbarStyle : {}}
        initialPosition={{ top: 20, left: window.innerWidth - 100 }}
      />
      <TaskbarManager
        indicatorStyle={{ backgroundColor: customUI ? "red" : "" }}
        indicatorMinimizedStyle={{ backgroundColor: customUI ? "rgba(255, 0, 0, 0.3)" : "" }}
        targetKey="1"
        taskButtonStyle={customUI ? customButtonTaskbarStyle : {}}
        style={customUI ? customTaskbarStyle : {}} />
      <div className="overlay-buttons">
        <button
          className="show-overlay"
          onClick={() => {
            setShowOverlay((prev) => !prev);
          }}
        >
          show Overlay
        </button>

        <button
          className="custom-ui"
          onClick={() => {
            setCustomUI((prev) => !prev);
          }}
        >
          Custom ui
        </button>

        <button
          className="github"
          onClick={() => {
            window.open("https://github.com/khoavutri/react-modal-windows", "_blank");
          }}
        >
          Github
        </button>

        <button
          className="npm"
          onClick={() => {
            window.open("https://www.npmjs.com", "_blank");
          }}
        >
          NPM
        </button>
      </div>

      {arrayFromCount.map((item) => (
        <DemoModal
          showOverlay={showOverlay}
          key={item}
          index={item}
          setCount={setCount}
          customUI={customUI}
        />
      ))}
    </div>
  );
};

export default App;
