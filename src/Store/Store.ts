import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./Slices/LayoutSlice";
import AuthSlice from "./Slices/AuthSlice";
import ModalSlice from "./Slices/ModalSlice";
import CompanySlice from "./Slices/CompanySlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    auth: AuthSlice,
    modal: ModalSlice,
    company: CompanySlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
