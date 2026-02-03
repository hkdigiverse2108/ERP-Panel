import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useMemo } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setProductDetailsModal, setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { removeProduct, setTotalAmount, setTotalDiscount, setTotalMep, setTotalQty, setTotalTaxAmount, updateProduct } from "../../../../../Store/Slices/PosSlice";
import type { PosProductDataModal } from "../../../../../Types";
import ProductDetails from "./ProductDetails";
import QtyCount from "./QtyCount";

const PosTable = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);
  const productData = PosProduct.product;

  const dispatch = useAppDispatch();
  const updateRow = (_id: string, data: Partial<PosProductDataModal>) => dispatch(updateProduct({ _id, data }));

  const removeRow = (_id: string) => dispatch(removeProduct(_id));

  const calcNetAmount = (row: PosProductDataModal) => ((row.sellingPrice - row.discount) * row.sellingQty)?.toFixed(2);
  const roundQty = (val: number) => Number(val?.toFixed(2));

  const totalQty = useMemo(() => productData?.reduce((acc, row) => acc + row.sellingQty, 0), [productData]);
  const totalMep = useMemo(() => productData?.reduce((acc, row) => acc + row.mrp * row.sellingQty, 0), [productData]);

  const calcTotalTaxAmount = (row: PosProductDataModal) => {
    const net = Number(calcNetAmount(row)) || 0;
    const taxRate = row.salesTaxId?.percentage || 0;

    if (row.isSalesTaxIncluding) {
      return (net - net / (1 + taxRate / 100))?.toFixed(2);
    }

    return ((net * taxRate) / 100)?.toFixed(2);
  };

  const totalTaxAmount = useMemo(() => productData?.reduce((acc, row) => acc + Number(calcTotalTaxAmount(row)), 0) ?? 0, [productData]);
  const totalDiscount = useMemo(() => productData?.reduce((acc, row) => acc + row.discount * row.sellingQty, 0), [productData]);
  const totalAmount = useMemo(() => productData?.reduce((acc, row) => acc + Number(calcNetAmount(row)), 0) ?? 0, [productData]);

  useEffect(() => {
    dispatch(setTotalQty(totalQty));
    dispatch(setTotalMep(totalMep));
    dispatch(setTotalDiscount(totalDiscount));
    dispatch(setTotalTaxAmount(totalTaxAmount));
    dispatch(setTotalAmount(totalAmount));
  }, [totalMep, totalDiscount, dispatch, totalQty, totalTaxAmount, totalAmount]);

  return (
    <>
      <div className="w-full p-2 bg-white dark:bg-gray-dark">
        <div className="lg:h-[420px] max-h-[420px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
          <table className="w-full text-sm ">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
              <tr>
                <th className="p-2">Sr No.</th>
                <th className="p-2 text-start">Product</th>
                <th className="p-2">Available Qty</th>
                <th className="p-2">Qty</th>
                <th className="p-2">MRP</th>
                <th className="p-2">Discount</th>
                <th className="p-2">Additional Disc</th>
                <th className="p-2">Unit Cost</th>
                <th className="p-2">Net Amount</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {productData?.map((row, i) => {
                const unitCost = row.sellingPrice - row.discount;
                const calcAmount = (row: PosProductDataModal) => {
                  const net = unitCost || 0;
                  const taxRate = row.salesTaxId?.percentage || 0;

                  if (row.isSalesTaxIncluding) {
                    return net?.toFixed(2);
                  }

                  return ((net * taxRate) / 100 + net)?.toFixed(2);
                };

                const isAvailable = unitCost >= (row.purchasePrice ?? 0);
                const getMaxDiscount = (row: PosProductDataModal) => Number(row.sellingPrice) || 0;

                return (
                  <tr key={row._id} className={`text-center text-gray-600 dark:text-gray-300 ${isAvailable ? "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark" : "bg-red-50 dark:bg-red-900"}`}>
                    <td className="p-2 text-center">{i + 1}</td>

                    <td className="p-2 min-w-70 w-90 text-start">
                      <a href="#" onClick={() => dispatch(setProductDetailsModal({ open: true, data: row }))} className="text-blue-600 underline">
                        {row.name}
                      </a>
                    </td>

                    {/* AVAILABLE QTY */}
                    <td className="p-2 min-w-30 w-30">{row.qty}</td>

                    {/* QTY */}
                    <td className="p-2 min-w-30 w-30 ">
                      <div className="flex gap-1 justify-center items-center cursor-pointer">
                        <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, { sellingQty: roundQty(Math.max(0.1, row.sellingQty - 0.1)) })}>
                          <RemoveIcon />
                        </CommonButton>

                        <span className="w-20 py-1 overflow-hidden" onClick={() => dispatch(setQtyCountModal({ open: true, data: row }))}>
                          {row.sellingQty}
                        </span>

                        <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row._id, { sellingQty: roundQty(row.sellingQty + 0.1) })} disabled={row.sellingQty >= (row.qty ?? Infinity)}>
                          <AddIcon />
                        </CommonButton>
                      </div>
                    </td>

                    {/* MRP */}
                    <td className="p-2">{row.mrp?.toFixed(2)}</td>
                    {/* DISCOUNT */}
                    <td className="p-2 min-w-32 w-35">
                      <CommonTextField type="number" value={row.discount || 0} onChange={(e) => updateRow(row._id, { discount: Math.min(Number(e) || 0, getMaxDiscount(row)) })} isCurrency currencyDisabled />
                    </td>

                    {/* ADD DISCOUNT */}
                    <td className="p-2 min-w-32 w-35">
                      <CommonTextField type="number" value={row.sellingDiscount || 0} onChange={(e) => updateRow(row._id, { sellingDiscount: Number(e) })} isCurrency disabled />
                    </td>

                    {/* UNIT COST */}
                    <td className="p-2">{calcAmount(row)}</td>

                    {/* NET AMOUNT */}
                    <td className="p-2 font-medium">{Number(calcAmount(row)) * row.sellingQty}</td>

                    {/* REMOVE */}
                    <td className="p-2">
                      <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 40 }} onClick={() => removeRow(row._id)}>
                        <CloseIcon />
                      </CommonButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ProductDetails />
      <QtyCount />
    </>
  );
};

export default PosTable;
