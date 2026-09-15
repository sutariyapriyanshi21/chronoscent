import { useMemo, useState, useEffect } from "react"; // <-- Added useEffect

import FragranceSearch from "../components/Fragerences/FragranceSearch";
import FragranceFilters from "../components/Fragerences/FragranceFilters";
import FragranceCard from "../components/Fragerences/FragranceCard";
import Footer from "../components/Footer";

import "../css/watches.css"; // Note: reuse same css

function Fragrances() {
  const [fragrances, setFragrances] = useState([]); // <-- State to hold fragrances from database

  // Fetch fragrances from backend when the page loads
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/fragrances")
      .then((res) => res.json())
      .then((data) => setFragrances(data))
      .catch((err) => console.error("Error fetching fragrances:", err));
  }, []);

  /* ================================
     FILTER STATES
  ================================= */

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  /* ================================
     SEARCH & SORT STATES
  ================================= */

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  /* ================================
     CLEAR FILTERS
  ================================= */

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedStyles([]);
    setSearchTerm("");
    setSortOption("");
  };

  /* ================================
     FILTER PRODUCTS
  ================================= */

  const filteredFragrances = useMemo(() => {
    let result = fragrances.filter((fragrance) => {

      /* Brand */
      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(fragrance.brand);

      /* Gender */
      const genderMatch =
        selectedGenders.length === 0 ||
        selectedGenders.includes(fragrance.gender);

      /* Style */
      const styleMatch =
        selectedStyles.length === 0 ||
        selectedStyles.includes(fragrance.fragranceType);

      /* Search */
      const search = searchTerm.trim().toLowerCase();
      const searchMatch =
        search === "" ||
        (fragrance.brand && fragrance.brand.toLowerCase().includes(search)) ||
        (fragrance.name && fragrance.name.toLowerCase().includes(search)) ||
        (fragrance.model && fragrance.model.toLowerCase().includes(search));

      return brandMatch && genderMatch && styleMatch && searchMatch;
    });

    /* ================================
       SORTING
    ================================= */

    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [fragrances, selectedBrands, selectedGenders, selectedStyles, searchTerm, sortOption]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Discover Fragrances
          </h1>
          <p className="lead text-secondary mx-auto mt-3" style={{ maxWidth: '600px' }}>
            A curated collection of signature scents.
          </p>
        </div>
      </section>

      {/* ================= SEARCH & SORT ================= */}
      <FragranceSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ================= CATALOG ================= */}
      <section className="watch-catalog py-5">
        <div className="container">

          <FragranceFilters
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedGenders={selectedGenders}
            setSelectedGenders={setSelectedGenders}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
            clearFilters={clearFilters}
          />

          {/* ================= SIMPLE GRID ================= */}
          <div className="row g-4 mt-4">
            {filteredFragrances.length > 0 ? (
              filteredFragrances.map((fragrance) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={fragrance._id}>
                  <FragranceCard fragrance={fragrance} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 style={{ color: 'var(--color-primary)' }}>No fragrances found</h4>
                <p className="text-secondary">Try changing your search or filters.</p>
                <button className="btn btn-outline-dark mt-3" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Fragrances;