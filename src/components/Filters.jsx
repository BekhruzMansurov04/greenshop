import React from "react";

const Filters = ({
  categories,
  category,
  sort,
  type,
  priceRange,
  setPriceRange,
  setSearchParams,
  searchParams,
  clearFilters,
  productCount,
}) => {
  const handleCategoryChange = (newCategory) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      category: newCategory,
      type: "all",
    });
  };

  const handleSortChange = (e) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sort: e.target.value,
    });
  };

  const handleTypeChange = (e) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      type: e.target.value,
    });
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    const updated = [...priceRange];
    updated[index] = value;
    setPriceRange(updated);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      minPrice: updated[0],
      maxPrice: updated[1],
    });
  };

  return (
    <aside className="w-full md:w-1/4 space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleCategoryChange("all")}
              className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
                category === "all" ? "bg-green-100 text-green-800 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              <span>All Plants</span>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                {productCount}
              </span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => handleCategoryChange(cat.route_path)}
                className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
                  category === cat.route_path ? "bg-green-100 text-green-800 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <span>{cat.title}</span>
                <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {cat.count || 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Price Range</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block mb-2 font-medium">Sort by</label>
          <select value={sort} onChange={handleSortChange} className="w-full p-2 border rounded">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Type</label>
          <select value={type} onChange={handleTypeChange} className="w-full p-2 border rounded">
            <option value="all">All Types</option>
            <option value="new">New Arrivals</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <button
          onClick={clearFilters}
          className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};

export default Filters;
