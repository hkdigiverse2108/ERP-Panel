import type { CommonDataType, MessageStatus } from "./Common";

export interface MessengerConfig {
  _id?: string;
  companyId?: string;
  branchId?: string;
  pageId: string;
  pageAccessToken: string;
  appSecret: string;
  verifyToken: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface MessengerTemplateVariable {
  paramName: string;
  exampleValue: string;
}

export interface MessengerTemplateButton {
  type: "quick_reply" | "url" | "phone_number";
  text: string;
  url?: string;
  phoneNumber?: string;
  payload?: string;
}

export interface MessengerTemplate extends CommonDataType {
  name: string;
  metaTemplateId?: string;
  category: "UTILITY" | "MARKETING";
  language: string;
  parameterFormat: "NAMED" | "POSITIONAL";
  header: {
    format: "NONE" | "TEXT" | "IMAGE";
    text?: string;
    imageHandle?: string;
  };
  bodyText: string;
  variables: MessengerTemplateVariable[];
  buttons: MessengerTemplateButton[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
  rejectionReason?: string;
}

export interface MessengerLog extends CommonDataType {
  contactId: string;
  templateId: string;
  triggerEvent: "POS_ORDER_CREATED" | "INVOICE_CREATED" | "DELIVERY_CHALLAN_CREATED" | "MANUAL";
  referenceType?: string;
  referenceId?: string;
  payloadSent: Record<string, any>;
  status: "QUEUED" | "SENT" | "FAILED" | "DELIVERED" | "READ";
  metaMessageId?: string;
  errorReason?: string;
  sentAt?: string;
}

export interface MessengerConfigApiResponse extends MessageStatus {
  data: MessengerConfig;
}

export interface MessengerTemplateApiResponse extends MessageStatus {
  data: { template_data: MessengerTemplate[]; totalData: number; state: any };
}

export interface MessengerLogApiResponse extends MessageStatus {
  data: { log_data: MessengerLog[]; totalData: number; state: any };
}

export interface SaveMessengerConfigPayload {
  pageId: string;
  pageAccessToken: string;
  appSecret: string;
  verifyToken: string;
  branchId?: string;
  companyId?: string;
}

export interface CreateMessengerTemplatePayload {
  name: string;
  language: string;
  header?: { format: string; text?: string; imageHandle?: string };
  bodyText: string;
  variables?: MessengerTemplateVariable[];
  buttons?: MessengerTemplateButton[];
  branchId?: string;
  companyId?: string;
}

export interface SendMessengerMessagePayload {
  contactId: string;
  templateId: string;
  variableValues?: Record<string, string>;
  referenceType?: string;
  referenceId?: string;
}
