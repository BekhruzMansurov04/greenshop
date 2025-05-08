import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const ProductCard = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingIndex = savedCart.findIndex((item) => item._id === product._id);

      if (existingIndex !== -1) {
        savedCart[existingIndex].quantity = (savedCart[existingIndex].quantity || 1) + 1;
      } else {
        savedCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(savedCart));
      setCartItems(savedCart);
    } else {
      const saved = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(saved);
    }
  }, [location.state]);

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const increaseQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); 
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    updateCart(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Savatchadagi mahsulotlar</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Savat bo'sh.</p>
      ) : (
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <div key={item._id} className="border rounded p-4 flex gap-4 items-center">
              <img src={item.main_image} alt={item.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.short_description}</p>
                <p className="text-green-600 font-bold mt-2">${item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="p-1 rounded-full border hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="p-1 rounded-full border hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 p-1 rounded-full border text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
