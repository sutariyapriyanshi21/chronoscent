import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import GlobalSearch from "./GlobalSearch";

import "../css/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar main-navbar">
      <div className="container">

        {/* ================= NAVBAR ROW ================= */}

        <div className="d-flex align-items-center justify-content-between w-100">

          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            <span className="logo-main">
              ChronoScent
            </span>

            <span className="logo-sub">
              Elite
            </span>
          </Link>


          {/* ================= DESKTOP MENU ================= */}

          <div className="desktop-menu d-none d-md-flex align-items-center">

            <div className="navbar-nav flex-row gap-4">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/watches"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                Watches
              </NavLink>

              <NavLink
                to="/fragrances"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                Fragrances
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                Contact
              </NavLink>

            </div>

          </div>


          {/* ================= DESKTOP ICONS ================= */}

          <div className="nav-icons desktop-icons d-none d-md-flex">

            <button
              type="button"
              className="icon-btn"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <FiSearch />
            </button>

            <Link to="/wishlist">
              <button
                type="button"
                className="icon-btn position-relative"
                aria-label="Wishlist"
              >
                <FiHeart />
                {wishlistItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            </Link>

            <Link to="/cart">
              <button
                type="button"
                className="icon-btn position-relative"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart />
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            <Link to="/login">
              <button
                type="button"
                className="icon-btn"
                aria-label="Account"
              >
                <FiUser />
              </button>
            </Link>

          </div>


          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            className="mobile-menu-btn d-md-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

        </div>


        {/* ================= MOBILE MENU ================= */}

        {menuOpen && (
          <div className="mobile-menu d-md-none">

            {/* Links */}

            <div className="mobile-links">

              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive ? "active-mobile-link" : ""
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/watches"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive ? "active-mobile-link" : ""
                  }`
                }
              >
                Watches
              </NavLink>

              <NavLink
                to="/fragrances"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive ? "active-mobile-link" : ""
                  }`
                }
              >
                Fragrances
              </NavLink>

              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive ? "active-mobile-link" : ""
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive ? "active-mobile-link" : ""
                  }`
                }
              >
                Contact
              </NavLink>

            </div>


            {/* Mobile Icons */}

            <div className="nav-icons mobile-icons">

              <button
                type="button"
                className="icon-btn"
                aria-label="Search"
                onClick={() => {
                  setIsSearchOpen(true);
                  closeMenu();
                }}
              >
                <FiSearch />
              </button>

              <Link to="/wishlist">
                <button
                  type="button"
                  className="icon-btn position-relative"
                  aria-label="Wishlist"
                >
                  <FiHeart />
                  {wishlistItems.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </Link>

              <Link to="/cart">
                <button
                  type="button"
                  className="icon-btn position-relative"
                  aria-label="Shopping Cart"
                >
                  <FiShoppingCart />
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              <Link to="/login">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Account"
                >
                  <FiUser />
                </button>
              </Link>

            </div>

          </div>
        )}

      </div>
      
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
}

export default Navbar;