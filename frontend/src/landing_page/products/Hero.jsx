import React from "react";

function Hero() {
    return (
        <div className="container border-bottom mb-5">
            <div className="text-center mt-5 p-3">
                <h1 className="fs-2 mb-3">Intelligent Technology Stack</h1>
                <h3 className="text-muted mt-3 fs-4">
                    Sleek, modern platforms integrated with predictive AI and machine learning models
                </h3>
                <p className="mt-3 mb-5">
                    Check out our{" "}
                    <a href="#ecosystem" className="text-decoration-none">
                        investment ecosystem <i className="fa-solid fa-arrow-right-long"></i>
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Hero;