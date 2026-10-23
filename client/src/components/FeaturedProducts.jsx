import { useState, useEffect } from "react";
import "../css/FeaturedProducts.css";
import ProductCard from "./ProductCard";

// Static fallbacks in case backend is offline
import rolex from "../assests/Products/rolex.jpg";
import omega from "../assests/Products/omega.jpg";
import creed from "../assests/Products/Fregerances/Creed Aventus.jpg";
import chanel from "../assests/Products/channel.jpg";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [watchesRes, fragrancesRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/api/watches"),
          fetch("http://127.0.0.1:5000/api/fragrances")
        ]);

        if (!watchesRes.ok || !fragrancesRes.ok) {
          throw new Error("Failed to fetch products from backend");
        }

        const watches = await watchesRes.json();
        const fragrances = await fragrancesRes.json();

        // Dynamically select 4 flagship luxury items (2 Watches & 2 Fragrances)
        const rolexWatch = watches.find(w => w.brand?.toLowerCase() === "rolex") || watches[0];
        const omegaWatch = watches.find(w => w.brand?.toLowerCase() === "omega") || watches[1];
        const creedFragrance = fragrances.find(f => f.brand?.toLowerCase() === "creed") || fragrances[0];
        const chanelFragrance = fragrances.find(f => f.brand?.toLowerCase() === "chanel") || fragrances[1];

        const products = [
          { ...rolexWatch, type: "watch" },
          { ...omegaWatch, type: "watch" },
          { ...creedFragrance, type: "fragrance" },
          { ...chanelFragrance, type: "fragrance" }
        ].filter(Boolean);

        setFeaturedProducts(products);
      } catch (err) {
        console.warn("Backend offline or error loading featured products. Using offline showcase:", err);
        setFeaturedProducts([
          { _id: "rolex-submariner", brand: "ROLEX", name: "Submariner Date", price: 1050000, rating: "4.9", image: rolex, type: "watch" },
          { _id: "omega-seamaster", brand: "OMEGA", name: "Seamaster Diver", price: 525000, rating: "4.8", image: omega, type: "watch" },
          { _id: "creed-aventus", brand: "CREED", name: "Aventus", price: 31000, rating: "4.9", image: creed, type: "fragrance" },
          { _id: "chanel-chance", brand: "CHANEL", name: "Chance", price: 11500, rating: "4.8", image: chanel, type: "fragrance" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <p>Premium picks curated exclusively for you.</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              _id={product._id || product.id}
              image={product.image}
              brand={product.brand}
              name={product.name}
              price={product.price}
              rating={product.rating}
              type={product.type}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;