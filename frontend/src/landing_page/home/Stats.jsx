import React from "react";
import { Link } from "react-router-dom";

const Stats = () => {
  return (
    <section className="bg-slate-50/60 py-16 sm:py-20 border-y border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Trust Statements */}
          <div className="space-y-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Trust with confidence
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Customer-first always
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  That's why 1.5+ crore customers trust NovusTrade with ₹4.5+ lakh
                  crores worth of equity investments.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  No spam or gimmicks
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  No gimmicks, spam, "gamification", or annoying push
                  notifications. High quality apps that you use at your pace.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  The NovusTrade universe
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Not just an app, but a whole ecosystem of modern investment
                  platforms and trading tools.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Do better with money
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  With initiatives like Nudge and Kill Switch, we don't just
                  facilitate transactions, but help you do better with your money.
                </p>
              </div>
            </div>
          </div>

          {/* Ecosystem Mockup & Links */}
          <div className="flex flex-col items-center space-y-6">
            <img
              src="media/ecosystem.png"
              alt="NovusTrade Ecosystem"
              className="w-full max-w-md drop-shadow-sm"
            />
            
            <div className="flex items-center justify-center gap-8 text-xs font-semibold text-blue-600 sm:text-sm">
              <Link to="/product" className="flex items-center gap-1 hover:underline">
                Explore our products <span>→</span>
              </Link>
              <a
                href="http://localhost:5174"
                className="flex items-center gap-1 hover:underline"
              >
                Try Kite demo <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;