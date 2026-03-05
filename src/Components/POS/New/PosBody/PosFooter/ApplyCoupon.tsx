import { Divider, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setApplyCouponModal } from "../../../../../Store/Slices/ModalSlice";
import { setCoupon, setHandleDiscount, setTotalAmount, setTotalDiscount } from "../../../../../Store/Slices/PosSlice";
import type { CouponBase } from "../../../../../Types";
import { useDebounce } from "../../../../../Utils/Hooks";
import { CommonCard, CommonModal } from "../../../../Common";

const ApplyCoupon = () => {
  const dispatch = useAppDispatch();

  const { isApplyCouponModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const [isSearch, setSearch] = useState<string>("");
  const searchCoupon = useDebounce(isSearch, 300);
  const [applyingId, setApplyingId] = useState<string>("");

  const prevTotalAmountRef = useRef<number | undefined>(undefined);
  const editRecalcDoneRef = useRef<string | null>(null);
  const editLoadedRef = useRef<boolean>(false);

  const { data: couponData, isLoading: couponDataLoading, isFetching: couponDataFetching } = Queries.useGetCouponDropdown({ ...(searchCoupon && { search: searchCoupon }) }, isApplyCouponModal);
  const { mutate: verifyCoupon } = Mutations.useVerifyCoupon();

  useEffect(() => {
    const currentAmount = PosProduct.totalAmount;
    const isEditMode = Boolean(PosProduct.posOrderId);

    if (prevTotalAmountRef.current === undefined) {
      prevTotalAmountRef.current = currentAmount;
      return;
    }

    if (isEditMode) {
      if (!editLoadedRef.current) {
        editLoadedRef.current = true;
        prevTotalAmountRef.current = currentAmount;
        return;
      }
      if (prevTotalAmountRef.current !== currentAmount) {
        dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
      }
    } else {
      editLoadedRef.current = false;
      if (prevTotalAmountRef.current !== currentAmount) {
        dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
      }
    }

    prevTotalAmountRef.current = currentAmount;
  }, [PosProduct.totalAmount, PosProduct.posOrderId, dispatch]);

  useEffect(() => {
    const isEditMode = Boolean(PosProduct.posOrderId);

    if (!isEditMode) {
      editRecalcDoneRef.current = null;
      return;
    }

    if (editRecalcDoneRef.current === PosProduct.posOrderId) return;
    editRecalcDoneRef.current = PosProduct.posOrderId;

    const finalDiscount = Number(PosProduct.totalDiscount || 0);
    const payableAmount = Number(PosProduct.totalAmount || 0) - finalDiscount;
    dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
    if (!isEditMode) dispatch(setTotalAmount(payableAmount));
    else dispatch(setTotalAmount(PosProduct.totalAmount));

    prevTotalAmountRef.current = payableAmount;
  }, [PosProduct.posOrderId, dispatch]);

  const handleApplyCoupon = (coupon: CouponBase) => {
    if (PosProduct.loyaltyId || PosProduct.redeemCreditId) {
      dispatch(setHandleDiscount("coupon"));
      // return;
    }

    const currentTotalAmount = Number(PosProduct.totalAmount || 0) + Number(PosProduct.loyaltyDiscount || 0);
    const currentTotalDiscount = Number(PosProduct.totalDiscount || 0) - Number(PosProduct.loyaltyDiscount || 0);
    const currentCouponDiscount = Number(PosProduct.couponDiscount || 0);

    if (PosProduct.couponId === coupon._id) {
      const restoredAmount = currentTotalAmount + currentCouponDiscount;
      const restoredDiscount = currentTotalDiscount - currentCouponDiscount;

      dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
      dispatch(setTotalDiscount(Number(restoredDiscount).toFixed(2)));
      dispatch(setTotalAmount(restoredAmount));
      ShowNotification("Coupon removed successfully", "success");
      setApplyingId("");

      prevTotalAmountRef.current = restoredAmount;
      return;
    }

    if ((coupon?.couponPrice ?? 0) > currentTotalAmount) {
      ShowNotification("Coupon price is greater than total amount", "error");
      return;
    }

    setApplyingId(coupon._id);
    verifyCoupon(
      { couponId: coupon._id, totalAmount: currentTotalAmount, customerId: PosProduct.customerId },
      {
        onSuccess: (response) => {
          const newDiscount = Number(response?.data?.discountAmount || 0);
          const removedPrevious = currentTotalDiscount - currentCouponDiscount;
          const finalDiscount = removedPrevious + newDiscount;
          const payableAmount = currentTotalAmount - newDiscount;
          dispatch(setCoupon({ couponId: coupon._id, couponDiscount: newDiscount }));
          dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
          dispatch(setTotalAmount(Number(payableAmount)));
          ShowNotification("Coupon applied successfully", "success");

          prevTotalAmountRef.current = Number(payableAmount);

          setApplyingId("");
          dispatch(setApplyCouponModal());
        },
        onError: () => {
          setApplyingId("");
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
          <CommonTextField label="Search Coupon" value={isSearch} onChange={(e) => setSearch(e)} />
        </div>
        <CommonCard hideDivider>
          {couponDataLoading || couponDataFetching ? (
            <div className="flex flex-col gap-2 w-full p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width="100%" height={50} className="rounded-lg!" />
              ))}
            </div>
          ) : couponData?.data?.length === 0 ? (
            <div className="flex flex-col gap-2 w-full p-3 text-center">No Coupons Found</div>
          ) : (
            couponData?.data?.map((item, i, arr) => (
              <div key={i}>
                <div className="flex items-center gap-3 p-3 m-0">
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">{item?.name}</span>
                  <CommonButton title={PosProduct.couponId === item._id ? "Remove" : "Apply"} variant="outlined" color={PosProduct.couponId === item._id ? "error" : "primary"} size="small" className="shrink-0" loading={applyingId === item._id} onClick={() => handleApplyCoupon(item)} />
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
