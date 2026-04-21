import dayjs from "dayjs";
import { STORAGE_KEYS } from "../Constants";
import { Storage } from "./index";

export const getCompanyDateFormat = () => {
  const StoredCompany = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");
  return StoredCompany?.printDateFormat || "DD/MM/YYYY";
};

export const FormatDate = (dateInput: any | Date): string => {
  const format = getCompanyDateFormat();

  return dateInput && dayjs(dateInput).isValid() ? dayjs(dateInput).format(format) : "-";
};

export const FormatTime = (dateInput: any | Date): string => {
  return dayjs(dateInput).isValid() ? dayjs(dateInput).format("hh:mm A") : "";
};

export const FormatDateTime = (dateInput: any | Date): string => {
  const format = getCompanyDateFormat();

  return dayjs(dateInput).isValid() ? dayjs(dateInput).format(`${format} hh:mm A`) : "";
};

export const FormatValidity = (_v: any, row: any): string => {
  const start = row?.startDateTime || row?.startDate || row?.campaignLaunchDate;
  const end = row?.endDateTime || row?.endDate || row?.campaignExpiryDate;
  const hasEnd = row?.hasEndDate !== undefined ? row?.hasEndDate : !!end;

  const formattedStart = FormatDate(start);
  const formattedEnd = hasEnd ? FormatDate(end) : "No End Date";

  return `${formattedStart || "N/A"} - ${formattedEnd || "No End Date"}`;
};
