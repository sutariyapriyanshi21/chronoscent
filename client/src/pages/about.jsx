import Footer from "../components/Footer";
import "../css/static.css";
import aboutImage from "../assests/Products/about.jpg";


function About() {
  return (
    <>
      <section className="static-page">
        <div className="container">

          <div className="static-header">
            <h1>Our Story</h1>
            <p>Discover the passion and precision behind ChronoScent Elite.</p>
          </div>

          <div className="row g-5 align-items-center">

            <div className="col-lg-6">
              <div className="about-content">
                <h3>A Legacy of Luxury</h3>
                <p>
                  Founded with a vision to bring the world's most exquisite timepieces and signature fragrances into one curated space, ChronoScent Elite represents the pinnacle of luxury e-commerce.
                </p>
                <p>
                  We believe that what you wear on your wrist and the scent you leave behind are the ultimate expressions of your personal brand. That is why our team meticulously sources only authentic, premium products from the world's most respected design houses.
                </p>
                <p>
                  Whether you are seeking the precision engineering of a Swiss diver watch, or the captivating allure of a niche Parisian perfume, our collection is designed for those who refuse to compromise on quality.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              {/* Using a placeholder luxury image from Unsplash */}
              <img
                src={aboutImage}
                alt="Luxury Lifestyle"
                className="about-image"
              />
            </div>

          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}

export default About;