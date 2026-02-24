import { Queries } from "../../../Api";
import { CashInHandDetails, MultiplePay, PosBody, PosHeader } from "../../../Components/POS/New";
import { useAppSelector } from "../../../Store/hooks";

const NewPos = () => {
  const { isMultiplePay } = useAppSelector((state) => state.pos);
  const { data: cashRegisterDetails } = Queries.useGetPosCashRegisterDetails();
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
    </>
  );
};

export default NewPos;
