import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PairScreen } from "./screens/PairScreen";
import { DisplayScreen } from "./screens/DisplayScreen";
import { deviceStorage } from "./lib/config";

export function App() {
  const isPaired = deviceStorage.isPaired();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pair" element={<PairScreen />} />
        <Route path="/display" element={<DisplayScreen />} />
        <Route
          path="*"
          element={<Navigate to={isPaired ? "/display" : "/pair"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
