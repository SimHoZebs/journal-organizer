import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Relationships from "./pages/Relationships";
import EmailVerify from "./EmailVerify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/relationships" element={<Relationships />} />
        <Route path="/verify-email" element={<EmailVerify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
