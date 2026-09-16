import React, { useState, useEffect, useMemo, memo } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import StockLogo from "./StockLogo";
import TradingViewChart from "./TradingViewChart";

const FO_DATA = [
  { symbol: "NIFTY 25000 CE", name: "Nifty Current Week Call", price: 145.20, change: 18.40, percentChange: 14.5, token: "FO_1", category: "FO" },
  { symbol: "NIFTY 24900 PE", name: "Nifty Current Week Put", price: 92.50, change: -12.10, percentChange: -11.5, token: "FO_2", category: "FO" },
  { symbol: "BANKNIFTY 52000 CE", name: "BankNifty Call Option", price: 280.00, change: 35.00, percentChange: 14.2, token: "FO_3", category: "FO" },
  { symbol: "BANKNIFTY 51500 PE", name: "BankNifty Put Option", price: 165.75, change: -22.50, percentChange: -11.9, token: "FO_4", category: "FO" },
  { symbol: "RELIANCE FUT", name: "Reliance Current Month Fut", price: 1242.00, change: 8.50, percentChange: 0.69, token: "FO_5", category: "FO" },
  { symbol: "TCS FUT", name: "TCS Current Month Fut", price: 2260.00, change: -15.00, percentChange: -0.66, token: "FO_6", category: "FO" }
];

const MF_DATA = [
  { symbol: "NIFTYBEES", name: "Nippon India Nifty 50 ETF", price: 278.40, change: 1.20, percentChange: 0.43, token: "MF_1", category: "MF" },
  { symbol: "GOLDBEES", name: "Nippon India Gold ETF", price: 62.15, change: 0.45, percentChange: 0.73, token: "MF_2", category: "MF" },
  { symbol: "BANKBEES", name: "Nippon India Bank ETF", price: 520.10, change: -2.30, percentChange: -0.44, token: "MF_3", category: "MF" },
  { symbol: "ITBEES", name: "Nippon India IT ETF", price: 41.80, change: 0.60, percentChange: 1.45, token: "MF_4", category: "MF" }
];

const WatchListRow = memo(({ stock, onSelectStock, onOpenOrderModal }) => {
  const isPositive = (stock.change || 0) >= 0;

  return (
    <div
      onClick={() => onSelectStock(stock)}
      className="group relative flex items-center justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden pr-2">
        <StockLogo symbol={stock?.symbol || "STK"} />
        <div className="overflow-hidden">
          <div className="font-bold text-xs text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {stock?.symbol}
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
            {stock?.name || stock?.symbol}
          </div>
        </div>
      </div>

      {/* Normal: Price & Change (Hides on hover) */}
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

      {/* Hover: Buy / Sell Buttons */}
      <div className="hidden group-hover:flex items-center gap-1.5 shrink-0 transition-all">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenOrderModal(stock, "BUY");
          }}
          className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          B
        </button>
        <button
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

  // Modal State
  const [orderModal, setOrderModal] = useState({ isOpen: false, stock: null, mode: "BUY" });
  const [orderQty, setOrderQty] = useState(1);
  const [orderProduct, setOrderProduct] = useState("CNC");
  const [orderPriceType, setOrderPriceType] = useState("MARKET");
  const [customPrice, setCustomPrice] = useState(0);

  // १. किमती ग्लोबल ऑब्जेक्टवर सिंक करण्याचे फंक्शन
  const syncGlobalPrices = (stocksList) => {
    if (!Array.isArray(stocksList) || stocksList.length === 0) return;
    
    const priceMap = window.__LIVE_STOCK_PRICES__ || {};
    
    // Stocks, F&O आणि Mutual Funds या तिन्हीच्या किमती सिंक करणे
    [...stocksList, ...FO_DATA, ...MF_DATA].forEach((s) => {
      const price = Number(s.price || 0);
      if (s.symbol) priceMap[s.symbol.toUpperCase().trim()] = price;
      if (s.name) priceMap[s.name.toUpperCase().trim()] = price;
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
    if (Array.isArray(updated) && updated.length > 0) {
      setStocks(updated);
      syncGlobalPrices(updated);
    }
  });

  return () => {
    socket.disconnect();
  };
}, []); // <--- ही रिकामी ॲरे [] असणे आवश्यक आहे

  // जेव्हा स्टॉक्स स्टेट बदलते तेव्हा नेहमी ग्लोबल प्राईस अपडेट ठेवणे
  useEffect(() => {
    syncGlobalPrices(stocks);
  }, [stocks]);

  const openOrderModal = (stock, mode) => {
    setOrderModal({ isOpen: true, stock, mode });
    setOrderQty(1);
    setCustomPrice(stock.price || 0);
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
    setOrderModal({ isOpen: false, stock: null, mode: "BUY" });

    try {
      const res = await axios.post("http://localhost:3002/newOrder", payload, {
        withCredentials: true,
      });
      console.log("Order success:", res.data);

      // ऑर्डर होताच संबंधित स्टॉकची प्राईस अपडेट ट्रिगर करणे
      window.dispatchEvent(new CustomEvent("stock-tick", {
        detail: { 
          symbol: targetStock.symbol || targetStock.name, 
          price: targetStock.price 
        }
      }));
    } catch (err) {
      console.error("Order placement error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Order placing failed! Check backend terminal.");
    }
  };

  const currentDataset = useMemo(() => {
    if (activeWatchlistTab === "fo") return FO_DATA;
    if (activeWatchlistTab === "mf") return MF_DATA;
    return stocks;
  }, [activeWatchlistTab, stocks]);

  const displayedItems = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return currentDataset.filter(
        (s) =>
          (s.symbol && s.symbol.toLowerCase().includes(term)) ||
          (s.name && s.name.toLowerCase().includes(term))
      );
    }
    return currentDataset;
  }, [currentDataset, searchTerm]);

  return (
    <div className="w-[380px] h-full flex flex-col bg-white border-r border-slate-200 select-none">
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
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 gap-1 shrink-0">
        {[
          { key: "stocks", label: "1. Stocks" },
          { key: "fo", label: "2. F&O" },
          { key: "mf", label: "3. Mutual Funds" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveWatchlistTab(tab.key)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
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
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">NSE</span>
                </div>
                <p className="text-xs opacity-90">Market Price: ₹{orderModal.stock.price}</p>
              </div>
              <button
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
                <StockLogo symbol={selectedStock.symbol} />
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{selectedStock.symbol}</h4>
                  <div className="text-xs text-slate-400">{selectedStock.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-xl text-slate-800">₹{selectedStock.price}</div>
                  <div className={`text-xs font-semibold ${selectedStock.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {selectedStock.change >= 0 ? `+₹${selectedStock.change}` : `-₹${Math.abs(selectedStock.change)}`}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="my-3 flex-1 min-h-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              <TradingViewChart symbol={selectedStock.symbol} />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStock(null)}
                className="px-5 py-2 text-xs border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchList;