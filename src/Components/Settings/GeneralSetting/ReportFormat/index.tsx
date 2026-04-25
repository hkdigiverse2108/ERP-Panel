import React, { useState, type SyntheticEvent } from "react";
// import { CommonSelect } from "../../../../Attribute";
import { Box, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import { CommonModal } from "../../../Common";
import { Queries } from "../../../../Api";
import { Thermal_80mmOfflineData, Thermal_80mmOffline1Data, Thermal_80mm1JasperData, A5_2JasperData } from "../../../ReportFormats/Data";
import { A4_14_1Jasper, A4_14Jasper, A4_1Jasper, A4_2Html, A4_7Jasper, A5_1Jasper, A5_2Jasper, Estimate_A4_1Jasper, Grn_Bill_ThermalJasper, Invoice_A4_1Jasper, Invoice_A4_4html, Invoice_A4EInvoiceJasper, Invoice_A4Jasper, Invoice_A5_1Jasper, Invoice_A5Jasper, Purchase1Jasper, Purchase2Jasper, Purchase3Jasper, PurchaseOrder1Jasper, PurchaseOrder2Jasper, PurchaseOrder3Jasper, PurchaseThermalHtml, Thermal_58mm1Jasper, Thermal_80mm11Jasper, Thermal_80mm17Jasper, Thermal_80mm18Jasper, Thermal_80mm1Jasper, Thermal_80mm2_1Jasper, Thermal_80mm3Jasper, Thermal_80mm4Jasper, Thermal_80mmOffline, thermal_80mmOffline1 } from "../../../ReportFormats";

export interface ISelectOption {
  label: string;
  value: string;
}

// const gstOptions: ISelectOption[] = [
//   { label: "ALL", value: "all" },
//   { label: "Thermal", value: "thermal" },
//   { label: "A4", value: "a4" },
//   { label: "A5", value: "a5" },
// ];

// Temporary fallback component
const FallbackPreview = () => <div className="p-4 w-full h-[500px]! flex items-center justify-center bg-gray-50 dark:bg-gray-dark! border-gray-200 dark:border-gray-800 text-gray-400">Preview Not Available</div>;

// Our static mapping definition
const FORMAT_COMPONENTS_MAP: Record<string, Record<string, any>> = {
  "POS Offline": {
    "thermal_80mm-offline(HTML)": { Component: Thermal_80mmOffline, mockData: Thermal_80mmOfflineData },
    "thermal_80mm-offline-1(HTML)": { Component: thermal_80mmOffline1, mockData: Thermal_80mmOffline1Data },
  },
  "POS(B2C)": {
    "Thermal_80mm-1(jasper)": { Component: Thermal_80mm1Jasper, mockData: Thermal_80mm1JasperData },
    "A5-2(jasper)": { Component: A5_2Jasper, mockData: A5_2JasperData },
    "Thermal_80mm-17(jasper)": { Component: Thermal_80mm17Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-11(jasper)": { Component: Thermal_80mm11Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_58mm-1(jasper)": { Component: Thermal_58mm1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-4(jasper)": { Component: Thermal_80mm4Jasper, mockData: Thermal_80mm1JasperData },
    "A5-1(jasper)": { Component: A5_1Jasper, mockData: Thermal_80mm1JasperData },
    "A4-14-1(jasper)": { Component: A4_14_1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-2-1(jasper)": { Component: Thermal_80mm2_1Jasper, mockData: Thermal_80mm1JasperData },
    "A4-1(jasper)": { Component: A4_1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-3(jasper)": { Component: Thermal_80mm3Jasper, mockData: Thermal_80mm1JasperData },
    "A4-7(jasper)": { Component: A4_7Jasper, mockData: Thermal_80mm1JasperData },
    "A4-2(html)": { Component: A4_2Html, mockData: Thermal_80mm1JasperData },
    "A4-14(jasper)": { Component: A4_14Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-18(jasper)": { Component: Thermal_80mm18Jasper, mockData: Thermal_80mm1JasperData },
  },
  "Sales(B2B)": {
    "invoice-A5(jasper)": { Component: Invoice_A5Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A5-1(jasper)": { Component: Invoice_A5_1Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-4(html)": { Component: Invoice_A4_4html, mockData: Thermal_80mm1JasperData },
    "invoice-A4(jasper)": { Component: Invoice_A4Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-1(jasper)": { Component: Invoice_A4_1Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-einvoice(jasper)": { Component: Invoice_A4EInvoiceJasper, mockData: Thermal_80mm1JasperData },
  },
  Order: {
    "purchase-order-1(jasper)": { Component: PurchaseOrder1Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-order-2(jasper)": { Component: PurchaseOrder2Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-order-3(jasper)": { Component: PurchaseOrder3Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-thermal(html)": { Component: PurchaseThermalHtml, mockData: Thermal_80mm1JasperData },
  },
  Bill: {
    "Purchase-2(jasper)": { Component: Purchase2Jasper, mockData: Thermal_80mm1JasperData },
    "Purchase-1(jasper)": { Component: Purchase1Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-3(jasper)": { Component: Purchase3Jasper, mockData: Thermal_80mm1JasperData },
    "grn_bill_thermal(jasper)": { Component: Grn_Bill_ThermalJasper, mockData: Thermal_80mm1JasperData },
  },
  Estimate: {
    "Estimate_A4-1(jasper)": { Component: Estimate_A4_1Jasper, mockData: Thermal_80mm1JasperData },
  },
};

const ReportFormats = () => {
  // const [format, setFormat] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<{ Component: any; mockData: any } | null>(null);
  const [value, setValue] = useState("");

  const { data: reportFormatData, isLoading: isLoadingReportFormatData } = Queries.useGetReportFormat({ activeFilter: true });

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (_: SyntheticEvent, newValue: number) => setTab(newValue);

  // Dynamic Array Parsing from Backend Response
  const rawApiData: any[] = (Array.isArray(reportFormatData?.data) ? reportFormatData.data : []).map((item) => ({
    ...item,
    type: item.type?.trim() || "",
    formats: (item.formats || []).map((format: any) => ({
      ...format,
      name: format.name?.trim() || "",
    })),
  }));

  const generalSettingTabs = rawApiData.map((item, index) => ({
    label: item.type,
    value: index,
  }));

  const activeTabDetails = rawApiData[tab];

  // Dynamic Items Extraction
  const items = (activeTabDetails?.formats || []).map((formatObj: any) => {
    // formatObj has keys: {name, isSelected, isActive, _id}
    const formatName = formatObj?.name || "";
    const formatConfig = FORMAT_COMPONENTS_MAP[activeTabDetails.type]?.[formatName];
    const Component = formatConfig?.Component || FallbackPreview;
    const MockData = formatConfig?.mockData || {};
    return {
      value: formatObj?._id || formatName,
      label: formatName,
      PreviewComponent: Component,
      MockData: MockData,
    };
  });

  return (
    <Grid container spacing={2}>
      {isLoadingReportFormatData ? (
        <Box className="flex items-center justify-center h-full! w-full! min-h-[500px] ">
          <CircularProgress color="primary" size={20} />
        </Box>
      ) : (
        <>
          {/* <Grid size={{ xs: 8, md: 4, xl: 3 }}>
        <CommonSelect label="Format Type" options={gstOptions} value={format} onChange={(v) => setFormat(v)} limitTags={1} />
      </Grid> */}

          {generalSettingTabs.length > 0 && (
            <Box className="bg-white dark:bg-gray-dark! border-b border-gray-200 dark:border-gray-800 w-full mb-4">
              <Tabs orientation="horizontal" variant="scrollable" value={tab} onChange={handleChange}>
                {generalSettingTabs.map((currentTab) => (
                  <Tab key={currentTab.value} label={currentTab.label} value={currentTab.value} />
                ))}
              </Tabs>
            </Box>
          )}

          {items.length === 0 && generalSettingTabs.length > 0 ? (
            <div className="p-4 w-full text-center text-gray-500">No formats found for this type</div>
          ) : (
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <RadioGroup name="formats" value={value} onChange={handleRadioChange} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  {items.map((item: any, index: number) => {
                    const { PreviewComponent, MockData } = item;
                    return (
                      <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box className="rounded-lg bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800 overflow-hidden w-full!">
                          <FormControlLabel value={item.value} control={<Radio />} label={item.label} className="text-nowrap px-4 py-2" />

                          {/* Scaled Thumbnail Wrapper */}
                          <div
                            className={`relative w-full h-[500px] border-t dark:border-gray-800 border-gray-200 overflow-hidden bg-gray-50  dark:bg-gray-dark transition-colors ${PreviewComponent !== FallbackPreview ? "cursor-pointer" : ""}`}
                            onClick={() => {
                              if (PreviewComponent !== FallbackPreview) {
                                setActiveFormat({ Component: PreviewComponent, mockData: MockData });
                                setOpen(true);
                              }
                            }}
                          >
                            <div className="absolute top-0 left-[50%] transform -translate-x-[50%] origin-top w-[400px]! pointer-events-none">
                              {/* Render Actual Component */}
                              <PreviewComponent bill={MockData} />
                            </div>
                          </div>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </RadioGroup>

              {/* Modal For Full View */}
              <CommonModal isOpen={open} title="Report Preview" subTitle="" onClose={() => setOpen(false)} className="max-w-[800px]! w-fit!">
                {activeFormat && (
                  <div className="flex justify-center bg-gray-50 dark:bg-gray-dark! ">
                    {/* Render without scaling */}
                    {React.createElement(activeFormat.Component, { bill: activeFormat.mockData })}
                  </div>
                )}
              </CommonModal>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default ReportFormats;
