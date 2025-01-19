import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearWishlist(state) {
      state.items = [];
    }
  },
});

export const { setWishlistItems, setLoading, setError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;