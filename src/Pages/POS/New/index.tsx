import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../Api";
import { CashInHandDetails, MultiplePay, PosBody, PosHeader } from "../../../Components/POS/New";
import BillReceipt from "../../../Components/POS/New/BillReceipt";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setPrintType, setSelectedOrderId } from "../../../Store/Slices/PosSlice";

const NewPos = () => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const { isSelectedOrderId, isPrintType } = useAppSelector((state) => state.pos);
  const { isMultiplePay } = useAppSelector((state) => state.pos);

  const { data: cashRegisterDetails } = Queries.useGetPosCashRegisterDetails();
  const { data: posOrderById, isLoading: posOrderByIdLoading, isFetching: posOrderByIdFetching } = Queries.useGetPosOrderById(isSelectedOrderId, Boolean(isSelectedOrderId));

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
    },
    onPrintError: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
    },
  });

  useEffect(() => {
    if (posOrderById?.data && isPrintType === "print" && isSelectedOrderId) {
      handleLastBillPrint();
    }
  }, [handleLastBillPrint, isSelectedOrderId, posOrderById, isPrintType]);
  return (
    <>
      {isMultiplePay ? (
        <MultiplePay />
      ) : (
        <>
          <PosHeader />
          <PosBody />
        </>
      )}
      {cashRegisterDetails?.data?.status === "closed" && <CashInHandDetails />}
      <div className="print-only hidden">{posOrderById?.data && !posOrderByIdLoading && !posOrderByIdFetching && <BillReceipt ref={contentRef} bill={posOrderById?.data} />}</div>
    </>
  );
};

export default NewPos;
