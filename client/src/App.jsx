import { Routes, Route, Navigate } from "react-router-dom";

import "./styles/app.scss";
import { ToolBar } from "./components/ToolBar";
import { SettingBar } from "./components/SettingBar";
import { Canvas } from "./components/Canvas";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <ToolBar />
              <SettingBar />
              <Canvas />
            </>
          }
        />
        <Route
          path="*"
          element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
        />
      </Routes>
    </div>
  );
}

export default App;
