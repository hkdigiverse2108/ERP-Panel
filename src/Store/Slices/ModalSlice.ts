import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUploadModal: { open: false, type: "image" },
  selectedFiles: [],
};

const ModalSlice = createSlice({
  name: "Modal",
  initialState,
  reducers: {
    setUploadModal: (state, actions) => {
      state.isUploadModal = actions.payload;
    },
    setSelectedFiles: (state, actions) => {
      state.selectedFiles = actions.payload;
    },
  },
});

export const { setUploadModal, setSelectedFiles } = ModalSlice.actions;
export default ModalSlice.reducer;
