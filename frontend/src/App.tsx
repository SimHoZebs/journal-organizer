
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
