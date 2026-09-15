import { FiSearch } from "react-icons/fi";

import "./WatchSearch.css";

function WatchSearch({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) {
  return (
    <section className="watch-search-section">

      <div className="container">

        <div className="row g-3 align-items-center">

          {/* ================= SEARCH ================= */}

          <div className="col-lg-8 col-md-7 col-12">

            <div className="input-group search-box">

              <span className="input-group-text">
                <FiSearch />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search watches by brand, name or model..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>


          {/* ================= SORT ================= */}

          <div className="col-lg-4 col-md-5 col-12">

            <select
              className="form-select sort-select"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value)
              }
            >

              <option value="">
                Sort by
              </option>

              <option value="featured">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="name">
                Name: A to Z
              </option>

            </select>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WatchSearch;