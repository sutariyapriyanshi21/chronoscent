import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Herosection.css";

import hero1 from "../assests/hero/hero1.png";
import hero2 from "../assests/hero/hero2.jpg";
import hero3 from "../assests/hero/hero3.jpg";
import hero4 from "../assests/hero/hero4.jpg";
import hero5 from "../assests/hero/hero5.jpg";

function HeroSection() {
  const images = [hero1, hero2, hero3, hero4, hero5];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(slider);
  }, [images.length]);

  return (
    <section className="hero">

      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-slide ${
            index === current ? "active" : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="container hero-content">

        <h1 className="display-1 fw-bold">
          Crafted for
          <br />
          Timeless Elegance.
        </h1>

        <p className="lead">
          Discover premium watches and signature fragrances
          crafted for people who appreciate timeless style,
          precision and sophistication.
        </p>

        <div className="hero-buttons d-flex flex-column flex-sm-row gap-3">

          <Link to="/watches" className="primary-btn btn btn-lg text-decoration-none">
            Shop Watches
          </Link>

          <Link to="/Fragrances" className="secondary-btn btn btn-lg text-decoration-none">
            Explore Fragrances
          </Link>

        </div>

        <div className="scroll-down">
          <span>↓</span>
        </div>

      </div>

    </section>
  );
}

export default HeroSection;