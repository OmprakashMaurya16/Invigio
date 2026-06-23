import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { login as loginRequest, setAuthCredentials, mapRole } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      const mappedRole = mapRole(data.user.role);

      setAuthCredentials({ token: data.token, user: data.user });
      onLogin(mappedRole);
      navigate(mappedRole === "admin" ? "/admin" : "/professor");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to log in. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-500 rounded-full p-3">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">UniExam Ops</h1>
          <p className="text-center text-gray-600 mb-8">
            University Examination Operations Platform
          </p>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-4">Demo Credentials</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold">Admin:</p>
                <p>Email: admin@exam.edu</p>
                <p>Password: admin123</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold">Professor:</p>
                <p>Email: prof@exam.edu</p>
                <p>Password: prof123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
