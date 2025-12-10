import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, Tabs } from "@mui/material";
import { Form, Formik } from "formik";
import { CommonTextField } from "../../../Attribute";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { GeneralSettingBreadcrumbs } from "../../../Data";
import Tab from "@mui/material/Tab";
import { useState, type SyntheticEvent } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TagIcon from "@mui/icons-material/Tag";
import PaymentIcon from "@mui/icons-material/Payment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import DevicesIcon from "@mui/icons-material/Devices";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LanIcon from "@mui/icons-material/Lan";

const GeneralSetting = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.GENERAL} maxItems={1} breadcrumbs={GeneralSettingBreadcrumbs} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12,md:3,lg: 3, xl: 2 }} className="rounded-lg py-4 bg-white dark:bg-gray-dark!">
            <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
              <Tab icon={<PersonIcon />} label="Profile" value={0} iconPosition="start" />
              <Tab icon={<ReceiptLongIcon />} label="Texes" value={1} iconPosition="start" />
              <Tab icon={<SettingsIcon />} label="Report Formats" value={2} iconPosition="start" />
              <Tab icon={<AccountTreeIcon />} label="User Roles" value={3} iconPosition="start" />
              <Tab icon={<TagIcon />} label="Prefix" value={4} iconPosition="start" />
              <Tab icon={<PaymentIcon />} label="Payment Terms" value={5} iconPosition="start" />
              <Tab icon={<AddCircleIcon />} label="Additional Charges" value={6} iconPosition="start" />
              <Tab icon={<BarChartIcon />} label="Consumption Type" value={7} iconPosition="start" />
              <Tab icon={<DevicesIcon />} label="Hardware" value={8} iconPosition="start" />
              <Tab icon={<ManageAccountsIcon />} label="Manage Account" value={9} iconPosition="start" />
              <Tab icon={<LanIcon />} label="MAC Binding Master" value={10} iconPosition="start" />
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12,md:9,lg:9, xl: 10 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark!">
            <Box className={`${value === 0 ? "block" : "hidden"}`}>
              <Formik initialValues={{ name: "", password: "", search: "", username: "" }} onSubmit={(values) => console.log(values)}>
                <Form>
                  <Grid container spacing={2}>
                    <CommonTextField name="name" label="Full Name" placeholder="John Doe" required grid={{ xs: 12, sm: 6 }} />
                    <CommonTextField name="password" label="password" type="password" required showPasswordToggle grid={{ xs: 12, sm: 6 }} />
                    <CommonTextField name="search" label="Search" clearable endIcon={<SearchIcon />} grid={{ xs: 12, sm: 6 }} />
                    <CommonTextField name="username" label="Username" validating={false} grid={{ xs: 12, sm: 6 }} />
                  </Grid>
                </Form>
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default GeneralSetting;
