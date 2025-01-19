import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import wishlistSlice from "./slices/wishlistSlice";
import orderSlice from "./slices/orderSlice";
import productSlice from "./slices/productSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ['auth', 'cart', 'wishlist'] // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  wishlist: wishlistSlice,
  orders: orderSlice,
  products: productSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;