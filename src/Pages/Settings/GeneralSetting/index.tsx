import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import DevicesIcon from "@mui/icons-material/Devices";
import LanIcon from "@mui/icons-material/Lan";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import TagIcon from "@mui/icons-material/Tag";
import { Box, Grid, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { Form, Formik } from "formik";
import { useState, type SyntheticEvent } from "react";
import { CommonTextField } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { GeneralSettingBreadcrumbs } from "../../../Data";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Constants/Routes";
import { Profile, ReportFormats } from "../../../Components/Settings/GeneralSetting";

const GeneralSetting = () => {
  
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

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

  // Map tab index → component
  const tabViews = [<Profile />, <Profile />, <ReportFormats />, <Profile />, <Profile />, <Profile />, <Profile />, <Profile />, <Profile />, <Profile />, <Profile />];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.GENERAL} maxItems={1} breadcrumbs={GeneralSettingBreadcrumbs} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, lg: 3, xl: 2 }}>
            <Box className="rounded-lg py-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
              <Tabs orientation={"vertical"} variant="scrollable" value={value} onChange={handleChange}>
                {generalSettingTabs.map((tab, index) => (
                  <Tab key={index} icon={tab.icon} label={tab.label} value={tab.value} iconPosition="start" className="" />
                ))}
              </Tabs>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9, xl: 10 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
            {tabViews[value]}
            {/* <Box className={`${value === 0 ? "block" : "hidden"}`}>
              <Profile />
            </Box>
            <Box className={`${value === 1 ? "block" : "hidden"}`}>
              <CommonCard title="Customers Report" grid={{ xs: 12 }}>
                <Formik initialValues={{ name: "", password: "", search: "", username: "" }} onSubmit={(values) => console.log(values)}>
                  <Form>
                    <Grid sx={{ p: 2 }} container spacing={2}>
                      <CommonTextField name="name" label="Full Name" placeholder="John Doe" required grid={{ xs: 12, sm: 6 }} />
                      <CommonTextField name="password" label="password" type="password" required showPasswordToggle grid={{ xs: 12, sm: 6 }} />
                      <CommonTextField name="searc" label="Search" clearable endIcon={<SearchIcon />} grid={{ xs: 12, sm: 6 }} />
                      <CommonTextField name="usernam" label="Username" validating={false} grid={{ xs: 12, sm: 6 }} />
                    </Grid>
                  </Form>
                </Formik>
              </CommonCard>
            </Box>
            <Box className={`${value === 2 ? "block" : "hidden"}`}>
              <ReportFormats />
            </Box> */}
            {value === 0 && (
              <Box className="flex justify-end mt-6">
                <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(ROUTES.COMPANY.EDIT)}>
                  Edit Company
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default GeneralSetting;
