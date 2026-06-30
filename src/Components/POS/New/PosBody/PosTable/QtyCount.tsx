import { useState } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { updateProduct } from "../../../../../Store/Slices/PosSlice";
import { CommonModal } from "../../../../Common";

// ─────────────────────────────────────────────
// Keypad definitions
// ─────────────────────────────────────────────
const QTY_KEYPAD = ["1", "2", "3", "+10", "4", "5", "6", "+20", "7", "8", "9", "+50", "C", "0", ".", "⌫"];
const AMT_KEYPAD = ["1", "2", "3", "+10", "4", "5", "6", "+50", "7", "8", "9", "+100", "C", "0", ".", "⌫"];

// ─────────────────────────────────────────────
// Mode toggle type
// ─────────────────────────────────────────────
type InputMode = "qty" | "amount";

const QtyCount = () => {
  const { isQtyCountModal } = useAppSelector((state) => state.modal);
  const { isReturnPosOrder } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();

  const [prevData, setPrevData] = useState(isQtyCountModal.data);
  const [mode, setMode] = useState<InputMode>("qty");

  // ─── Derived helpers ────────────────────────
  const isPieces = prevData?.uomId?.name === "PIECES";
  const qtyDefault = isPieces ? "0" : "0.00";

  const [tendered, setTendered] = useState<string>(qtyDefault);
  const [amountInput, setAmountInput] = useState<string>("0.00");

  const MIN_QTY = isPieces ? 0 : 0.1;
  const maxQty = isReturnPosOrder
    ? (prevData?.originalQty ?? Infinity)
    : (isQtyCountModal.data?.qty ?? Infinity);

  // Sync modal data when it changes (different row clicked)
  if (isQtyCountModal.data !== prevData) {
    setPrevData(isQtyCountModal.data);
    setMode("qty");
    setAmountInput("0.00");
    if (isQtyCountModal.data) {
      setTendered(isQtyCountModal.data.posQty?.toString() ?? qtyDefault);
    }
  }

  // ─── Amount ↔ Qty conversion ─────────────────
  /**
   * MRP is price per 1 unit (kg, piece, etc.)
   * qty from amount  = enteredAmount / mrp
   * amount from qty  = qty * mrp
   */
  const mrp: number = isQtyCountModal.data?.mrp ?? 0;
  const discount = isQtyCountModal.data?.discount ?? 0;
  const additionalDiscount = isQtyCountModal.data?.additionalDiscount ?? 0;
  const unitPrice = mrp - discount - additionalDiscount;
  const taxRate = Number(isQtyCountModal.data?.salesTaxId?.percentage || 0);
  const unitPriceIncludingTax = isQtyCountModal.data?.isSalesTaxIncluding ? unitPrice : unitPrice + (unitPrice * taxRate) / 100;

  const derivedQtyFromAmount = (): number => {
    if (!unitPriceIncludingTax || unitPriceIncludingTax === 0) return 0;
    const amt = parseFloat(amountInput || "0");
    return Number((amt / unitPriceIncludingTax).toFixed(3));
  };

  const derivedAmountFromQty = (): string => {
    const qty = parseFloat(tendered || "0");
    return (qty * unitPriceIncludingTax).toFixed(2);
  };

  // ─── Clamp helper ────────────────────────────
  const clampQty = (val: number) => {
    if (val > maxQty) return maxQty;
    if (val < MIN_QTY) return MIN_QTY;
    return isPieces ? Math.floor(val) : Number(val.toFixed(3));
  };

  // ─── QTY mode handlers ───────────────────────
  const handleQtyChange = (e: string) => {
    if (isPieces) {
      if (!/^\d*$/.test(e)) return;
    } else {
      if (!/^[\d.]*$/.test(e)) return;
    }
    setTendered(e);
  };

  const handleQtyKeyPress = (key: string) => {
    if (key === "C") { setTendered(qtyDefault); return; }
    if (key === "⌫") {
      setTendered((prev) => { const next = prev.slice(0, -1); return next.length ? next : qtyDefault; });
      return;
    }
    if (key.startsWith("+")) {
      const add = Number(key.replace("+", ""));
      setTendered(clampQty(Number(tendered || 0) + add).toString());
      return;
    }
    if (key === ".") {
      setTendered((prev) => (prev.includes(".") ? prev : prev === qtyDefault ? "0." : prev + "."));
      return;
    }
    setTendered((prev) => {
      const next = prev === qtyDefault || prev === "0" ? key : prev + key;
      return clampQty(Number(next)).toString();
    });
  };

  // ─── AMOUNT mode handlers ────────────────────
  const handleAmountChange = (e: string) => {
    if (!/^[\d.]*$/.test(e)) return;
    setAmountInput(e);
  };

  const handleAmountKeyPress = (key: string) => {
    if (key === "C") { setAmountInput("0.00"); return; }
    if (key === "⌫") {
      setAmountInput((prev) => { const next = prev.slice(0, -1); return next.length ? next : "0.00"; });
      return;
    }
    if (key.startsWith("+")) {
      const add = Number(key.replace("+", ""));
      setAmountInput((parseFloat(amountInput || "0") + add).toFixed(2));
      return;
    }
    if (key === ".") {
      setAmountInput((prev) => (prev.includes(".") ? prev : prev === "0.00" ? "0." : prev + "."));
      return;
    }
    setAmountInput((prev) => (prev === "0.00" ? key : prev + key));
  };

  // ─── Close / Confirm ─────────────────────────
  const handleClose = () => {
    dispatch(setQtyCountModal({ open: false, data: null }));
    setTendered(qtyDefault);
    setAmountInput("0.00");
    setMode("qty");
  };

  const handleConfirm = () => {
    if (!isQtyCountModal.data) return;

    let finalQty: number;

    if (mode === "amount") {
      // Reverse-calculate qty from entered amount
      finalQty = clampQty(derivedQtyFromAmount());
    } else {
      finalQty = clampQty(Number(tendered));
    }

    if (finalQty <= 0) return;

    dispatch(updateProduct({ _id: isQtyCountModal.data._id, data: { posQty: finalQty } }));
    handleClose();
  };

  // ─── Disable logic ───────────────────────────
  const isConfirmDisabled = (() => {
    if (mode === "qty") return Number(tendered) <= MIN_QTY;
    // Amount mode: derived qty must be > 0 and mrp must be set
    return !mrp || derivedQtyFromAmount() <= 0;
  })();

  // ─── UI ──────────────────────────────────────
  const activeKeypad = mode === "qty" ? QTY_KEYPAD : AMT_KEYPAD;
  const activeHandler = mode === "qty" ? handleQtyKeyPress : handleAmountKeyPress;

  return (
    <CommonModal
      isOpen={isQtyCountModal.open}
      onClose={handleClose}
      className="max-w-[420px]"
      showCloseButton={false}
    >
      <div className="space-y-4 p-1">

        {/* ── Mode Toggle ── */}
        {!isPieces && unitPriceIncludingTax > 0 && (
          <div className="flex gap-2 justify-center">
            <CommonButton
              title="By Qty"
              variant={mode === "qty" ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setMode("qty");
                setAmountInput("0.00");
              }}
            />
            <CommonButton
              title="By Amount (₹)"
              variant={mode === "amount" ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setMode("amount");
                setTendered(qtyDefault);
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">

          {/* ── Input field ── */}
          {mode === "qty" ? (
            <CommonTextField
              label="Qty"
              value={tendered}
              type="text"
              onChange={handleQtyChange}
              color="primary"
            />
          ) : (
            <>
              <CommonTextField
                label="Enter Amount (₹)"
                value={amountInput}
                type="text"
                onChange={handleAmountChange}
                color="primary"
                focused
              />
              {unitPriceIncludingTax > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
                  Net Price: ₹{unitPriceIncludingTax.toFixed(2)} / unit &nbsp;→&nbsp;
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Qty: {derivedQtyFromAmount()} {prevData?.uomId?.name ?? ""}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Show reverse info in qty mode too */}
          {mode === "qty" && unitPriceIncludingTax > 0 && Number(tendered) > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
              Amount: ₹{derivedAmountFromQty()}
            </div>
          )}

          {/* ── Keypad ── */}
          <div className="grid grid-cols-4 gap-2">
            {activeKeypad.map((key) => (
              <button
                key={key}
                onClick={() => activeHandler(key)}
                disabled={isPieces && key === "."}
                className={`border border-gray-200 dark:border-gray-700 rounded py-3 text-xs sm:text-base font-semibold
                  ${isPieces && key === "." ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"}
                `}
              >
                {key}
              </button>
            ))}
          </div>

          {/* ── Action buttons ── */}
          <div className="flex justify-end gap-2">
            <CommonButton
              title="Cancel"
              variant="outlined"
              color="error"
              className="py-4"
              onClick={handleClose}
            />
            <CommonButton
              title="Submit"
              variant="contained"
              className="py-4"
              disabled={isConfirmDisabled}
              onClick={handleConfirm}
            />
          </div>

        </div>
      </div>
    </CommonModal>
  );
};

export default QtyCount;
