import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlUserId = queryParams.get("userId");
    const urlUsername = queryParams.get("username");
    const urlToken = queryParams.get("token");

    if (urlUserId) localStorage.setItem("userId", urlUserId);
    if (urlUsername) localStorage.setItem("username", urlUsername);
    if (urlToken) localStorage.setItem("token", urlToken);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <TopBar />
      {/* key काढून टाकली आहे, आता वॉचलिस्ट पुन्हा पुन्हा रेंडर होणार नाही आणि ॲप एकदम फास्ट चालेल */}
      <Dashboard />
    </div>
  );
};

export default Home;