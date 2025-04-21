import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaBell,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
  
        if (parsedUser?.name) {
          setUsername(parsedUser.name);
        }
      } else {
        console.warn("User is not in localStorage");
      }
    } catch (err) {
      console.error("User JSON parsing error:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    navigate("/signIn");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/nature.png" alt="Green Shop Logo" className="w-8 h-8" />
          <span className="text-green-600 font-bold text-lg">GREENSHOP</span>
        </div>

        <div className="hidden md:flex gap-6 text-gray-700 text-sm font-medium">
          <button onClick={() => navigate("/dashboard")} className="hover:text-green-600 transition">Home</button>
          <button onClick={() => navigate("/shop")} className="hover:text-green-600 transition">Shop</button>
        </div>

        <div className="flex items-center gap-4">
          <FaSearch className="text-gray-600 cursor-pointer hover:text-green-600" />
          <Link to="/productCard"><FaShoppingCart className="text-gray-600 cursor-pointer hover:text-green-600" /></Link>
          <FaBell className="text-gray-600 cursor-pointer hover:text-green-600" />

          {username ? (
            <div className="flex items-center gap-3">
              <button 
               onClick={() => navigate("/profile")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
                Hi, {username}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/signIn")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
            >
              <FaSignInAlt />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
