import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUploadModal: { open: false, type: "image" },
};

const ModalSlice = createSlice({
  name: "Modal",
  initialState,
  reducers: {
    setUploadModal: (state, actions) => {
      state.isUploadModal = actions.payload;
    },
  },
});

export const { setUploadModal } = ModalSlice.actions;
export default ModalSlice.reducer;
