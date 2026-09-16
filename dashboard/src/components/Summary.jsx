import React from "react";

const Summary = () => {
  const username = localStorage.getItem("username") || "Trader";

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
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            Add Funds
          </button>
          <button
            onClick={() => (window.location.href = "/orders")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Order Book
          </button>
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
              <p className="text-2xl font-black font-medium text-slate-900 mt-1">₹45,280.50</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Used Margin</p>
              <p className="text-lg font-bold text-slate-700 mt-1">₹12,450.00</p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Opening Balance</span>
              <span className="font-semibold text-slate-800">₹57,730.50</span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>Pay-in (Deposited today)</span>
              <span className="font-semibold text-emerald-600">+₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-600">
              <span>SPAN & Exposure</span>
              <span className="font-semibold text-slate-800">₹8,200.00</span>
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