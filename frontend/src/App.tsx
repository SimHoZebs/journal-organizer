import { BrowserRouter, Routes, Route } from "react-router";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Relationships from "./pages/Relationships";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./ForgotPwd";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/relationships" element={<Relationships />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
