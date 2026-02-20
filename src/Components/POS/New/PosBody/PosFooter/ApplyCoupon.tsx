import { Divider, Skeleton } from "@mui/material";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setApplyCouponModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonCard, CommonModal } from "../../../../Common";
import type { CouponBase } from "../../../../../Types";
import { useState } from "react";
import { useDebounce } from "../../../../../Utils/Hooks";
import { setCoupon, setTotalDiscount } from "../../../../../Store/Slices/PosSlice";

const ApplyCoupon = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isSearch, setSearch] = useState<string>("");

  const searchCoupon = useDebounce(isSearch, 300);

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const { isApplyCouponModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const [prevTotalAmount, setPrevTotalAmount] = useState(PosProduct?.totalAmount);

  const dispatch = useAppDispatch();

  const { data: couponData, isLoading: couponDataLoading, isFetching: couponDataFetching } = Queries.useGetCouponDropdown({ ...(searchCoupon && { search: searchCoupon }) });
  const { mutate: verifyCoupon } = Mutations.useVerifyCoupon();

  const handleApplyCoupon = (coupon: CouponBase) => {
    if ((coupon?.couponPrice ?? 0) > PosProduct?.totalAmount) {
      ShowNotification("Coupon price is greater than total amount", "error");
      return;
    }
    if (couponCode === coupon._id) {
      setCouponCode("");
      return;
    }
    setApplyingId(coupon._id);
    verifyCoupon(
      { couponId: coupon._id, totalAmount: PosProduct?.totalAmount, customerId: PosProduct?.customerId },
      {
        onSuccess: (response) => {
          const discount = Number(PosProduct.totalDiscount || 0) + Number(response?.data?.discountAmount || 0);
          dispatch(setTotalDiscount(Number(discount).toFixed(2)));
          dispatch(setCoupon({ couponId: coupon._id, couponDiscount: response?.data?.discountAmount }));
          setCouponCode(coupon._id);
          setApplyingId(null);
        },
        onError: () => {
          setApplyingId(null);
        },
      },
    );
  };

  if (PosProduct?.totalAmount !== undefined && PosProduct?.totalAmount !== prevTotalAmount) {
    setPrevTotalAmount(PosProduct?.totalAmount);
    dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
    setCouponCode("");
    setApplyingId(null);
  }

  return (
    <CommonModal title="Apply Coupon" isOpen={isApplyCouponModal} onClose={() => dispatch(setApplyCouponModal())} className="max-w-[500px]">
      <div className="space-y-3 pe-1 sm:pe-3">
        <div className="flex justify-center">
          <span className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-semibold">Invoice Balance: {PosProduct?.totalAmount}</span>
        </div>
        <div>
          <CommonTextField label="Search Coupon" value={isSearch} onChange={(e) => setSearch(e)} />
        </div>
        <CommonCard hideDivider>
          {couponDataLoading || couponDataFetching ? (
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
                    {item?.name}
                  </span>
                  <CommonButton title={`${couponCode === item._id ? "Remove" : "Apply"}`} variant="outlined" color={couponCode === item._id ? "error" : "primary"} size="small" className="shrink-0" loading={applyingId === item._id} onClick={() => handleApplyCoupon(item)} />
                </div>
                {i !== arr.length - 1 && <Divider variant="middle" className="border-gray-300! dark:border-gray-800!" />}
              </div>
            ))
          )}
          {couponData?.data?.length === 0 && <div className="flex flex-col gap-2 w-full p-3 text-center">No Coupons Found</div>}
        </CommonCard>
      </div>
    </CommonModal>
  );
};

export default ApplyCoupon;
