import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const getQueryCredentials = () => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || "poresomesh@gmail.com";
    const userId = params.get("userId") || "";
    return `email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
  };

  const fetchOrders = useCallback(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3002/allOrders?${getQueryCredentials()}`, {
        withCredentials: true,
      })
      .then((res) => {
        setAllOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders fetching error:", err);
        setLoading(false);
      });
  }, []);

useEffect(() => {
    fetchOrders();
  }, [location.pathname, location.search, fetchOrders]);

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Executed Orders ({allOrders.length})
          </h2>
          <p className="text-xs text-slate-400">List of all orders executed today</p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Loading orders...
        </div>
      ) : allOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-2xl mb-3">📋</div>
          <h4 className="text-sm font-bold text-slate-700">No orders executed yet</h4>
          <p className="text-xs text-slate-400 mt-1">Place buy or sell orders from the watchlist to see history.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto mt-3">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {allOrders.map((order, idx) => {
                const isBuy = (order.mode || "BUY").toUpperCase() === "BUY";
                return (
                  <tr key={order._id || idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "Just now"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${isBuy ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"}`}>
                        {order.mode || "BUY"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{order.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{order.product || "CNC"}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{order.qty}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      ₹{Number(order.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        COMPLETE
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

export default Orders;