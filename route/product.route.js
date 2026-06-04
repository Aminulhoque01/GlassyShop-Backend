import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { createProduct, getAllFeatureProducts, getAllProduct, getAllProductByCatId, getAllProductByCatName, getAllProductByPrice, getAllProductByRating, getAllProductBySubCatId, getAllProductBySubCatName, getAllProductBythirdsubCat, getAllProductBythirdsubCatName, getProductCount, uploadImages } from "../controllers/product.controller.js";


const productRouter=Router();

productRouter.post("/uploadImages", auth, upload.array('images'), uploadImages);

productRouter.post('/create', auth, createProduct);
productRouter.get('/all-products', getAllProduct);
productRouter.get('/all-productsByCatId/:id', getAllProductByCatId);
productRouter.get('/productsByCatName', getAllProductByCatName);
productRouter.get('/productsBySubCatId/:id', getAllProductBySubCatId);
productRouter.get('/productsBythirdsubName', getAllProductBythirdsubCat);
productRouter.get('/productsBythirdsubCat', getAllProductBythirdsubCatName);
productRouter.get('/price-filter', getAllProductByPrice);
productRouter.get('/filter-rating', getAllProductByRating);
productRouter.get('/product-count', getProductCount);
productRouter.get('/feature-products', getAllFeatureProducts);


export default productRouter;