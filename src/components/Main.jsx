import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Filters from "./Filters";
import ProductList from "./ProductList";

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
    if (type !== "all") url += `&type=${type}`;
    url += `&range_min=${minPrice}&range_max=${maxPrice}`;

    axios
      .get(url)
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Mahsulotlarni olishda xatolik:", err);
        setProducts([]);
        setLoading(false);
      });
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case "price-asc": return copy.sort((a, b) => a.price - b.price);
      case "price-desc": return copy.sort((a, b) => b.price - a.price);
      case "name-asc": return copy.sort((a, b) => a.title?.localeCompare(b.title));
      case "name-desc": return copy.sort((a, b) => b.title?.localeCompare(a.title));
      default: return copy;
    }
  }, [products, sort]);

  return (
    <div className="w-full px-6 md:px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        <Filters
          categories={categories}
          category={category}
          sort={sort}
          type={type}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
          clearFilters={() => {
            setSearchParams({});
            setPriceRange([0, 1000]);
          }}
          productCount={products.length}
        />
        <ProductList
          loading={loading}
          sortedProducts={sortedProducts}
          type={type}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          clearFilters={() => {
            setSearchParams({});
            setPriceRange([0, 1000]);
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
