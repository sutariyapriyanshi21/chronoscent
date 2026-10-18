import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/home";
import Watches from "./pages/watches";
import WatchDetails from "./pages/WatchDetails";
import Fragrances from "./pages/Fragrances";
import FragranceDetails from "./pages/FragranceDetails";
import About from "./pages/about";
import Contact from "./pages/contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/notfound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderSuccess from "./pages/OrderSuccess";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watches" element={<Watches />} />
        <Route path="/watches/:id" element={<WatchDetails />} />
        <Route path="/fragrances" element={<Fragrances />} />
        <Route path="/Fragrances" element={<Fragrances />} />
        <Route path="/fragrances/:id" element={<FragranceDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;