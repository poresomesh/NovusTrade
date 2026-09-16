import React from "react";

const Funds = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Funds & Margin</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your trading limits, deposit via UPI, or request withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("Instant UPI / Netbanking Gateway will open here.")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            + Add Funds
          </button>
          <button
            onClick={() => alert("Withdrawal request window.")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Grid: Equity vs Commodity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equity Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Equity
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Available Cash</span>
              <span className="font-bold text-slate-900 text-sm">₹45,280.50</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Used Margin</span>
              <span className="font-semibold text-slate-800">₹12,450.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Opening Balance</span>
              <span className="font-semibold text-slate-800">₹57,730.50</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Pay-in Amount</span>
              <span className="font-semibold text-emerald-600">+₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">SPAN Margin</span>
              <span className="font-semibold text-slate-800">₹8,200.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Delivery Margin</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Exposure Margin</span>
              <span className="font-semibold text-slate-800">₹4,250.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Total Collateral</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
          </div>
        </div>

        {/* Commodity Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Commodity
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
              Inactive
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Available Cash</span>
              <span className="font-bold text-slate-900 text-sm">₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Used Margin</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Opening Balance</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Pay-in Amount</span>
              <span className="font-semibold text-slate-800">₹0.00</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">
              You haven't activated Commodity trading yet.
            </p>
            <button
              onClick={() => alert("Redirecting to segment activation...")}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              Activate MCX Segment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;