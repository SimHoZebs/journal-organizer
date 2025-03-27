import { useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import { useState } from "react";

const EmailVerify = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async () => {
    const token = localStorage.getItem("verificationToken");

    if (!token) {
      setErrorMessage("No verification token found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Verification failed: ${response.status} - ${errorText}`,
        );
      }

      console.log("Email successfully verified");
      localStorage.removeItem("verificationToken");
      navigate("/login");
    } catch (error) {
      console.error("Email verification failed:", error);
      setErrorMessage("Email verification failed");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>
      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Verify your email
        </h2>

        {errorMessage && (
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full mt-4 !bg-neutral-800 !border-neutral-600 text-neutral-50 py-2 rounded-md hover:!bg-neutral-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
