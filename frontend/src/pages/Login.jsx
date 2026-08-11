import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  login as loginRequest,
  mapRole,
  setAuthCredentials,
} from "../services/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return setError("Please enter your email and password.");
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      const role = mapRole(data.user.role);
      setAuthCredentials({ token: data.token, user: data.user });
      onLogin(role);
      navigate(role === "admin" ? "/admin" : "/professor");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm">
        <div className="bg-gray-800 text-white md:w-2/5 p-10 flex flex-col justify-center">
          <div className="mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Exam Invigilation Management System
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Manage exam scheduling, faculty allocation, venue assignment, and
              invigilation duties from one portal.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              For authorized personnel only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        <div className="md:w-3/5 p-10 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the portal.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2 px-4 rounded text-sm transition-colors mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
