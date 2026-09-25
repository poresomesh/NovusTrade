import React, { useState, useEffect } from "react";
import axios from "axios";

const Funds = () => {
  const [funds, setFunds] = useState(0);
  const [usedMargin, setUsedMargin] = useState(0);
  const [loading, setLoading] = useState(true);

  // User credentials extract karne
  const params = new URLSearchParams(window.location.search);
  const userEmail = params.get("email") || localStorage.getItem("email") || "poresomesh@gmail.com";
  const userId = params.get("userId") || localStorage.getItem("userId") || "";

  const fetchFundsAndMargin = async () => {
    try {
      // 1. Live Available Funds fetch karne
      const fundsRes = await axios.get("http://localhost:3002/userFunds", {
        params: { userId, email: userEmail },
        withCredentials: true,
      });

      if (fundsRes.data && fundsRes.data.funds !== undefined) {
        setFunds(Number(fundsRes.data.funds));
      }

      // 2. Used Margin sathi Holdings calculate karne
      const holdingsRes = await axios.get("http://localhost:3002/allHoldings", {
        params: { userId, email: userEmail },
        withCredentials: true,
      });

      if (Array.isArray(holdingsRes.data)) {
        const totalInvested = holdingsRes.data.reduce((acc, curr) => {
          const qty = Number(curr.qty) || 0;
          const avg = Number(curr.avg) || Number(curr.price) || 0;
          return acc + qty * avg;
        }, 0);
        setUsedMargin(totalInvested);
      }
    } catch (err) {
      console.error("Failed to fetch funds/margin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundsAndMargin();

    // Custom order event kiva tick aalyavr real-time update
    const handleUpdate = () => fetchFundsAndMargin();
    window.addEventListener("stock-tick", handleUpdate);
    window.addEventListener("price-update", handleUpdate);

    return () => {
      window.removeEventListener("stock-tick", handleUpdate);
      window.removeEventListener("price-update", handleUpdate);
    };
  }, []);

  const openingBalance = funds + usedMargin;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Funds &amp; Margin</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your trading limits, deposit via UPI, or request withdrawals.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer">
            + Add Funds
          </button>
          <button className="px-5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all cursor-pointer">
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-sm text-slate-800">Equity</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Available Cash</span>
              <span className="font-bold text-base text-slate-800 tabular-nums">
                ₹{loading ? "..." : funds.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Used Margin</span>
              <span className="font-bold text-slate-700 tabular-nums">
                ₹{loading ? "..." : usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Opening Balance</span>
              <span className="font-bold text-slate-700 tabular-nums">
                ₹{loading ? "..." : openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Pay-in Amount</span>
              <span className="font-bold text-emerald-600 tabular-nums">+₹0.00</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">SPAN Margin</span>
              <span className="font-semibold text-slate-700 tabular-nums">₹0.00</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Delivery Margin</span>
              <span className="font-semibold text-slate-700 tabular-nums">₹0.00</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Exposure Margin</span>
              <span className="font-semibold text-slate-700 tabular-nums">₹0.00</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-3">
              <span className="text-slate-500">Total Collateral</span>
              <span className="font-semibold text-slate-700 tabular-nums">₹0.00</span>
            </div>
          </div>
        </div>

        {/* Commodity Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-sm text-slate-800">Commodity</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Inactive
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Available Cash</span>
                <span className="font-bold text-slate-700 tabular-nums">₹0.00</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Used Margin</span>
                <span className="font-bold text-slate-700 tabular-nums">₹0.00</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Opening Balance</span>
                <span className="font-bold text-slate-700 tabular-nums">₹0.00</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Pay-in Amount</span>
                <span className="font-bold text-slate-700 tabular-nums">₹0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200 mt-6">
            <p className="text-xs text-slate-500 mb-1">You haven't activated Commodity trading yet.</p>
            <button className="text-blue-600 font-bold text-xs hover:underline cursor-pointer">
              Activate MCX Segment &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;