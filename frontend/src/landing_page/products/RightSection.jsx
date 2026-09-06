import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
       
        <div className="col-6 p-5">
          <h1 className="fs-2 mb-3">{productName}</h1>
          <p className="text-muted" style={{ lineHeight: "1.8" }}>
            {productDescription}
          </p>
          <div>
            <a href={learnMore} className="text-decoration-none">
              Explore Documentation <i className="fa-solid fa-arrow-right-long"></i>
            </a>
          </div>
        </div>

       
        <div className="col-6 p-4 text-center">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;