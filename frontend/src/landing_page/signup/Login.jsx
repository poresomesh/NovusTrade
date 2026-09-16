import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = inputValue;

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
        "http://localhost:3002/login",
        { ...inputValue },
        { withCredentials: true }
      );

      const { success, message, user } = data;

      if (success) {
        // Extract real user details or create fallbacks from input form
        const finalUserId = user?._id || "";
        const finalUsername =
          user?.username || user?.name || inputValue.email.split("@")[0];
        const finalEmail = user?.email || inputValue.email;

        // Store in current frontend origin storage
        localStorage.setItem("userId", finalUserId);
        localStorage.setItem("username", finalUsername);
        localStorage.setItem("email", finalEmail);

        // Redirect across ports to Dashboard (5174) with complete credentials encoded
        window.location.href = `http://localhost:5174/?userId=${encodeURIComponent(
          finalUserId
        )}&username=${encodeURIComponent(
          finalUsername
        )}&email=${encodeURIComponent(finalEmail)}`;
      } else {
        setErrorMessage(message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setErrorMessage(
        error.response?.data?.message || "Server connection failed. Try again."
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
            Login to NovusTrade
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Access your Kite dashboard, holdings, and order book
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
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600 hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;