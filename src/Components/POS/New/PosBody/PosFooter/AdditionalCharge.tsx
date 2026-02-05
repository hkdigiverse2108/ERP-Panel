import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { Queries } from "../../../../../Api";
import { CommonButton, CommonSelect, CommonTextField } from "../../../../../Attribute";
import { BAUD_RATE, GROUP_OPTIONS } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal } from "../../../../../Store/Slices/ModalSlice";
import type { AdditionalChargeRowType, CommonTableColumn } from "../../../../../Types";
import { GenerateOptions } from "../../../../../Utils";
import { CommonModal, CommonTable } from "../../../../Common";
import { setAdditionalCharges, setTotalAdditionalCharge } from "../../../../../Store/Slices/PosSlice";

const AdditionalCharge = () => {
  const { isAdditionalChargeModal } = useAppSelector((s) => s.modal);
  const dispatch = useAppDispatch();

  const [rows, setRows] = useState<AdditionalChargeRowType[]>([]);

  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();

  const calculateTotal = (value: number, tax: string[]) => {
    const rate = TaxData?.data?.find((item) => item._id === tax[0])?.percentage ?? 0;
    return value + (value * Number(rate)) / 100;
  };

  const updateRow = (index: number, key: keyof AdditionalChargeRowType, val: string[] | number) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updatedRow: AdditionalChargeRowType = {
          ...row,
          [key]: key === "value" ? Number(val) || 0 : val,
        } as AdditionalChargeRowType;

        updatedRow.totalAmount = calculateTotal(updatedRow.value, updatedRow.taxId);

        return updatedRow;
      }),
    );
  };

  const addRow = () => setRows((p) => [...p, { chargeId: [], value: 0, taxId: [], accountGroupId: [], totalAmount: 0 }]);

  const removeRow = (i: number) => setRows((p) => p.filter((_, idx) => idx !== i));

  const grandTotal = useMemo(() => rows.reduce((sum, r) => sum + r.totalAmount, 0), [rows]);

  const handleUpdateCharge = () => {
    const payload = {
      additionalCharges: rows.map((row) => ({
        chargeId: row.chargeId[0],
        value: row.value,
        taxId: row.taxId[0],
        accountGroupId: row.accountGroupId[0],
        totalAmount: row.totalAmount,
      })),
    };
    dispatch(setAdditionalCharges(payload.additionalCharges));
    dispatch(setTotalAdditionalCharge(grandTotal.toFixed(2)));
    dispatch(setAdditionalChargeModal());
  };

  const columns: CommonTableColumn<AdditionalChargeRowType>[] = [
    {
      key: "additionalCharge",
      header: "Additional Charge",
      bodyClass: "min-w-32 w-60",
      render: (row, index) => <CommonSelect label="Select Additional Charge" value={row.chargeId} options={BAUD_RATE} onChange={(val) => updateRow(index, "chargeId", val)} />,
      footer: () => <CommonButton variant="outlined" size="small" onClick={addRow} title="+ Additional Charge" />,
    },
    {
      key: "value",
      header: "Value",
      bodyClass: "min-w-32 w-40",
      render: (row, index) => <CommonTextField value={row.value} isCurrency type="number" onChange={(e) => updateRow(index, "value", Number(e))} currencyDisabled />,
    },
    {
      key: "tax",
      header: "Tax",
      bodyClass: "min-w-32 w-45",
      render: (row, index) => <CommonSelect label="Select Tax" value={row.taxId} options={GenerateOptions(TaxData?.data)} isLoading={TaxDataLoading} onChange={(val) => updateRow(index, "taxId", val)} />,
    },
    {
      key: "group",
      header: "Group",
      bodyClass: "min-w-32 w-55",
      render: (row, index) => <CommonSelect label="Select Group" value={row.accountGroupId} options={GROUP_OPTIONS} onChange={(val) => updateRow(index, "accountGroupId", val)} />,
    },
    {
      key: "total",
      header: "Total",
      render: (row) => row.totalAmount.toFixed(2),
      footer: () => grandTotal.toFixed(2),
    },
    {
      key: "action",
      header: "Action",
      render: (_, index) => (
        <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 40 }} onClick={() => removeRow(index)}>
          <CloseIcon />
        </CommonButton>
      ),
    },
  ];
  const CommonTableOption = {
    data: rows,
    rowKey: (_: AdditionalChargeRowType, index: number) => index,
    columns: columns,
    getRowClass: () => "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark",
    showFooter: true,
  };
  return (
    <CommonModal title="Add Additional Charge" isOpen={isAdditionalChargeModal} onClose={() => dispatch(setAdditionalChargeModal())} className="max-w-[1000px]">
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-y-auto custom-scrollbar text-sm w-full">
          <CommonTable {...CommonTableOption} />
        </div>
        <div className="flex justify-end items-center">
          <CommonButton variant="contained" size="small" sx={{ minWidth: 40 }} onClick={handleUpdateCharge} title="Update Charge" />
        </div>
      </div>
    </CommonModal>
  );
};

export default AdditionalCharge;
