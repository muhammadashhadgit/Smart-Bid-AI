const express = require("express");
const controller = require("../controllers/productController");
const helperController = require("../controllers/helperController");

const router = express.Router();

// View Products
router.route("/").get(controller.ViewProducts);

// View Products by Cateogies
router.route("/category").post(controller.ViewProductsByCategory);

//viewallproducts
router.route("/viewallproducts").get(controller.getAllProducts);

// Search Product
router.route("/search").get(controller.SearchProduct);

// View Single Product
router
  .route("/single")
  .post(controller.ViewSingleProduct, controller.HighestBidder);

module.exports = router;

//View Recomendations
router.route("/recommendations").get(controller.ViewRecommendations);
