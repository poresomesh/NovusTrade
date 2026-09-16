import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePath, setActivePath] = useState(
    window.location.pathname.toLowerCase()
  );

  // URL बदलल्यास किंवा लोगोवर क्लिक केल्यावर (app-navigate) स्टेट सिंक करणे
  useEffect(() => {
    const handleSync = () => {
      setActivePath(window.location.pathname.toLowerCase());
    };

    handleSync();
    window.addEventListener("app-navigate", handleSync);
    window.addEventListener("popstate", handleSync);

    return () => {
      window.removeEventListener("app-navigate", handleSync);
      window.removeEventListener("popstate", handleSync);
    };
  }, [location.pathname]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Funds", path: "/funds" },
    { name: "Apps", path: "/apps" },
  ];

  const handleNavClick = (path) => {
    setActivePath(path);
    navigate({
      pathname: path,
      search: window.location.search,
    });
    window.dispatchEvent(new Event("app-navigate"));
  };

  return (
    <nav className="flex items-center gap-2">
      {menuItems.map((item) => {
        // केवळ जेव्हा URL मध्ये तो विशिष्ट पाथ असेल तेव्हाच लाल होईल
        // URL जेव्हा "/" (Home / AI Assistant) असेल तेव्हा कोणताही टॅब लाल होणार नाही
        const isActive =
          activePath !== "/" && activePath.includes(item.path);

        return (
          <button
            key={item.name}
            type="button"
            onClick={() => handleNavClick(item.path)}
            className={`px-3 py-1.5 text-xs transition-all duration-150 cursor-pointer ${
              isActive
                ? "text-[#df514c] font-bold border-b-2 border-[#df514c]"
                : "text-slate-600 font-medium hover:text-slate-900 border-b-2 border-transparent hover:bg-slate-50 rounded-xs"
            }`}
          >
            {item.name}
          </button>
        );
      })}
    </nav>
  );
};

export default Menu;