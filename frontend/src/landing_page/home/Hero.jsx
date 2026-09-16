import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Main Hero Illustration */}
        <div className="flex justify-center">
          <img
            src="media/homeHero.png"
            alt="NovusTrade Investment Platform"
            className="w-full max-w-3xl drop-shadow-sm transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        {/* Headline & Subtitle */}
        <div className="mt-12 space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Invest in everything
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-normal text-slate-500 sm:text-base">
            Online platform to invest in stocks, derivatives, mutual funds, and more.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;