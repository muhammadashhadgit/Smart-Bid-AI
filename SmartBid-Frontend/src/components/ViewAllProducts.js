import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import DisplayCards from "./DisplayCards";
import "./ViewAllProducts.css";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [dataCheck, setDataCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/product/viewallproducts"
        );
        setProducts(response.data);
        setDataCheck(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      <h2 style={{ textAlign: "left", marginLeft: "60px" }}>All Products</h2>
      <Box
        sx={{ display: "flex", overflowY: "auto", justifyContent: "center" }}
      >
        {dataCheck ? (
          <DisplayCards test={products} onCardClick={handleProductClick} />
        ) : (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default ViewAllProducts;
