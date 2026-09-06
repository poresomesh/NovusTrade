import React from "react";

function Awards(){
    return(
      <div className="container mt-5">
        <div className="row ">
            <div className="col-6 p-5">
                <img src="media/largestBroker.svg" alt="Largest Broker Image" />
            </div>

            <div className="col-6 mt-3 p-5 " >
                <h1>Next-Gen Trading Platform</h1>
                <p>Thousands of active traders and investors power their financial growth daily on NovusTrade by investing in:</p>

                <div className="row">
                    <div className="col-6 mt-4">
                        <ul>
                            <li>
                                <p>Futures & Options</p>
                            </li>
                            <li>
                                <p>Commodity Derivatives</p>
                            </li>
                            <li>
                                <p>Currency Derivatives</p>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 mt-4">
                        <ul>
                            <li>
                                <p>Stocks & IPOs</p>
                            </li>
                            <li>
                                <p>Direct Mutual Funds</p>
                            </li>
                            <li>
                                <p>Government Securities & Bonds</p>
                            </li>
                        </ul>
                    </div>
                    <img src="media/pressLogos.png" alt="Press Logo Png Image" style={{width : "90%"}}/>
                </div>
               
            </div>
        </div>

      </div>
    )
}

export default Awards;