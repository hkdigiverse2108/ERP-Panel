import { createSlice } from "@reduxjs/toolkit";
import type { PosSliceState } from "../../Types";

const initialState: PosSliceState = {
  isMultiplePay: false,
  productDataModal: [],
  PosProduct: {
    items: [],
    customerId: "",
    orderType: "walk_in",
    salesmanId: "",
    totalQty: 0,
    totalMep: 0,
    totalTaxAmount: 0,
    totalDiscount: 0,
    totalAdditionalCharge: 0,
    flatDiscountAmount: 0,
    additionalCharges: [],
    roundOff: 0,
    remark: "",
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

      const existingProduct = state.PosProduct.items.find((item) => item._id === action.payload._id);

      if (existingProduct) {
        existingProduct.posQty += 1;
      } else {
        state.PosProduct.items.push({
          ...action.payload,
          posQty: 1,
          discount: action.payload.sellingDiscount || 0,
          additionalDiscount: 0,
        });
      }
    },

    updateProduct: (state, action) => {
      const row = state.PosProduct.items.find((item) => item._id === action.payload._id);
      if (row) Object.assign(row, action.payload.data);
    },
    removeProduct: (state, action) => {
      state.PosProduct.items = state.PosProduct.items.filter((item) => item._id !== action.payload);
    },
    clearProductDataModal: (state) => {
      state.PosProduct.items = [];
    },

    setCustomerId: (state, action) => {
      state.PosProduct.customerId = action.payload;
    },

    setOrderType: (state, action) => {
      state.PosProduct.orderType = action.payload;
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
    setTotalAdditionalCharge: (state, action) => {
      state.PosProduct.totalAdditionalCharge = action.payload;
    },
    setFlatDiscountAmount: (state, action) => {
      state.PosProduct.flatDiscountAmount = action.payload;
    },
    setAdditionalCharges: (state, action) => {
      state.PosProduct.additionalCharges = action.payload;
    },
    setRoundOff: (state, action) => {
      state.PosProduct.roundOff = action.payload;
    },
    setRemarks: (state, action) => {
      state.PosProduct.remark = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.PosProduct.totalAmount = action.payload;
    },
  },
});

export const { setAdditionalCharges, setTotalAdditionalCharge, setMultiplePay, updateProduct, removeProduct, clearProductDataModal, addOrUpdateProduct, setCustomerId, setSalesmanId, setTotalMep, setTotalDiscount, setTotalTaxAmount, setFlatDiscountAmount, setRoundOff, setTotalAmount, setTotalQty, setRemarks, setOrderType } = PosSlice.actions;
export default PosSlice.reducer;
