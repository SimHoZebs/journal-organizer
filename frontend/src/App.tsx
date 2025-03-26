import "./App.css";
import EmailVerify from "./EmailVerify";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Relationships from "./pages/Relationships";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/verify" element={<EmailVerify />} />
        <Route path="/relationships" element={<Relationships />} />
      </Routes>
    </Router>
  );
}

export default App;
