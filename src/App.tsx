import { useState } from "react";
import RecursiveAlgorithm from "./RecursiveAlgorithm";
import { TaskbarManager } from "../lib/main";
import "./App.css";
const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [count, setCount] = useState(1);
  const arrayFromCount = Array(count)
    .fill(null)
    .map((_, index) => index + 1);

  return (
    <div style={{ position: "relative" }}>
      <TaskbarManager targetKey="4" />
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
            setShowOverlay((prev) => !prev);
          }}
        >
          Custom ui
        </button>

        <button
          className="github"
          onClick={() => {
            window.open("https://github.com", "_blank");
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
        <RecursiveAlgorithm
          showOverlay={showOverlay}
          key={item}
          index={item}
          setCount={setCount}
        />
      ))}
    </div>
  );
};

export default App;
