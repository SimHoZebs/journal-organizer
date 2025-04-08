import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./pages/ForgotPwd";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Relationships from "./pages/Relationships";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
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
