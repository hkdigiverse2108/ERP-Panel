import { useState } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { updateProduct } from "../../../../../Store/Slices/PosSlice";
import { CommonModal } from "../../../../Common";

const keypad = ["1", "2", "3", "+10", "4", "5", "6", "+20", "7", "8", "9", "+50", "C", "0", ".", "⌫"];

const QtyCount = () => {
  const { isQtyCountModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [prevData, setPrevData] = useState(isQtyCountModal.data);
  const [tendered, setTendered] = useState<string>("0.00");

  const maxQty = isQtyCountModal.data?.qty ?? Infinity;
  if (isQtyCountModal.data !== prevData) {
    setPrevData(isQtyCountModal.data);
    if (isQtyCountModal.data) setTendered(isQtyCountModal.data.sellingQty?.toString() ?? "0.00");
  }

  // 🔒 Clamp qty between 0 and stock qty
  const clampQty = (val: number) => {
    if (val > maxQty) return maxQty;
    if (val < 0) return 0;
    return Number(val.toFixed(2));
  };

  const handleQtyChange = (e: string) => {
    const value = e;
    if (!/^[\d.]*$/.test(value)) return;
    const num = Number(value || 0);
    setTendered(clampQty(num).toString());
  };

  // ⌨ Keypad handler
  const handleKeyPress = (key: string) => {
    // CLEAR
    if (key === "C") {
      setTendered("0.00");
      return;
    }

    // BACKSPACE
    if (key === "⌫") {
      setTendered((prev) => {
        const next = prev.slice(0, -1);
        return next.length ? next : "0.00";
      });
      return;
    }

    // ADD (+10, +20, +50)
    if (key.startsWith("+")) {
      const add = Number(key.replace("+", ""));
      const current = Number(tendered || 0);
      setTendered(clampQty(current + add).toString());
      return;
    }

    // DECIMAL
    if (key === ".") {
      setTendered((prev) => (prev.includes(".") ? prev : prev === "0" ? "0." : prev + "."));
      return;
    }

    // NUMBERS
    setTendered((prev) => {
      const next = prev === "0.00" || prev === "0" ? key : prev + key;
      return clampQty(Number(next)).toString();
    });
  };

  const handleClose = () => {
    dispatch(setQtyCountModal({ open: false, data: null }));
    setTendered("0.00");
  };

  const handleConfirm = () => {
    if (!isQtyCountModal.data) return;
    dispatch(updateProduct({ _id: isQtyCountModal.data._id, data: { sellingQty: clampQty(Number(tendered)) } }));
    handleClose();
  };

  return (
    <CommonModal isOpen={isQtyCountModal.open} onClose={handleClose} className="max-w-[400px]" showCloseButton={false}>
      <div className="space-y-4 p-1">
        <div className="flex flex-col gap-4">
          <CommonTextField label="Qty" value={tendered} type="text" onChange={handleQtyChange} color="primary" focused />
          <div className="grid grid-cols-4 gap-2">
            {keypad.map((key) => (
              <button key={key} onClick={() => handleKeyPress(key)} className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded py-3 text-xs sm:text-base font-semibold hover:bg-gray-100 active:scale-95">
                {key}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <CommonButton title="Cancel" variant="outlined" color="error" className="py-4" onClick={handleClose} />
            <CommonButton title="Submit" variant="contained" className="py-4" onClick={handleConfirm} />
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default QtyCount;
