import { AccountBalanceWallet, AttachMoney, CardGiftcard, Description, Pause, Payments, ReceiptLong } from "@mui/icons-material";
import { type FC, type JSX } from "react";
import HoldBill from "./HoldBill";
import { useAppDispatch } from "../../../../../../Store/hooks";
import { setHoldBillDrawer } from "../../../../../../Store/Slices/DrawerSlice";
import PaymentList from "./PaymentList";
import { setPaymentListModal } from "../../../../../../Store/Slices/ModalSlice";

const ActionItem: FC<{ icon: JSX.Element; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center justify-center py-3 px-0.5 text-gray-700 dark:text-gray-400 odd:bg-gray-200 dark:odd:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer">
    <div className="text-lg">{icon}</div>
    <div className="text-xs text-center mt-1">{label}</div>
  </div>
);

const PosOption = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="grid grid-cols-3 border border-gray-300 bg-white dark:bg-gray-dark dark:border-gray-700 overflow-hidden rounded-md">
        <ActionItem icon={<Pause />} label="Hold Bill" onClick={() => dispatch(setHoldBillDrawer())} />
        <ActionItem icon={<Payments />} label="Payments" onClick={() => dispatch(setPaymentListModal())}/>
        <ActionItem icon={<CardGiftcard />} label="Redeem Loyalty" />
        <ActionItem icon={<AttachMoney />} label="Add Payment" />
        <ActionItem icon={<Description />} label="Credit Notes" />
        <ActionItem icon={<ReceiptLong />} label="Orders" />
        <ActionItem icon={<AccountBalanceWallet />} label="Cash Control" />
      </div>
      <HoldBill />
      <PaymentList />
    </>
  );
};

export default PosOption;
