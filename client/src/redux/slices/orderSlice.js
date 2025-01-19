import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    myOrders: null,
    orderDetails: null,
    soldOrder:[],
    sellingOrder:[],
    isLoading:false,
    error: null,
  },
  reducers: {
    setAllOrders(state, action) {
      state.state = action.payload;
    },
    setMyOrders(state, action) {
      state.myOrders = action.payload;
    },
    setOrderDetails(state, action) {
      state.isLoading = action.payload;
    },
    setSoldOrders(state, action){
      state.soldOrder = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSellingOrders(state, action){
      state.sellingOrder = action.payload;
    },
  },
});

export const { 
  setAllOrders, 
  setMyOrders, 
  setOrderDetails,
  setSoldOrders,  
  setError, 
  setSellingOrders,
} = orderSlice.actions;
export default orderSlice.reducer;