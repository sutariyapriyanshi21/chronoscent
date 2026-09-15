import { useMemo, useState, useEffect } from "react"; // <-- Added useEffect

import WatchSearch from "../components/watches/WatchSearch";
import WatchFilters from "../components/watches/WatchFilters";
import WatchCard from "../components/watches/WatchCard";
import Footer from "../components/Footer";

import "../css/watches.css";

function Watches() {
  const [watches, setWatches] = useState([]); // <-- State to hold watches from database

  // Fetch watches from backend when the page loads
  useEffect(() => {
    console.log("Fetching watches from backend...");
    fetch("http://127.0.0.1:5000/api/watches")
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched watches:", data);
        setWatches(data);
      })
      .catch((err) => console.error("Error fetching watches:", err));
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

  const filteredWatches = useMemo(() => {
    let result = watches.filter((watch) => {

      /* Brand */
      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(watch.brand);

      /* Gender */
      const genderMatch =
        selectedGenders.length === 0 ||
        selectedGenders.includes(watch.gender);

      /* Style */
      const styleMatch =
        selectedStyles.length === 0 ||
        selectedStyles.includes(watch.watchType);

      /* Search */
      const search = searchTerm.trim().toLowerCase();
      const searchMatch =
        search === "" ||
        (watch.brand && watch.brand.toLowerCase().includes(search)) ||
        (watch.name && watch.name.toLowerCase().includes(search)) ||
        (watch.model && watch.model.toLowerCase().includes(search));

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
  }, [watches, selectedBrands, selectedGenders, selectedStyles, searchTerm, sortOption]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Discover Watches
          </h1>
          <p className="lead text-secondary mx-auto mt-3" style={{ maxWidth: '600px' }}>
            A curated collection of timepieces.
          </p>
        </div>
      </section>

      {/* ================= SEARCH & SORT ================= */}
      <WatchSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ================= WATCH CATALOG ================= */}
      <section className="watch-catalog py-5">
        <div className="container">

          <WatchFilters
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
            {filteredWatches.length > 0 ? (
              filteredWatches.map((watch) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={watch._id}>
                  <WatchCard watch={watch} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 style={{ color: 'var(--color-primary)' }}>No watches found</h4>
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

export default Watches;