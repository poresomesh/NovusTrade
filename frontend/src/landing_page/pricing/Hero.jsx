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
                        src="https://dummyimage.com/150x120/0d6efd/ffffff&text=%E2%82%B90"
                        alt="Free Equity"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Free equity delivery</h1>
                    <p className="text-muted mt-3">
                        All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.
                    </p>
                </div>

                <div className="col-4 p-4">
                    <img
                        src="https://dummyimage.com/150x120/198754/ffffff&text=%E2%82%B920"
                        alt="Intraday Trades"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Intraday and F&O trades</h1>
                    <p className="text-muted mt-3">
                        Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity.
                    </p>
                </div>

                <div className="col-4 p-4">
                    <img
                        src="https://dummyimage.com/150x120/6f42c1/ffffff&text=%E2%82%B90"
                        alt="Free Mutual Funds"
                        className="img-fluid mb-3"
                    />
                    <h1 className="fs-3">Free direct MF</h1>
                    <p className="text-muted mt-3">
                        All direct mutual fund investments are completely free — zero commissions and no DP charges.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hero;