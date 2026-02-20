import { Divider, Skeleton } from "@mui/material";
import { CommonButton } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setRedeemLoyaltyModal } from "../../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../../Common";
import { Queries } from "../../../../../../Api";
import { useState } from "react";

const RedeemLoyalty = () => {
  const { isRedeemLoyaltyModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();
  const { data: loyaltyData, isLoading: loyaltyDataLoading } = Queries.useGetLoyalty({});
  const [applyingId, setApplyingId] = useState<string | null>(null);

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
          loyaltyData?.data?.loyalty_data.map((item, i, arr) => (
            <div key={i}>
              <div className="flex items-center gap-3 p-3 m-0">
                {/* Coupon Text */}
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">{item?.name}</span>

                {/* Action */}
                <CommonButton title={`${PosProduct.loyaltyId === item._id ? "Remove" : "Apply"}`} variant="outlined" color={PosProduct.loyaltyId === item._id ? "error" : "primary"} loading={applyingId === item._id} size="small" className="shrink-0" />
              </div>
              {i !== arr.length - 1 && <Divider variant="middle" className="border-gray-300! dark:border-gray-800!" />}
            </div>
          ))
        )}
        {loyaltyData?.data?.loyalty_data.length === 0 && <div className="flex flex-col gap-2 w-full p-3 text-center">No Loyalty Found</div>}
      </div>
    </CommonModal>
  );
};

export default RedeemLoyalty;
