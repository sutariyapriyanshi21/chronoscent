import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import watches from "../Data/Watches";
import fragrances from "../Data/fragerence";

import "../css/GlobalSearch.css";

function GlobalSearch({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [dbWatches, setDbWatches] = useState([]);
  const [dbFragrances, setDbFragrances] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);

      // Fetch live products from backend to ensure real MongoDB IDs
      fetch("http://127.0.0.1:5000/api/watches")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setDbWatches(data);
        })
        .catch(() => {});

      fetch("http://127.0.0.1:5000/api/fragrances")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setDbFragrances(data);
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = "unset";
      setSearchTerm("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const isWatchKeyword = term === 'watch' || term === 'watches';
    const isFragranceKeyword = ['fragrance', 'fragrances', 'perfume', 'perfumes', 'cologne'].includes(term);

    const watchSource = dbWatches.length > 0 ? dbWatches : watches;
    const fragranceSource = dbFragrances.length > 0 ? dbFragrances : fragrances;

    const matchedWatches = watchSource
      .filter((w) => 
        isWatchKeyword ||
        (w.name && w.name.toLowerCase().includes(term)) || 
        (w.brand && w.brand.toLowerCase().includes(term))
      )
      .map(w => ({ ...w, type: 'watch', link: `/watches/${w._id || w.id}` }));

    const matchedFragrances = fragranceSource
      .filter((f) => 
        isFragranceKeyword ||
        (f.name && f.name.toLowerCase().includes(term)) || 
        (f.brand && f.brand.toLowerCase().includes(term))
      )
      .map(f => ({ ...f, type: 'fragrance', link: `/fragrances/${f._id || f.id}` }));

    setResults([...matchedWatches, ...matchedFragrances].slice(0, 8));
  }, [searchTerm, dbWatches, dbFragrances]);

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-modal" onClick={e => e.stopPropagation()}>
        <div className="global-search-header">
          <FiSearch className="search-icon" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search watches and fragrances..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {searchTerm && (
          <div className="global-search-results">
            {results.length > 0 ? (
              results.map((item, index) => (
                <Link to={item.link} className="search-result-item" key={index} onClick={onClose}>
                  <img src={item.image} alt={item.name} />
                  <div className="result-info">
                    <h4>{item.name}</h4>
                    <p className="brand">{item.brand}</p>
                    <span className="price">₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-results">
                No products found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalSearch;
