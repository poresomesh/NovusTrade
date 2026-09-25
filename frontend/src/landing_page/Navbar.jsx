import React from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { name: "Signup", path: "/signup" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Pricing", path: "/pricing" },
  { name: "Support", path: "/support" },
];

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/media/NovusTradeLogo.png" alt="NovusTrade" className="h-8" />
        
      </Link>

      {/* Nav Links with Active Pill Button Style */}
      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        {/* Login Action Button */}
        <Link
          to="/login"
          className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-lg shadow-sm transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;