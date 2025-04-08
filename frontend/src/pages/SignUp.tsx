import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  const navigate = useNavigate();
  const handleRegister = async () => {
    setIsSubmitted(true);
    const errors = [];

    if (!email || !username || !password || !confirmPassword) {
      errors.push("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
    }

    //const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      errors.push("Password must meet the following:");
      errors.push("• At least 8 characters");
      errors.push("• 1 number");
      errors.push("• 1 special character (e.g., !@#$%^&*)");
      errors.push("• 1 uppercase letter");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setSuccessMessage(""); // Clear success message if errors exist
      setTimeout(() => {
        setErrorMessages([]);
      }, 10000);
      return;
    }

    try {
      //const apiUrl = import.meta.env.VITE_API_URL;
      //console.log("API URL:", apiUrl);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText, response);
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();
      console.log(data.message);
      console.log(data.verificationToken);
      setSuccessMessage(`We have sent a verification link to ${email}`);
      setErrorMessages([]); // Clear any previous errors
      setTimeout(() => navigate("/login"), 5000);
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>

      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">Sign Up</h2>

        {(errorMessages.length > 0 || successMessage) && (
          <div className="mb-4">
            {errorMessages.map((error, index) => (
              <p key={index} className="text-sm text-red-600 text-justify">
                {error}
              </p>
            ))}

            {successMessage && (
              <p className="text-sm font-bold text-neutral-100 text-center">
                {successMessage}
              </p>
            )}
          </div>
        )}

        <input
          type="text"
          placeholder="Email"
          className={`w-full px-3 py-2 border rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
            isSubmitted && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              ? "border-red-600"
              : "border-neutral-500"
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
              isSubmitted &&
                (
                  !password ||
                  password !== confirmPassword ||
                  password.length < 8 ||
                  !passwordRegex.test(password)
                )
                ? "border-red-600"
                : "border-neutral-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="relative w-full mt-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
              isSubmitted &&
                (
                  !confirmPassword ||
                  password !== confirmPassword ||
                  confirmPassword.length < 8 ||
                  !passwordRegex.test(confirmPassword)
                )
                ? "border-red-600"
                : "border-neutral-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-4 !bg-neutral-800 !border-neutral-600 text-neutral-50 py-2 rounded-md hover:!bg-neutral-500"
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
