import type { ProductBase } from "../Types";
import { BULK_IMPORT_TYPES } from "../Constants";

/**
 * Maps the extracted raw Excel data into the correct Formik items format based on the page type.
 * It matches 'Product' string name/SKU/itemCode to the existing product dropdown.
 *
 * @param rawData The array of objects extracted from the Excel file via `extractExcelData`.
 * @param pageType The type of document being processed (e.g. "PURCHASE_ORDER", "SUPPLIER_BILL").
 * @param productData The array of loaded products from existing `Queries.useGetProductDropdown()`.
 * @param emptyRow The default empty template of the row item for your specific page.
 */
export const mapExcelToFormItems = <T extends object>(
  rawData: any[],
  pageType: string,
  productData: ProductBase[],
  emptyRow: T
): T[] => {
  const mappedItems: T[] = [];

  rawData.forEach((row) => {
    const itemContent: any = { ...emptyRow };
    let hasValidMatch = false;

    // Common Matching Strategy on 'Product' column against Product Dropdown
    const productNameFromExcel = String(row["Product"] || "").trim().toLowerCase();

    if (productNameFromExcel) {
      const match = productData.find(
        (p) =>
          (p.name ?? "").toLowerCase() === productNameFromExcel ||
          (p.sku ?? "").toLowerCase() === productNameFromExcel
      );

      if (match) {
        itemContent.productId = match._id;
        hasValidMatch = true;
      }
    }

    // Only process row if we matched a product
    if (!hasValidMatch) return;

    // Value Binding Strategy Depending on Page Type
    if (pageType === BULK_IMPORT_TYPES.PURCHASE_ORDER) {
      itemContent.qty = parseFloat(row["Qty"] || "0");
      if (row["Unit Cost"]) itemContent.unitCost = parseFloat(row["Unit Cost"] || "0");
      // Add other columns as needed here
    } else if (pageType === BULK_IMPORT_TYPES.SUPPLIER_BILL) {
      itemContent.qty = parseFloat(row["Qty"] || "0");
      if (row["Free Qty"]) itemContent.freeQty = parseFloat(row["Free Qty"] || "0");
      if (row["Unit Cost"]) itemContent.unitCost = parseFloat(row["Unit Cost"] || "0");
      if (row["Selling Price"]) itemContent.sellingPrice = parseFloat(row["Selling Price"] || "0");
      const discountVal = row["Disc 1"] || row["Discount"];
      if (discountVal) itemContent.discount1 = parseFloat(discountVal || "0");
    } else if (pageType === BULK_IMPORT_TYPES.SALES_ORDER || pageType === BULK_IMPORT_TYPES.ESTIMATE || pageType === BULK_IMPORT_TYPES.INVOICE || pageType === BULK_IMPORT_TYPES.DELIVERY_CHALLAN) {
      itemContent.qty = parseFloat(row["Qty"] || "0");
      if (row["Free Qty"]) itemContent.freeQty = parseFloat(row["Free Qty"] || "0");
      if (row["Price"]) itemContent.price = parseFloat(row["Price"] || "0");
      const discountVal = row["Disc 1"] || row["Discount 1"] || row["Discount"];
      if (discountVal) itemContent.discount1 = parseFloat(discountVal || "0");
    }

    mappedItems.push(itemContent as T);
  });

  return mappedItems;
};
