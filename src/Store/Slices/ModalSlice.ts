// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isUploadModal: { open: false, type: "image" },
//   selectedFiles: [],
// };

// const ModalSlice = createSlice({
//   name: "Modal",
//   initialState,
//   reducers: {
//     setUploadModal: (state, actions) => {
//       state.isUploadModal = actions.payload;
//     },
//     setSelectedFiles: (state, actions) => {
//       state.selectedFiles = actions.payload;
//     },
//   },
// });

// export const { setUploadModal, setSelectedFiles } = ModalSlice.actions;
// export default ModalSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
type UploadType = "image" | "pdf";

interface UploadModalState {
  open: boolean;
  type: UploadType;
}

interface ModalState {
  isUploadModal: UploadModalState;
  selectedFiles: string[];
}

/* ---------------------------------- */
/* Initial State */
/* ---------------------------------- */
const initialState: ModalState = {
  isUploadModal: {
    open: false,
    type: "image",
  },
  selectedFiles: [],
};

/* ---------------------------------- */
/* Slice */
/* ---------------------------------- */
const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    /* Open / Close Upload Modal */
    setUploadModal: (state, action: PayloadAction<UploadModalState>) => {
      state.isUploadModal = action.payload;
    },

    /* TEMP selected files from upload modal */
    setSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.selectedFiles = action.payload;
    },

    /* Clear selection after consuming */
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */
export const { setUploadModal, setSelectedFiles, clearSelectedFiles } = ModalSlice.actions;

export default ModalSlice.reducer;
