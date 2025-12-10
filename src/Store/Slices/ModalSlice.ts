import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUploadModal: false,
};

const ModalSlice = createSlice({
  name: "Modal",
  initialState,
  reducers: {
    setUploadModal: (state) => {
      state.isUploadModal = !state.isUploadModal;
    },
  },
});

export const { setUploadModal } = ModalSlice.actions;
export default ModalSlice.reducer;
