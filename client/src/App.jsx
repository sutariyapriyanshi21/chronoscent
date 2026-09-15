import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Watches from "./pages/watches";
import WatchDetails from "./pages/WatchDetails";
import Fragrances from "./pages/Fragrances";
import FragranceDetails from "./pages/FragranceDetails";
import About from "./pages/about";
import Contact from "./pages/contact";
import NotFound from "./pages/notfound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
        <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/watches" element={<Watches />} />

        <Route
          path="/watches/:id"
          element={<WatchDetails />}
        />

        <Route path="/Fragrances" element={<Fragrances />} />

        <Route
          path="/fragrances/:id"
          element={<FragranceDetails />}
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/wishlist" element={<Wishlist />} />
        
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;