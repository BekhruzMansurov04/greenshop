import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("likedItems")) || [];
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    localStorage.setItem("likedItems", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist); 
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...cart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Mahsulot savatchaga qo'shildi");

    navigate("/productCard"); 
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>😔 Siz hali hech qanday gulni layk qilmadingiz.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={product.main_image || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {product.short_description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-bold">${product.price}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => addToCart(product)} 
                      className="text-green-600 hover:text-green-800"
                      title="Add to Cart"
                    >
                      <FaShoppingCart size={18} />
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove from Wishlist"
                    >
                      <FaHeart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
