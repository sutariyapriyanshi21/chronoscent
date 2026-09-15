import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import watches from "../Data/watches";
import fragrances from "../Data/fragerence";

import "../css/GlobalSearch.css";

function GlobalSearch({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
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

    const matchedWatches = watches
      .filter((w) => 
        w.name.toLowerCase().includes(term) || 
        w.brand.toLowerCase().includes(term)
      )
      .map(w => ({ ...w, type: 'watch', link: `/watches/${w.id}` }));

    const matchedFragrances = fragrances
      .filter((f) => 
        f.name.toLowerCase().includes(term) || 
        f.brand.toLowerCase().includes(term)
      )
      .map(f => ({ ...f, type: 'fragrance', link: `/fragrances/${f.id}` }));

    setResults([...matchedWatches, ...matchedFragrances].slice(0, 8));
  }, [searchTerm]);

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
                    <span className="price">${item.price}</span>
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
