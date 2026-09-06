import React from "react";

function Hero() {
    return (
        <section className="container-fluid bg-primary text-white py-5" id="supportHero">
            <div className="container">
               
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h4 className="m-0">Support Portal</h4>
                    <a href="#" className="text-white text-decoration-underline">
                        Track tickets
                    </a>
                </div>

               
                <div className="row pb-4">
                    <div className="col-7">
                        <h1 className="fs-3 mb-4">
                            Search for an answer or browse help topics to fix issues with your account.
                        </h1>
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="Eg: how do I activate F&O, why is my order getting rejected..."
                            />
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <a href="#" className="text-white text-decoration-underline">Track account opening</a>
                            <a href="#" className="text-white text-decoration-underline">Track segment activation</a>
                            <a href="#" className="text-white text-decoration-underline">Intraday margins</a>
                            <a href="#" className="text-white text-decoration-underline">Kite user manual</a>
                        </div>
                    </div>

                    <div className="col-5 ps-5">
                        <h1 className="fs-3 mb-4">Featured</h1>
                        <ol className="lh-lg">
                            <li className="mb-2">
                                <a href="#" className="text-white text-decoration-underline">
                                    Current Takeovers and Delisting - January 2026
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white text-decoration-underline">
                                    Surveillance measure on scrips - January 2026
                                </a>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;