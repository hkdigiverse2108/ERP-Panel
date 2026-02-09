import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface PayLaterFormValues {
  customerId?: string;
  posOrderId?: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: number;
  dueDate?: string;
  note?: string;
  sendReminder?: boolean;
}

export type AddPayLaterPayload = PayLaterFormValues;

export type EditPayLaterPayload = AddPayLaterPayload & { payLaterId?: string };

export interface PayLaterBase extends Omit<PayLaterFormValues, "parentId">, CommonDataType {
  parentId?: PayLaterBase;
}

export interface PayLaterDataResponse extends PageStatus {
  PayLater_data: PayLaterBase[];
}

export interface PayLaterApiResponse extends MessageStatus {
  data: PayLaterDataResponse;
}