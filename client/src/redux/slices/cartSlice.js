import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    total: 0
  },
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
      state.total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item._id === productId);
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }
  },
});

export const { setCartItems, setLoading, setError, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;