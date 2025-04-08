import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar"; // Adjust path

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  // Check for token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setResetToken(token);
    } else {
      setErrorMessage("No reset token found in the URL");
    }
  }, []);

  const handleResetPassword = async () => {
    setIsSubmitted(true);
    setErrorMessage("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();
      setMessage(data.message); // "Password reset successful"
      setTimeout(() => navigate("/login"), 2000); // Redirect to login
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900">
      <div className="w-full fixed top-0 left-0">
        <Navbar />
      </div>

      <div className="bg-neutral-700 w-96 p-6 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">
          Reset Password
        </h2>

        {message && (
          <p className="text-neutral-100 text-center mb-4">{message}</p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
        )}

        <div className="relative w-full">
          <input
            type="password"
            placeholder="New Password"
            className={`w-full px-3 py-2 border rounded-md mb-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
              isSubmitted && (!newPassword || newPassword !== confirmPassword)
                ? "border-red-600"
                : "border-neutral-500"
            }`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="relative w-full">
          <input
            type="password"
            placeholder="Confirm New Password"
            className={`w-full px-3 py-2 border rounded-md mb-2 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 ${
              isSubmitted &&
                (!confirmPassword || newPassword !== confirmPassword)
                ? "border-red-600"
                : "border-neutral-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleResetPassword}
          className="w-full mt-2 !bg-neutral-800 !border-neutral-600 text-neutral-50 py-2 rounded-md hover:!bg-neutral-500"
        >
          Reset Password
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

export default ResetPassword;
