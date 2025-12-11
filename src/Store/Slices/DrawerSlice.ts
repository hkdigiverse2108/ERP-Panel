import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEndTestDrawer: false,
};

const DrawerSlice = createSlice({
  name: "Drawer",
  initialState,
  reducers: {
    setEndTestDrawer: (state) => {
      state.isEndTestDrawer = !state.isEndTestDrawer;
    },
  },
});

export const { setEndTestDrawer } = DrawerSlice.actions;
export default DrawerSlice.reducer;
