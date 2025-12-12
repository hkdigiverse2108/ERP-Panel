import React, { useState, type SyntheticEvent } from "react";
import { CommonSelect } from "../../Attribute";
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Tab, Tabs } from "@mui/material";

const gstOptions = [
  { label: "ALL", value: "all" },
  { label: "Thermal", value: "thermal" },
  { label: "A4", value: "a4" },
  { label: "A5", value: "a5" },
];

const ReportFormats = () => {
  const [format, setFormat] = useState<string[]>([]);
  const [tab, setTab] = useState(0);

  const [value, setValue] = useState("");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (_: SyntheticEvent, newValue: number) => setTab(newValue);
  const generalSettingTabs = [
    { label: "POS Offline", value: 0 },
    { label: "POS(B2C)", value: 1 },
    { label: "Sales(B2B)", value: 2 },
    { label: "Material Inward", value: 3 },
    { label: "Order", value: 4 },
    { label: "Bill", value: 5 },
    { label: "Debit Note", value: 6 },
    { label: "Estimate", value: 7 },
    { label: "Delivery Challan", value: 8 },
    { label: "Stock Transfer", value: 9 },
    { label: "Receipt", value: 10 },
  ];

  const tabViews = ["", "", "", "", "", "", "", "", "", "", ""];

  return (
    <Grid container spacing={2}>
      <Grid size={2}>
        <CommonSelect label="Format Type" options={gstOptions} value={format} onChange={(v) => setFormat(v)} limitTags={1} />
      </Grid>
      <Box className=" bg-white dark:bg-gray-dark! border-b border-gray-200 dark:border-gray-800 w-full">
        <Tabs orientation="horizontal" variant="scrollable" value={tab} onChange={handleChange}>
          {generalSettingTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} iconPosition="start" />
          ))}
        </Tabs>
      </Box>
      <Grid size={{ xs: 12, md: 9, lg: 9, xl: 12 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
        {tabViews[tab]}
      </Grid>
      <Grid container spacing={2}>
        <RadioGroup name="formats" value={value} onChange={handleRadioChange} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
              <Box className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
                <FormControlLabel value="best" control={<Radio />} label="The best!" />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
              <Box className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
                <FormControlLabel value="worst" control={<Radio />} label="The worst." />
              </Box>
            </Grid>

            {/* Add more cards here */}
          </Grid>
        </RadioGroup>
      </Grid>
    </Grid>
  );
};

export default ReportFormats;
