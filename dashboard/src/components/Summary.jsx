import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const Summary = () => {
  const username = localStorage.getItem("username") || "Trader";

  // Backend States
  const [availableFunds, setAvailableFunds] = useState(50000);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [pnlFilter, setPnlFilter] = useState("all"); // today, week, month, year, all

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email") || localStorage.getItem("email") || "";
        const userId = params.get("userId") || localStorage.getItem("userId") || "";

        const [fundsRes, ordersRes, holdingsRes] = await Promise.all([
          axios.get(`https://novustrade-backend.onrender.com/userFunds?userId=${userId}&email=${encodeURIComponent(email)}`),
          axios.get(`https://novustrade-backend.onrender.com/allOrders?userId=${userId}&email=${encodeURIComponent(email)}`),
          axios.get(`https://novustrade-backend.onrender.com/allHoldings?userId=${userId}&email=${encodeURIComponent(email)}`),
        ]);

        if (fundsRes.data && typeof fundsRes.data.funds === "number") {
          setAvailableFunds(fundsRes.data.funds);
        }
        setOrders(ordersRes.data || []);
        setHoldings(holdingsRes.data || []);
      } catch (err) {
        console.warn("Summary data fetch error:", err.message);
      }
    };

    fetchSummaryData();
  }, []);

  // Used Margin (सध्याच्या होल्डिंग्समधील एकूण गुंतवणूक)
  const usedMargin = useMemo(() => {
    return holdings.reduce((acc, curr) => acc + Number(curr.qty || 0) * Number(curr.avg || 0), 0);
  }, [holdings]);

  // टाईम-फिल्टरनुसार ऑर्डर्स वेगळे करणे
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || Date.now());
      if (pnlFilter === "today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (pnlFilter === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      }
      if (pnlFilter === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= oneMonthAgo;
      }
      if (pnlFilter === "year") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return orderDate >= oneYearAgo;
      }
      return true; // "all"
    });
  }, [orders, pnlFilter]);

  // Realized P&L (विकलेल्या ऑर्डर्सवरून Booked Profit/Loss)
  const realizedPnL = useMemo(() => {
    let buyMap = {};
    let profit = 0;

    [...filteredOrders].reverse().forEach((ord) => {
      const sym = ord.name;
      const qty = Number(ord.qty);
      const price = Number(ord.price);

      if (ord.mode === "BUY") {
        if (!buyMap[sym]) buyMap[sym] = [];
        buyMap[sym].push({ qty, price });
      } else if (ord.mode === "SELL") {
        let sellQty = qty;
        while (sellQty > 0 && buyMap[sym] && buyMap[sym].length > 0) {
          const buyLot = buyMap[sym][0];
          const matchedQty = Math.min(sellQty, buyLot.qty);
          profit += matchedQty * (price - buyLot.price);
          buyLot.qty -= matchedQty;
          sellQty -= matchedQty;
          if (buyLot.qty === 0) buyMap[sym].shift();
        }
      }
    });

    return profit;
  }, [filteredOrders]);

  // Unrealized P&L (चालू असलेल्या ओपन होल्डिंग्सचा नफा/तोटा)
  const unrealizedPnL = useMemo(() => {
    return holdings.reduce((acc, curr) => {
      const currentPrice = Number(curr.price || curr.avg);
      const avgPrice = Number(curr.avg);
      const qty = Number(curr.qty);
      return acc + (currentPrice - avgPrice) * qty;
    }, 0);
  }, [holdings]);

  // Total P&L
  const totalPnL = realizedPnL + unrealizedPnL;
  const isOverallProfit = totalPnL >= 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Equity & Derivatives
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-800">
            Hi, {username}! 👋
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Here is your account overview and trading margin summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (window.location.href = "/funds")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            Add Funds
          </button>
          <button
            onClick={() => (window.location.href = "/orders")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Order Book
          </button>
        </div>
      </div>

      {/* --- OVERALL P&L ANALYTICS CARD WITH FILTERS --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isOverallProfit ? "bg-emerald-500" : "bg-rose-500"}`}></span>
              Overall Performance & P&L
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Booked profit/loss and active portfolio returns</p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto">
            {[
              { key: "today", label: "Today" },
              { key: "week", label: "Last Week" },
              { key: "month", label: "Last Month" },
              { key: "year", label: "Last Year" },
              { key: "all", label: "Overall Trade" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPnlFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  pnlFilter === tab.key
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Metrics Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-semibold text-slate-400">Booked Realized P&L</span>
            <p className={`text-xl font-black mt-1 ${realizedPnL >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {realizedPnL >= 0 ? `+₹${realizedPnL.toFixed(2)}` : `-₹${Math.abs(realizedPnL).toFixed(2)}`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">From closed / sold positions</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-xs font-semibold text-slate-400">Unrealized Open P&L</span>
            <p className={`text-xl font-black mt-1 ${unrealizedPnL >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {unrealizedPnL >= 0 ? `+₹${unrealizedPnL.toFixed(2)}` : `-₹${Math.abs(unrealizedPnL).toFixed(2)}`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">Live market return on holdings</span>
          </div>

          <div className={`rounded-xl border p-4 ${isOverallProfit ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"}`}>
            <span className="text-xs font-semibold text-slate-500">Net Combined P&L ({pnlFilter.toUpperCase()})</span>
            <p className={`text-xl font-black mt-1 ${isOverallProfit ? "text-emerald-600" : "text-rose-600"}`}>
              {isOverallProfit ? `+₹${totalPnL.toFixed(2)}` : `-₹${Math.abs(totalPnL).toFixed(2)}`}
            </p>
            <span className="text-[10px] text-slate-500 block mt-1">Total Trading Performance</span>
          </div>
        </div>
      </div>

      {/* Margins & Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equity Margin Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Equity Margins
            </h3>
            <span className="text-xs text-slate-400 font-medium">Segment: NSE/BSE</span>
          </div>

          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Available Margin</p>
              <p className="text-2xl font-black font-medium text-slate-900 mt-1">
                ₹{Number(availableFunds).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Used Margin</p>
              <p className="text-lg font-bold text-slate-700 mt-1">
                ₹{Number(usedMargin).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Opening Balance</span>
              <span className="font-semibold text-slate-800">
                ₹{(availableFunds + usedMargin).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Virtual Initial Bonus</span>
              <span className="font-semibold text-emerald-600">₹50,000.00</span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>SPAN & Exposure</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
          </div>
        </div>

        {/* Commodity Margin Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Commodity Margins
            </h3>
            <span className="text-xs text-slate-400 font-medium">Segment: MCX</span>
          </div>

          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Available Margin</p>
              <p className="text-2xl font-black font-medium text-slate-900 mt-1">₹0.00</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Used Margin</p>
              <p className="text-lg font-bold text-slate-700 mt-1">₹0.00</p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Opening Balance</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Commodity Status</span>
              <span className="font-semibold text-amber-600">Inactive</span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Activation Required</span>
              <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
                Activate MCX
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;