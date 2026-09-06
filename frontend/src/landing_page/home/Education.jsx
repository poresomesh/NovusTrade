import React from "react";

function Education(){
    return(
        <div className="container mt-5">
            <div className="row">
                <div className="col-6 p-5">
                    <img src="media/education.svg" alt="Education Image" />
                </div>

                <div className="col-6 p-5">
                    <h1 className="fs-2 mb-4">Free and open market education</h1>
                    <p className="text-muted">Novus Academy, an extensive stock market resource covering everything 
                        from basic personal finance to advanced derivative strategies.</p>
                    <a href="" style={{textDecoration : "none"}}>Explore Academy<i class="fa-solid fa-arrow-right-long"></i></a>
                    

                    <p className="mt-5 text-muted">Novus Community, an active trader forum to discuss market insights, 
                        analyze charts, and get your trading queries answered.</p>
                    <a href="" style={{textDecoration : "none"}}>Join Community <i class="fa-solid fa-arrow-right-long"></i></a>
                </div>
            </div>
        </div>
    )
}

export default Education;