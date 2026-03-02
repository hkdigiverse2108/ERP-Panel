import { Divider, Skeleton } from "@mui/material";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setApplyCouponModal } from "../../../../../Store/Slices/ModalSlice";
import { setCoupon, setTotalAmount, setTotalDiscount } from "../../../../../Store/Slices/PosSlice";
import type { CouponBase } from "../../../../../Types";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../../../../Utils/Hooks";
import { CommonCard, CommonModal } from "../../../../Common";

const ApplyCoupon = () => {
  const [isSearch, setSearch] = useState<string>("");
  const searchCoupon = useDebounce(isSearch, 300);
  const [applyingId, setApplyingId] = useState<string>("");

  const { isApplyCouponModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const dispatch = useAppDispatch();

  // ✅ Track previous totalAmount with a ref — no re-render triggered on change
  const prevTotalAmountRef = useRef<number | undefined>(undefined);

  const { data: couponData, isLoading: couponDataLoading, isFetching: couponDataFetching } = Queries.useGetCouponDropdown({ ...(searchCoupon && { search: searchCoupon }) });
  const { mutate: verifyCoupon } = Mutations.useVerifyCoupon();

  // Ref to ensure edit-mode recalculation only runs once per order load
  const editRecalcDoneRef = useRef<string | null>(null);

  // ✅ Coupon reset — only in CREATE mode when totalAmount changes
  useEffect(() => {
    const currentAmount = PosProduct.totalAmount;
    const isEditMode = Boolean(PosProduct.posOrderId);

    // Skip the very first render — just record the baseline amount
    if (prevTotalAmountRef.current === undefined) {
      prevTotalAmountRef.current = currentAmount;
      return;
    }

    // Only auto-reset coupon in CREATE mode when totalAmount changes
    if (!isEditMode && prevTotalAmountRef.current !== currentAmount) {
      dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
    }

    prevTotalAmountRef.current = currentAmount;
  }, [PosProduct.totalAmount, PosProduct.posOrderId, dispatch]);

  // ✅ Edit-mode: recalculate discount ONCE when an order is loaded
  useEffect(() => {
    if (!PosProduct.posOrderId) {
      // Reset the guard when going back to create mode
      editRecalcDoneRef.current = null;
      return;
    }

    // Only run once per unique order
    if (editRecalcDoneRef.current === PosProduct.posOrderId) return;
    editRecalcDoneRef.current = PosProduct.posOrderId;

    const finalDiscount = Number(PosProduct.totalDiscount || 0);
    const payableAmount = Number(PosProduct.totalAmount || 0) - finalDiscount;

    dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
    dispatch(setTotalAmount(payableAmount));

    // Sync the amount ref so the create-mode effect doesn't fire
    prevTotalAmountRef.current = payableAmount;
  }, [PosProduct.posOrderId, PosProduct.totalAmount, PosProduct.totalDiscount, PosProduct.couponDiscount, dispatch]);

  const handleApplyCoupon = (coupon: CouponBase) => {
    // ── REMOVE ────────────────────────────────────────────────────────────
    if (PosProduct.couponId === coupon._id) {
      const restoredAmount = Number(PosProduct.totalAmount) + Number(PosProduct.couponDiscount || 0);
      const restoredDiscount = Number(PosProduct.totalDiscount || 0) - Number(PosProduct.couponDiscount || 0);

      dispatch(setCoupon({ couponId: "", couponDiscount: 0 }));
      dispatch(setTotalDiscount(Number(restoredDiscount).toFixed(2)));
      dispatch(setTotalAmount(restoredAmount));

      // Sync ref so the useEffect won't treat this amount change as a "product change"
      prevTotalAmountRef.current = restoredAmount;
      return;
    }

    // ── APPLY ─────────────────────────────────────────────────────────────
    if ((coupon?.couponPrice ?? 0) > PosProduct.totalAmount) {
      ShowNotification("Coupon price is greater than total amount", "error");
      return;
    }

    setApplyingId(coupon._id);
    verifyCoupon(
      { couponId: coupon._id, totalAmount: PosProduct.totalAmount, customerId: PosProduct.customerId },
      {
        onSuccess: (response) => {
          const newDiscount = Number(response?.data?.discountAmount || 0);
          const prevCouponDiscount = Number(PosProduct.couponDiscount || 0);

          // Swap out the old coupon discount for the new one
          const adjustedDiscount = Number(PosProduct.totalDiscount || 0) - prevCouponDiscount + newDiscount;

          dispatch(setCoupon({ couponId: coupon._id, couponDiscount: newDiscount }));
          dispatch(setTotalDiscount(Number(adjustedDiscount).toFixed(2)));
          dispatch(setTotalAmount(Number(response?.data?.finalAmount)));

          // Sync ref so the useEffect doesn't treat this as a product change
          prevTotalAmountRef.current = Number(response?.data?.finalAmount);

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
