import React from "react";
import { Link } from "react-router-dom";

const OpenAccount = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Main Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Open a NovusTrade account
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          Online platform to invest in stocks, derivatives, mutual funds, and more.
        </p>

        {/* Signup Redirect Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            Signup Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OpenAccount;