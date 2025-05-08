import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductList = ({ loading, sortedProducts, type, searchParams, setSearchParams, clearFilters }) => {
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedItems")) || [];
    setLikedItems(storedLikes);
  }, []);


  const toggleLike = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem("likedItems")) || [];
    let updatedLikes;

    if (existingWishlist.some(item => item._id === product._id)) {
      updatedLikes = existingWishlist.filter(item => item._id !== product._id);
    } else {
      updatedLikes = [...existingWishlist, product];
    }

    setLikedItems(updatedLikes);
    localStorage.setItem("likedItems", JSON.stringify(updatedLikes));
  };

  const handleAddToCart = (product) => {
    navigate("/productCard", { state: { product } });
  };

  return (
    <main className="w-full md:w-3/4">
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {["all", "new", "sale"].map((item) => (
          <button
            key={item}
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                type: item,
              })
            }
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              type === item ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {item === "all" ? "All Plants" : item === "new" ? "New Arrivals" : "Sale"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500" />
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div key={product._id} className="relative bg-white rounded shadow hover:shadow-md transition flex flex-col justify-between">
              <img
                src={product.main_image || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t"
              />

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-600 font-bold">${product.price}</span>
                  {product.discount_price && (
                    <span className="ml-2 text-gray-500 line-through">${product.discount_price}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border-t">
                <button
                  onClick={() => toggleLike(product)}
                  className="text-2xl text-red-500 hover:scale-110 transition"
                >
                  {likedItems.some(item => item._id === product._id) ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-2xl text-green-600 hover:scale-110 transition"
                >
                  <FiShoppingCart />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No products found.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
};

export default ProductList;
