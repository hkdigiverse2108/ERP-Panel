import type { ProductRow, AdditionalChargeRow, SupplierBillFormValues } from "../../../Types/SupplierBill";

export const mapApiToProductRows = (items: any[], emptyRow: ProductRow): ProductRow[] => {
  return items.map((item) => ({
    ...emptyRow,
    productId: item.productId?._id || item.productId || "",
    qty: item.qty || "",
    freeQty: item.freeQty || "",
    mrp: item.mrp || "",
    sellingPrice: item.sellingPrice || "",
    disc1: item.discount1 || "",
    disc2: item.discount2 || "",
    taxAmount: item.taxAmount || "",
    totalAmount: item.total || "",
    landingCost: item.landingCost || "",
    margin: item.margin || "",
    itemCode: item.itemCode || "",
    unit: item.unit || "",
    unitCost: item.unitCost || "",
    mfgDate: item.mfgDate || "",
    expiryDate: item.expiryDate || "",
  }));
};

export const mapApiToReturnRows = (items: any[], emptyRow: ProductRow): ProductRow[] => {
  return items.map((item) => ({
    ...emptyRow,
    productId: item.productId?._id || item.productId || "",
    qty: item.qty || "",
    disc1: item.discount1 || "",
    disc2: item.discount2 || "",
    taxAmount: item.tax || "",
    totalAmount: item.total || "",
    landingCost: item.landingCost || "",
  }));
};

export const mapApiToAdditionalRows = (items: any[], emptyRow: AdditionalChargeRow): AdditionalChargeRow[] => {
  return items.map((item) => ({
    ...emptyRow,
    chargeId: item.chargeId?._id || item.chargeId || "",
    taxableAmount: String(item.value || ""),
    tax: String(item.taxRate || ""),
    taxAmount: item.value && item.taxRate ? ((item.value * item.taxRate) / 100).toFixed(2) : "0",
    totalAmount: String(item.total || ""),
  }));
};

export const calculateSummary = (
  rows: ProductRow[],
  returnRows: ProductRow[],
  additionalRows: AdditionalChargeRow[],
  values: SupplierBillFormValues
) => {
  const productItems = rows
    .filter((r) => r.productId)
    .map((r) => ({
      productId: r.productId,
      qty: Number(r.qty) || 0,
      freeQty: Number(r.freeQty) || 0,
      mrp: Number(r.mrp) || 0,
      sellingPrice: Number(r.sellingPrice) || 0,
      discount1: Number(r.disc1) || 0,
      discount2: Number(r.disc2) || 0,
      taxAmount: Number(r.taxAmount) || 0,
      total: Number(r.totalAmount) || 0,
      landingCost: Number(r.landingCost) || 0,
      margin: Number(r.margin) || 0,
      itemCode: r.itemCode,
      unit: r.unit,
      unitCost: Number(r.unitCost) || 0,
      mfgDate: r.mfgDate,
      expiryDate: r.expiryDate,
    }));

  const returnItems = returnRows
    .filter((r) => r.productId)
    .map((r) => ({
      productId: r.productId,
      qty: Number(r.qty) || 0,
      discount1: Number(r.disc1) || 0,
      discount2: Number(r.disc2) || 0,
      tax: Number(r.taxAmount) || 0,
      total: Number(r.totalAmount) || 0,
      landingCost: Number(r.landingCost) || 0,
    }));

  const additionalChargeItems = additionalRows
    .filter((r) => r.chargeId)
    .map((r) => ({
      chargeId: { _id: r.chargeId },
      value: Number(r.taxableAmount) || 0,
      taxRate: Number(r.tax) || 0,
      total: Number(r.totalAmount) || 0,
    }));

  const itemDiscount = productItems.reduce((acc, r) => acc + (r.discount1 + r.discount2), 0);
  const itemTax = productItems.reduce((acc, r) => acc + r.taxAmount, 0);
  const grossAmount = productItems.reduce((acc, r) => acc + (r.total - r.taxAmount), 0);
  const totalQty = productItems.reduce((acc, r) => acc + r.qty, 0);

  const additionalChargeAmount = additionalChargeItems.reduce((acc, r) => acc + r.value, 0);
  const additionalChargeTax = additionalChargeItems.reduce((acc, r) => acc + (r.total - r.value), 0);
  const additionalTotal = additionalChargeAmount + additionalChargeTax;

  const totalReturnNet = returnItems.reduce((acc, r) => acc + r.total, 0);

  const flatDiscount = Number(values.summary?.flatDiscount) || 0;
  const billDiscount = Number(values.summary?.billDiscount) || 0;

  const netAmountBeforeRoundoff = grossAmount + itemTax + additionalTotal - (flatDiscount + billDiscount + totalReturnNet);
  const netAmount = Math.round(netAmountBeforeRoundoff);
  const roundOff = netAmount - netAmountBeforeRoundoff;

  return {
    productItems,
    returnItems,
    additionalChargeItems,
    itemDiscount,
    itemTax,
    grossAmount,
    totalQty,
    additionalChargeAmount,
    additionalChargeTax,
    additionalTotal,
    totalReturnNet,
    flatDiscount,
    billDiscount,
    netAmount,
    roundOff,
  };
};
