import React from "react";
import { Link } from "react-router-dom";

function Universe() {
    return (
        <div className="container mt-5">
            <div className="row text-center">
                <h1 className="fs-3">The NovusTrade Universe</h1>
                <p className="text-muted mt-2">
                    Extend your trading and investment experience even further with our partner platforms
                </p>

                <div className="col-4 p-3 mt-5">
                    <img
                        src="media/NovusAssets.png"
                        alt="Asset Management"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                       Smart index-tracking and automated asset management for passive, long-term wealth creation.
                    </p>
                </div>

                <div className="col-4 p-3 mt-5">
                    <img
                        src="media/NovusRAG.png"
                        alt="Options Trading"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                       RAG-driven conversational AI assistant providing real-time stock insights, market analysis, and trade suggestions.
                    </p>
                </div>

                <div className="col-4 p-3 mt-5">
                    <img
                        src="media/NovusMarket.png"
                        alt="Investment Research"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Deep fundamental research and real-time financial metrics to evaluate company balance sheets effortlessly.
                    </p>
                </div>


                <div className="col-4 p-3 mt-4">
                    <img
                        src="media/NovusAlgo.png"
                        alt="Algo Trading"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                       Build, backtest, and deploy algorithmic trading strategies with zero code requirement.
                    </p>
                </div>

                <div className="col-4 p-3 mt-4">
                    <img
                        src="media/NovusMarketIntel.png"
                        alt="Thematic Investing"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Invest in curated, theme-based stock baskets aligned with emerging sectors and market trends.
                    </p>
                </div>

                <div className="col-4 p-3 mt-4">
                    <img
                        src="media/NovusMindGuard.png"
                        alt="Insurance"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                       Machine learning engine that tracks emotional tilt, halts revenge trading, and protects user capital.
                    </p>
                </div>


                <div className="text-center my-5">
                    <Link 
                        to="/signup"
                        className="p-2 btn btn-primary fs-5"
                        style={{ width: "20%", margin: "0 auto" }}
                    >
                        Sign up for free
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Universe;