import React from "react";

function Pricing(){
    return(
       <div className="container p-5">
        <div className="row p-5" >
            <div className="col-4">
                <h1 className="fs-2">Transparent pricing</h1>
                <p className="text-muted">We believe in 100% pricing transparency. Enjoy ultra-low brokerage, 
                    zero hidden fees, and maximum value on every single trade.</p>
                <a href="" style={{textDecoration : "none"}}>see pricing <i class="fa-solid fa-arrow-right-long"></i></a>
            </div>

            <div className="col-2">

            </div>

            <div className="col-6 mb-4">
                <div className="row text-center">
                    <div className="col p-3 border">
                        <h1>₹0</h1>
                        <p className="text-muted">Free account opening, free equity delivery & <br /> direct mutual funds</p>
                    </div>

                    <div className="col p-3 border ">
                        <h1>₹20</h1>
                        <p className="text-muted">Flat ₹20 or 0.03% (whichever is lower) per executed order on Intraday</p>
                    </div>
                </div>
            </div>
        </div>
       </div>
    )
}

export default Pricing;