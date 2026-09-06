import React from "react";

function Hero() {
  return (
    <div className="container">

      <div className="row p-5 my-5 text-center border-bottom">
        <h1 className="fs-2 text-muted" style={{ lineHeight: "1.6" }}>
          Next-Gen AI Powered Trading Platform. <br />
          Combining real-time market execution with <br /> intelligent LLM & ML decision support.
        </h1>
      </div>

     
      <div className="row p-5 text-muted fs-6" style={{ lineHeight: "1.8" }}>
        <div className="col-6 p-4">
          <p>
            <strong>NovusTrade</strong> is built to redefine standard retail trading. We bridge 
            high-speed MERN architecture with intelligent Python ML services to make markets data-driven and accessible.
          </p>
          <p>
            Instead of navigating complex charts alone, our integrated <strong>AI Assistant & RAG Engine </strong> 
            processes live technical indicators, financial reports, and news to deliver actionable market insights.
          </p>
          <p>
            Whether executing standard orders or analyzing derivatives, users get real-time clarity powered by modern web tech.
          </p>
        </div>

        <div className="col-6 p-4">
          <p>
            Our dedicated <strong>ML-driven Predictive Models</strong> (served via high-performance Flask microservices) 
            evaluate market trends to provide probability-backed Buy/Sell trigger suggestions.
          </p>
          <p>
            Beyond execution, NovusTrade acts as an interactive trading tutor—allowing beginners to ask complex trading questions 
            and learn risk management strategies interactively via our conversational AI.
          </p>
          <p>
            Zero unnecessary latency, absolute data transparency, and predictive machine intelligence in one workspace.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;