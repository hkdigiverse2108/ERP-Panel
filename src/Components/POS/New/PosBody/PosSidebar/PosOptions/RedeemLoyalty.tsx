import { Divider, Skeleton } from "@mui/material";
import { CommonButton, ShowNotification } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setRedeemLoyaltyModal } from "../../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../../Common";
import { Mutations, Queries } from "../../../../../../Api";
import { useState } from "react";
import type { LoyaltyBase, RedeemLoyaltyDataResponse } from "../../../../../../Types";
import { setLoyalty, setTotalDiscount } from "../../../../../../Store/Slices/PosSlice";

const RedeemLoyalty = () => {
  const { isRedeemLoyaltyModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const [prevTotalAmount, setPrevTotalAmount] = useState(PosProduct?.totalAmount);
  const [isRedeemLoyalty, setIsRedeemLoyalty] = useState<RedeemLoyaltyDataResponse | null>(null);
  const dispatch = useAppDispatch();
  const { data: loyaltyData, isLoading: loyaltyDataLoading } = Queries.useGetLoyaltyDropdown({}, isRedeemLoyaltyModal);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const { mutate: redeemLoyalty } = Mutations.useRedeemLoyalty();

  const handleRedeemLoyalty = (loyalty: LoyaltyBase) => {
    if ((loyalty?.minimumPurchaseAmount ?? 0) > PosProduct?.totalAmount) {
      ShowNotification("Loyalty price is greater than total amount", "error");
      return;
    }
    if (PosProduct.loyaltyId === loyalty._id) {
      const discount = Number(PosProduct.totalDiscount || 0) - Number(isRedeemLoyalty?.discountValue || 0);
      dispatch(setTotalDiscount(Number(discount).toFixed(2)));
      dispatch(setLoyalty({ loyaltyId: "", loyaltyDiscount: 0 }));
      setApplyingId(null);
      return;
    }
    setApplyingId(loyalty._id);
    redeemLoyalty(
      { loyaltyId: loyalty._id, totalAmount: PosProduct?.totalAmount, customerId: PosProduct?.customerId },
      {
        onSuccess: (response) => {
          const newDiscount = Number(response?.data?.discountValue || 0);
          const removedPrevious = Number(PosProduct.totalDiscount || 0) - Number(PosProduct.loyaltyDiscount || 0);
          const finalDiscount = removedPrevious + newDiscount;
          dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
          dispatch(setLoyalty({ loyaltyId: loyalty._id, loyaltyDiscount: newDiscount }));
          setIsRedeemLoyalty(response?.data);
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
    dispatch(setLoyalty({ loyaltyId: "", loyaltyDiscount: 0 }));
    setApplyingId(null);
  }

  return (
    <CommonModal title="Redeem Loyalty" isOpen={isRedeemLoyaltyModal} onClose={() => dispatch(setRedeemLoyaltyModal())} className="max-w-[400px]">
      <div className="space-y-3">
        {loyaltyDataLoading ? (
          <div className="flex flex-col gap-2 w-full p-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={50} className="rounded-lg!" />
            ))}
          </div>
        ) : (
          loyaltyData?.data?.map((item, i, arr) => (
            <div key={i}>
              <div className="flex items-center gap-3 m-0">
                {/* Coupon Text */}
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">{item?.name}</span>

                {/* Action */}
                <CommonButton title={`${PosProduct.loyaltyId === item._id ? "Remove" : "Apply"}`} variant="outlined" color={PosProduct.loyaltyId === item._id ? "error" : "primary"} loading={applyingId === item._id} size="small" className="shrink-0" onClick={() => handleRedeemLoyalty(item)} />
              </div>
              {i !== arr.length - 1 && <Divider variant="middle" className="border-gray-300! dark:border-gray-800! my-3!" />}
            </div>
          ))
        )}
        {loyaltyData?.data?.length === 0 && <div className="flex flex-col gap-2 w-full p-3 text-center">No Loyalty Found</div>}
      </div>
    </CommonModal>
  );
};

export default RedeemLoyalty;
