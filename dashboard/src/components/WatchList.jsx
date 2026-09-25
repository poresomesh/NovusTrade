import React, { useState, useEffect, useMemo, memo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import axios from "axios";
import StockLogo from "./StockLogo";
import TradingViewChart from "./TradingViewChart";

// Fallback official active weekly CE/PE options (Jar socket thambla tari screen white padnar nahi)
const DEFAULT_FO_CONTRACTS = [
  { symbol: "NIFTY 23150 CE", name: "Nifty 23150 Call Option", price: 132.40, change: 14.20, percentChange: 12.01, token: "FO_101", category: "FO", exchangeType: 2 },
  { symbol: "NIFTY 23150 PE", name: "Nifty 23150 Put Option", price: 98.60, change: -12.40, percentChange: -11.17, token: "FO_102", category: "FO", exchangeType: 2 },
  { symbol: "NIFTY 23200 CE", name: "Nifty 23200 Call Option", price: 104.20, change: 11.50, percentChange: 12.41, token: "FO_103", category: "FO", exchangeType: 2 },
  { symbol: "NIFTY 23200 PE", name: "Nifty 23200 Put Option", price: 121.80, change: -15.10, percentChange: -11.03, token: "FO_104", category: "FO", exchangeType: 2 },
  { symbol: "BANKNIFTY 55500 CE", name: "BankNifty 55500 Call", price: 285.40, change: 35.20, percentChange: 14.07, token: "FO_105", category: "FO", exchangeType: 2 },
  { symbol: "BANKNIFTY 55500 PE", name: "BankNifty 55500 Put", price: 242.10, change: -41.30, percentChange: -14.57, token: "FO_106", category: "FO", exchangeType: 2 },
  { symbol: "BANKNIFTY 55600 CE", name: "BankNifty 55600 Call", price: 228.00, change: 28.50, percentChange: 14.29, token: "FO_107", category: "FO", exchangeType: 2 },
  { symbol: "BANKNIFTY 55600 PE", name: "BankNifty 55600 Put", price: 295.60, change: -48.20, percentChange: -14.02, token: "FO_108", category: "FO", exchangeType: 2 },
  { symbol: "SENSEX 75000 CE", name: "Sensex 75000 Call", price: 345.50, change: 42.00, percentChange: 13.84, token: "FO_109", category: "FO", exchangeType: 2 },
  { symbol: "SENSEX 75000 PE", name: "Sensex 75000 Put", price: 280.20, change: -38.40, percentChange: -12.05, token: "FO_110", category: "FO", exchangeType: 2 },
  { symbol: "NIFTY FUT", name: "Nifty Current Month Future", price: 23170.00, change: -125.00, percentChange: -0.54, token: "FO_111", category: "FO", exchangeType: 2 },
  { symbol: "BANKNIFTY FUT", name: "BankNifty Current Month Fut", price: 55620.00, change: -430.00, percentChange: -0.77, token: "FO_112", category: "FO", exchangeType: 2 },
];

const MF_DATA = [
  { symbol: "NIFTYBEES", name: "Nippon India Nifty 50 ETF", price: 278.40, change: 1.20, percentChange: 0.43, token: "MF_1", category: "MF" },
  { symbol: "BANKBEES", name: "Nippon India Bank ETF", price: 520.10, change: -2.30, percentChange: -0.44, token: "MF_2", category: "MF" },
  { symbol: "GOLDBEES", name: "Nippon India Gold BeES ETF", price: 62.15, change: 0.45, percentChange: 0.73, token: "MF_3", category: "MF" },
  { symbol: "SILVERBEES", name: "Nippon India Silver ETF", price: 84.50, change: -0.80, percentChange: -0.94, token: "MF_4", category: "MF" },
];

const COMMODITY_DATA = [
  { symbol: "GOLD 1KG", name: "Gold Standard MCX Fut", price: 73540.00, change: 320.00, percentChange: 0.44, token: "COM_1", category: "COMMODITY" },
  { symbol: "SILVER 30KG", name: "Silver Regular MCX Fut", price: 88450.00, change: -410.00, percentChange: -0.46, token: "COM_5", category: "COMMODITY" },
  { symbol: "CRUDEOIL", name: "Crude Oil 100 BBL Fut", price: 5980.00, change: 45.00, percentChange: 0.76, token: "COM_8", category: "COMMODITY" },
];

const FD_DATA = [
  { symbol: "HDFC BANK FD", name: "7.40% p.a. (1 to 2 Years)", price: 10000.00, change: 74.00, percentChange: 7.40, token: "FD_1", category: "FD" },
  { symbol: "SBI WECARE FD", name: "7.50% p.a. (Senior Citizen)", price: 10000.00, change: 75.00, percentChange: 7.50, token: "FD_2", category: "FD" },
];

const WatchListRow = memo(({ stock, onSelectStock, onOpenOrderModal }) => {
  const isPositive = (Number(stock?.change) || 0) >= 0;

  return (
    <div
      onClick={() => onSelectStock(stock)}
      className="group relative flex items-center justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden pr-2">
        {stock?.symbol === "SENSEX" ? (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
            SE
          </div>
        ) : (
          <StockLogo symbol={stock?.symbol || "STK"} />
        )}
        <div className="overflow-hidden">
          <div className="font-bold text-xs text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {stock?.symbol || "N/A"}
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
            {stock?.name || stock?.symbol || ""}
          </div>
        </div>
      </div>

      {/* Price & Change */}
      <div className="flex flex-col items-end shrink-0 group-hover:hidden transition-all">
        <span className="font-semibold text-xs text-slate-800 tabular-nums">
          ₹{Number(stock?.price || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span
          className={`text-[10px] font-medium tabular-nums ${
            isPositive ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {isPositive ? `+₹${Number(stock?.change || 0).toFixed(2)}` : `-₹${Math.abs(Number(stock?.change || 0)).toFixed(2)}`}
          <span className="ml-1 opacity-80">
            ({isPositive ? `+${stock?.percentChange || 0}` : `${stock?.percentChange || 0}`}%)
          </span>
        </span>
      </div>

      {/* Buy / Sell Buttons */}
      <div className="hidden group-hover:flex items-center gap-1.5 shrink-0 transition-all">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenOrderModal(stock, "BUY");
          }}
          className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          B
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenOrderModal(stock, "SELL");
          }}
          className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          S
        </button>
      </div>
    </div>
  );
});

const WatchList = () => {
  const [activeWatchlistTab, setActiveWatchlistTab] = useState("stocks");
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  // Order Modal State
  const [orderModal, setOrderModal] = useState({ isOpen: false, stock: null, mode: "BUY" });
  const [orderQty, setOrderQty] = useState(1);
  const [orderProduct, setOrderProduct] = useState("CNC");
  const [orderPriceType, setOrderPriceType] = useState("MARKET");
  const [customPrice, setCustomPrice] = useState(0);

  const syncGlobalPrices = (stocksList) => {
    if (!Array.isArray(stocksList) || stocksList.length === 0) return;
    const priceMap = window.__LIVE_STOCK_PRICES__ || {};
    [...stocksList, ...DEFAULT_FO_CONTRACTS, ...MF_DATA, ...COMMODITY_DATA, ...FD_DATA].forEach((s) => {
      if (!s) return;
      const price = Number(s.price || 0);
      if (s.symbol) priceMap[String(s.symbol).toUpperCase().trim()] = price;
      if (s.name) priceMap[String(s.name).toUpperCase().trim()] = price;
    });
    window.__LIVE_STOCK_PRICES__ = priceMap;
    window.dispatchEvent(new Event("price-update"));
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        let res = await fetch("http://localhost:3002/api/stocks");
        if (!res.ok) res = await fetch("http://localhost:3002/allHoldings");
        const data = await res.json();
        if (Array.isArray(data)) {
          setStocks(data);
          syncGlobalPrices(data);
        }
      } catch (err) {
        console.error("Watchlist API error:", err);
      }
    };
    fetchStocks();

    const socket = io("http://localhost:3002", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("market-tick", (updated) => {
      if (Array.isArray(updated)) {
        setStocks(updated);
        syncGlobalPrices(updated);
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    syncGlobalPrices(stocks);
  }, [stocks]);

  const openOrderModal = (stock, mode) => {
    setOrderModal({ isOpen: true, stock, mode });
    setOrderQty(1);
    setCustomPrice(stock?.price || 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderModal.stock) return;

    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email") || localStorage.getItem("email") || "poresomesh@gmail.com";
    const userId = params.get("userId") || localStorage.getItem("userId") || "";

    const payload = {
      userId: userId,
      email: userEmail,
      name: orderModal.stock.symbol || orderModal.stock.name,
      qty: Number(orderQty),
      price: orderPriceType === "MARKET" ? Number(orderModal.stock.price) : Number(customPrice),
      mode: orderModal.mode,
      product: orderProduct,
    };

    const targetStock = orderModal.stock;

    try {
      const res = await axios.post("http://localhost:3002/newOrder", payload, {
        withCredentials: true,
      });

      setOrderModal({ isOpen: false, stock: null, mode: "BUY" });

      toast.success(res.data.message || `Order executed: ${orderModal.mode} ${orderQty} ${targetStock.symbol}!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      window.dispatchEvent(new CustomEvent("stock-tick", {
        detail: { 
          symbol: targetStock.symbol || targetStock.name, 
          price: targetStock.price 
        }
      }));
    } catch (err) {
      console.error("Order error caught:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Order placing failed!";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
    }
  };

  // Safe F&O Filter (No White Screen Crash)
  const currentDataset = useMemo(() => {
    if (!Array.isArray(stocks)) return [];

    if (activeWatchlistTab === "fo") {
      // Backend madhun NFO CE/PE contracts shodhane
      const liveFO = stocks.filter((s) => {
        if (!s || !s.symbol) return false;
        const sym = String(s.symbol).toUpperCase().trim();

        // Remove commodities (Gold, Silver, Crude) completely
        if (s.exchangeType === 5 || s.category === "COMMODITY" || sym.includes("GOLD") || sym.includes("CRUDE") || sym.includes("SILVER")) {
          return false;
        }

        // Only NIFTY, BANKNIFTY, SENSEX Options (CE/PE) & Futures
        const isIndex = sym.startsWith("NIFTY") || sym.startsWith("BANKNIFTY") || sym.startsWith("SENSEX");
        const isOptOrFut = sym.endsWith("CE") || sym.endsWith("PE") || sym.includes("FUT") || s.category === "FO" || s.exchangeType === 2;

        return isIndex && isOptOrFut;
      });

      // Jar database madhe azun load hot asel tar fallback list disel, screen white padnar nahi
      return liveFO.length > 0 ? liveFO : DEFAULT_FO_CONTRACTS;
    }

    if (activeWatchlistTab === "mf") return MF_DATA;
    if (activeWatchlistTab === "commodity") return COMMODITY_DATA;
    if (activeWatchlistTab === "fd") return FD_DATA;

    // Regular Stocks (F&O ani MF kadhun)
    return stocks.filter((s) => {
      if (!s || !s.symbol) return false;
      const sym = String(s.symbol).toUpperCase().trim();
      return s.category !== "FO" && s.exchangeType !== 2 && !sym.endsWith("CE") && !sym.endsWith("PE");
    });
  }, [activeWatchlistTab, stocks]);

  // SENSEX la NIFTY 50 ani BANKNIFTY chya barobar khali 3rd rank var thevne
  const displayedItems = useMemo(() => {
    let dataset = currentDataset || [];

    if (activeWatchlistTab === "stocks" && Array.isArray(dataset)) {
      const n50 = dataset.find((s) => s && (s.symbol === "NIFTY 50" || s.symbol === "NIFTY"));
      const bnf = dataset.find((s) => s && s.symbol === "BANKNIFTY");
      let snx = dataset.find((s) => s && s.symbol === "SENSEX");

      const remainingStocks = dataset.filter(
        (s) => s && s.symbol !== "NIFTY 50" && s.symbol !== "NIFTY" && s.symbol !== "BANKNIFTY" && s.symbol !== "SENSEX"
      );

      dataset = [
        ...(n50 ? [n50] : []),
        ...(bnf ? [bnf] : []),
        ...(snx ? [snx] : []),
        ...remainingStocks,
      ];
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return dataset.filter(
        (s) =>
          s &&
          ((s.symbol && String(s.symbol).toLowerCase().includes(term)) ||
            (s.name && String(s.name).toLowerCase().includes(term)))
      );
    }
    return dataset;
  }, [currentDataset, searchTerm, activeWatchlistTab]);

  return (
    <div className="w-[440px] h-full flex flex-col bg-white border-r border-slate-200 select-none">
      {/* 1. Search */}
      <div className="p-3.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">Watchlist</h3>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {displayedItems.length} Items
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={`Search in ${activeWatchlistTab.toUpperCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 gap-1 shrink-0 overflow-x-auto">
        {[
          { key: "stocks", label: "Stocks" },
          { key: "fo", label: "F&O" },
          { key: "mf", label: "MF" },
          { key: "commodity", label: "Commodity" },
          { key: "fd", label: "FD" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveWatchlistTab(tab.key)}
            className={`flex-1 py-1.5 px-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              activeWatchlistTab === tab.key
                ? "bg-white text-blue-600 shadow-xs border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Column Titles */}
      <div className="flex justify-between px-4 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 shrink-0">
        <span>Instrument</span>
        <div className="flex gap-10">
          <span>Price</span>
          <span>Change</span>
        </div>
      </div>

      {/* 4. List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {displayedItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No instruments found.</div>
        ) : (
          displayedItems.map((item) => (
            <WatchListRow
              key={item.token || item.symbol || item._id}
              stock={item}
              onSelectStock={(stk) => setSelectedStock(stk)}
              onOpenOrderModal={openOrderModal}
            />
          ))
        )}
      </div>

      {/* 5. BUY / SELL POPUP MODAL */}
      {orderModal.isOpen && orderModal.stock && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className={`px-5 py-4 text-white flex justify-between items-center ${orderModal.mode === "BUY" ? "bg-blue-600" : "bg-rose-600"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">{orderModal.mode} {orderModal.stock.symbol}</h3>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">NSE/NFO</span>
                </div>
                <p className="text-xs opacity-90">Market Price: ₹{orderModal.stock.price}</p>
              </div>
              <button
                type="button"
                onClick={() => setOrderModal({ isOpen: false, stock: null, mode: "BUY" })}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Product</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderProduct("CNC")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${orderProduct === "CNC" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    Longterm (CNC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderProduct("MIS")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${orderProduct === "MIS" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    Intraday (MIS)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Price</label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={orderPriceType === "MARKET"}
                    value={orderPriceType === "MARKET" ? orderModal.stock.price : customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-xs font-bold outline-none ${orderPriceType === "MARKET" ? "bg-slate-100 border-slate-200 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500"}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priceType"
                    checked={orderPriceType === "MARKET"}
                    onChange={() => setOrderPriceType("MARKET")}
                  />
                  Market
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priceType"
                    checked={orderPriceType === "LIMIT"}
                    onChange={() => setOrderPriceType("LIMIT")}
                  />
                  Limit
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Margin Req.</span>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{(orderQty * (orderPriceType === "MARKET" ? orderModal.stock.price : customPrice || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderModal({ isOpen: false, stock: null, mode: "BUY" })}
                    className="px-4 py-2 text-xs border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 text-white font-bold text-xs rounded-lg active:scale-95 shadow-xs cursor-pointer ${orderModal.mode === "BUY" ? "bg-blue-600 hover:bg-blue-700" : "bg-rose-600 hover:bg-rose-700"}`}
                  >
                    {orderModal.mode}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Chart Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl h-[680px] p-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedStock?.symbol === "SENSEX" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    SE
                  </div>
                ) : (
                  <StockLogo symbol={selectedStock?.symbol || "STK"} />
                )}
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{selectedStock?.symbol}</h4>
                  <div className="text-xs text-slate-400">{selectedStock?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-xl text-slate-800">₹{selectedStock?.price}</div>
                  <div className={`text-xs font-semibold ${Number(selectedStock?.change) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {Number(selectedStock?.change) >= 0 ? `+₹${selectedStock?.change}` : `-₹${Math.abs(selectedStock?.change)}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="my-3 flex-1 min-h-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              <TradingViewChart symbol={selectedStock?.symbol} />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                className="px-5 py-2 text-xs border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern React-Toastify Alerts Container */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default WatchList;