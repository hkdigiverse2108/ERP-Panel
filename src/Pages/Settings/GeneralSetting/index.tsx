import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import DevicesIcon from "@mui/icons-material/Devices";
import LanIcon from "@mui/icons-material/Lan";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import TagIcon from "@mui/icons-material/Tag";
import { Box, Grid, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState, type SyntheticEvent } from "react";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { Profile } from "../../../Components/Settings/GeneralSetting";
import { PAGE_TITLE } from "../../../Constants";
import { GeneralSettingBreadcrumbs } from "../../../Data";

const GeneralSetting = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);
  const generalSettingTabs = [
    { label: "Profile", value: 0, icon: <PersonIcon /> },
    { label: "Taxes", value: 1, icon: <ReceiptLongIcon /> },
    { label: "Report Formats", value: 2, icon: <SettingsIcon /> },
    { label: "User Roles", value: 3, icon: <AccountTreeIcon /> },
    { label: "Prefix", value: 4, icon: <TagIcon /> },
    { label: "Payment Terms", value: 5, icon: <PaymentIcon /> },
    { label: "Additional Charges", value: 6, icon: <AddCircleIcon /> },
    { label: "Consumption Type", value: 7, icon: <BarChartIcon /> },
    { label: "Hardware", value: 8, icon: <DevicesIcon /> },
    { label: "Manage Account", value: 9, icon: <ManageAccountsIcon /> },
    { label: "MAC Binding Master", value: 10, icon: <LanIcon /> },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.GENERAL} maxItems={1} breadcrumbs={GeneralSettingBreadcrumbs} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, lg: 3, xl: 2 }} className="rounded-lg py-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
            <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
              {generalSettingTabs.map((tab, index) => (
                <Tab key={index} icon={tab.icon} label={tab.label} value={tab.value} iconPosition="start" />
              ))}
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9, xl: 10 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
            <Box className={`${value === 0 ? "block" : "hidden"}`}>
              <Profile />
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default GeneralSetting;
