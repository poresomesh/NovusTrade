import React from "react";

function CreateTicket() {
    return (
        <div className="container mt-5">
            <div className="row p-4">
                <h1 className="fs-4 text-muted mb-4">
                    To create a ticket, select a relevant topic
                </h1>

      
                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3">
                        <i className="fa-solid fa-circle-plus me-2"></i> Account Opening
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Getting started</a>
                        <a href="#" className="text-decoration-none">Online</a>
                        <a href="#" className="text-decoration-none">Offline</a>
                        <a href="#" className="text-decoration-none">Charges</a>
                        <a href="#" className="text-decoration-none">Company, Partnership and HUF</a>
                        <a href="#" className="text-decoration-none">Non Resident Indian (NRI)</a>
                    </div>
                </div>

                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3">
                        <i className="fa-regular fa-user me-2"></i> Your Novus Account
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Login credentials</a>
                        <a href="#" className="text-decoration-none">Your Profile</a>
                        <a href="#" className="text-decoration-none">Account modification</a>
                        <a href="#" className="text-decoration-none">CMR & DP ID</a>
                        <a href="#" className="text-decoration-none">Nomination</a>
                        <a href="#" className="text-decoration-none">Transfer and conversion</a>
                    </div>
                </div>

                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3">
                        <i className="fa-solid fa-chart-line me-2"></i> Trading and Markets
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Trading FAQs</a>
                        <a href="#" className="text-decoration-none">Novus Terminal</a>
                        <a href="#" className="text-decoration-none">Margins</a>
                        <a href="#" className="text-decoration-none">Product and order types</a>
                        <a href="#" className="text-decoration-none">Corporate actions</a>
                        <a href="#" className="text-decoration-none">Novus AI & Quant Engine</a>
                    </div>
                </div>

               
                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3">
                        <i className="fa-regular fa-credit-card me-2"></i> Funds
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Fund withdrawal</a>
                        <a href="#" className="text-decoration-none">Adding funds</a>
                        <a href="#" className="text-decoration-none">Adding bank accounts</a>
                        <a href="#" className="text-decoration-none">eMandates</a>
                    </div>
                </div>

                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3">
                        <i className="fa-solid fa-circle-notch me-2"></i> Console
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Reports</a>
                        <a href="#" className="text-decoration-none">Ledger</a>
                        <a href="#" className="text-decoration-none">Portfolio</a>
                        <a href="#" className="text-decoration-none">60 Day Challenge</a>
                        <a href="#" className="text-decoration-none">IPO</a>
                        <a href="#" className="text-decoration-none">Referral program</a>
                    </div>
                </div>

                <div className="col-4 p-4">
                    <h4 className="fs-5 mb-3 ">
                        <i className="fa-regular fa-circle-check me-2"></i> Coin
                    </h4>
                    <div className="d-flex flex-column gap-2 text-muted">
                        <a href="#" className="text-decoration-none">Understanding mutual funds</a>
                        <a href="#" className="text-decoration-none">About Coin</a>
                        <a href="#" className="text-decoration-none">Buying and Selling</a>
                        <a href="#" className="text-decoration-none">Starting an SIP</a>
                        <a href="#" className="text-decoration-none">Managing investments</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;