import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { EmployeeBase } from "./Employee";

export interface Denomination {
  currency?: number;
  count?: number;
  amount?: number;
}

export interface PosCashRegisterFormInitialValues {
  bankAccountId: string;
  bankTransferAmount: number;
  cashFlow: number;
  totalCashInDrawer: number;
  physicalDrawerCash: number;
  closingNote: string;
  denominations: Record<number, string>;
  status: string;
}

export interface PosCashRegisterValues extends Omit<PosCashRegisterFormInitialValues, "denominations"> {
  isActive?: boolean;
  openingCash?: number;
  cashPayment?: number;
  chequePayment?: number;
  cardPayment?: number;
  bankPayment?: number;
  upiPayment?: number;
  walletPayment?: number;
  salesReturn?: number;
  cashRefund?: number;
  bankRefund?: number;
  creditAdvanceRedeemed?: number;
  payLater?: number;
  expense?: number;
  purchasePayment?: number;
  totalSales?: number;
  denominations?: Denomination[];
  totalDenominationAmount?: number;
  user?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  numberOfBills?: number;
  numberOfItems?: number;
  discount?: number;
  taxAmount?: number;
  refund?: number;
  paymentsReceived?: number;
  profit?: number;
  salesManId?: string;
}

export type AddPosCashRegisterPayload = Pick<PosCashRegisterValues, "openingCash">;

export interface EditPosCashRegisterPayload {
  posCashRegisterId?: string;
  bankAccountId?: string;
  bankTransferAmount?: number;
  cashFlow?: number;
  totalCashInDrawer?: number;
  physicalDrawerCash?: number;
  closingNote?: string;
  denominations?: Denomination[];
  status?: string;
}

export interface PosCashRegisterBase extends Omit<PosCashRegisterValues,"salesManId">, CommonDataType {
  companyId: CompanyBase;
  salesManId?: EmployeeBase;
}

export interface PosCashRegisterDataResponse extends PageStatus {
  posCashRegister_data: PosCashRegisterBase[];
}

export interface PosCashRegisterApiResponse extends MessageStatus {
  data: PosCashRegisterDataResponse;
}

export interface PosCashRegisterDropdownApiResponse extends MessageStatus {
  data: PosCashRegisterBase[];
}

export interface PosCashRegisterDetailsDataResponse {
  registerId: string;
  registerNo: string;
  status: string;
  createdAt: string;
  summary: PosCashRegisterBase;
}

export interface PosCashRegisterDetailsApiResponse extends MessageStatus {
  data: PosCashRegisterDetailsDataResponse;
}
