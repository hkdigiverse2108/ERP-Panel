import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { CommonTextField } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setHoldBillDrawer } from "../../../../../../Store/Slices/DrawerSlice";
import { setPosProduct } from "../../../../../../Store/Slices/PosSlice";
import type { PosProductOrderBase } from "../../../../../../Types";
import { FormatDateTime } from "../../../../../../Utils";
import { CommonDeleteModal, CommonDrawer } from "../../../../../Common";
import { useDebounce } from "../../../../../../Utils/Hooks";
import { setDiscardModal } from "../../../../../../Store/Slices/ModalSlice";

const HoldBill = () => {
  const { isHoldBillDrawer } = useAppSelector((stale) => stale.drawer);
  const { PosProduct } = useAppSelector((stale) => stale.pos);
  const [value, setValue] = useState<string>("");
  const debouncedSearch = useDebounce(value, 500);

  const [rowToDelete, setRowToDelete] = useState<PosProductOrderBase | null>(null);

  const { data: holdBills, isLoading: holdBillsPending, isFetching: holdBillsFetched } = Queries.useGetPosHoldOrder({ ...(debouncedSearch && { search: debouncedSearch }) });

  const { mutate: deleteHoldBill, isPending: isDeleteLoading } = Mutations.useDeletePosOrder();

  const dispatch = useAppDispatch();

  const handleBillClick = (bill: PosProductOrderBase) => {
    const payload = {
      items: bill?.items?.map((item) => ({
        _id: item.productId?._id,
        name: item.productId?.name,
        discount: item.discountAmount,
        additionalDiscount: item.additionalDiscountAmount,
        posQty: item.qty,
        netAmount: item.netAmount,
        unitCost: item.unitCost,
        ...item.productId,
      })),
      customerId: bill.customerId?._id,
      orderType: bill.orderType,
      salesManId: bill.salesManId?._id,
      totalQty: bill.totalQty,
      totalMrp: bill.totalMrp,
      totalTaxAmount: bill.totalTaxAmount,
      totalDiscount: bill.totalDiscount,
      totalAdditionalCharge: bill.totalAdditionalCharge,
      flatDiscountAmount: bill.flatDiscountAmount,
      additionalCharges: bill.additionalCharges,
      roundOff: bill.roundOff,
      remark: bill.remark,
      totalAmount: bill.totalAmount,
      posOrderId: bill._id,
    };
    if (PosProduct?.items.length > 0) {
      dispatch(setDiscardModal());
      dispatch(setHoldBillDrawer());
    } else {
      dispatch(setPosProduct(payload));
      dispatch(setHoldBillDrawer());
    }
  };

  // const handleDelete = (id: string) => deleteHoldBill(id, { onSuccess: () => dispatch(setHoldBillDrawer()) });
  const handleDelete = (bill: PosProductOrderBase) => setRowToDelete(bill);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    // handleDelete(rowToDelete._id);
    deleteHoldBill(rowToDelete._id, {
      onSuccess: () => {
        dispatch(setHoldBillDrawer());
        setRowToDelete(null);
      },
    });
  };

  return (
    <>
      <CommonDrawer open={isHoldBillDrawer} onClose={() => dispatch(setHoldBillDrawer())} anchor="right" title="On Hold" paperProps={{ className: "bg-white dark:bg-gray-800! custom-scrollbar" }}>
        <div className="flex flex-col gap-3">
          {/* 🔍 Search */}
          <CommonTextField label="Search" placeholder="Search" endIcon={<SearchIcon />} value={value} onChange={(e) => setValue(e)} />

          {/* 📄 List */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            {holdBillsPending || holdBillsFetched ? (
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width="100%" height={100} className="rounded-lg!" />
                ))}
              </Box>
            ) : holdBills?.data?.length === 0 ? (
              <Typography align="center" width="100%">
                No Data Found
              </Typography>
            ) : (
              holdBills?.data?.map((bill) => (
                <div key={bill._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3 text-sm cursor-pointer" onClick={() => handleBillClick(bill)}>
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">
                      Order ID : <span className="font-bold">{bill.orderNo}</span>
                    </div>

                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* <IconButton size="small">
                    <PrintIcon fontSize="small" />
                  </IconButton> */}
                      <IconButton size="small" color="error" onClick={() => handleDelete(bill)}>
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{FormatDateTime(bill.holdDate)}</div>

                  <div className="mt-2 space-y-1">
                    <div>
                      <span className="font-medium">Contact Name :</span> {bill.customerId?.firstName ? bill.customerId?.firstName + " " + bill.customerId?.lastName : "Walk in Customer"}
                    </div>
                    <div>
                      <span className="font-medium">Contact No :</span> {bill.customerId?.phoneNo?.phoneNo ?? "-"}
                    </div>
                    <div>
                      <span className="font-medium">Amount :</span> ₹ {bill.totalAmount}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.orderNo} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </CommonDrawer>
    </>
  );
};

export default HoldBill;
