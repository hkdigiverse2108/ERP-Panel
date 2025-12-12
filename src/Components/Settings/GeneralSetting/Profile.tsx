import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { CommonSelect, CommonSwitch } from "../../../Attribute";
import { ImagePath } from "../../../Constants";
import { CommonCard } from "../../Common";
import { useAppDispatch } from "../../../Store/hooks";
import { setUploadModal } from "../../../Store/Slices/ModalSlice";

const Profile = () => {
  const [value, setValue] = useState<string[]>([]);
    const dispatch = useAppDispatch();
  
  const BasicDetails = [
    { label: "Accounting Type", value: "Centralized" },
    { label: "Name", value: "Bakery" },
    { label: "Display Name", value: "Bakery" },
    { label: "Contact Name", value: "Bakery" },
    { label: "Owner No", value: "1234567890" },
    { label: "Support Email", value: "Bakery" },
    { label: "Email", value: "Bakery" },
    { label: "Mobile No.", value: "Bakery" },
    { label: "Customer Care No.", value: "1234567890" },
  ];
  const CommunicationDetails = [
    { label: "Address", value: "Centralized" },
    { label: "City", value: "Bakery" },
    { label: "State", value: "Bakery" },
    { label: "Country", value: "Bakery" },
    { label: "Pin Code", value: "1234567890" },
    { label: "Timezone", value: "Bakery" },
    { label: "Web Site", value: "Bakery" },
  ];
  const BankDetails = [
    { label: "Bank Name", value: "Centralized" },
    { label: "Bank IFSC", value: "Bakery" },
    { label: "UPI", value: "Bakery" },
    { label: "Branch Name", value: "Bakery" },
    { label: "Account Holder Name", value: "1234567890" },
    { label: "Bank Account No.", value: "Bakery" },
  ];
  const AdditionalDetails = [
    { label: "User Name", value: "Centralized" },
    { label: "PAN No.", value: "Bakery" },
    { label: "GST Registration Type", value: "Bakery" },
    { label: "GSTIN", value: "Bakery" },
    { label: "Financial Month Interval", value: "1234567890" },
    { label: "Default Financial Year", value: "Bakery" },
  ];
  const OtherDetails = [
    { label: "CIN No.", value: "Centralized" },
    { label: "LUT No.", value: "Bakery" },
    { label: "TAN No.", value: "Bakery" },
    { label: "IEC No.", value: "Bakery" },
    { label: "Outlet Size (sq.ft.)", value: "1234567890" },
  ];

  const gstOptions = [
    { label: "ALL", value: "all" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ];

  const [enabled, setEnabled] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid size={12} className="p-5 border border-gray-200 rounded-lg dark:border-gray-800">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={`${ImagePath}user/1.jpg`} alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">Musharof Chowdhury</h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Manager</p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arizona, United States</p>
              </div>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
            </svg>
            Edit
          </button>
        </div>
      </Grid>
      <CommonCard title="Basic Details" grid={{ xs: 12 }}>
        <Grid sx={{ p: 2 }} container spacing={2}>
          {BasicDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 3 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Communication Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2}>
          {CommunicationDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Bank Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2}>
          {BankDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Additional Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2}>
          {AdditionalDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="Other Details" grid={{ xs: 12, lg: 6 }}>
        <Grid sx={{ p: 2 }} container spacing={2}>
          {OtherDetails.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
            </Grid>
          ))}
        </Grid>
      </CommonCard>
      <CommonCard title="logo" grid={{ xs: 12 }}> 
        <Grid container className="p-4">
          <Grid size={3}>
            <Box onClick={() => dispatch(setUploadModal({open: true, type: "image"}))} className={`flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden`} sx={{ width: 150, height: 150 }}>
              <img src={`${ImagePath}user/1.jpg`} alt={"alt"} className="object-cover w-full h-full rounded-md" />
            </Box>
          </Grid>
          <Grid size={3}>
            <Box onClick={() => dispatch(setUploadModal({open: true, type: "pdf"}))} className={`flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden`} sx={{ width: 150, height: 150 }}>
              <img src={`${ImagePath}user/1.jpg`} alt={"alt"} className="object-cover w-full h-full rounded-md" />
            </Box>
          </Grid>
          <Grid size={3}>
            <Box className={`flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden`} sx={{ width: 150, height: 150 }}>
              <img src={`${ImagePath}user/1.jpg`} alt={"alt"} className="object-cover w-full h-full rounded-md" />
            </Box>
          </Grid>
          <Grid size={3}>
            <Box className={`flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden`} sx={{ width: 150, height: 150 }}>
              <img src={`${ImagePath}user/1.jpg`} alt={"alt"} className="object-cover w-full h-full rounded-md" />
            </Box>
          </Grid>
        </Grid>
      </CommonCard>
      <Grid size={6}>
        <CommonSwitch name="notifications" label="Enable Feedback Module" required value={enabled} onChange={(val) => setEnabled(val)} />
        <CommonSwitch name="notifications" label="Allow RoundOff" required value={enabled} onChange={(val) => setEnabled(val)} />
        <CommonSelect label="Select Location" options={gstOptions} value={value} onChange={(v) => setValue(v)} limitTags={1} />
      </Grid>
    </Grid>
  );
};

export default Profile;
