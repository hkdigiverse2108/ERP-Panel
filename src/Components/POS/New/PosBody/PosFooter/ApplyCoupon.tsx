import { Divider, Skeleton } from "@mui/material";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setApplyCouponModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonCard, CommonModal } from "../../../../Common";
import type { CouponBase } from "../../../../../Types";
import { useState } from "react";

const ApplyCoupon = () => {
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const { isApplyCouponModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const dispatch = useAppDispatch();

  const { data: couponData, isLoading: couponDataLoading } = Queries.useGetCouponDropdown();
  const { mutate: applyCoupon } = Mutations.useApplyCoupon();

  const handleApplyCoupon = (coupon: CouponBase) => {
    if ((coupon?.couponPrice ?? 0) > PosProduct?.totalAmount) {
      ShowNotification("Coupon price is greater than total amount", "error");
      return;
    }
    setApplyingId(coupon._id);
    applyCoupon(
      { couponId: coupon._id, totalAmount: PosProduct?.totalAmount, customerId: PosProduct?.customerId },
      {
        onSuccess: () => {
          setApplyingId(null);
        },
      },
    );
  };

  return (
    <CommonModal title="Apply Coupon" isOpen={isApplyCouponModal} onClose={() => dispatch(setApplyCouponModal())} className="max-w-[500px]">
      <div className="space-y-3 pe-1 sm:pe-3">
        <div className="flex justify-center">
          <span className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-semibold">Invoice Balance: {PosProduct?.totalAmount}</span>
        </div>
        <div>
          <CommonTextField value="123456" onChange={(e) => console.log(e)} />
        </div>
        <CommonCard hideDivider>
          {couponDataLoading ? (
            <div className="flex flex-col gap-2 w-full p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width="100%" height={50} className="rounded-lg!" />
              ))}
            </div>
          ) : (
            couponData?.data?.map((item, i, arr) => (
              <div key={i}>
                <div className="flex items-center gap-3 p-3 m-0">
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">
                    {item?.name} - {item?.couponPrice}
                  </span>
                  <CommonButton title="Apply" variant="outlined" color="primary" size="small" className="shrink-0" loading={applyingId === item._id} onClick={() => handleApplyCoupon(item)} />
                </div>
                {i !== arr.length - 1 && <Divider variant="middle" className="border-gray-300! dark:border-gray-800!" />}
              </div>
            ))
          )}
        </CommonCard>
      </div>
    </CommonModal>
  );
};

export default ApplyCoupon;
