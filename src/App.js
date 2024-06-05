import React from "react";
import ReactDOM from "react-dom";
import SpeechSynthesis from "./SpeechSynthesis";

function App() {
  return (
    <div className="App">
      <SpeechSynthesis />
    </div>
  );
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
