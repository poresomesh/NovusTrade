import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);
  const location = useLocation();

  const getQueryCredentials = () => {
    const params = new URLSearchParams(window.location.search);
    const email =
      params.get("email") ||
      localStorage.getItem("email") ||
      "poresomesh@gmail.com";
    const userId =
      params.get("userId") || localStorage.getItem("userId") || "";
    return `email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
  };

  const fetchPositions = useCallback(() => {
    setLoading(true);
    axios
      .get(`https://novustrade-backend.onrender.com/allPositions?${getQueryCredentials()}`, {
        withCredentials: true,
      })
      .then((res) => {
        setAllPositions(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Positions fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [location.pathname, location.search, fetchPositions]);

  // लाईव्ह टिकर इव्हेंट ऐकून व्ह्यू अपडेट करणे
  useEffect(() => {
    const handlePriceTick = () => {
      setTick((t) => t + 1);
    };

    window.addEventListener("price-update", handlePriceTick);
    const interval = setInterval(handlePriceTick, 1000);

    return () => {
      window.removeEventListener("price-update", handlePriceTick);
      clearInterval(interval);
    };
  }, []);

  // वॉचलिस्टच्या लाईव्ह किमतींमधून LTP शोधणे
  const getLiveLtp = (item) => {
    const stockName = (item.name || "").toUpperCase().trim();
    const livePrices = window.__LIVE_STOCK_PRICES__ || {};

    if (livePrices[stockName]) {
      return Number(livePrices[stockName]);
    }
    return Number(item.price || item.avg || 0);
  };

  // एकूण P&L आणि आकडेमोड
  const totalInvestment = allPositions.reduce(
    (acc, item) => acc + Number(item.qty || 0) * Number(item.avg || 0),
    0
  );

  const currentValue = allPositions.reduce((acc, item) => {
    const ltp = getLiveLtp(item);
    return acc + Number(item.qty || 0) * ltp;
  }, 0);

  const totalPnL = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col bg-white select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Open Positions ({allPositions.length})
          </h2>
          <p className="text-xs text-slate-400">
            Intraday & overnight trading positions
          </p>
        </div>
        <button
          type="button"
          onClick={fetchPositions}
          className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4 my-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Investment
          </span>
          <span className="text-sm font-bold text-slate-800">
            ₹
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Current Value
          </span>
          <span className="text-sm font-bold text-slate-800">
            ₹
            {currentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total P&L
          </span>
          <span
            className={`text-sm font-bold ${
              totalPnL >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {totalPnL >= 0
              ? `+₹${totalPnL.toFixed(2)}`
              : `-₹${Math.abs(totalPnL).toFixed(2)}`}{" "}
            ({pnlPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Positions Table */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Loading positions...
        </div>
      ) : allPositions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-2xl mb-3">
            📊
          </div>
          <h4 className="text-sm font-bold text-slate-700">
            No open positions
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Execute a trade from the watchlist to see active positions.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Avg. Price</th>
                <th className="py-3 px-4 text-right">LTP</th>
                <th className="py-3 px-4 text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {allPositions.map((item, idx) => {
                const liveLtp = getLiveLtp(item);
                const avgPrice = Number(item.avg || 0);
                const qty = Number(item.qty || 0);

                const itemCurVal = qty * liveLtp;
                const itemTotalCost = qty * avgPrice;
                const itemPnL = itemCurVal - itemTotalCost;
                const itemPnLPercent =
                  itemTotalCost > 0 ? (itemPnL / itemTotalCost) * 100 : 0;

                return (
                  <tr
                    key={item._id || idx}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.product || "CNC"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      {qty}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ₹{avgPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      ₹{liveLtp.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-bold ${
                        itemPnL >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {itemPnL >= 0
                        ? `+₹${itemPnL.toFixed(2)}`
                        : `-₹${Math.abs(itemPnL).toFixed(2)}`}
                      <span className="text-[10px] ml-1">
                        ({itemPnLPercent.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Positions;