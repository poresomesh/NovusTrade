import React from "react";

function Stats(){
    return(
        <div className="container mt-5 p-5">
            <div className="row">
                <div className="col-6 p-5">
                    
                    <h2 className="fs-2 mb-4">Trust with confidence</h2>

                        <div className="mb-4">
                        <h4 className="fs-4">Customer-first always</h4>
                        <p className="text-muted">
                            That's why thousands of smart traders trust NovusTrade with their daily market orders and long-term investment portfolios.
                        </p>
                        </div>

                        <div className="mb-4">
                        <h4 className="fs-4">No spam or gimmicks</h4>
                        <p className="text-muted">
                            No spam, annoying push notifications, or shady gamification. A clean, distraction-free trading terminal built for serious market participants.
                        </p>
                        </div>

                        <div className="mb-4">
                        <h4 className="fs-4">The NovusTrade ecosystem</h4>
                        <p className="text-muted">
                            Not just an execution app, but an entire financial workspace. Seamless integration across market feeds, charting suites, and instant fund transfers.
                        </p>
                        </div>

                        <div className="mb-4">
                        <h4 className="fs-4">Trade smarter, manage risk</h4>
                        <p className="text-muted">
                            Advanced order types, instant stop-loss triggers, and transparent analytics designed to actively safeguard your trading capital.
                        </p>
                        </div>

                </div>

                <div className="col-6 p-5">
                    <img src="media/ecosystem.png" alt="ecosysytem image" style={{width : "90%"}} />

                    <div className="text-center">
                        <a href="" className="mx-5" style={{textDecoration : "none"}}>explore page <i class="fa-solid fa-arrow-right-long"></i> </a> 
                        <a href="" style={{textDecoration : "none"}}>try kite <i class="fa-solid fa-arrow-right-long"></i></a>
                    </div>
            
                </div>
                
            </div>
        </div>
    )
}

export default Stats;