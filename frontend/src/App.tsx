import { BrowserRouter, Routes, Route } from "react-router";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Relationships from "./pages/Relationships";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/relationships" element={<Relationships />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
