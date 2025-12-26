import { CommonCard } from "../../../Common";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ImagePath, ROUTES } from "../../../../Constants";
import { useAppSelector } from "../../../../Store/hooks";
import { CommonSwitch } from "../../../../Attribute";
import EditIcon from "@mui/icons-material/Edit";
import CommonImageBox from "../../../Common/CommonUploadImage/CommonImageBox";

// type CompanyDetailsProps = {
//   handleDeleteImage: () => void;
//   menuAnchor: HTMLElement | null;
//   setMenuAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
//   menuIndex: any;
//   setMenuIndex: React.Dispatch<React.SetStateAction<any>>;
// };

// const BasicDetails = [
//   { label: "Accounting Type", value: "Centralized" },
//   { label: "Name", value: "Bakery" },
//   { label: "Display Name", value: "Bakery" },
//   { label: "Contact Name", value: "Bakery" },
//   { label: "Owner No", value: "1234567890" },
//   { label: "Support Email", value: "Bakery" },
//   { label: "Email", value: "Bakery" },
//   { label: "Mobile No.", value: "Bakery" },
//   { label: "Customer Care No.", value: "1234567890" },
// ];
// const CommunicationDetails = [
//   { label: "Address", value: "Centralized" },
//   { label: "City", value: "Bakery" },
//   { label: "State", value: "Bakery" },
//   { label: "Country", value: "Bakery" },
//   { label: "Pin Code", value: "1234567890" },
//   { label: "Timezone", value: "Bakery" },
//   { label: "Web Site", value: "Bakery" },
// ];
// const BankDetails = [
//   { label: "Bank Name", value: "Centralized" },
//   { label: "Bank IFSC", value: "Bakery" },
//   { label: "UPI", value: "Bakery" },
//   { label: "Branch Name", value: "Bakery" },
//   { label: "Account Holder Name", value: "1234567890" },
//   { label: "Bank Account No.", value: "Bakery" },
// ];
// const AdditionalDetails = [
//   { label: "User Name", value: "Centralized" },
//   { label: "PAN No.", value: "Bakery" },
//   { label: "GST Registration Type", value: "Bakery" },
//   { label: "GSTIN", value: "Bakery" },
//   { label: "Financial Month Interval", value: "1234567890" },
//   { label: "Default Financial Year", value: "Bakery" },
// ];
// const OtherDetails = [
//   { label: "CIN No.", value: "Centralized" },
//   { label: "LUT No.", value: "Bakery" },
//   { label: "TAN No.", value: "Bakery" },
//   { label: "IEC No.", value: "Bakery" },
//   { label: "Outlet Size (sq.ft.)", value: "1234567890" },
// ];

// const gstOptions = [
//   { label: "ALL", value: "all" },
//   { label: "Online", value: "online" },
//   { label: "Offline", value: "offline" },
// ];

const CompanyDetails = () => {
  const { company = {} } = useAppSelector((state) => state.company);

  const navigate = useNavigate();

  const BasicDetails = [
    // { label: "Accounting Type", value: "Centralized" },
    { label: "Name", value: company?.name },
    { label: "Display Name", value: company?.displayName },
    { label: "Contact Name", value: company?.contactName },
    { label: "Owner No", value: company?.ownerNo },
    { label: "Support Email", value: company?.supportEmail },
    { label: "Email", value: company?.email },
    { label: "Mobile No.", value: company?.phoneNumber },
    { label: "Customer Care No.", value: company?.customerCareNumber },
  ];

  const CommunicationDetails = [
    { label: "Address", value: company?.address },
    { label: "City", value: company?.city },
    { label: "State", value: company?.state },
    { label: "Country", value: company?.country },
    { label: "Pin Code", value: company?.pinCode },
    { label: "Timezone", value: company?.timeZone },
    { label: "Web Site", value: company?.webSite },
  ];

  const BankDetails = [
    { label: "Bank Name", value: company?.bankName },
    { label: "Bank IFSC", value: company?.bankIFSC },
    { label: "UPI", value: company?.upiId },
    { label: "Branch Name", value: company?.branch },
    { label: "Account Holder Name", value: company?.accountHolderName },
    { label: "Bank Account No.", value: company?.bankAccountNumber },
  ];
  const AdditionalDetails = [
    { label: "User Name", value: company?.userName },
    { label: "PAN No.", value: company?.PanNo },
    { label: "GST Registration Type", value: company?.GSTRegistrationType },
    { label: "GSTIN", value: company?.GSTIdentificationNumber },
    { label: "Financial Month Interval", value: company?.financialMonthInterval },
    { label: "Default Financial Year", value: company?.defaultFinancialYear },
  ];

  const OtherDetails = [
    { label: "CIN No.", value: company?.corporateIdentificationNumber },
    { label: "LUT No.", value: company?.letterOfUndertaking },
    { label: "TAN No.", value: company?.taxDeductionAndCollectionAccountNumber },
    { label: "IEC No.", value: company?.importerExporterCode },
    { label: "Outlet Size (sq.ft.)", value: company?.outletSize },
  ];
  const ImageItems = [
    {
      label: "Logo",
      src: company?.logo,
      alt: "Logo",
    },
    {
      label: "Watermark",
      src: company?.waterMark,
      alt: "waterMark",
    },
    {
      label: "Report Formats Logo",
      src: company?.reportFormatLogo,
      alt: "reportFormatLogo",
    },
    {
      label: "Authorised Signature",
      src: company?.authorizedSignature,
      alt: "authorizedSignature",
    },
  ];

  return (
    <>
      <CommonCard title="Basic Details" grid={{ xs: 12 }}>
        <Grid sx={{ p: 2 }} container spacing={2} className=" overflow-auto">
          {BasicDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 3 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Communication Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2} className=" overflow-auto">
          {CommunicationDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Bank Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2} className=" overflow-auto">
          {BankDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Additional Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2} className=" overflow-auto">
          {AdditionalDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Other Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2} className=" overflow-auto">
          {OtherDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>

      <CommonCard title="logo" grid={{ xs: 12, xl: 6 }}>
        <Grid container spacing={2} className="p-4 overflow-auto ">
          {ImageItems.map((item, index) => (
            <CommonImageBox key={index} url={item.src || `${ImagePath}user/1.jpg`} label={item.label} type={"image"} />
          ))}
        </Grid>
      </CommonCard>

      <Grid size={6}>
        <CommonSwitch name="allowRoundOff" label="Allow RoundOff" value={company?.allowRoundOff === "true" || false} />
        <CommonSwitch name="enableFeedbackModule" label="Enable Feedback Module" value={company?.enableFeedbackModule === "true" || false} />
      </Grid>
      <Box className="flex justify-end w-full">
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(ROUTES.COMPANY.EDIT)}>
          Edit Company
        </Button>
      </Box>
    </>
  );
};

export default CompanyDetails;
