import { Link } from "react-router-dom";
import "../css/FeaturedBrands.css";

// Watch Logos
import rolex from "../assests/brands/Rolex.jpg";
import omega from "../assests/brands/Omega.jpg";
import cartier from "../assests/brands/Cartier.jpg";
import seiko from "../assests/brands/Seiko.jpg";
import tissot from "../assests/brands/Tissot.jpg";

// Perfume Logos
import dior from "../assests/brands/Dior.jpg";
import chanel from "../assests/brands/Chanel.jpg";
import tomford from "../assests/brands/Tomford.jpg";
import versace from "../assests/brands/Versace.jpg";
import creed from "../assests/brands/Creed.jpg";

function FeaturedBrands() {

    const watchBrands = [
        {
            name: "Rolex",
            country: "Geneva, Switzerland",
            logo: rolex
        },
        {
            name: "Omega",
            country: "Biel, Switzerland",
            logo: omega
        },
        {
            name: "Cartier",
            country: "Paris, France",
            logo: cartier
        },
        {
            name: "Seiko",
            country: "Tokyo, Japan",
            logo: seiko
        },
        {
            name: "Tissot",
            country: "Le Locle, Switzerland",
            logo: tissot
        }
    ];

    const perfumeBrands = [
        {
            name: "Dior",
            country: "Paris, France",
            logo: dior
        },
        {
            name: "Chanel",
            country: "Paris, France",
            logo: chanel
        },
        {
            name: "Tom Ford",
            country: "New York, USA",
            logo: tomford
        },
        {
            name: "Versace",
            country: "Milan, Italy",
            logo: versace
        },
        {
            name: "Creed",
            country: "Paris, France",
            logo: creed
        }
    ];

    return (

        <section className="featured-brands">

            <h2>Featured Luxury Brands</h2>

            <p>
                Explore the world's finest watchmakers and fragrance houses.
            </p>

            {/* Watch Brands */}

            <h3 className="brand-heading">
                Luxury Watch Brands
            </h3>

            <div className="brand-grid">

                {watchBrands.map((brand) => (

                    <div className="brand-card" key={brand.name}>

                        <div className="brand-logo">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                            />
                        </div>

                        <h4>{brand.name}</h4>

                        <span>{brand.country}</span>

                    </div>

                ))}

            </div>

            <div className="brands-button">

                <Link to="/watches" className="btn text-decoration-none p-0 border-0" style={{background: 'none', color: 'inherit'}}>
                    <button>
                        Explore All Watches →
                    </button>
                </Link>

            </div>


            {/* Perfume Brands */}

            <h3 className="brand-heading">
                Premium Fragrance Brands
            </h3>

            <div className="brand-grid">

                {perfumeBrands.map((brand) => (

                    <div className="brand-card" key={brand.name}>

                        <div className="brand-logo">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                            />
                        </div>

                        <h4>{brand.name}</h4>

                        <span>{brand.country}</span>

                    </div>

                ))}

            </div>

            <div className="brands-button">

                <Link to="/Fragrances" className="btn text-decoration-none p-0 border-0" style={{background: 'none', color: 'inherit'}}>
                    <button>
                        Explore All Fragrances →
                    </button>
                </Link>

            </div>

        </section>

    );

}

export default FeaturedBrands;