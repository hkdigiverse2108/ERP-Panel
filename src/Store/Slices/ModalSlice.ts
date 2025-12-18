import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UploadType = "image" | "pdf";

interface UploadModalState {
  open: boolean;
  type: UploadType;
}

interface ModalState {
  isUploadModal: UploadModalState;
  selectedFiles: string[];
}

const initialState: ModalState = {
  isUploadModal: {
    open: false,
    type: "image",
  },
  selectedFiles: [],
};

const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setUploadModal: (state, action: PayloadAction<UploadModalState>) => {
      state.isUploadModal = action.payload;
    },

    setSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.selectedFiles = action.payload;
    },

    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
  },
});

export const { setUploadModal, setSelectedFiles, clearSelectedFiles } = ModalSlice.actions;

export default ModalSlice.reducer;
