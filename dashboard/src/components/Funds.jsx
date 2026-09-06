import React from "react";
import { Link } from "react-router-dom";

const Funds = () => {
  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <Link className="btn btn-green">Add funds</Link>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin : </p>
              <p className="imp colored"> &nbsp;4,043.10</p>
            </div>
            <div className="data">
              <p>Used margin : </p>
              <p className="imp"> &nbsp;3,757.30</p>
            </div>
            <div className="data">
              <p>Available cash : </p>
              <p className="imp"> &nbsp;4,043.10</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance : </p>
              <p> &nbsp; 4,043.10</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;