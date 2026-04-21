import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./Slices/LayoutSlice";
import AuthSlice from "./Slices/AuthSlice";
import ModalSlice from "./Slices/ModalSlice";
import CompanySlice from "./Slices/CompanySlice";
import DrawerSlice from "./Slices/DrawerSlice";
import PosSlice from "./Slices/PosSlice";
import DashboardSlice from "./Slices/DashboardSlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    auth: AuthSlice,
    modal: ModalSlice,
    company: CompanySlice,
    drawer: DrawerSlice,
    pos: PosSlice,
    dashboard: DashboardSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
