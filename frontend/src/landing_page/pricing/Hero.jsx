import React from "react";

function Hero() {
    return (
        <div className="container">

            <div className="row p-5 mt-5 border-bottom text-center">
                <h1>Pricing</h1>
                <h3 className="text-muted mt-3 fs-5">
                    Free equity investments and flat ₹20 intraday and F&O trades
                </h3>
            </div>

  
            <div className="row p-5 mt-5 text-center">
                <div className="col-4 p-4">
                    <img
                        src="media/Brokrage.png"
                        alt="Free Equity Delivery"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Free equity delivery</h1>
                    <p className="text-muted mt-3">
                       All equity delivery investments (NSE, BSE) are 100% free with zero commission.
                    </p>
                </div>

                <div className="col-4 p-4">
                    <img
                        src="media/BrokrageAmount.png"
                        alt="Intraday Trades"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Intraday and F&O trades</h1>
                    <p className="text-muted mt-3">
                        Flat ₹20 or 0.03% (whichever is lower) per executed order across Equity, F&O, and Commodity.
                    </p>
                </div>

                <div className="col-4 p-4">
                    <img
                        src="media/MutualFund.png"
                        alt="Free Mutual Funds"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Free direct MF</h1>
                    <p className="text-muted mt-3">
                        All direct mutual fund investments are completely free — zero commissions, zero distributor fees, and no DP transaction charges.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hero;