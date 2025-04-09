import { useState } from "react";
import { useNavigate } from "react-router";
import EyeClosedIcon from "../assets/icons/eye-closed.svg";
import EyeOpenIcon from "../assets/icons/eye-open.svg";
import Navbar from "../components/Navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();
      console.log(data.message);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", username);

      localStorage.setItem("token", data.token);
      navigate("/notes");
    } catch (error) {
      console.error("Login error:", (error as Error).message);
      const errorMsg = (error as Error).message;
      const parts = errorMsg.split(": ", 2);
      if (parts.length === 2) {
        const jsonPart = parts[1];
        try {
          const errorData = JSON.parse(jsonPart);
          setErrorMessage(errorData.error || "Unknown error");
        } catch (parseError) {
          setErrorMessage(jsonPart);
        }
      } else {
        setErrorMessage(errorMsg);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>
      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">Sign In</h2>

        <p
          className={`text-sm text-red-600 mb-4 ${
            errorMessage ? "block" : "hidden"
          }`}
        >
          {errorMessage}
        </p>

        <input
          type="text"
          placeholder="User Name"
          className="w-full px-3 py-2 border rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 hover:border-neutral-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 hover:border-neutral-700 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword
            ? (
              <img
                src={EyeOpenIcon}
                width="15"
                height="15"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                alt="Show password"
              />
            )
            : (
              <img
                src={EyeClosedIcon}
                width="15"
                height="15"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer invert brightness-0"
                onClick={() => setShowPassword(!showPassword)}
                alt="Hide password"
              />
            )}
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-4 !bg-neutral-800 !border-neutral-600 text-neutral-50 py-2 rounded-md hover:!bg-neutral-600"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Don't remember your password?{" "}
            <a
              href="/forgot-password"
              className="!text-white !underline hover:text-neutral-900"
            >
              Forgot Password
            </a>
          </p>
        </div>
      </div>

      <div className="bg-neutral-700 w-96 mt-4 p-3 rounded-xl shadow-md flex justify-center">
        <p className="text-sm text-white">
          Don't have an account?{" "}
          <a
            href="/register"
            className="!text-white !underline hover:text-neutral-900"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
