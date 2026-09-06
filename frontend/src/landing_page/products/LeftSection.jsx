import React from "react";

function LeftSection({
    imageURL,
    productName,
    productDescription,
    tryDemo,
    learnMore,
    googlePlay,
    appStore,
}) {
    return (
        <div className="container mt-5">
            <div className="row align-items-center">

                <div className="col-6 p-4 text-center">
                    <img src={imageURL} alt={productName} className="img-fluid" />
                </div>


                <div className="col-6 p-5">
                    <h1 className="fs-2 mb-3">{productName}</h1>
                    <p className="text-muted" style={{ lineHeight: "1.8" }}>
                        {productDescription}
                    </p>

                    <div className="mb-4">
                        <a href={tryDemo} className="text-decoration-none me-5">
                            Explore Platform <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                        <a href={learnMore} className="text-decoration-none">
                            Learn More <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                    </div>

                    <div>
                        <a href={googlePlay} className="me-4">
                            <img src="media/googlePlayBadge.svg" alt="Google Play" />
                        </a>
                        <a href={appStore}>
                            <img src="media/appstoreBadge.svg" alt="App Store" />
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default LeftSection;