import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { Queries } from "../../../../../Api";
import { CommonButton, CommonSelect, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal } from "../../../../../Store/Slices/ModalSlice";
import { setAdditionalCharges, setTotalAdditionalCharge } from "../../../../../Store/Slices/PosSlice";
import type { AdditionalChargeRowType, CommonTableColumn } from "../../../../../Types";
import { GenerateOptions } from "../../../../../Utils";
import { CommonModal, CommonTable } from "../../../../Common";

const AdditionalCharge = () => {
  const { isAdditionalChargeModal } = useAppSelector((s) => s.modal);
  const { PosProduct } = useAppSelector((s) => s.pos);
  const dispatch = useAppDispatch();
  const isModalOpen = isAdditionalChargeModal.open;

  const [rows, setRows] = useState<AdditionalChargeRowType[]>(useMemo(() => PosProduct?.additionalCharges ?? [], [PosProduct?.additionalCharges]));

  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown({}, isModalOpen);
  const { data: AdditionalChargeData, isLoading: AdditionalChargeDataLoading } = Queries.useGetAdditionalChargeDropdown({ typeFilter: "sales" }, isModalOpen);
  const { data: AccountGroupData, isLoading: AccountGroupDataLoading } = Queries.useGetAccountGroupDropdown({ natureFilter: "sales" }, isModalOpen);

  const calculateTotal = (value: number, tax: string) => {
    const rate = TaxData?.data?.find((item) => item._id === tax)?.percentage ?? 0;
    return value + (value * Number(rate)) / 100;
  };

  const updateRow = (index: number, key: keyof AdditionalChargeRowType, val: string[] | number) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updatedRow: AdditionalChargeRowType = {
          ...row,
          [key]: key === "value" ? Number(val) || 0 : val,
        };

        if (key === "chargeId") {
          const data = AdditionalChargeData?.data?.find((item) => item._id === updatedRow.chargeId[0]);
          updatedRow.value = data?.defaultValue ?? 0;
          updatedRow.taxId = data?.taxId?._id ? data.taxId._id : "";
          updatedRow.accountGroupId = data?.accountGroupId?._id ? data.accountGroupId._id : "";
        }

        updatedRow.totalAmount = calculateTotal(updatedRow.value, updatedRow.taxId);

        return updatedRow;
      }),
    );
  };

  const addRow = () => setRows((p) => [...p, { chargeId: "", value: 0, taxId: "", accountGroupId: "", totalAmount: 0 }]);

  const removeRow = (i: number) => setRows((p) => p.filter((_, idx) => idx !== i));

  const grandTotal = useMemo(() => rows.reduce((sum, r) => sum + r.totalAmount, 0), [rows]);
  const getSingleValue = (val?: string | string[]) => {
    if (Array.isArray(val)) return val[0] ?? "";
    return val ?? "";
  };

  const handleUpdateCharge = () => {
    const payload = {
      additionalCharges: rows.map((row) => ({
        chargeId: getSingleValue(row.chargeId),
        value: row.value,
        taxId: getSingleValue(row.taxId),
        accountGroupId: getSingleValue(row.accountGroupId),
        totalAmount: row.totalAmount,
      })),
    };
    dispatch(setAdditionalCharges(payload.additionalCharges));
    dispatch(setTotalAdditionalCharge(grandTotal.toFixed(2)));
    dispatch(setAdditionalChargeModal({ open: false, data: null }));
  };

  const columns: CommonTableColumn<AdditionalChargeRowType>[] = [
    {
      key: "additionalCharge",
      header: "Additional Charge",
      bodyClass: "min-w-32 w-60",
      render: (row, index) => <CommonSelect label="Select Additional Charge" value={[row.chargeId]} options={GenerateOptions(AdditionalChargeData?.data)} isLoading={AdditionalChargeDataLoading} onChange={(val) => updateRow(index, "chargeId", val)} />,
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
      render: (row, index) => <CommonSelect label="Select Tax" value={[row.taxId]} options={GenerateOptions(TaxData?.data)} isLoading={TaxDataLoading} onChange={(val) => updateRow(index, "taxId", val)} />,
    },
    {
      key: "group",
      header: "Group",
      bodyClass: "min-w-32 w-55",
      render: (row, index) => <CommonSelect label="Select Group" value={[row.accountGroupId]} options={GenerateOptions(AccountGroupData?.data)} isLoading={AccountGroupDataLoading} onChange={(val) => updateRow(index, "accountGroupId", val)} disabled />,
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
    <CommonModal title="Add Additional Charge" isOpen={isModalOpen} onClose={() => dispatch(setAdditionalChargeModal({ open: false, data: null }))} className="max-w-[1000px]">
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
