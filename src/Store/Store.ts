import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "./Slices/LayoutSlice";

const Store = configureStore({
  reducer: {
    layout: layoutSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
