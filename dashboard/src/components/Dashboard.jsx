import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Apps from "./App";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import WatchList from "./WatchList";
import TradingAssistant from "./TradingAssistant";
import Summary from "./Summary";

const Dashboard = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.toLowerCase()
  );

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname.toLowerCase());
    };

    window.addEventListener("app-navigate", updatePath);
    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("app-navigate", updatePath);
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  // जेव्हा React Router ची location बदलेल तेव्हाच स्टेट बदला
  useEffect(() => {
    setCurrentPath(location.pathname.toLowerCase());
  }, [location.pathname]);

  const renderCurrentView = () => {
    if (currentPath.includes("/orders")) return <Orders />;
    if (currentPath.includes("/holdings")) return <Holdings />;
    if (currentPath.includes("/positions")) return <Positions />;
    if (currentPath.includes("/funds")) return <Funds />;
    if (currentPath.includes("/apps")) return <Apps />;
    if (currentPath.includes("/dashboard")) return <Summary />;

    return <TradingAssistant />;
  };

  return (
    <div className="flex w-full h-[calc(100vh-84px)] overflow-hidden bg-slate-100 p-2 gap-2 select-none">
      {/* डावीकडील वॉचलिस्ट कायम मेमरीमध्ये राहील, ज्यामुळे लोड स्पीड वाढेल */}
      <div className="shrink-0 h-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <WatchList />
      </div>

      {/* फक्त उजवीकडील भाग बदलेल */}
      <main className="flex-1 h-full min-w-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Dashboard;