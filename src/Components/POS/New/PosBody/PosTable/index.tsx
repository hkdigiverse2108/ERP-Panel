import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useMemo } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setProductDetailsModal, setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { removeProduct, setTotalAmount, setTotalDiscount, setTotalMrp, setTotalQty, setRoundOff, setTotalTaxAmount, updateProduct, clearPosProduct } from "../../../../../Store/Slices/PosSlice";
import type { CommonTableColumn, PosProductDataModal } from "../../../../../Types";
import ProductDetails from "./ProductDetails";
import QtyCount from "./QtyCount";
import { CommonTable } from "../../../../Common";

const PosTable = () => {
  const { PosProduct, isPosLoading, isReturnPosOrder } = useAppSelector((state) => state.pos);
  const productData = PosProduct.items;

  const dispatch = useAppDispatch();
  const updateRow = (_id: string, variantId?: string, data?: Partial<PosProductDataModal>) => dispatch(updateProduct({ _id, variantId, data }));

  const removeRow = (_id: string, variantId?: string) => {
    if (productData.length === 1) dispatch(clearPosProduct());
    else dispatch(removeProduct({ _id, variantId }));
  };

  const calcNetAmount = (row: PosProductDataModal) => ((row.mrp - row.discount - row.additionalDiscount) * row.posQty)?.toFixed(2);

  const roundQty = (val: number) => Number(val?.toFixed(2));

  const qtyCount = (row: PosProductDataModal) => (row.uomId?.name === "PIECES" ? 1 : 0.1);

  const calcTotalTaxAmount = (row: PosProductDataModal) => {
    const net = Number(calcNetAmount(row)) || 0;
    const taxRate = row.salesTaxId?.percentage || 0;
    // if (row.isSalesTaxIncluding) return (net - net / (1 + taxRate / 100))?.toFixed(2);
    if (row.isSalesTaxIncluding) return 0;
    else return ((net * taxRate) / 100)?.toFixed(2);
  };

  const totalQty = useMemo(() => productData?.reduce((acc, row) => acc + row.posQty, 0), [productData]);
  const totalMrp = useMemo(() => productData?.reduce((acc, row) => acc + row.mrp * row.posQty, 0), [productData]);
  const totalTaxAmount = useMemo(() => productData?.reduce((acc, row) => acc + Number(calcTotalTaxAmount(row)), 0) ?? 0, [productData]);
  const totalDiscount = useMemo(() => productData?.reduce((acc, row) => acc + row.discount * row.posQty, 0), [productData]);
  const totalAdditionalDiscount = useMemo(() => productData?.reduce((acc, row) => acc + row.additionalDiscount * row.posQty, 0), [productData]);
  const finalDiscount = useMemo(() => totalDiscount + totalAdditionalDiscount + PosProduct.couponDiscount + PosProduct.loyaltyDiscount + PosProduct.discountAmount, [totalDiscount, totalAdditionalDiscount, PosProduct.couponDiscount, PosProduct.loyaltyDiscount, PosProduct.discountAmount]);
  const totalDiscountAmount = useMemo(() => Number(PosProduct.couponDiscount || 0) + Number(PosProduct.loyaltyDiscount || 0) + Number(PosProduct.flatDiscountAmount || 0) + Number(PosProduct.redeemCreditAmount || 0) + Number(PosProduct.discountAmount || 0) - Number(PosProduct.totalAdditionalCharge || 0), [PosProduct.couponDiscount, PosProduct.loyaltyDiscount, PosProduct.flatDiscountAmount, PosProduct.totalAdditionalCharge, PosProduct.redeemCreditAmount, PosProduct.discountAmount]);

  const totalAmount = useMemo(() => productData?.reduce((acc, row) => acc + row.netAmount, 0) ?? 0, [productData]);
  const finalAmount = useMemo(() => (totalAmount - totalDiscountAmount)?.toFixed(2), [totalAmount, totalDiscountAmount]);

  const roundOffAmount = useMemo(() => {
    const amt = Number(finalAmount);
    const decimal = amt % 1;

    const rounded = decimal >= 0.5 ? Math.ceil(amt) : Math.floor(amt);

    return (rounded - amt).toFixed(2);
  }, [finalAmount]);

  const finalTotal = Number(finalAmount) + Number(PosProduct.roundOff || roundOffAmount);
  const finalPayable = finalTotal >= 0 ? finalTotal?.toFixed(2) : "0.00";
  useEffect(() => {
    dispatch(setTotalQty(totalQty?.toFixed(2)));
    dispatch(setTotalMrp(totalMrp?.toFixed(0)));
    dispatch(setTotalDiscount(finalDiscount?.toFixed(2)));
    dispatch(setTotalTaxAmount(totalTaxAmount?.toFixed(2)));
    if (!PosProduct.roundOff) {
      dispatch(setRoundOff(Number(roundOffAmount)?.toFixed(2)));
    }
    dispatch(setTotalAmount(finalPayable));
  }, [totalMrp, finalDiscount, dispatch, totalQty, totalTaxAmount, roundOffAmount, finalPayable, PosProduct.roundOff]);

  const isDisabled = (row: PosProductDataModal) => {
    if (isReturnPosOrder) return row.posQty >= row.originalQty;
    else return row.posQty >= (row.qty ?? Infinity);
  };

  const columns: CommonTableColumn<PosProductDataModal>[] = [
    { key: "sr", header: "Sr No.", render: (_, i) => i + 1 },
    {
      key: "name",
      header: "Product",
      headerClass: "text-start",
      bodyClass: "min-w-70 w-90 text-start",
      render: (row) => (
        <span className="text-blue-600 underline cursor-pointer" onClick={() => dispatch(setProductDetailsModal({ open: true, data: row }))}>
          {row.name}
        </span>
      ),
    },
    { key: "qty", header: "Available Qty", bodyClass: "min-w-30 w-30", render: (row) => row.qty?.toFixed(2) },
    {
      key: "posQty",
      header: "Qty",
      bodyClass: "min-w-30 w-30",
      render: (row) => (
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, row.variantId, { posQty: roundQty(Math.max(row.uomId?.name === "PIECES" ? 1 : 0.01, row.posQty - qtyCount(row))) })}>
            <RemoveIcon />
          </CommonButton>

          <span className="w-16 text-center cursor-pointer" onClick={() => dispatch(setQtyCountModal({ open: true, data: row }))}>
            {row.posQty}
            {/* <CommonTextField type="number" value={row.posQty} onChange={(e) => updateRow(row._id, { posQty: Math.min(Number(e) || 0, row.posQty) })} /> */}
          </span>

          <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, row.variantId, { posQty: roundQty(row.posQty + qtyCount(row)) })} disabled={isDisabled(row)}>
            <AddIcon />
          </CommonButton>
        </div>
      ),
    },
    {
      key: "mrp",
      header: "MRP",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.mrp} onChange={(e) => updateRow(row._id, row.variantId, { mrp: Number(e) || 0 })} isCurrency currencyDisabled />,
    },
    {
      key: "discount",
      header: "Discount",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.discount} onChange={(e) => updateRow(row._id, row.variantId, { discount: Math.min(Number(e) || 0, row.mrp) })} isCurrency currencyDisabled />,
    },
    {
      key: "additionalDisc",
      header: "Additional Disc",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.additionalDiscount || 0} onChange={(e) => updateRow(row._id, row.variantId, { additionalDiscount: Number(e) })} isCurrency disabled />,
    },
    { key: "unitCost", header: "Unit Cost", bodyClass: "min-w-32 w-35" },
    {
      key: "netAmount",
      header: "Net Amount",
      bodyClass: "min-w-32 w-35",
      render: (row) => (
        <CommonTextField
          type="number"
          value={row.netAmount}
          onChange={(e) => {
            const desiredAmt = Number(e) || 0;
            const unitPrice = row.mrp - row.discount - row.additionalDiscount;
            const taxRate = row.salesTaxId?.percentage || 0;
            const unitPriceIncludingTax = row.isSalesTaxIncluding ? unitPrice : unitPrice + (unitPrice * taxRate) / 100;
            if (unitPriceIncludingTax > 0) {
              const isPieces = row.uomId?.name === "PIECES";
              const rawQty = desiredAmt / unitPriceIncludingTax;
              const newQty = isPieces ? Math.round(rawQty) : Number(rawQty.toFixed(3));
              updateRow(row._id, row.variantId, { posQty: newQty });
            }
          }}
          isCurrency
          currencyDisabled
        />
      ),
    },
    // ...(!PosProduct.posOrderId || isReturnPosOrder
    //   ? [
    {
      key: "action",
      header: "",
      render: (row: PosProductDataModal) => (
        <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 40 }} onClick={() => removeRow(row._id, row.variantId)}>
          <CloseIcon />
        </CommonButton>
      ),
    },
    //   ]
    // : []),
  ];

  const CommonTableOption = {
    isLoading: isPosLoading,
    data: productData,
    rowKey: (row: PosProductDataModal) => row._id,
    columns: columns,
    getRowClass: (row: PosProductDataModal) => (Number(calcNetAmount(row)) >= (row.landingCost ?? 0) ? "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark" : "bg-red-50 dark:bg-red-900"),
  };

  return (
    <>
      <div className="w-full p-2 bg-white dark:bg-gray-dark">
        <div className="lg:h-[420px] max-h-[420px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
          <CommonTable {...CommonTableOption} />
        </div>
      </div>
      <ProductDetails />
      <QtyCount />
    </>
  );
};

export default PosTable;
