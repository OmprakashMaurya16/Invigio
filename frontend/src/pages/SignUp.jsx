import React, { useState } from "react";
import {
  BookOpenCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import libraryBg from "../assets/library-bg.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Invigilator");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !password) return setError("Complete all fields.");
    if (password.length < 8)
      return setError("Password must have at least 8 characters.");
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully. Please sign in.");
      navigate("/");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${libraryBg})` }}
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 max-w-sm px-10 text-center text-white">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600">
            <BookOpenCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-semibold">Exam Desk</h1>
          <p className="mt-3 text-sm text-slate-300">Create your account</p>
        </div>
      </aside>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl shadow-slate-200/70 sm:p-9">
          <div className="mb-7">
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <BookOpenCheck className="h-6 w-6 text-blue-700" />
              <span className="text-sm font-bold">EXAM DESK</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Create account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Use your institutional email.
            </p>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Role
              </span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Invigilator">Invigilator</option>
                <option value="Administrator">Administrator</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </span>
              <span className="relative block">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="h-11 w-full rounded-lg border border-slate-200 pl-11 pr-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@institution.edu"
                  className="h-11 w-full rounded-lg border border-slate-200 pl-11 pr-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-11 w-full rounded-lg border border-slate-200 pl-11 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-lg bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
