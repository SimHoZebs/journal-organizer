import { useState } from "react";
import Navbar from "./Navbar";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText || 'No details'}`);
      }
  
      const data = await response.json();
      console.log(data.message);
      
      //localStorage.setItem('token', data.token);
      
    } catch (error) {
      console.error('Login error:', (error as Error).message);
    }
  };
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>
      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sign In</h2>

        <input
          type="text"
          placeholder="User Name"
          className="w-full px-3 py-2 border border-neutral-500 rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2 border border-neutral-500 rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button  onClick={handleLogin} className="w-full mt-4 !bg-neutral-400 text-neutral-50 py-2 rounded-md hover:!bg-neutral-600">
          Login
        </button>
      </div>

      <div className="bg-neutral-300 w-96 mt-4 p-3 rounded-xl shadow-md flex justify-center">
        <p className="text-sm text-neutral-800">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-neutral-700 underline hover:text-neutral-900"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
