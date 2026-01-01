import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image" },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isCustomerModal: { open: false, data: null },
  isPaymentListModal: false,
};

const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setUploadModal: (state, action) => {
      state.isUploadModal = action.payload;
    },

    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },

    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
    setModalVideoPlay(state, action) {
      state.isModalVideoPlay = action.payload;
    },
    setCustomerModal: (state, action) => {
      state.isCustomerModal = action.payload;
    },
    setPaymentListModal: (state) => {
      state.isPaymentListModal = !state.isPaymentListModal;
    },
  },
});

export const { setUploadModal, setSelectedFiles, clearSelectedFiles, setModalVideoPlay, setCustomerModal ,setPaymentListModal} = ModalSlice.actions;

export default ModalSlice.reducer;
