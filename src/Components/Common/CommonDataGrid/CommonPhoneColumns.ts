import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppGridColDef, PhoneNumberType } from "../../../Types";

const CommonPhoneColumns = <T extends GridValidRowModel>(field: keyof T, headerName: string, width: number = 150): AppGridColDef<T> => ({
  field: field as string,
  headerName,
  width,

  renderCell: (params) => {
    const phone = params.row?.[field] as PhoneNumberType | undefined;
    return phone ? `${phone.countryCode} ${phone.phoneNo}` : "-";
  },

  exportFormatter: (value) => {
    const phone = value as PhoneNumberType | null;
    return phone ? `${phone.countryCode} ${phone.phoneNo}` : "-";
  },
});

export default CommonPhoneColumns;
