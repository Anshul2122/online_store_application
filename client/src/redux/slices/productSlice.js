
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    error: null,
    products: [],
    sellerProducts:[],
    productDetails: null,
    lastesProducts:[],
    categoryProducts:[],
    allProducts :[],
    singleProductOfeachCategory: [],
  },
  reducers: {
    
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLastestProduct(state, action) {
      state.lastesProducts = action.payload;
    },
    setCategoryProducts(state, action) {
      state.categoryProducts = action.payload;
    },
    setAllProducts(state, action) {
      state.allProducts = action.payload;
    },
    setProductDetails(state, action) {
      state.productDetails = action.payload;
    },
    setSingleProductOfEachCategory(state, action) {
      state.singleProductOfeachCategory = action.payload;
    },
    setProducts(state, action){
      state.products = action.payload;
    },
    setSellerProducts(state, action){
      state.sellerProducts = action.payload;
    }

  },
});

export const {
  setLoading,
  setError,
  setLastestProduct,
  setCategoryProducts,
  setAllProducts,
  setProductDetails,
  setSingleProductOfEachCategory,
  setProducts,
  setSellerProducts,

} = productSlice.actions;

export default productSlice.reducer;
