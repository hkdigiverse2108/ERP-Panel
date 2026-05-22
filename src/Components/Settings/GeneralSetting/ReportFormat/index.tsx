import React, { useState, type SyntheticEvent } from "react";
// import { CommonSelect } from "../../../../Attribute";
import { Box, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import { Mutations, Queries } from "../../../../Api";
import type { ReportFormat } from "../../../../Types";
import { CommonModal } from "../../../Common";
import { A4_2Html, A5_1Jasper, A5_2Jasper, Deliverychallan_1Jasper, Estimate_A4_1Jasper, Grn_Bill_ThermalJasper, Invoice_A4_1Jasper, Invoice_A4_4html, Invoice_A4EInvoiceJasper, Invoice_A4Jasper, Invoice_A5_1Jasper, Invoice_A5Jasper, Purchase1Jasper, Purchase2Jasper, Purchase3Jasper, PurchaseOrder1Jasper, PurchaseOrder2Jasper, PurchaseOrder3Jasper, PurchaseThermalHtml, StockTransfer_A4_1Jasper, StockTransfer_A4_2Jasper, Thermal_58mm1Jasper, Thermal_80mm11Jasper, Thermal_80mm17Jasper, Thermal_80mm18Jasper, Thermal_80mm1Jasper, Thermal_80mm2_1Jasper, Thermal_80mm3Jasper, Thermal_80mm4Jasper, Thermal_80mmOffline, thermal_80mmOffline1 } from "../../../ReportFormats";
import { A5_2JasperData, Thermal_80mm1JasperData, Thermal_80mmOffline1Data, Thermal_80mmOfflineData } from "../../../ReportFormats/Data";
import { ReceiptJasper, Thermal_80mm_Receipt_1Jasper } from "../../../ReportFormats/Receipt";

export interface ISelectOption {
  label: string;
  value: string;
}

// Temporary fallback component
const FallbackPreview = () => <div className="p-4 w-full h-[500px]! flex items-center justify-center bg-gray-50 dark:bg-gray-dark! border-gray-200 dark:border-gray-800 text-gray-400">Preview Not Available</div>;

// Our static mapping definition
const FORMAT_COMPONENTS_MAP: Record<string, Record<string, any>> = {
  "POS Offline": {
    "thermal_80mm-offline": { Component: Thermal_80mmOffline, mockData: Thermal_80mmOfflineData },
    "thermal_80mm-offline-1": { Component: thermal_80mmOffline1, mockData: Thermal_80mmOffline1Data },
  },
  "POS(B2C)": {
    "Thermal_80mm-1": { Component: Thermal_80mm1Jasper, mockData: Thermal_80mm1JasperData },
    "A5-2": { Component: A5_2Jasper, mockData: A5_2JasperData },
    "Thermal_80mm-17": { Component: Thermal_80mm17Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-11": { Component: Thermal_80mm11Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_58mm-1": { Component: Thermal_58mm1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-4": { Component: Thermal_80mm4Jasper, mockData: Thermal_80mm1JasperData },
    "A5-1": { Component: A5_1Jasper, mockData: Thermal_80mm1JasperData },
    // "A4-14-1": { Component: A4_14_1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-2-1": { Component: Thermal_80mm2_1Jasper, mockData: Thermal_80mm1JasperData },
    // "A4-1": { Component: A4_1Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-3": { Component: Thermal_80mm3Jasper, mockData: Thermal_80mm1JasperData },
    // "A4-7": { Component: A4_7Jasper, mockData: Thermal_80mm1JasperData },
    "A4-2": { Component: A4_2Html, mockData: Thermal_80mm1JasperData },
    // "A4-14": { Component: A4_14Jasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm-18": { Component: Thermal_80mm18Jasper, mockData: Thermal_80mm1JasperData },
  },
  "Sales(B2B)": {
    "invoice-A5": { Component: Invoice_A5Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A5-1": { Component: Invoice_A5_1Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-4": { Component: Invoice_A4_4html, mockData: Thermal_80mm1JasperData },
    "invoice-A4": { Component: Invoice_A4Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-1": { Component: Invoice_A4_1Jasper, mockData: Thermal_80mm1JasperData },
    "invoice-A4-einvoice": { Component: Invoice_A4EInvoiceJasper, mockData: Thermal_80mm1JasperData },
  },
  Order: {
    "purchase-order-1": { Component: PurchaseOrder1Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-order-2": { Component: PurchaseOrder2Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-order-3": { Component: PurchaseOrder3Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-thermal": { Component: PurchaseThermalHtml, mockData: Thermal_80mm1JasperData },
  },
  Bill: {
    "Purchase-2": { Component: Purchase2Jasper, mockData: Thermal_80mm1JasperData },
    "Purchase-1": { Component: Purchase1Jasper, mockData: Thermal_80mm1JasperData },
    "purchase-3": { Component: Purchase3Jasper, mockData: Thermal_80mm1JasperData },
    grn_bill_thermal: { Component: Grn_Bill_ThermalJasper, mockData: Thermal_80mm1JasperData },
  },
  Estimate: {
    "Estimate_A4-1": { Component: Estimate_A4_1Jasper, mockData: Thermal_80mm1JasperData },
  },
  "Delivery Challan": {
    "deliverychallan-1": { Component: Deliverychallan_1Jasper, mockData: Thermal_80mm1JasperData },
  },
  "Stock Transfer": {
    "Stock_Transfer_A4-1": { Component: StockTransfer_A4_1Jasper, mockData: Thermal_80mm1JasperData },
    "Stock_Transfer_A4-2": { Component: StockTransfer_A4_2Jasper, mockData: Thermal_80mm1JasperData },
  },
  Receipt: {
    receipt: { Component: ReceiptJasper, mockData: Thermal_80mm1JasperData },
    "Thermal_80mm_Receipt-1": { Component: Thermal_80mm_Receipt_1Jasper, mockData: Thermal_80mm1JasperData },
  },
};

const ReportFormats = () => {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<{ Component: any; mockData: any } | null>(null);
  const [value, setValue] = useState("");

  const { data: reportFormatData, isLoading: isLoadingReportFormatData } = Queries.useGetReportFormat({ activeFilter: true });

  const { mutateAsync: editReportConfigBranch } = Mutations.useEditReportConfigBranch();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue((event.target as HTMLInputElement).value);

  const handleChange = (_: SyntheticEvent, newValue: number) => setTab(newValue);

  const handleActivate = (item: any) => {
    const payload = {
      reportConfig: {
        type: item?.mainType || "",
        formatName: item?.label || "",
      },
    };
    editReportConfigBranch(payload);
  };

  // Dynamic Array Parsing from Backend Response
  const rawApiData = (Array.isArray(reportFormatData?.data) ? reportFormatData.data : []).map((item) => ({
    ...item,
    type: item.type?.trim() || "",
    formats: (item.formats || []).map((format) => ({ ...format, name: format.name?.trim() || "" })),
  }));

  const generalSettingTabs = rawApiData.map((item, index) => ({ label: item.type, value: index }));

  const activeTabDetails = rawApiData[tab];

  // Dynamic Items Extraction
  const items = (activeTabDetails?.formats || [])
    .filter((format: ReportFormat) => format.isActive)
    .map((formatObj: ReportFormat) => {
      const formatName = formatObj?.name || "";
      const formatConfig = FORMAT_COMPONENTS_MAP[activeTabDetails.type]?.[formatName];
      const Component = formatConfig?.Component || FallbackPreview;
      const MockData = formatConfig?.mockData || {};
      return {
        value: formatObj?._id || formatName,
        label: formatName,
        PreviewComponent: Component,
        MockData: MockData,
        mainType: activeTabDetails?.type,
        ...formatObj,
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
            <>
              <RadioGroup name="formats" value={value} onChange={handleRadioChange} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  {items.map((item, index) => {
                    const { PreviewComponent, MockData, isSelected } = item;
                    return (
                      <Grid key={index} size={{ xs: 12, sm: 6, xl: 4, xxl: 3 }}>
                        <Box className="rounded-lg bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800 overflow-hidden w-full!">
                          <FormControlLabel control={<Radio value={item.label} onChange={() => handleActivate(item)} />} checked={isSelected} label={item.label} className="text-nowrap px-4 py-2 w-[200px]  text-ellipsis whitespace-nowrap" />

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
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default ReportFormats;
