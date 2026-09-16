import React from "react";

const Education = () => {
  return (
    <section className="bg-slate-50/60 py-16 sm:py-20 border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Varsity Illustration */}
          <div className="flex justify-center">
            <img
              src="media/education.svg"
              alt="Trading Education Varsity"
              className="w-full max-w-md"
            />
          </div>

          {/* Learning Platform Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Free and open market education
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Varsity mobile
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  An easy to grasp collection of stock market lessons with
                  in-depth coverage and illustrations. Content is broken down
                  into bite-sized cards to help you learn on the go.
                </p>
                <a
                  href="https://zerodha.com/varsity/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Varsity <span>→</span>
                </a>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800">
                  TradingQ&A
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  The most active trading and investment community in India for
                  all your market related queries.
                </p>
                <a
                  href="https://tradingqna.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  TradingQ&A <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;