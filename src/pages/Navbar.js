import React, { useState } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("username"))
  );
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  let navigate = useNavigate();
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        The Pink Bakery.
      </Link>
      <ul>
        <li>
          <CustomLink to="/Recipies">Recipies</CustomLink>
        </li>
        <li>
          <CustomLink to="/products">Products</CustomLink>
        </li>
        <li>
          <CustomLink to={`/users/${user.id}/MyCart`}>My Cart</CustomLink>
        </li>
        <li>
          <CustomLink to="/About">About</CustomLink>
        </li>

        <li isActive="false">
          <button className="logout" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  // <--- Add 'to' here
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {" "}
        {children}
      </Link>
    </li>
  );
}
