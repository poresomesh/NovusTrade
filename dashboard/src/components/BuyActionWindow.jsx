import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBuyClick = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const currentUserId =
      localStorage.getItem("userId") || queryParams.get("userId");

    if (!currentUserId) {
      alert("Session expired. Redirecting to login...");
      window.location.href = "http://localhost:5173/login";
      return;
    }

    if (Number(stockQuantity) <= 0 || Number(stockPrice) <= 0) {
      alert("Please enter a valid quantity and price.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("https://novustrade-backend.onrender.com/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
        userId: currentUserId,
      });

      closeBuyWindow();
      window.location.reload();
    } catch (error) {
      console.error("Buy order execution failed:", error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredMargin = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
            BUY
          </span>
          <h4 className="mt-1 text-sm font-bold text-slate-800">{uid}</h4>
        </div>
        <button
          onClick={closeBuyWindow}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Inputs */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-500">Qty</label>
          <input
            type="number"
            min="1"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-500">Price (₹)</label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={stockPrice}
            onChange={(e) => setStockPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Margin Info & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-[10px] text-slate-400">Margin Req.</p>
          <p className="text-xs font-bold text-slate-800">₹{requiredMargin}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={closeBuyWindow}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleBuyClick}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Buying..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;