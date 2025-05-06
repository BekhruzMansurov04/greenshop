import React, { useEffect, useState } from "react";
import axios from "axios";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const token = "6803b89df2a99d0247959d1a";

  useEffect(() => {
    axios.get(`https://green-shop-backend.onrender.com/api/user/products?access_token=${token}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error("Productlarni olishda xatolik:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
      {products.map((product) => (
        <div key={product._id} className="bg-white p-4 border rounded-lg shadow hover:shadow-lg transition">
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-4 rounded" />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-green-700 font-bold">{product.price} so'm</p>
          <h1>Hello</h1>
        </div>
      ))}
    </div>
  );
};

export default Hero;
