import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = "6803b89df2a99d0247959d1a";

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "default";
  const type = searchParams.get("type") || "all";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || 1000;

  useEffect(() => {
    axios
      .get(`https://green-shop-backend.onrender.com/api/flower/category?access_token=${token}`)
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Kategoriya olishda xatolik:", err));

    fetchProducts();
  }, [category, type, minPrice, maxPrice]);

  const fetchProducts = () => {
    setLoading(true);
    let url = `https://green-shop-backend.onrender.com/api/flower/category/${category === "all" ? "all" : category}?access_token=${token}`;
    
    if (type !== "all") {
      url += `&type=${type}`;
    }
    
    url += `&range_min=${minPrice}&range_max=${maxPrice}`;

    axios
      .get(url)
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Mahsulotlarni olishda xatolik:", err);
        setLoading(false);
        setProducts([]);
      });
  };

  const sortedProducts = React.useMemo(() => {
    const productsCopy = [...products];
    switch (sort) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return productsCopy.sort((a, b) => a.title?.localeCompare(b.title));
      case "name-desc":
        return productsCopy.sort((a, b) => b.title?.localeCompare(a.title));
      default:
        return productsCopy;
    }
  }, [products, sort]);

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ 
      ...Object.fromEntries(searchParams), 
      category: newCategory,
      type: "all"
    });
  };

  const handleSortChange = (e) => {
    setSearchParams({ 
      ...Object.fromEntries(searchParams), 
      sort: e.target.value 
    });
  };

  const handleTypeChange = (e) => {
    setSearchParams({ 
      ...Object.fromEntries(searchParams), 
      type: e.target.value 
    });
  };

  const handlePriceChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = newValue;
    setPriceRange(newRange);
   
    setTimeout(() => {
      setSearchParams({ 
        ...Object.fromEntries(searchParams), 
        minPrice: newRange[0],
        maxPrice: newRange[1]
      });
    }, 300);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 1000]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
                    category === "all" ? "bg-green-100 text-green-800 font-medium" : "hover:bg-gray-100"
                  }`}
                >
                  <span>All Plants</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {products.length}
                  </span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategoryChange(cat.route_path)}
                    className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
                      category === cat.route_path ? "bg-green-100 text-green-800 font-medium" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {cat.count || 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Price Range</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">${priceRange[0]}</span>
                <span className="text-gray-600">${priceRange[1]}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Filter</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Sort by:</label>
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Type:</label>
                <select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-full p-2 border rounded"
                >
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
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                category === "all" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All Plants
            </button>
            <button
              onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), type: "new" })}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                type === "new" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), type: "sale" })}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                type === "sale" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Sale
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.main_image || "https://via.placeholder.com/300"} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        {product.discount_price ? 
                          `${Math.round((1 - product.discount_price / product.price) * 100)}% OFF` : 
                          "SALE"}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.short_description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-600 font-bold">${product.price}</span>
                      {product.discount_price && product.discount_price < product.price && (
                        <span className="ml-2 text-gray-500 line-through">${product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sortedProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;