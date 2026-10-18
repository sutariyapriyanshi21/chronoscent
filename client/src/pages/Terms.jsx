import Footer from "../components/Footer";
import "../css/static.css";

function Terms() {
  return (
    <>
      <section className="static-page">
        <div className="container">
          <div className="static-header">
            <h1>Terms & Conditions</h1>
            <p>Guidelines ensuring an authentic, seamless luxury boutique experience.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content">
                <h3>1. Authenticity Guarantee</h3>
                <p>
                  Every timepiece and artisanal fragrance featured at ChronoScent Elite is 100% genuine, sourced directly from certified authorized partners and esteemed luxury houses. Each timepiece includes documentation and original box sets.
                </p>

                <h3 className="mt-4">2. Orders & Verification</h3>
                <p>
                  Orders submitted through our boutique portal are subject to stock confirmation and standard security verification. We reserve the right to verify transactions to ensure the security of high-value luxury orders.
                </p>

                <h3 className="mt-4">3. Insured Delivery</h3>
                <p>
                  All shipments are handled by specialized luxury courier networks, fully insured from our vault to your door, and require direct signature upon delivery.
                </p>

                <h3 className="mt-4">4. Returns & Exchange Policy</h3>
                <p>
                  Timepieces in pristine, unworn condition with factory protective seals intact, and unopened fragrance packaging may be returned within 14 days of delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Terms;
