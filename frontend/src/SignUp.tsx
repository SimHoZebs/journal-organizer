import { useState } from "react";
import Navbar from "./Navbar";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRegister = () => {
    setIsSubmitted(true);
    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>

      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">Sign Up</h2>

        <p
          className={`text-sm text-red-600 mb-4 ${errorMessage ? "block" : "hidden"}`}
        >
          {errorMessage}
        </p>

        <input
          type="text"
          placeholder="Email"
          className={`w-full px-3 py-2 border rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
            isSubmitted && !email ? "border-red-600" : "border-neutral-500"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="User Name"
          className={`w-full px-3 py-2 border rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
            isSubmitted && !username ? "border-red-600" : "border-neutral-500"
          }`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
              isSubmitted && !password ? "border-red-600" : "border-neutral-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="relative w-full mt-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
              isSubmitted && !confirmPassword
                ? "border-red-600"
                : "border-neutral-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-4 !bg-neutral-800 text-neutral-50 py-2 rounded-md hover:!bg-neutral-500"
        >
          Register
        </button>
      </div>

      <div className="bg-neutral-700 w-96 mt-4 p-3 rounded-xl shadow-md flex justify-center">
        <p className="text-sm text-white">
          Already have an account?{" "}
          <a
            href="/login"
            className="!text-white !underline hover:text-neutral-900"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
