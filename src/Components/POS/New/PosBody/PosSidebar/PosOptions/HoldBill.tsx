import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Queries } from "../../../../../../Api";
import { CommonTextField } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setHoldBillDrawer } from "../../../../../../Store/Slices/DrawerSlice";
import { setPosProduct } from "../../../../../../Store/Slices/PosSlice";
import type { PosProductOrderBase } from "../../../../../../Types";
import { FormatDateTime } from "../../../../../../Utils";
import { CommonDrawer } from "../../../../../Common";

const HoldBill = () => {
  const { isHoldBillDrawer } = useAppSelector((stale) => stale.drawer);
  const [value, setValue] = useState<string>("");

  const { data: holdBills } = Queries.useGetPosHoldOrder({ ...(value && { search: value }) }, isHoldBillDrawer);

  const dispatch = useAppDispatch();

  const handleBillClick = (bill: PosProductOrderBase) => {
    console.log(bill);
    dispatch(
      setPosProduct({
        items: {
          _id: bill._id,
          // name: bill.name,
          // mrp: bill.mrp,
          // discount: bill.discount,
          // tax: bill.tax,
          // additionalCharge: bill.additionalCharge,
          // quantity: bill.quantity,
          // total: bill.total,
        },
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
      }),
    );
    // dispatch(setHoldBillDrawer());
  };

  return (
    <CommonDrawer open={isHoldBillDrawer} onClose={() => dispatch(setHoldBillDrawer())} anchor="right" title="On Hold" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
      <div className="flex flex-col gap-3">
        {/* 🔍 Search */}
        <CommonTextField label="Search" placeholder="Search" endIcon={<SearchIcon />} value={value} onChange={(e) => setValue(e)} />

        {/* 📄 List */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {holdBills?.data?.map((bill) => (
            <div key={bill._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3 text-sm" onClick={() => handleBillClick(bill)}>
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="font-semibold">
                  Order ID : <span className="font-bold">{bill.orderNo}</span>
                </div>

                <div className="flex gap-1">
                  <IconButton size="small">
                    <PrintIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{FormatDateTime(bill.holdDate)}</div>

              <div className="mt-2 space-y-1">
                <div>
                  <span className="font-medium">Contact Name :</span> {bill.customerId?.firstName + " " + bill.customerId?.lastName}
                </div>
                <div>
                  <span className="font-medium">Contact No :</span> {bill.customerId?.phoneNo?.phoneNo ?? "-"}
                </div>
                <div>
                  <span className="font-medium">Amount :</span> ₹ {bill.totalAmount}
                </div>
              </div>
            </div>
          ))}
          {holdBills?.data?.length === 0 && <div className="text-center text-gray-600 dark:text-gray-400">No Data Found</div>}
        </div>
      </div>
    </CommonDrawer>
  );
};

export default HoldBill;
