import { AccountTree, AddCircle, BarChart, CorporateFare, Payment, Person, ReceiptLong, Settings, Tag } from "@mui/icons-material";
import { Box, Grid, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState, type SyntheticEvent } from "react";
import { useLocation } from "react-router-dom";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { CompanyProfile, Profile, ReportFormats, Taxes, UserRoles } from "../../../Components/Settings/GeneralSetting";
import AdditionalCharges from "../../../Components/Settings/GeneralSetting/AdditionalCharges";
import ConsumptionType from "../../../Components/Settings/GeneralSetting/ConsumptionType";
import PaymentTerms from "../../../Components/Settings/GeneralSetting/PaymentTerms";
import Prefix from "../../../Components/Settings/GeneralSetting/Prefix";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { usePagePermission } from "../../../Utils/Hooks";

const GeneralSetting = () => {
  const location = useLocation();
  const [value, setValue] = useState<number>(() => (typeof location.state === "number" ? location.state : 0));

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);
  const TaxPermission = usePagePermission(PAGE_TITLE.SETTINGS.TAX.BASE);
  const RolesPermission = usePagePermission(PAGE_TITLE.ROLES.BASE);
  const AdditionalChargesPermission = usePagePermission(PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE);
  const PrefixPermission = usePagePermission(PAGE_TITLE.SETTINGS.PREFIX.BASE);
  const PaymentTermsPermission = usePagePermission(PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE);
  const ConsumptionTypePermission = usePagePermission(PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE);
  const ReportFormatsPermission = usePagePermission(PAGE_TITLE.SETTINGS.REPORT_FORMATS.BASE);

  const generalSettingTabs = [
    {
      label: "User Profile",
      value: 0,
      icon: <Person />,
    }, //
    { label: "Company Profile", value: 1, icon: <CorporateFare /> },
    ...(TaxPermission.view ? [{ label: PAGE_TITLE.SETTINGS.TAX.TITLE, value: 2, icon: <ReceiptLong /> }] : []),
    ...(ReportFormatsPermission.view ? [{ label: PAGE_TITLE.SETTINGS.REPORT_FORMATS.BASE, value: 3, icon: <Settings /> }] : []),
    ...(RolesPermission.view ? [{ label: PAGE_TITLE.ROLES.TITLE, value: 4, icon: <AccountTree /> }] : []),
    ...(PrefixPermission.view ? [{ label: PAGE_TITLE.SETTINGS.PREFIX.BASE, value: 5, icon: <Tag /> }] : []),
    ...(PaymentTermsPermission.view ? [{ label: PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE, value: 6, icon: <Payment /> }] : []),
    ...(AdditionalChargesPermission.view ? [{ label: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE, value: 7, icon: <AddCircle /> }] : []),
    ...(ConsumptionTypePermission.view ? [{ label: PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE, value: 8, icon: <BarChart /> }] : []),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.GENERAL} maxItems={1} breadcrumbs={BREADCRUMBS.GENERAL_SETTING.BASE} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, lg: 3, xl: 2 }}>
            <Box className="rounded-lg py-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
              <Tabs orientation={"vertical"} variant="scrollable" value={value} onChange={handleChange}>
                {generalSettingTabs.map((tab, index) => (
                  <Tab key={index} icon={tab.icon} label={tab.label} value={tab.value} iconPosition="start" className="capitalize" />
                ))}
              </Tabs>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9, xl: 10 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
            {value === 0 && <Profile />}
            {value === 1 && <CompanyProfile />}
            {value === 2 && TaxPermission.view && <Taxes />}
            {value === 3 && ReportFormatsPermission.view && <ReportFormats />}
            {value === 4 && RolesPermission.view && <UserRoles />}
            {value === 5 && PrefixPermission.view && <Prefix />}
            {value === 6 && PaymentTermsPermission.view && <PaymentTerms />}
            {value === 7 && AdditionalChargesPermission.view && <AdditionalCharges />}
            {value === 8 && ConsumptionTypePermission.view && <ConsumptionType />}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default GeneralSetting;
