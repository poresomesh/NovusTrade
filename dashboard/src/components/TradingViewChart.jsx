import React, { useEffect, useRef, memo } from "react";

const TradingViewChart = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

const cleanSym = symbol ? String(symbol).replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "RELIANCE";

    let tvSymbol = `NSE:${cleanSym}`;

    // Map Index & Option derivatives to base active indices on TradingView
    if (cleanSym.includes("NIFTY") && !cleanSym.includes("BANK")) {
      tvSymbol = "NSE:NIFTY";
    } else if (cleanSym.includes("BANKNIFTY") || cleanSym.includes("BANK")) {
      tvSymbol = "NSE:BANKNIFTY";
    } else if (cleanSym.includes("SENSEX")) {
      tvSymbol = "BSE:SENSEX";
    } else if (cleanSym.includes("RELIANCE")) {
      tvSymbol = "NSE:RELIANCE";
    } else if (cleanSym.includes("TCS")) {
      tvSymbol = "NSE:TCS";
    }

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_side_toolbar: false,
      withdateranges: true,
      save_image: true,
      // झूमिंग आणि टचपॅड जेश्चर चालू करण्यासाठी:
      disabled_features: [],
      enabled_features: [
        "mouse_wheel_scale",       // माउस स्क्रोलने थेट कॅन्डल्स झूम इन / आउट होतात
        "pinch_to_zoom",          // लॅपटॉप टचपॅडवर 2 बोटांनी Pinch-in / Pinch-out ने झूम होते
        "chart_zoom",             // ऑन-स्क्रीन झूम टूल्स चालू होतात
      ],
      studies: ["STD;EMA", "STD;RSI"],
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full h-[520px] rounded-xl overflow-hidden"
    />
  );
};

export default memo(TradingViewChart);