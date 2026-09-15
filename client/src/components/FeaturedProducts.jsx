import "../css/FeaturedProducts.css";
import ProductCard from "./ProductCard";

import rolex from "../assests/Products/rolex.jpg";
import omega from "../assests/Products/omega.jpg";
import cartier from "../assests/Products/cartier.jpg";
import chanel from "../assests/Products/channel.jpg";

function FeaturedProducts() {

    return (

        <section className="featured-products">

            <h2>Featured Products</h2>

            <p>
                Premium picks curated exclusively for you.
            </p>

            <div className="product-grid">

                <ProductCard
                    image={rolex}
                    brand="ROLEX"
                    name="Submariner"
                    price="$899"
                    rating="5.0"
                />

                <ProductCard
                    image={omega}
                    brand="OMEGA"
                    name="Speedmaster"
                    price="$799"
                    rating="4.9"
                />

                <ProductCard
                    image={cartier}
                    brand="CARTIER"
                    name="Declaration"
                    price="$149"
                    rating="4.8"
                />

                <ProductCard
                    image={chanel}
                    brand="CHANEL"
                    name="Bleu De Chanel"
                    price="$169"
                    rating="5.0"
                />

            </div>

        </section>

    );

}

export default FeaturedProducts;