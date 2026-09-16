import React, { useState } from "react";

const StockLogo = ({ symbol }) => {
  const [sourceIndex, setSourceIndex] = useState(0);

  const safeSymbol = typeof symbol === "string" ? symbol : "STK";
  const cleanSym = safeSymbol.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const cdnSources = [
    `https://assets-netstorage.groww.in/stock-assets/logos/GSTK${cleanSym}.png`,
    `https://images.financialmodelingprep.com/symbol/${cleanSym}.NS.png`,
    `https://s3-symbol-logo.tradingview.com/${cleanSym.toLowerCase()}--big.svg`
  ];

  const handleImageError = () => {
    setSourceIndex((prev) => prev + 1);
  };

  if (sourceIndex >= cdnSources.length || !cleanSym) {
    const initials = cleanSym ? cleanSym.slice(0, 2) : "ST";
    const charCode = cleanSym && cleanSym.length > 0 ? cleanSym.charCodeAt(0) : 65;
    const bgColors = [
      "bg-blue-600",
      "bg-emerald-600",
      "bg-violet-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-indigo-600"
    ];
    const colorClass = bgColors[charCode % bgColors.length];

    return (
      <div className={`w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0 shadow-xs`}>
        {initials}
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 shadow-xs overflow-hidden">
      <img
        src={cdnSources[sourceIndex]}
        alt={safeSymbol}
        className="w-full h-full object-contain rounded-full"
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};

export default StockLogo;