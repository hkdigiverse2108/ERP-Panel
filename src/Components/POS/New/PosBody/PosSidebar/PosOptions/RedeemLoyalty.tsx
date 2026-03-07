import { Divider, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { CommonButton, ShowNotification } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setRedeemLoyaltyModal } from "../../../../../../Store/Slices/ModalSlice";
import { setHandleDiscount, setLoyalty, setTotalAmount, setTotalDiscount } from "../../../../../../Store/Slices/PosSlice";
import type { LoyaltyBase } from "../../../../../../Types";
import { CommonModal } from "../../../../../Common";

const RedeemLoyalty = () => {
  const dispatch = useAppDispatch();

  const { isRedeemLoyaltyModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const [applyingId, setApplyingId] = useState<string>("");

  const prevTotalAmountRef = useRef<number | undefined>(undefined);
  const editRecalcDoneRef = useRef<string | null>(null);
  const editLoadedRef = useRef<boolean>(false);

  const { data: loyaltyData, isLoading: loyaltyDataLoading, isFetching: loyaltyDataFetching } = Queries.useGetLoyaltyDropdown({}, isRedeemLoyaltyModal);
  const { mutate: redeemLoyalty } = Mutations.useRedeemLoyalty();

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
        dispatch(setLoyalty({ loyaltyId: "", loyaltyDiscount: 0 }));
      }
    } else {
      editLoadedRef.current = false;
      if (prevTotalAmountRef.current !== currentAmount) {
        dispatch(setLoyalty({ loyaltyId: "", loyaltyDiscount: 0 }));
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

  const handleRedeemLoyalty = (loyalty: LoyaltyBase) => {
    if (PosProduct.couponId || PosProduct.redeemCreditId) {
      dispatch(setHandleDiscount("loyalty"));
      // return;
    }

    const currentTotalAmount = Number(PosProduct.totalAmount || 0) + Number(PosProduct.couponDiscount || 0) + Number(PosProduct.redeemCreditAmount || 0);
    const currentTotalDiscount = Number(PosProduct.totalDiscount || 0) - Number(PosProduct.couponDiscount || 0);
    const currentLoyaltyDiscount = Number(PosProduct.loyaltyDiscount || 0);

    if (PosProduct.loyaltyId === loyalty._id) {
      const discount = currentTotalDiscount - currentLoyaltyDiscount;
      const restoredAmount = currentTotalAmount + currentLoyaltyDiscount;
      dispatch(setLoyalty({ loyaltyId: "", loyaltyDiscount: 0 }));
      dispatch(setTotalDiscount(Number(discount).toFixed(2)));
      dispatch(setTotalAmount(restoredAmount));
      ShowNotification("Loyalty removed successfully", "success");
      setApplyingId("");

      prevTotalAmountRef.current = restoredAmount;
      return;
    }
    setApplyingId(loyalty._id);
    redeemLoyalty(
      { loyaltyId: loyalty._id, totalAmount: currentTotalAmount, customerId: PosProduct?.customerId },
      {
        onSuccess: (response) => {
          const newDiscount = Number(response?.data?.discountValue || 0);
          const removedPrevious = currentTotalDiscount - currentLoyaltyDiscount;
          const finalDiscount = removedPrevious + newDiscount;
          const payableAmount = currentTotalAmount - newDiscount;
          dispatch(setLoyalty({ loyaltyId: loyalty._id, loyaltyDiscount: newDiscount }));
          dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
          dispatch(setTotalAmount(Number(payableAmount)));
          ShowNotification("Loyalty applied successfully", "success");

          prevTotalAmountRef.current = Number(payableAmount);

          setApplyingId("");
          dispatch(setRedeemLoyaltyModal());
        },
        onError: () => {
          setApplyingId("");
        },
      },
    );
  };

  return (
    <CommonModal title="Redeem Loyalty" isOpen={isRedeemLoyaltyModal} onClose={() => dispatch(setRedeemLoyaltyModal())} className="max-w-[400px]">
      <div className="space-y-3">
        {loyaltyDataLoading || loyaltyDataFetching ? (
          <div className="flex flex-col gap-2 w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={50} className="rounded-lg!" />
            ))}
          </div>
        ) : loyaltyData?.data?.length === 0 ? (
          <div className="flex flex-col gap-2 w-full p-3 text-center">No Loyalty Found</div>
        ) : (
          loyaltyData?.data?.map((item, i, arr) => (
            <div key={i}>
              <div className="flex items-center gap-3 m-0">
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">{item?.name}</span>
                <CommonButton title={`${PosProduct.loyaltyId === item._id ? "Remove" : "Apply"}`} variant="outlined" color={PosProduct.loyaltyId === item._id ? "error" : "primary"} loading={applyingId === item._id} size="small" className="shrink-0" onClick={() => handleRedeemLoyalty(item)} />
              </div>
              {i !== arr.length - 1 && <Divider variant="middle" className="border-gray-300! dark:border-gray-800! my-3!" />}
            </div>
          ))
        )}
      </div>
    </CommonModal>
  );
};

export default RedeemLoyalty;
