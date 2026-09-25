import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProfileDropdown = ({ user, onClose, onLogout }) => {
  const username = user?.username || "somesh";
  const email = user?.email || "poresomesh@gmail.com";
  const clientId = user?.clientId || "NT7294";

  // रिअल टाइम युझर फंड्स (Default ₹50,000)
  const [availableFunds, setAvailableFunds] = useState(50000);

  useEffect(() => {
    const fetchUserFunds = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryEmail = params.get("email") || email || localStorage.getItem("email") || "";
        const queryUserId = params.get("userId") || user?.id || localStorage.getItem("userId") || "";
        
        const res = await axios.get(
          `https://novustrade-backend.onrender.com/userFunds?userId=${queryUserId}&email=${encodeURIComponent(queryEmail)}`
        );
        if (res.data && typeof res.data.funds === "number") {
          setAvailableFunds(res.data.funds);
        }
      } catch (err) {
        console.warn("Funds fetch error in ProfileDropdown:", err.message);
      }
    };
    fetchUserFunds();
  }, [user, email]);

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // संपूर्ण लॉगआउट हँडलर
  const handleFullLogout = async () => {
    try {
      // 1. बॅकएंडवर लॉगआउट रिक्वेस्ट पाठवणे
      await axios.post("https://novustrade-backend.onrender.com/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Backend logout warning:", err.message);
    } finally {
      // 2. पालकाकडून आलेला प्रॉप असल्यास चालवणे
      if (typeof onLogout === "function") {
        onLogout();
      }

      // 3. लोकल स्टोरेज आणि सेशन पूर्णपणे रिकामे करणे
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      sessionStorage.clear();

      // 4. ब्राऊझरमधील टोकन कुकी नष्ट करणे
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 5. मुख्य लँडिंग/लॉगिन ॲपवर रिडायरेक्ट करणे
      window.location.href = "http://localhost:5173";
    }
  };

  return (
    <div
      className={`absolute right-0 top-12 z-50 w-84 rounded-2xl border p-4 shadow-2xl transition-colors duration-200 ${
        isDark
          ? "bg-[#0f172a] border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      {/* 1. Header Profile Info */}
      <div
        className={`flex items-center gap-3.5 border-b pb-3 ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold">{username}</h4>
          <p className="truncate text-xs text-slate-400">{email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                isDark
                  ? "bg-blue-950 text-blue-400 border border-blue-900"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {clientId}
            </span>
            <span className="text-[10px] text-slate-400">PAN: ABCDE****F</span>
          </div>
        </div>
      </div>

      {/* 2. Account Margins */}
      <div
        className={`grid grid-cols-2 gap-2 border-b py-3 text-xs ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <div className={`rounded-xl p-2.5 ${isDark ? "bg-[#1e293b]" : "bg-slate-50"}`}>
          <span className="block text-[10px] font-medium text-slate-400">Available Margin</span>
          <span className="font-bold">
            ₹{Number(availableFunds).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`rounded-xl p-2.5 ${isDark ? "bg-[#1e293b]" : "bg-slate-50"}`}>
          <span className="block text-[10px] font-medium text-slate-400">Trading Segments</span>
          <span className="font-bold text-emerald-500">NSE • BSE • F&O</span>
        </div>
      </div>

      {/* 3. Reports Section */}
      <div
        className={`border-b py-2.5 ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <span className="mb-1 block px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Console & Reports
        </span>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {[
            { name: "Holdings P&L", path: "/holdings" },
            { name: "Tradebook", path: "/orders" },
            { name: "Positions", path: "/positions" },
            { name: "Funds & Ledger", path: "/funds" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                isDark
                  ? "hover:bg-[#1e293b] hover:text-blue-400 text-slate-300"
                  : "hover:bg-slate-100 hover:text-blue-600 text-slate-700"
              }`}
            >
              <span>{item.name}</span>
              <span className="text-[10px] text-slate-400">›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Dark/Light Mode Switch Row */}
      <div className="space-y-1 py-2 text-xs">
        <div
          onClick={toggleTheme}
          className={`flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
            isDark ? "hover:bg-[#1e293b]" : "hover:bg-slate-100"
          }`}
        >
          <span>Dark Mode Theme</span>
          <button
            type="button"
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${
              isDark
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {isDark ? "ON" : "OFF"}
          </button>
        </div>

        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer ${
            isDark ? "hover:bg-[#1e293b]" : "hover:bg-slate-100"
          }`}
        >
          <span>Keyboard Shortcuts</span>
          <span className="font-mono text-xs text-slate-400">⌘ /</span>
        </div>
      </div>

      {/* 5. Logout */}
      <div className={`border-t pt-2.5 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <button
          type="button"
          onClick={handleFullLogout}
          className={`w-full rounded-xl px-3 py-2 text-center text-xs font-bold transition-all cursor-pointer ${
            isDark
              ? "bg-rose-950/40 text-rose-400 hover:bg-rose-900/50"
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;