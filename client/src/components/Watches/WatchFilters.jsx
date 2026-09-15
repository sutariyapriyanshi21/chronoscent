import "./WatchFilters.css";

function WatchFilters({
  selectedBrands,
  setSelectedBrands,
  selectedGenders,
  setSelectedGenders,
  selectedStyles,
  setSelectedStyles,
  clearFilters,
}) {
  const brands = ["Rolex", "Omega", "Cartier", "Tissot", "Seiko"];
  const genders = ["Men", "Women", "Unisex"];
  const styles = ["Classic", "Diver", "Dress", "Sport"];

  const handleToggle = (item, selectedList, setList) => {
    if (selectedList.includes(item)) {
      setList(selectedList.filter((i) => i !== item));
    } else {
      setList([...selectedList, item]);
    }
  };

  const hasFilters = selectedBrands.length > 0 || selectedGenders.length > 0 || selectedStyles.length > 0;

  return (
    <div className="watch-filters-container mb-4">
      <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center mb-3">
        <span className="fw-bold me-2 text-uppercase" style={{fontSize: '0.85rem', letterSpacing: '1px'}}>Brand</span>
        {brands.map((brand) => (
          <button
            key={brand}
            className={`btn btn-sm rounded-pill ${selectedBrands.includes(brand) ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => handleToggle(brand, selectedBrands, setSelectedBrands)}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center mb-3">
        <span className="fw-bold me-2 text-uppercase" style={{fontSize: '0.85rem', letterSpacing: '1px'}}>For</span>
        {genders.map((gender) => (
          <button
            key={gender}
            className={`btn btn-sm rounded-pill ${selectedGenders.includes(gender) ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => handleToggle(gender, selectedGenders, setSelectedGenders)}
          >
            {gender}
          </button>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center mb-3">
        <span className="fw-bold me-2 text-uppercase" style={{fontSize: '0.85rem', letterSpacing: '1px'}}>Style</span>
        {styles.map((style) => (
          <button
            key={style}
            className={`btn btn-sm rounded-pill ${selectedStyles.includes(style) ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => handleToggle(style, selectedStyles, setSelectedStyles)}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button 
          className={`btn btn-sm rounded-pill ${!hasFilters ? 'btn-dark' : 'btn-outline-danger'}`}
          onClick={clearFilters}
        >
          {hasFilters ? "Clear All Filters" : "All Watches"}
        </button>
      </div>
    </div>
  );
}

export default WatchFilters;