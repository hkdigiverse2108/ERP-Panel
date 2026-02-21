import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image", multiple: false },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isCustomerModal: { open: false, data: null },
  isContactModal: { open: false, data: null },
  isPaymentListModal: false,
  isAddPaymentModal: false,
  isRedeemLoyaltyModal: false,
  isCreditNoteModal: false,
  isOrderModal: false,
  isCashControlModal: false,
  isRedeemCreditModal: false,
  isCardModal: false,
  isApplyCouponModal: false,
  isPayLaterModal: { open: false, data: [] },
  isCashModal: false,
  isAdditionalChargeModal: { open: false, data: null },
  isProductDetailsModal: { open: false, data: null },
  isQtyCountModal: { open: false, data: null },
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
    setContactModal: (state, action) => {
      state.isContactModal = action.payload;
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
    setAddPaymentModal: (state) => {
      state.isAddPaymentModal = !state.isAddPaymentModal;
    },
    setRedeemLoyaltyModal: (state) => {
      state.isRedeemLoyaltyModal = !state.isRedeemLoyaltyModal;
    },
    setCreditNoteModal: (state) => {
      state.isCreditNoteModal = !state.isCreditNoteModal;
    },
    setOrderModal: (state) => {
      state.isOrderModal = !state.isOrderModal;
    },
    setCashControlModal: (state) => {
      state.isCashControlModal = !state.isCashControlModal;
    },
    setRedeemCreditModal: (state) => {
      state.isRedeemCreditModal = !state.isRedeemCreditModal;
    },
    setCardModal: (state) => {
      state.isCardModal = !state.isCardModal;
    },
    setApplyCouponModal: (state) => {
      state.isApplyCouponModal = !state.isApplyCouponModal;
    },
    setPayLaterModal: (state, action) => {
      state.isPayLaterModal = action.payload;
    },
    setCashModal: (state) => {
      state.isCashModal = !state.isCashModal;
    },
    setAdditionalChargeModal: (state, action) => {
      state.isAdditionalChargeModal = action.payload;
    },
    setProductDetailsModal: (state, action) => {
      state.isProductDetailsModal = action.payload;
    },
    setQtyCountModal: (state, action) => {
      state.isQtyCountModal = action.payload;
    },
  },
});

export const { setQtyCountModal, setProductDetailsModal, setAdditionalChargeModal, setCashModal, setPayLaterModal, setApplyCouponModal, setUploadModal, setSelectedFiles, clearSelectedFiles, setModalVideoPlay, setCustomerModal, setPaymentListModal, setAddPaymentModal, setRedeemLoyaltyModal, setCreditNoteModal, setOrderModal, setCashControlModal, setRedeemCreditModal, setCardModal, setContactModal } = ModalSlice.actions;

export default ModalSlice.reducer;
