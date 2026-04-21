import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../Constants";
import { Storage } from "../../Utils";

const StoredUser = JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");
// branchId may be a populated object { _id, isHeadBranch, ... } or a plain string
const defaultBranchId = StoredUser?.branchId?._id ?? StoredUser?.branchId ?? null;

const initialState = {
  branchFilter: defaultBranchId ? [String(defaultBranchId)] : ["all"],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setBranchFilter: (state, action) => {
      state.branchFilter = action.payload;
    },
  },
});

export const { setBranchFilter } = dashboardSlice.actions;
export default dashboardSlice.reducer;
