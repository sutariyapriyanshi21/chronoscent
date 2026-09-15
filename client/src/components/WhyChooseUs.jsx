import "../css/WhyChooseUs.css";

function WhyChooseUs() {

    const features = [

        {
            icon: "bi bi-truck",
            title: "Free Shipping",
            description: "Enjoy free shipping on premium orders worldwide."
        },

        {
            icon: "bi bi-shield-check",
            title: "Secure Payment",
            description: "100% safe and encrypted payment methods."
        },

        {
            icon: "bi bi-patch-check",
            title: "Authentic Brands",
            description: "Only genuine luxury watches and fragrances."
        },

        {
            icon: "bi bi-gift",
            title: "Premium Packaging",
            description: "Every order arrives beautifully packaged."
        }

    ];

    return (

        <section className="why-section">

            <div className="container">

                <div className="text-center mb-5">

                    <h2>Why Choose ChronoScent Elite</h2>

                    <p>
                        Luxury shopping with trust, elegance and premium service.
                    </p>

                </div>

                <div className="row g-4">

                    {features.map((item, index) => (

                        <div className="col-lg-3 col-md-6" key={index}>

                            <div className="feature-card">

                                <i className={item.icon}></i>

                                <h4>{item.title}</h4>

                                <p>{item.description}</p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default WhyChooseUs;