import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://novustrade-backend.onrender.com/signup",
        { ...inputValue },
        { withCredentials: true }
      );

      const { success, message, user } = data;

      if (success) {
        if (user && user._id) {
          localStorage.setItem("userId", user._id);
          localStorage.setItem("username", user.username || username);
        }
        // Direct jump to Dashboard
        window.location.href = `https://novustrade-gses.onrender.com/?userId=${user?._id || ""}`;
      } else {
        setErrorMessage(message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage(
        error.response?.data?.message || "Server connection failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50/75 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Open a free account
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Start investing with zero brokerage on delivery trades
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              required
              placeholder="e.g. rahul_trader"
              onChange={handleOnChange}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              required
              placeholder="trader@example.com"
              onChange={handleOnChange}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              required
              placeholder="••••••••"
              onChange={handleOnChange}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Complete Registration"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;