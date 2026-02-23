import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface CashControlFormValues {
  type?: string;
  amount?: number | string;
  remark?: string;
}

export type AddCashControlPayload = CashControlFormValues;

export type EditCashControlPayload = AddCashControlPayload & { cashControlId?: string };

export interface CashControlBase extends CashControlFormValues, CommonDataType {
  isActive: boolean;
  companyId: CompanyBase;
  registerId: {
    _id: string;
    isDeleted: boolean;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    companyId: string;
    openingCash: number;
    cashPayment: number;
    chequePayment: number;
    cardPayment: number;
    bankPayment: number;
    upiPayment: number;
    salesReturn: number;
    cashRefund: number;
    bankRefund: number;
    creditAdvanceRedeemed: number;
    payLater: number;
    expense: number;
    purchasePayment: number;
    totalSales: number;
    bankTransferAmount: number;
    cashFlow: number;
    status: string;
    denominations: {
      currency: number;
      count: number;
      amount: number;
    }[];
    createdAt: string;
    updatedAt: string;
    closingNote: string;
    physicalDrawerCash: number;
    totalCashLeftInDrawer: number;
    totalDenominationAmount: number;
  };
}

export interface CashControlDataResponse extends PageStatus {
  cashControl_data: CashControlBase[];
  totalAmount: number;
}

export interface CashControlApiResponse extends MessageStatus {
  data: CashControlDataResponse;
}

export interface CashControlApiResponse extends MessageStatus {
  data: CashControlDataResponse;
}
