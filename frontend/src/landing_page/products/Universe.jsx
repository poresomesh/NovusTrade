import React from "react";

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
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Fund+House"
                        alt="Asset Management"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Our asset management venture creating simple index funds.
                    </p>
                </div>

                <div className="col-4 p-3 mt-5">
                    <img
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Sensibull+AI"
                        alt="Options Trading"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Options trading platform with automated strategy builders.
                    </p>
                </div>

                <div className="col-4 p-3 mt-5">
                    <img
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Tijori+Data"
                        alt="Investment Research"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Fundamental research platform with deep sector breakdowns.
                    </p>
                </div>


                <div className="col-4 p-3 mt-4">
                    <img
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Streak+Algo"
                        alt="Algo Trading"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Systematic trading platform for algo creation without coding.
                    </p>
                </div>

                <div className="col-4 p-3 mt-4">
                    <img
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Smallcase"
                        alt="Thematic Investing"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Thematic investing platform building diversified portfolios.
                    </p>
                </div>

                <div className="col-4 p-3 mt-4">
                    <img
                        src="https://dummyimage.com/180x50/e9ecef/495057&text=Ditto+Risk"
                        alt="Insurance"
                        className="img-fluid"
                    />
                    <p className="text-small text-muted mt-3">
                        Personalized advice on term life and health insurance.
                    </p>
                </div>


                <div className="text-center my-5">
                    <button
                        className="p-2 btn btn-primary fs-5"
                        style={{ width: "20%", margin: "0 auto" }}
                    >
                        Sign up for free
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Universe;