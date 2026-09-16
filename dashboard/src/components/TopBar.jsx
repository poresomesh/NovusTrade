import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import ProfileDropdown from "./ProfileDropdown";
import TradingViewChart from "./TradingViewChart";
// तुमच्या प्रोजेक्टच्या रचनेनुसार NewLogo.png इम्पोर्ट करा:
import newLogo from "../assets/NewLogo.png";

const TopBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState(null);

  const username = user?.username || localStorage.getItem("username") || "somesh";

  const indices = [
    { name: "NIFTY 50", symbol: "NIFTY", value: "23,219.75", change: "+0.44%", isUp: true },
    { name: "SENSEX", symbol: "SENSEX", value: "74,285.80", change: "+0.38%", isUp: true },
    { name: "BANKNIFTY", symbol: "BANKNIFTY", value: "56,222.95", change: "+0.77%", isUp: true },
  ];

  // लोगोवर क्लिक केल्यावर थेट "/" (TradingAssistant) वर जाण्यासाठी
  const handleLogoClick = () => {
    navigate({
      pathname: "/",
      search: window.location.search,
    });
    window.dispatchEvent(new Event("app-navigate"));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
        {/* Row 1: Logo & Nav */}
        <div className="flex h-14 items-center justify-between px-6">
          
          {/* Logo Container (Clickable to "/") */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="Go to Trading Assistant"
          >
            <img 
              src={newLogo} 
              alt="NovusTrade Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-6">
            <Menu />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span>{username}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showProfile && (
                <ProfileDropdown
                  user={user || { username }}
                  onClose={() => setShowProfile(false)}
                  onLogout={onLogout}
                />
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Live Clickable Indices Bar */}
        <div className="flex h-8 items-center gap-6 px-6 bg-slate-50/80 text-xs border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Markets
          </span>
          {indices.map((idx) => (
            <div
              key={idx.name}
              onClick={() => setActiveChartIndex(idx)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-200/50 px-2 py-0.5 rounded transition-colors"
              title={`Click to view ${idx.name} Candlestick Chart`}
            >
              <span className="font-semibold text-slate-600 text-[11px]">{idx.name}</span>
              <span className="font-bold text-slate-800 text-[11px]">{idx.value}</span>
              <span className={`text-[10px] font-bold ${idx.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                {idx.change}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Index Candle Chart Modal with Buy & Sell */}
      {activeChartIndex && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl h-[680px] p-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {activeChartIndex.name} Candlestick Chart
                </h3>
                <p className="text-xs text-slate-400">Live Index Technical Analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-xl text-slate-800">{activeChartIndex.value}</span>
                <span className={`text-xs font-bold ${activeChartIndex.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                  {activeChartIndex.change}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveChartIndex(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="my-3 flex-1 min-h-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              <TradingViewChart symbol={activeChartIndex.symbol} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 bg-white">
              <span className="text-xs text-slate-500 font-medium">
                Trade {activeChartIndex.name} Futures & Options
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveChartIndex(null)}
                  className="px-4 py-2 text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Buy Order placed for ${activeChartIndex.name}`);
                    setActiveChartIndex(null);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs transition-all"
                >
                  Buy {activeChartIndex.name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Sell Order placed for ${activeChartIndex.name}`);
                    setActiveChartIndex(null);
                  }}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs transition-all"
                >
                  Sell {activeChartIndex.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;