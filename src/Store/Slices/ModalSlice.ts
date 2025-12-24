import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image" },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
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
  },
});

export const { setUploadModal, setSelectedFiles, clearSelectedFiles ,setModalVideoPlay} = ModalSlice.actions;

export default ModalSlice.reducer;
