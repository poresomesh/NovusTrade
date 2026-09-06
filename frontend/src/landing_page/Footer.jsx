import React from "react";

function Footer() {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <img src="media/logo.svg" alt="Logo" style={{ width: "50%" }} />
                    <p>&copy; NovusTrade all rights reserved..</p>
                </div>

                <div className="col">
                    <p>Company</p>
                    <a href="">about</a><br />
                    <a href="">Products</a><br />
                    <a href="">Pricing</a><br />
                    <a href="">Refferal Program</a><br />
                    <a href="">Carrers</a><br />
                    <a href="">NovusTrade.tech</a><br />
                    <a href="">Press & Media</a><br />
                    <a href="">NovusTrade cares</a><br />
                </div>

                <div className="col">
                    <p>Support</p>
                    <a href="">Contact</a><br />
                    <a href="">Support Portal</a><br />
                    <a href="">Z-Connect blog</a><br />
                    <a href="">List of Charges</a><br />
                    <a href="">Downloads & Resources</a><br />
                </div>

                <div className="col">
                    <p>Account</p>
                    <a href="">Open an account</a><br />
                    <a href="">Fund Transfer</a><br />
                    <a href="">60 day Challenge</a><br />
                </div>

                <div className="container mt-5 text-muted" style={{ fontSize: "12px", lineHeight: "1.8" }}>
                    <p>
                        NovusTrade Technologies Pvt. Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration no.: INZ000000000.
                        CDSL/NSDL: Depository services through NovusTrade Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-000-2026.
                        Registered Address: NovusTrade Technologies, Financial Tech Park, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India.
                        For any complaints, please write to <a href="mailto:complaints@novustrade.com" className="text-decoration-none">complaints@novustrade.com</a>.
                        Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI.
                    </p>

                    <p>
                        Procedure to file a complaint on SEBI SCORES: Register on the SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID.
                        Benefits: Effective communication, speedy redressal of grievances.
                    </p>

                    <p>
                        Investments in securities market are subject to market risks; read all the related documents carefully before investing.
                    </p>

                    <p>
                        "Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary, you need not undergo the same process again when you approach another intermediary."
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer;