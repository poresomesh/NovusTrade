import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-10">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="media/NewLogo.png"
            alt="NovusTradeLogo"
            className="h-8 sm:h-9 w-auto"
          />
        </Link>

        {/* Navigation Links & Action Buttons */}
        <nav className="flex items-center gap-6 text-xs font-medium text-slate-600 sm:text-sm">
          <Link
            to="/signup"
            className="transition-colors hover:text-blue-600"
          >
            Signup
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-blue-600"
          >
            About
          </Link>
          <Link
            to="/products"
            className="transition-colors hover:text-blue-600"
          >
            Products
          </Link>
          <Link
            to="/pricing"
            className="transition-colors hover:text-blue-600"
          >
            Pricing
          </Link>
          <Link
            to="/support"
            className="transition-colors hover:text-blue-600"
          >
            Support
          </Link>

          {/* Login / Dashboard Direct Action */}
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;