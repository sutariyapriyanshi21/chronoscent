import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiShield,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiChevronRight
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import GlobalSearch from "./GlobalSearch";

import "../css/navbar.css";

function Navbar() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("chronoscent_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === "admin" || currentUser?.email === "admin@chronoscent.com";

  // Listen for login/logout events across components
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem("chronoscent_user");
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    // Close user dropdown on outside click
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chronoscent_user");
    setCurrentUser(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event("authChange"));
    
  };

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

            {currentUser ? (
              <div className="position-relative" ref={userMenuRef}>
                <button
                  type="button"
                  className={`icon-btn ${isAdmin ? "icon-btn-admin" : ""}`}
                  aria-label="Account Menu"
                  title={isAdmin ? `Administrator: ${currentUser.name}` : `Logged in as ${currentUser.name}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {isAdmin ? <FiShield /> : <FiUser />}
                </button>

                {userMenuOpen && (
                  <div 
                    className="position-absolute end-0 mt-2 p-3 bg-white shadow-lg rounded-3 border admin-user-dropdown"
                    style={{ minWidth: '240px', zIndex: 1050 }}
                  >
                    <div className="mb-2">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <small className="text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                          SIGNED IN AS
                        </small>
                        {isAdmin && (
                          <span className="admin-role-badge">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <strong className="d-block text-truncate" style={{ color: '#0f4c81', fontSize: '0.95rem' }}>
                        {currentUser.name}
                      </strong>
                      <small className="text-muted d-block text-truncate" style={{ fontSize: '0.8rem' }}>
                        {currentUser.email}
                      </small>
                    </div>

                    <hr className="my-2" />
                    <div className="admin-menu-list">
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="admin-menu-item"
                        style={{ color: '#0f4c81', fontWeight: 600 }}
                      >
                        <FiPackage size={15} className="text-primary" />
                        <span>My Orders</span>
                        <FiChevronRight size={12} className="ms-auto text-muted" />
                      </Link>
                    </div>

                    {isAdmin && (
                      <>
                        <hr className="my-2" />
                        <div className="admin-menu-list">
                          <small className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                            ADMIN SHORTCUTS
                          </small>
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="admin-menu-item"
                          >
                            <FiGrid size={14} className="text-primary" />
                            <span>Dashboard Overview</span>
                            <FiChevronRight size={12} className="ms-auto text-muted" />
                          </Link>
                          <Link
                            to="/admin?tab=orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="admin-menu-item"
                          >
                            <FiPackage size={14} className="text-info" />
                            <span>Manage Orders</span>
                            <FiChevronRight size={12} className="ms-auto text-muted" />
                          </Link>
                          <Link
                            to="/admin?tab=products"
                            onClick={() => setUserMenuOpen(false)}
                            className="admin-menu-item"
                          >
                            <FiShoppingBag size={14} className="text-success" />
                            <span>Product Catalog</span>
                            <FiChevronRight size={12} className="ms-auto text-muted" />
                          </Link>
                          <Link
                            to="/admin?tab=customers"
                            onClick={() => setUserMenuOpen(false)}
                            className="admin-menu-item"
                          >
                            <FiUsers size={14} className="text-warning" />
                            <span>Customer Accounts</span>
                            <FiChevronRight size={12} className="ms-auto text-muted" />
                          </Link>
                        </div>
                      </>
                    )}

                    <hr className="my-2" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <FiLogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Account"
                  title="Sign In"
                >
                  <FiUser />
                </button>
              </Link>
            )}

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

              {currentUser && (
                <NavLink
                  to="/my-orders"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `mobile-nav-link d-flex align-items-center justify-content-between ${
                      isActive ? "active-mobile-link" : ""
                    }`
                  }
                  style={{ color: '#0f4c81', fontWeight: 600 }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <FiPackage size={16} /> My Orders
                  </span>
                  <FiChevronRight size={14} className="text-muted" />
                </NavLink>
              )}

            </div>


            {/* Mobile Admin Panel */}
            {isAdmin && (
              <div className="mobile-admin-panel">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="admin-role-badge">
                    <FiShield size={11} className="me-1" /> ADMINISTRATOR
                  </span>
                  <small className="text-muted text-truncate" style={{ maxWidth: '140px' }}>
                    {currentUser.name}
                  </small>
                </div>
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="mobile-admin-main-btn"
                >
                  <FiGrid size={15} /> Go to Admin Dashboard
                </Link>
                <div className="mobile-admin-quick-links">
                  <Link to="/admin?tab=orders" onClick={closeMenu}>
                    <FiPackage size={13} /> Orders
                  </Link>
                  <Link to="/admin?tab=products" onClick={closeMenu}>
                    <FiShoppingBag size={13} /> Products
                  </Link>
                  <Link to="/admin?tab=customers" onClick={closeMenu}>
                    <FiUsers size={13} /> Users
                  </Link>
                </div>
              </div>
            )}


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

              {currentUser ? (
                <button
                  type="button"
                  className="icon-btn text-danger"
                  aria-label="Log Out"
                  title="Log Out"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <FiLogOut />
                </button>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Account"
                  >
                    <FiUser />
                  </button>
                </Link>
              )}

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