import React, { useState } from "react";
import { User, Lock, AppWindow, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import libraryBg from "../assets/library-bg.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Invigilator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    // Mock signup process
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully! Please log in.");
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Panel - Image Background */}
      <div 
        className="hidden lg:flex w-5/12 relative flex-col justify-center items-center overflow-hidden bg-slate-900"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${libraryBg})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12 max-w-lg">
          {/* Icon Box */}
          <div className="w-24 h-24 bg-slate-800/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-slate-700/50 shadow-2xl">
            <AppWindow className="w-12 h-12 text-blue-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Exam Invigilation System
          </h1>
          
          <p className="text-slate-300 text-lg leading-relaxed">
            Ensuring academic integrity with professional institutional clarity and modern management tools.
          </p>
        </div>

        {/* Left Footer */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            Institutional Exam Management © 2024
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 relative flex flex-col justify-center items-center bg-white">
        
        {/* Wavy Divider SVG (Visible only on large screens, overlapping left panel) */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-0 w-32 -translate-x-[99%] pointer-events-none text-white overflow-hidden">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full fill-current"
          >
            {/* S-curve logic: Top starts at 100, curves left to 0, then curves right to 200, ends at 100 */}
            <path d="M100 0 C-40 30, 200 70, 100 100 L100 100 L100 0 Z" />
          </svg>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Create an Account</h2>
            <p className="text-slate-500 text-sm">Sign up to join the system</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Role Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Role</label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 font-medium transition-all"
                >
                  <option value="Invigilator">Invigilator</option>
                  <option value="Administrator">Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium transition-all"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-black tracking-widest transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account? <Link to="/" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Sign in!</Link>
            </p>
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center pt-8 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400">
              Need assistance? <a href="#" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Contact Support</a>
            </p>
          </div>
          
        </div>

        {/* Right Footer */}
        <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-4">
          <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
