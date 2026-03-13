import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CompanyDriveFormValues {
  documentName?: string;
  documentUrl?: string;
  remark?: string;
  isActive?: boolean;
}

export type AddCompanyDrivePayload = CompanyDriveFormValues;

export type EditCompanyDrivePayload = AddCompanyDrivePayload & {documentId?: string;};

export type CompanyDrive = CompanyDriveFormValues & CommonDataType;

export type CompanyDriveDataResponse = PageStatus& {companyDrive_data: CompanyDrive[];}

export type CompanyDriveApiResponse = MessageStatus & {data: CompanyDriveDataResponse;}
