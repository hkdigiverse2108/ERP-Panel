import React, { useState, type SyntheticEvent } from "react";
import { CommonSelect } from "../../../../Attribute";
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import { ImagePath } from "../../../../Constants";
import { CommonModal } from "../../../Common";
import BillReceipt80mm from "./BillReceipt80mm";
import BillReceiptA4B2B from "./BillReceiptA4B2B";
import BillReceiptA4B2BType2 from "./BillReceiptA4B2BType2";
import BillReceiptA4B2BType3 from "./BillReceiptA4B2BType3";
import BillReceipt80mmB2C from "./BillReceipt80mmB2C";
import BillReceipt80mmB2CType2 from "./BillReceipt80mmB2CType2";
import BillReceipt80mmType2 from "./BillReceipt80mmType2";

import BillReceiptA5 from "./BillReceiptA5";
import MaterialInwardReceipt from "./MaterialInwardReceipt";
import PurchaseOrderReport from "./PurchaseOrderReport";
import type { PosOrderBase } from "../../../../Types";
import type { SupplierBillBase } from "../../../../Types/SupplierBill";
import type { PurchaseOrderBase } from "../../../../Types/PurchaseOrder";

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IReportItem {
  value: string;
  label: string;
  preview?: string;
  component?: React.ReactNode;
}

export interface IReportData {
  [tabIndex: number]: IReportItem[];
}

export interface IGeneralSettingTab {
  label: string;
  value: number;
}

const gstOptions: ISelectOption[] = [
  { label: "ALL", value: "all" },
  { label: "Thermal", value: "thermal" },
  { label: "A4", value: "a4" },
  { label: "A5", value: "a5" },
];

const mockBill: PosOrderBase = {
  _id: "mock1",
  orderNo: "POS2981",
  createdAt: new Date().toISOString(),
  customerId: {
    _id: "cust1",
    firstName: "Walk In",
    lastName: "Customer",
    phoneNo: { countryCode: "+91", phoneNo: "0000000000" },
    address: [{ addressLine1: "Aadityana", city: { name: "Gujarat" } }]
  },
  companyId: { name: "Vasy ERP Solutions Private Limited", _id: "comp1" },
  items: [
    {
      productId: { _id: "prod1", name: "Test demo yellow / 1", hsnCode: "1234", isSalesTaxIncluding: false, salesTaxId: { percentage: 5 } },
      qty: 1,
      mrp: 2010.00,
      netAmount: 2163.60,
      discountAmount: 0,
      additionalDiscountAmount: 0,
    }
  ],
  totalAmount: 2366.00,
  roundOff: 0.40,
  totalDiscount: 0,
  flatDiscountAmount: 0,
  additionalCharges: [{ _id: "charge1", totalAmount: 202.00, accountId: "acc1" }],
  multiplePayments: [
    { method: "cash", amount: 1000 },
    { method: "card", amount: 1366 }
  ],
} as any;

const mockMaterialInward: SupplierBillBase = {
  _id: "mi1",
  supplierBillNo: "mi88231",
  supplierId: { firstName: "karva", lastName: "" } as any,
  supplierBillDate: "2025-08-05",
  notes: "Zaid",
  productDetails: {
    totalQty: 1,
    item: [
      {
        productId: { name: "Ching's Secret Singapore Curry Instant Noodles 60 g", uomId: { name: "Gram" } } as any,
        qty: 1,
      }
    ]
  },
  summary: {
    netAmount: 9.00
  },
  termsAndConditionIds: [
    { termsCondition: "demo" },
    { termsCondition: "demoterm" },
    { termsCondition: "test" },
    { termsCondition: "testing purchase terms and conditions" },
    { termsCondition: "I agree to the mentioned items and conditions" },
  ] as any
} as any;

const mockPurchaseOrder: PurchaseOrderBase = {
  _id: "pord1",
  orderNo: "PORD500",
  orderDate: new Date().toISOString(),
  date: new Date().toISOString(),
  supplierId: {
    _id: "supp1",
    firstName: "karva",
    lastName: "enterprise",
    gstNo: "24ACTPJ9050C1ZL",
    address: [{ addressLine1: "G57, CITY CENTER", addressLine2: "NEAR IDGH CIRCEL", city: { name: "Anjar" }, state: { name: "Gujarat" }, country: { name: "India" } }]
  } as any,
  items: [
    {
      productId: { name: "Ching's Secret Singapore Curry Instant Noodles 60 g", hsnCode: "1234" } as any,
      itemCode: "8901595963409",
      qty: 1,
      unit: "gm",
      unitCost: 9.00,
      taxName: "0.00",
      taxableAmount: 9.00,
      taxAmount: 0.00,
      total: 9.00
    }
  ],
  summary: {
    netAmount: 9.00,
    roundOff: 0.00
  },
  termsAndConditionIds: [
    { termsCondition: "demoterm" },
    { termsCondition: "test" }
  ] as any
} as any;

const ReportFormats = () => {
  const [format, setFormat] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<{ type: "image" | "component", content: any }>({ type: "image", content: "" });

  const [value, setValue] = useState("");

  const handleChange = (_: SyntheticEvent, newValue: number) => setTab(newValue);
  const generalSettingTabs: IGeneralSettingTab[] = [
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

  const reportData: IReportData = {
    0: [
      { value: "pos-jasper-80", label: "Mark as default 80MM Page", component: <BillReceipt80mm bill={mockBill} /> },
      { value: "pos-jasper-80-type2", label: "Mark as default 80MM Page (Type 2)", component: <BillReceipt80mmType2 bill={mockBill} /> },
      { value: "pos-jasper-a5", label: "Mark as default A5 Page", component: <BillReceiptA5 bill={mockBill} /> },
      { value: "pos1", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos2", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos4", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
    1: [
      { value: "thermal_80mm_17_jasper", label: "Thermal_80mm-17(jasper)", component: <BillReceipt80mmB2C bill={mockBill} /> },
      { value: "thermal_80mm_b2c_type2", label: "Thermal_80mm B2C Type 2", component: <BillReceipt80mmB2CType2 bill={mockBill} /> },
      { value: "b2c1", label: "B2C - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` }
    ],
    2: [
      { value: "a4_b2b_invoice", label: "A4 B2B Invoice", component: <BillReceiptA4B2B bill={mockBill} /> },
      { value: "a4_b2b_invoice_type2", label: "A4 B2B Invoice (Type 2)", component: <BillReceiptA4B2BType2 bill={mockBill} /> },
      { value: "a4_b2b_invoice_type3", label: "A4 B2B Invoice (Type 3)", component: <BillReceiptA4B2BType3 bill={mockBill} /> },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
    3: [
      { value: "material-inward-receipt", label: "Goods Receipt Note", component: <MaterialInwardReceipt bill={mockMaterialInward} /> },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
    4: [
      { value: "purchase-order-report", label: "Purchase Order Report", component: <PurchaseOrderReport bill={mockPurchaseOrder} /> },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos1", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
  };

  const items = reportData[tab] || [];

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 8, md: 4, xl: 3 }}>
        <CommonSelect label="Format Type" options={gstOptions} value={format} onChange={(v) => setFormat(v)} limitTags={1} />
      </Grid>
      <Box className=" bg-white dark:bg-gray-dark! border-b border-gray-200 dark:border-gray-800 w-full">
        <Tabs orientation="horizontal" variant="scrollable" value={tab} onChange={handleChange}>
          {generalSettingTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} iconPosition="start" />
          ))}
        </Tabs>
      </Box>
      <Grid container spacing={2}>
        <RadioGroup name="formats" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 6, lg: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 6, xl: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 4, xxl: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 3 }}>
                <Box className="rounded-lg bg-white  dark:bg-gray-dark! border border-gray-200 dark:border-gray-800 overflow-hidden w-fit ">
                  <FormControlLabel value={item.value} control={<Radio />} label={item.label} className="text-nowrap px-4! " />
                  {item.component ? (
                    <div
                      className="border-t p-2 cursor-pointer bg-gray-50 flex items-center justify-center h-48"
                      onClick={() => {
                        setOpen(true);
                        setPreviewContent({ type: "component", content: item.component });
                      }}
                    >
                      <span className="text-sm font-semibold text-gray-500">Live Preview Available (Click)</span>
                    </div>
                  ) : (
                    <img
                      src={item.preview}
                      alt="report preview"
                      className="border-t p-2 cursor-pointer"
                      onClick={() => {
                        setOpen(true);
                        setPreviewContent({ type: "image", content: item.preview });
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>

        <CommonModal isOpen={open} title="" subTitle="" onClose={() => setOpen(!open)} className="w-[450px] m-2 sm:m-5">
          <div className="flex flex-col gap-5 overflow-auto max-h-[80vh] p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            {previewContent.type === "image" ? (
              <img src={previewContent.content} alt="" className="w-full h-auto" />
            ) : (
              <div className="pointer-events-none scale-90 origin-top">
                {previewContent.content}
              </div>
            )}
          </div>
        </CommonModal>
      </Grid>
    </Grid>
  );
};

export default ReportFormats;
