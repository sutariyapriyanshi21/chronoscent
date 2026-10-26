import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/FeaturedBrands.css";

// Baseline Watch Logos
import rolex from "../assests/brands/Rolex.jpg";
import omega from "../assests/brands/Omega.jpg";
import cartier from "../assests/brands/Cartier.jpg";
import seiko from "../assests/brands/Seiko.jpg";
import tissot from "../assests/brands/Tissot.jpg";
import casio from "../assests/brands/Casio.jpg";

// Baseline Perfume Logos
import dior from "../assests/brands/Dior.jpg";
import chanel from "../assests/brands/Chanel.jpg";
import tomford from "../assests/brands/Tomford.jpg";
import versace from "../assests/brands/Versace.jpg";
import creed from "../assests/brands/Creed.jpg";

const KNOWN_LOGOS = {
  rolex,
  omega,
  cartier,
  seiko,
  tissot,
  casio,
  dior,
  chanel,
  "tom ford": tomford,
  tomford,
  versace,
  creed
};

function FeaturedBrands() {
  const [dbBrands, setDbBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider refs for horizontal smooth scroll
  const watchTrackRef = useRef(null);
  const perfumeTrackRef = useRef(null);

  // Scroll states for enabling/disabling arrow buttons
  const [watchScroll, setWatchScroll] = useState({ canLeft: false, canRight: true });
  const [perfumeScroll, setPerfumeScroll] = useState({ canLeft: false, canRight: true });

  // 1. Fetch live brands from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/brands")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbBrands(data);
        }
      })
      .catch((err) => {
        console.warn("Using baseline fallback luxury brands:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Baseline fallback lists
  const baselineWatchBrands = useMemo(
    () => [
      { name: "Rolex", origin: "Geneva, Switzerland", categoryType: "watches" },
      { name: "Omega", origin: "Biel, Switzerland", categoryType: "watches" },
      { name: "Cartier", origin: "Paris, France", categoryType: "both" },
      { name: "Seiko", origin: "Tokyo, Japan", categoryType: "watches" },
      { name: "Tissot", origin: "Le Locle, Switzerland", categoryType: "watches" }
    ],
    []
  );

  const baselinePerfumeBrands = useMemo(
    () => [
      { name: "Dior", origin: "Paris, France", categoryType: "fragrances" },
      { name: "Chanel", origin: "Paris, France", categoryType: "fragrances" },
      { name: "Tom Ford", origin: "Paris, France", categoryType: "fragrances" },
      { name: "Versace", origin: "Milan, Italy", categoryType: "fragrances" },
      { name: "Creed", origin: "Paris, France", categoryType: "fragrances" }
    ],
    []
  );

  // 3. Filter Watch and Perfume brand lists dynamically
  const watchBrands = useMemo(() => {
    if (dbBrands.length === 0) return baselineWatchBrands;

    const filtered = dbBrands.filter((b) => {
      const type = (b.categoryType || "").toLowerCase();
      return type === "watches" || type === "watch" || type === "both";
    });

    return filtered.length > 0 ? filtered : baselineWatchBrands;
  }, [dbBrands, baselineWatchBrands]);

  const perfumeBrands = useMemo(() => {
    if (dbBrands.length === 0) return baselinePerfumeBrands;

    const filtered = dbBrands.filter((b) => {
      const type = (b.categoryType || "").toLowerCase();
      return type === "fragrance" || type === "fragrances" || type === "perfume" || type === "both";
    });

    return filtered.length > 0 ? filtered : baselinePerfumeBrands;
  }, [dbBrands, baselinePerfumeBrands]);

  // 4. Update arrow states when scrolling
  const updateScrollState = (ref, setScrollState, totalCount) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setScrollState({
      canLeft: scrollLeft > 10,
      canRight: totalCount > 5 && scrollLeft < scrollWidth - clientWidth - 10
    });
  };

  const scrollTrack = (ref, direction, setScrollState, totalCount) => {
    if (!ref.current) return;
    const firstCard = ref.current.querySelector(".brand-card");
    const step = firstCard ? firstCard.offsetWidth + 24 : 260;
    ref.current.scrollBy({
      left: direction === "right" ? step : -step,
      behavior: "smooth"
    });

    setTimeout(() => {
      updateScrollState(ref, setScrollState, totalCount);
    }, 350);
  };

  useEffect(() => {
    updateScrollState(watchTrackRef, setWatchScroll, watchBrands.length);
  }, [watchBrands]);

  useEffect(() => {
    updateScrollState(perfumeTrackRef, setPerfumeScroll, perfumeBrands.length);
  }, [perfumeBrands]);

  // 5. Helper to resolve logo or monogram
  const renderBrandLogo = (brand) => {
    const key = (brand.name || "").toLowerCase().trim();
    const staticLogo = KNOWN_LOGOS[key];

    if (staticLogo) {
      return <img src={staticLogo} alt={brand.name} />;
    }

    // Try public assets or fallback to monogram
    return (
      <img
        src={`/assests/brands/${brand.name}.jpg`}
        alt={brand.name}
        onError={(e) => {
          e.target.style.display = "none";
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = "flex";
          }
        }}
      />
    );
  };

  const getMonogram = (name) => {
    if (!name) return "B";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="featured-brands">
      <h2>Featured Luxury Brands</h2>
      <p>Explore the world's finest watchmakers and fragrance houses.</p>

      {/* ========================================================
          1. LUXURY WATCH BRANDS SLIDER
          ======================================================== */}
      <div className="brand-heading-row">
        <h3 className="brand-heading">Luxury Watch Brands</h3>

        {/* Arrow Buttons appear ONLY if there are MORE than 5 brands */}
        {watchBrands.length > 5 && (
          <div className="brand-slider-controls">
            <button
              type="button"
              className="brand-slider-btn"
              onClick={() => scrollTrack(watchTrackRef, "left", setWatchScroll, watchBrands.length)}
              disabled={!watchScroll.canLeft}
              aria-label="Previous watch brands"
              title="Previous watch brands"
            >
              ‹
            </button>
            <button
              type="button"
              className="brand-slider-btn"
              onClick={() => scrollTrack(watchTrackRef, "right", setWatchScroll, watchBrands.length)}
              disabled={!watchScroll.canRight}
              aria-label="Next watch brands"
              title="Next watch brands"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        className="brand-slider-track"
        ref={watchTrackRef}
        onScroll={() => updateScrollState(watchTrackRef, setWatchScroll, watchBrands.length)}
      >
        {watchBrands.map((brand) => (
          <Link
            to={`/watches?brand=${encodeURIComponent(brand.name)}`}
            className="brand-card"
            key={brand._id || brand.name}
          >
            <div className="brand-logo">
              {renderBrandLogo(brand)}
              <div className="brand-monogram" style={{ display: "none" }}>
                {getMonogram(brand.name)}
              </div>
            </div>
            <h4>{brand.name}</h4>
            <span>{brand.origin || "International"}</span>
          </Link>
        ))}
      </div>

      <div className="brands-button">
        <Link to="/watches" className="brand-explore-link">
          Explore All Watches →
        </Link>
      </div>

      {/* ========================================================
          2. PREMIUM FRAGRANCE BRANDS SLIDER
          ======================================================== */}
      <div className="brand-heading-row">
        <h3 className="brand-heading">Premium Fragrance Brands</h3>

        {/* Arrow Buttons appear ONLY if there are MORE than 5 brands */}
        {perfumeBrands.length > 5 && (
          <div className="brand-slider-controls">
            <button
              type="button"
              className="brand-slider-btn"
              onClick={() => scrollTrack(perfumeTrackRef, "left", setPerfumeScroll, perfumeBrands.length)}
              disabled={!perfumeScroll.canLeft}
              aria-label="Previous fragrance brands"
              title="Previous fragrance brands"
            >
              ‹
            </button>
            <button
              type="button"
              className="brand-slider-btn"
              onClick={() => scrollTrack(perfumeTrackRef, "right", setPerfumeScroll, perfumeBrands.length)}
              disabled={!perfumeScroll.canRight}
              aria-label="Next fragrance brands"
              title="Next fragrance brands"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        className="brand-slider-track"
        ref={perfumeTrackRef}
        onScroll={() => updateScrollState(perfumeTrackRef, setPerfumeScroll, perfumeBrands.length)}
      >
        {perfumeBrands.map((brand) => (
          <Link
            to={`/fragrances?brand=${encodeURIComponent(brand.name)}`}
            className="brand-card"
            key={brand._id || brand.name}
          >
            <div className="brand-logo">
              {renderBrandLogo(brand)}
              <div className="brand-monogram" style={{ display: "none" }}>
                {getMonogram(brand.name)}
              </div>
            </div>
            <h4>{brand.name}</h4>
            <span>{brand.origin || "Paris, France"}</span>
          </Link>
        ))}
      </div>

      <div className="brands-button">
        <Link to="/fragrances" className="brand-explore-link">
          Explore All Fragrances →
        </Link>
      </div>
    </section>
  );
}

export default FeaturedBrands;