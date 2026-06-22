import { useState } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { updateProduct } from "../../../../../Store/Slices/PosSlice";
import { CommonModal } from "../../../../Common";

const keypadPieces = ["1", "2", "3", "+10", "4", "5", "6", "+20", "7", "8", "9", "+50", "C", "0", ".", "⌫"];
const keypadGrams = ["1", "2", "3", "+0.05", "+0.10", "4", "5", "6", "+0.25", "+0.5", "7", "8", "9", "+1", "+2", "C", "0", ".", "⌫", "+5"];

const QtyCount = () => {
  const { isQtyCountModal } = useAppSelector((state) => state.modal);
  const { isReturnPosOrder } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();
  const [prevData, setPrevData] = useState(isQtyCountModal.data);

  const isPieces = prevData?.uomId?.name === "PIECES";
  const qtyCount = isPieces ? "0" : "0.00";

  const [tendered, setTendered] = useState<string>(qtyCount);

  const MIN_QTY = isPieces ? 0 : 0.01;

  const maxQty = isReturnPosOrder ? (prevData?.originalQty ?? Infinity) : (isQtyCountModal.data?.qty ?? Infinity);
  if (isQtyCountModal.data !== prevData) {
    setPrevData(isQtyCountModal.data);
    if (isQtyCountModal.data) setTendered(isQtyCountModal.data.posQty?.toString() ?? qtyCount);
  }

  // 🔒 Clamp qty between 0 and stock qty
  const clampQty = (val: number) => {
    if (val > maxQty) return maxQty;
    if (val < MIN_QTY) return MIN_QTY;
    return isPieces ? Math.floor(val) : Number(val.toFixed(2));
  };

  const handleQtyChange = (e: string) => {
    const value = e;
    if (!/^[\d.]*$/.test(value)) return;
    if (isPieces) {
      // Only integers for PIECES
      if (!/^\d*$/.test(value)) return;
    } else {
      // Allow decimals for other UOMs
      if (!/^[\d.]*$/.test(value)) return;
    }
    setTendered(value);
  };

  const keypad = isPieces ? keypadPieces : keypadGrams;

  // ⌨ Keypad handler
  const handleKeyPress = (key: string) => {
    // CLEAR
    if (key === "C") {
      setTendered(qtyCount);
      return;
    }

    // BACKSPACE
    if (key === "⌫") {
      setTendered((prev) => {
        const next = prev.slice(0, -1);
        return next.length ? next : qtyCount;
      });
      return;
    }

    // ADD (+10, +20, +50...)
    if (key.startsWith("+")) {
      const add = Number(key.replace("+", ""));
      const current = Number(tendered || 0);
      setTendered(clampQty(current + add).toString());
      return;
    }

    // DECIMAL
    if (key === ".") {
      setTendered((prev) => (prev.includes(".") ? prev : prev === qtyCount ? "0." : prev + "."));
      return;
    }

    // NUMBERS
    setTendered((prev) => {
      const next = prev === qtyCount || prev === "0" ? key : prev + key;
      return next;
    });
  };

  const handleClose = () => {
    dispatch(setQtyCountModal({ open: false, data: null }));
    setTendered(qtyCount);
  };

  const handleConfirm = () => {
    if (!isQtyCountModal.data) return;
    dispatch(updateProduct({ _id: isQtyCountModal.data._id, data: { posQty: clampQty(Number(tendered)) } }));
    handleClose();
  };

  return (
    <CommonModal isOpen={isQtyCountModal.open} onClose={handleClose} className="max-w-[400px]" showCloseButton={false}>
      <div className="space-y-4 p-1">
        <div className="flex flex-col gap-4">
          <CommonTextField label="Qty" value={tendered} type="text" onChange={handleQtyChange} color="primary" />
          <div className={`grid ${isPieces ? "grid-cols-4" : "grid-cols-5"} gap-2`}>
            {keypad.map((key) => (
              <button key={key} onClick={() => handleKeyPress(key)} disabled={isPieces && key === "."} className={`border border-gray-200 dark:border-gray-700 rounded py-3 text-xs sm:text-base font-semibold ${isPieces && key === "." ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 active:scale-95"}`}>
                {key}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <CommonButton title="Cancel" variant="outlined" color="error" className="py-4" onClick={handleClose} />
            <CommonButton title="Submit" variant="contained" className="py-4" disabled={Number(tendered) <= MIN_QTY} onClick={handleConfirm} />
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default QtyCount;
