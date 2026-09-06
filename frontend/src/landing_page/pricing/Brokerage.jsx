import React from "react";

function Brokerage() {
    return (
        <div className="container">
            <div className="row p-5 mt-5 text-center border-top">
              
                <div className="col-8 p-4 text-start">
                    <a href="#" className="text-decoration-none">
                        <h3 className="fs-5 mb-4 text-center text-primary">Brokerage calculator</h3>
                    </a>
                    
                    <ul className="text-muted fs-6" style={{ lineHeight: "1.9" }}>
                        <li>
                            Call & Trade and RMS auto-squareoff: Additional charges of ₹50 + GST per order.
                        </li>
                        <li>Digital contract notes will be sent via e-mail by end of day.</li>
                        <li>
                            Physical copies of contract notes will be charged ₹20 per contract note plus courier charges.
                        </li>
                        <li>
                            For NRI account (non-PIS), 0.5% or ₹100 per executed order for equity (whichever is lower).
                        </li>
                        <li>
                            If the account is in debit balance, any order placed will be charged ₹40 per executed order instead of ₹20.
                        </li>
                    </ul>
                </div>


                <div className="col-4 p-4 text-start">
                    <a href="#" className="text-decoration-none">
                        <h3 className="fs-5 mb-4 text-center text-primary">List of charges</h3>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Brokerage;