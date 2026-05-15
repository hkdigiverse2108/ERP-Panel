import type { CommonDataType, MessageStatus } from "./Common";

export interface ReportFormat {
  name: string;
  isSelected: boolean;
  isActive: boolean;
  _id: string;
}

export interface ReportFormatFormValues {
  type?: string;
  formats?: ReportFormat[] | null;
  isActive?: boolean;
  _submitAction?: string;
}

export interface ReportFormatBase extends ReportFormatFormValues, CommonDataType {}

export interface ReportFormatApiResponse extends MessageStatus {
  data: ReportFormatBase[];
}
