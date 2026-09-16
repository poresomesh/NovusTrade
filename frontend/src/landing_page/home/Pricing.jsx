import React from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Description */}
          <div className="space-y-4 lg:col-span-5">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Unbeatable pricing
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              We pioneered the concept of discount broking and price
              transparency in India. Flat fees and no hidden charges.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline sm:text-sm"
            >
              See pricing <span>→</span>
            </Link>
          </div>

          {/* Right Pricing Cards */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-7 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center transition-all hover:bg-white hover:shadow-sm">
              <span className="text-3xl font-black text-slate-900 sm:text-4xl">₹0</span>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                Free account opening & free equity delivery
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center transition-all hover:bg-white hover:shadow-sm">
              <span className="text-3xl font-black text-slate-900 sm:text-4xl">₹20</span>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                Intraday and F&O trades (Flat per executed order)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;