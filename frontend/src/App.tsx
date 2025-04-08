import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Notes from "./pages/Notes";
import Relationships from "./pages/Relationships";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/relationships" element={<Relationships />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
