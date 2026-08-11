import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return setError("Please enter the 6-digit OTP.");
    setError("");
    setLoading(true);
    try {
      await api.post("/api/user/verify-otp", { email, otp });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Verify OTP</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit OTP sent to <span className="font-medium text-gray-700">{email}</span>.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-500 text-center">
          Didn't receive the OTP?{" "}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
