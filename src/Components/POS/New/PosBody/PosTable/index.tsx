import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useMemo } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setProductDetailsModal, setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { removeProduct, setTotalAmount, setTotalDiscount, setTotalMep, setTotalQty, setTotalRoundOFF, setTotalTaxAmount, updateProduct } from "../../../../../Store/Slices/PosSlice";
import type { CommonTableColumn, PosProductDataModal } from "../../../../../Types";
import ProductDetails from "./ProductDetails";
import QtyCount from "./QtyCount";
import { CommonTable } from "../../../../Common";

const PosTable = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);
  const productData = PosProduct.product;

  const dispatch = useAppDispatch();
  const updateRow = (_id: string, data: Partial<PosProductDataModal>) => dispatch(updateProduct({ _id, data }));

  const removeRow = (_id: string) => dispatch(removeProduct(_id));

  const calcNetAmount = (row: PosProductDataModal) => ((row.mrp - row.discount - row.sellingDiscount) * row.sellingQty)?.toFixed(2);

  const roundQty = (val: number) => Number(val?.toFixed(2));

  const calcTotalTaxAmount = (row: PosProductDataModal, isTex: boolean, unit?: boolean) => {
    const net = !unit ? Number(calcNetAmount(row)) || 0 : Number(calcNetAmount(row)) / row.sellingQty || 0;
    const taxRate = row.salesTaxId?.percentage || 0;

    if (row.isSalesTaxIncluding) {
      return isTex ? (net - net / (1 + taxRate / 100))?.toFixed(2) : net?.toFixed(2);
    }

    return isTex ? ((net * taxRate) / 100)?.toFixed(2) : ((net * taxRate) / 100 + net)?.toFixed(2);
  };

  const totalQty = useMemo(() => productData?.reduce((acc, row) => acc + row.sellingQty, 0), [productData]);
  const totalMep = useMemo(() => productData?.reduce((acc, row) => acc + row.mrp * row.sellingQty, 0), [productData]);
  const totalTaxAmount = useMemo(() => productData?.reduce((acc, row) => acc + Number(calcTotalTaxAmount(row, true)), 0) ?? 0, [productData]);
  const totalDiscount = useMemo(() => productData?.reduce((acc, row) => acc + row.discount * row.sellingQty, 0), [productData]);
  const totalAmount = useMemo(() => productData?.reduce((acc, row) => acc + Number(calcTotalTaxAmount(row, false)), 0) ?? 0, [productData]);
  const finalAmount = useMemo(() => (totalAmount - PosProduct.totalFlatDiscount).toFixed(2), [totalAmount, PosProduct.totalFlatDiscount]);
  const roundedAmount = useMemo(() => {
    const amt = Number(finalAmount);
    const decimal = amt % 1;

    return decimal >= 0.5 ? Math.ceil(amt) : Math.floor(amt);
  }, [finalAmount]);

  const roundOffAmount = useMemo(() => (roundedAmount - Number(finalAmount)).toFixed(2), [roundedAmount, finalAmount]);

  useEffect(() => {
    dispatch(setTotalQty(totalQty?.toFixed(2)));
    dispatch(setTotalMep(totalMep?.toFixed(0)));
    dispatch(setTotalDiscount(totalDiscount?.toFixed(2)));
    dispatch(setTotalTaxAmount(totalTaxAmount?.toFixed(2)));
    dispatch(setTotalAmount(roundedAmount?.toFixed(0)));
    dispatch(setTotalRoundOFF(Number(roundOffAmount)?.toFixed(2)));
  }, [totalMep, totalDiscount, dispatch, totalQty, totalTaxAmount, roundOffAmount, roundedAmount]);

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
    { key: "qty", header: "Available Qty", bodyClass: "min-w-30 w-30" },
    {
      key: "sellingQty",
      header: "Qty",
      bodyClass: "min-w-30 w-30",
      render: (row) => (
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, { sellingQty: roundQty(Math.max(0.1, row.sellingQty - 0.1)) })}>
            <RemoveIcon />
          </CommonButton>

          <span className="w-16 text-center cursor-pointer" onClick={() => dispatch(setQtyCountModal({ open: true, data: row }))}>
            {row.sellingQty}
          </span>

          <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, { sellingQty: roundQty(row.sellingQty + 0.1) })} disabled={row.sellingQty >= (row.qty ?? Infinity)}>
            <AddIcon />
          </CommonButton>
        </div>
      ),
    },
    { key: "mrp", header: "MRP", render: (row) => row.mrp.toFixed(2) },
    {
      key: "discount",
      header: "Discount",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.discount} onChange={(e) => updateRow(row._id, { discount: Math.min(Number(e) || 0, row.mrp) })} isCurrency currencyDisabled />,
    },
    {
      key: "additionalDisc",
      header: "Additional Disc",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.sellingDiscount || 0} onChange={(e) => updateRow(row._id, { sellingDiscount: Number(e) })} isCurrency disabled />,
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      bodyClass: "min-w-32 w-35",
      render: (row) => Number(calcTotalTaxAmount(row, false, true)).toFixed(2),
    },
    {
      key: "net",
      header: "Net Amount",
      bodyClass: "min-w-32 w-35",
      render: (row) => Number(calcTotalTaxAmount(row, false)).toFixed(2),
    },
    {
      key: "action",
      header: "",
      render: (row) => (
        <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 40 }} onClick={() => removeRow(row._id)}>
          <CloseIcon />
        </CommonButton>
      ),
    },
  ];

  const CommonTableOption = {
    data: productData,
    rowKey: (row: PosProductDataModal) => row._id,
    columns: columns,
    getRowClass: (row: PosProductDataModal) => (Number(calcNetAmount(row)) >= (row.purchasePrice ?? 0) ? "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark" : "bg-red-50 dark:bg-red-900"),
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
