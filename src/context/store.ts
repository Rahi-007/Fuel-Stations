import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slice/counter.slice";
import { logger } from "./middleware/logger";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...(process.env.NODE_ENV === "development" ? [logger] : [])
    ),
});

//W---------={ RootState and AppDispatch }=----------</br>
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
