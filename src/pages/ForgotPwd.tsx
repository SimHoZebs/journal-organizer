import { useState } from "react";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequestReset = async () => {
    setIsSubmitted(true);
    setErrorMessage("");
    setMessage("");

    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Forgot password error:", error);
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
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">
          Forgot Password
        </h2>

        {message && (
          <p className="text-neutral-100 text-center mb-4">{message}</p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
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
        <button
          onClick={handleRequestReset}
          className="w-full mt-4 !bg-neutral-800 !border-neutral-600 text-neutral-50 py-2 rounded-md hover:!bg-neutral-500"
        >
          Send Reset Link
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Back to{" "}
            <a
              href="/login"
              className="!text-white !underline hover:text-neutral-900"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
