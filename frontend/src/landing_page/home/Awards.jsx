import React from "react";

const Awards = () => {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Award Badge Illustration */}
          <div className="flex justify-center">
            <img
              src="media/largestBroker.svg"
              alt="Largest Stock Broker Badge"
              className="w-full max-w-md"
            />
          </div>

          {/* Award Details & Offerings */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Largest stock broker in India
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                2+ million NovusTrade clients contribute to over 15% of all retail
                order volumes in India daily by trading and investing in:
              </p>
            </div>

            {/* Offerings Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs font-semibold text-slate-700 sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Futures and Options</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Commodity derivatives</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Currency derivatives</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Stocks & IPOs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Direct mutual funds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>Bonds and Govt. Securities</span>
              </div>
            </div>

            {/* Press Logos */}
            <div className="pt-4">
              <img
                src="media/pressLogos.png"
                alt="Featured in Press"
                className="w-full max-w-lg opacity-85 transition-opacity hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;