import { forwardRef } from "react";
import { Queries } from "../../Api";
import { Grn_Bill_ThermalJasper, Purchase1Jasper, Purchase2Jasper, Purchase3Jasper } from "./Bill";
import { Deliverychallan_1Jasper } from "./Deliverychallan";
import { Estimate_A4_1Jasper } from "./Estimate";
import { PurchaseOrder1Jasper, PurchaseOrder2Jasper, PurchaseOrder3Jasper, PurchaseThermalHtml } from "./Order";
import { A4_14_1Jasper, A4_14Jasper, A4_1Jasper, A4_2Html, A4_7Jasper, A5_1Jasper, A5_2Jasper, Thermal_58mm1Jasper, Thermal_80mm11Jasper, Thermal_80mm17Jasper, Thermal_80mm18Jasper, Thermal_80mm1Jasper, Thermal_80mm2_1Jasper, Thermal_80mm3Jasper, Thermal_80mm4Jasper, Thermal_80mmOffline, thermal_80mmOffline1 } from "./Pos";
import { ReceiptJasper, Thermal_80mm_Receipt_1Jasper } from "./Receipt";
import { Invoice_A4_1Jasper, Invoice_A4_4html, Invoice_A4EInvoiceJasper, Invoice_A4Jasper, Invoice_A5_1Jasper, Invoice_A5Jasper } from "./Sales";
import { StockTransfer_A4_1Jasper, StockTransfer_A4_2Jasper } from "./StockTransfer";

const FORMAT_COMPONENTS_MAP: Record<string, Record<string, any>> = {
  "POS Offline": {
    "thermal_80mm-offline": Thermal_80mmOffline,
    "thermal_80mm-offline-1": thermal_80mmOffline1,
  },

  "POS(B2C)": {
    "Thermal_80mm-1": Thermal_80mm1Jasper,
    "A5-2": A5_2Jasper,
    "Thermal_80mm-17": Thermal_80mm17Jasper,
    "Thermal_80mm-11": Thermal_80mm11Jasper,
    "Thermal_58mm-1": Thermal_58mm1Jasper,
    "Thermal_80mm-4": Thermal_80mm4Jasper,
    "A5-1": A5_1Jasper,
    "A4-14-1": A4_14_1Jasper,
    "Thermal_80mm-2-1": Thermal_80mm2_1Jasper,
    "A4-1": A4_1Jasper,
    "Thermal_80mm-3": Thermal_80mm3Jasper,
    "A4-7": A4_7Jasper,
    "A4-2": A4_2Html,
    "A4-14": A4_14Jasper,
    "Thermal_80mm-18": Thermal_80mm18Jasper,
  },

  "Sales(B2B)": {
    "invoice-A5": Invoice_A5Jasper,
    "invoice-A5-1": Invoice_A5_1Jasper,
    "invoice-A4-4": Invoice_A4_4html,
    "invoice-A4": Invoice_A4Jasper,
    "invoice-A4-1": Invoice_A4_1Jasper,
    "invoice-A4-einvoice": Invoice_A4EInvoiceJasper,
  },

  Order: {
    "purchase-order-1": PurchaseOrder1Jasper,
    "purchase-order-2": PurchaseOrder2Jasper,
    "purchase-order-3": PurchaseOrder3Jasper,
    "purchase-thermal": PurchaseThermalHtml,
  },

  Bill: {
    "Purchase-2": Purchase2Jasper,
    "Purchase-1": Purchase1Jasper,
    "purchase-3": Purchase3Jasper,
    grn_bill_thermal: Grn_Bill_ThermalJasper,
  },

  Estimate: {
    "Estimate_A4-1": Estimate_A4_1Jasper,
  },

  "Delivery Challan": {
    "deliverychallan-1": Deliverychallan_1Jasper,
  },

  "Stock Transfer": {
    "Stock_Transfer_A4-1": StockTransfer_A4_1Jasper,
    "Stock_Transfer_A4-2": StockTransfer_A4_2Jasper,
  },

  Receipt: {
    receipt: ReceiptJasper,
    "Thermal_80mm_Receipt-1": Thermal_80mm_Receipt_1Jasper,
  },
};

const Print = forwardRef<HTMLDivElement, { type: string; bill: any }>(({ type, bill }, ref) => {
  const { data: reportFormatData, isLoading } = Queries.useGetReportFormat({ activeFilter: true });

  const currentType = reportFormatData?.data?.find((item) => item?.type === type);

  const selectedFormat = currentType?.formats?.find((format) => format?.isActive && format?.isSelected);

  const formatName = selectedFormat?.name?.trim();

  const normalizedFormat = formatName?.toLowerCase()?.trim();

  const formatMap = Object.entries(FORMAT_COMPONENTS_MAP?.[type] || {}).find(([key]) => key?.toLowerCase()?.trim() === normalizedFormat);

  const PreviewComponent = formatMap?.[1];

  return (
    <div ref={ref}>
      {isLoading ? ( //
        <div className="flex items-center justify-center w-full h-[80vh]!">Loading...</div>
      ) : PreviewComponent ? (
        <PreviewComponent bill={bill} />
      ) : (
        <div className="flex items-center justify-center w-full h-[80vh]!">No Bill Found</div>
      )}
    </div>
  );
});

export default Print;
