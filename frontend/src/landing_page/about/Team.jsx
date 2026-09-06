import React from "react";

function Team() {
  return (
    <div className="container border-top mb-5">
      <div className="row p-3 mt-5">
        <h1 className="fs-2 text-center text-muted">Architect & Builder</h1>
      </div>

      <div className="row p-3 text-muted fs-6" style={{ lineHeight: "1.8" }}>
        <div className="col-6 p-4 text-center">
          <img
            src="media/circular_profile_pic.png"
            alt="Founder"
            className="rounded-circle mb-3"
            style={{ width: "50%" }}
          />
          <h4 className="mt-3">Somesh Pore</h4>
          <h6>Full-Stack & AI Developer</h6>
        </div>

        <div className="col-6 p-4 mt-5">
          <p>
            Passionate MERN-stack and AI engineer focused on building scalable, latency-critical financial platforms.
          </p>
          <p>
            Engineered NovusTrade to merge low-latency trade execution with RAG-based financial LLMs and machine learning microservices.
          </p>
          <p>
            Connect on{" "}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-decoration-none">GitHub</a> /{" "}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-decoration-none">LinkedIn</a> /{" "}
            <a href="#" className="text-decoration-none">Portfolio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;