import { createSlice } from "@reduxjs/toolkit";
import type { PosSliceState } from "../../Types";

const initialState: PosSliceState = {
  isMultiplePay: false,
  productDataModal: [],
};

const PosSlice = createSlice({
  name: "Pos",
  initialState,
  reducers: {
    setMultiplePay: (state) => {
      state.isMultiplePay = !state.isMultiplePay;
    },
    setProductDataModal: (state, action) => {
      const existingProduct = state.productDataModal.find((item) => item._id === action.payload._id);
      if (existingProduct) {
        existingProduct.sellingQty = (existingProduct.sellingQty || 0) + 1;
      } else {
        state.productDataModal.push({
          ...action.payload,
          sellingQty: 1,
          discount: 0,
        });
      }
    },
    updateProduct: (state, action) => {
      const row = state.productDataModal.find((item) => item._id === action.payload._id);
      if (row) Object.assign(row, action.payload.data);
    },
    removeProduct: (state, action) => {
      state.productDataModal = state.productDataModal.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setMultiplePay, setProductDataModal, updateProduct, removeProduct } = PosSlice.actions;
export default PosSlice.reducer;
