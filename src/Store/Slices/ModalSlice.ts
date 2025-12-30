import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image" },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isCustomerModal: { open: false, data: null },
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
  },
});

export const { setUploadModal, setSelectedFiles, clearSelectedFiles, setModalVideoPlay, setCustomerModal } = ModalSlice.actions;

export default ModalSlice.reducer;
