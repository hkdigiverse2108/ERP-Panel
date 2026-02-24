import { createSlice } from "@reduxjs/toolkit";
import { Storage, Stringify } from "../../Utils";
import { STORAGE_KEYS } from "../../Constants";

const StoredCompany = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");

const initialState = {
  company: StoredCompany,
  financialYear: [{ label: "", value: "" }],
  isCompanyLoading: false,
};

const companySlice = createSlice({
  name: "companySlice",
  initialState: initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
      Storage.setItem(STORAGE_KEYS.COMPANY, Stringify(action.payload));
    },
    setFinancialYear: (state, action) => {
      state.financialYear = action.payload;
    },
    setIsCompanyLoading: (state, action) => {
      state.isCompanyLoading = action.payload;
    },
  },
});

export const { setCompany, setFinancialYear, setIsCompanyLoading } = companySlice.actions;
export default companySlice.reducer;
