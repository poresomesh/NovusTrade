import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 pt-16 pb-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Legal Info */}
          <div className="space-y-4 md:col-span-4">
            <img
              src="media/images/logo.svg"
              alt="NovusTrade"
              className="h-5 w-auto"
            />
            <p className="text-xs leading-relaxed text-slate-500">
              © 2010 - 2026, NovusTrade Broking Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer">Twitter</span>
              <span className="hover:text-blue-600 cursor-pointer">LinkedIn</span>
              <span className="hover:text-blue-600 cursor-pointer">Telegram</span>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-blue-600 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Support & Education
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/support" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Support Portal
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Varsity Education
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Market Pulse
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3 */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Account & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/signup" className="hover:text-blue-600 transition-colors">
                  Open an account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 transition-colors">
                  Login to Kite
                </Link>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-12 border-t border-slate-200/80 pt-8 text-[11px] leading-relaxed text-slate-400">
          <p>
            NovusTrade Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration no.: INZ000031633. 
            Investments in securities market are subject to market risks; read all the related documents carefully before investing. 
            Brokerage will not exceed the SEBI prescribed limit.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;