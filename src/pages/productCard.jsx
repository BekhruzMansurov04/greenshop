import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductCard = () => {
  const [categories, setCategories] = useState([]);
  const token = "6803b89df2a99d0247959d1a"; 

  useEffect(() => {
    axios
      .get(`https://green-shop-backend.onrender.com/api/flower/category?access_token=${token}`)
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Kategoriya olishda xatolik:", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Kategoriyalar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="p-4 border rounded shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{category.title}</h3>
            <p className="text-gray-500">Route: <span className="text-green-600">{category.route_path}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
