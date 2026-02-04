import { createSlice } from "@reduxjs/toolkit";
import type { PosSliceState } from "../../Types";

const initialState: PosSliceState = {
  isMultiplePay: false,
  productDataModal: [],
  PosProduct: {
    product: [],
    customerId: "",
    salesmanId: "",
    totalQty: 0,
    totalMep: 0,
    totalTaxAmount: 0,
    totalCharges: 0,
    totalDiscount: 0,
    totalFlatDiscount: 0,
    totalRoundOFF: 0,
    remarks: "",
    totalAmount: 0,
  },
};

const PosSlice = createSlice({
  name: "Pos",
  initialState,
  reducers: {
    setMultiplePay: (state) => {
      state.isMultiplePay = !state.isMultiplePay;
    },

    addOrUpdateProduct: (state, action) => {
      if (!action.payload || !action.payload._id) return;

      const existingProduct = state.PosProduct.product.find((item) => item._id === action.payload._id);

      if (existingProduct) {
        existingProduct.sellingQty += 1;
      } else {
        state.PosProduct.product.push({
          ...action.payload,
          sellingQty: 1,
          discount: 0,
        });
      }
    },

    updateProduct: (state, action) => {
      const row = state.PosProduct.product.find((item) => item._id === action.payload._id);
      if (row) Object.assign(row, action.payload.data);
    },
    removeProduct: (state, action) => {
      state.PosProduct.product = state.PosProduct.product.filter((item) => item._id !== action.payload);
    },
    clearProductDataModal: (state) => {
      state.PosProduct.product = [];
    },

    setCustomerId: (state, action) => {
      state.PosProduct.customerId = action.payload;
    },

    setSalesmanId: (state, action) => {
      state.PosProduct.salesmanId = action.payload;
    },

    setTotalQty: (state, action) => {
      state.PosProduct.totalQty = action.payload;
    },
    setTotalMep: (state, action) => {
      state.PosProduct.totalMep = action.payload;
    },
    setTotalDiscount: (state, action) => {
      state.PosProduct.totalDiscount = action.payload;
    },
    setTotalTaxAmount: (state, action) => {
      state.PosProduct.totalTaxAmount = action.payload;
    },
    setTotalCharges: (state, action) => {
      state.PosProduct.totalCharges = action.payload;
    },
    setTotalFlatDiscount: (state, action) => {
      state.PosProduct.totalFlatDiscount = action.payload;
    },
    setTotalRoundOFF: (state, action) => {
      state.PosProduct.totalRoundOFF = action.payload;
    },
    setRemarks: (state, action) => {
      state.PosProduct.remarks = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.PosProduct.totalAmount = action.payload;
    },
  },
});

export const { setMultiplePay, updateProduct, removeProduct, clearProductDataModal, addOrUpdateProduct, setCustomerId, setSalesmanId, setTotalMep, setTotalDiscount, setTotalTaxAmount, setTotalCharges, setTotalFlatDiscount, setTotalRoundOFF, setTotalAmount, setTotalQty, setRemarks } = PosSlice.actions;
export default PosSlice.reducer;
