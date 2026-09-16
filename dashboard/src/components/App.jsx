import React from "react";

const appsList = [
  {
    name: "Varsity",
    desc: "Easy to grasp, collection of stock market lessons with in-depth coverage and illustrations.",
    badge: "Education",
    icon: "🎓",
    link: "https://zerodha.com/varsity/",
  },
  {
    name: "Coin",
    desc: "Buy direct mutual funds online, commission-free, delivered directly to your Demat account.",
    badge: "Mutual Funds",
    icon: "🪙",
    link: "https://coin.zerodha.com/",
  },
  {
    name: "Streak",
    desc: "Systematic trading platform that allows you to create, backtest, and deploy trading strategies.",
    badge: "Algo & Strategies",
    icon: "⚡",
    link: "https://streak.tech/",
  },
  {
    name: "Sensibull",
    desc: "Options trading platform that lets you create strategies, analyze positions, and trade seamlessly.",
    badge: "Options & F&O",
    icon: "🎯",
    link: "https://sensibull.com/",
  },
];

const Apps = () => {
  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          NovusTrade Ecosystem Apps
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Discover specialized tools for options, mutual funds, learning, and algorithmic trading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {appsList.map((app) => (
          <a
            key={app.name}
            href={app.link}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-500 transition-all no-underline"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg shadow-xs group-hover:scale-105 transition-transform">
                  {app.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {app.badge}
                  </span>
                </div>
              </div>

              <span className="text-slate-400 group-hover:text-blue-600 text-sm font-bold transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {app.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Apps;