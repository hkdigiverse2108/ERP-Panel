import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Grid, Tooltip } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { Mutations, Queries } from "../../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../Attribute";
import type { PosCashRegisterFormInitialValues, PosCashRegisterValues } from "../../../../Types/PosCashRegister";
import { FormatDateTime, GenerateOptions, RemoveEmptyFields } from "../../../../Utils";
import { CurrentRegisterSchema } from "../../../../Utils/ValidationSchemas";
import { CommonModal } from "../../../Common";

const CurrentRegister = () => {
  const [open, setOpen] = useState(false);
  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown({}, open);
  const { data: cashRegisterDetails, isLoading: cashRegisterDetailsLoading } = Queries.useGetPosCashRegisterDetails();

  const { mutate: editPosCashRegister, isPending: editPosCashRegisterLoading } = Mutations.useEditPosCashRegister();

  const createdAt = FormatDateTime(cashRegisterDetails?.data?.createdAt);
  const updatedAt = FormatDateTime(new Date().toISOString());
  const summary = cashRegisterDetails?.data?.summary;

  const initialValues: PosCashRegisterFormInitialValues = {
    bankAccountId: "",
    bankTransferAmount: 0,
    cashFlow: 0,
    totalCashLeftInDrawer: 0,
    physicalDrawerCash: 0,
    closingNote: "",
    denominations: {} as Record<number, string>,
    status: "closed",
  };

  const Sales = [
    { label: "Opening Cash", value: summary?.openingCash },
    { label: "Cash Payment", value: summary?.cashPayment },
    { label: "Cheque Payment", value: summary?.chequePayment },
    { label: "Card Payment", value: summary?.cardPayment },
    { label: "Bank Payment", value: summary?.bankPayment },
    { label: "UPI Payment", value: summary?.upiPayment },
    { label: "Sales Return", value: summary?.salesReturn },
    { label: "Cash Refund", value: summary?.cashRefund },
    { label: "Bank Refund", value: summary?.bankRefund },
    { label: "Credit/Advance Redeemed", value: summary?.creditAdvanceRedeemed },
    { label: "Pay Later", value: summary?.payLater },
    { label: "Expense", value: summary?.expense },
    { label: "Purchase Payment", value: summary?.purchasePayment },
    { label: "Total Sales", value: summary?.totalSales },
  ];

  const currencyNotes = [1, 2, 5, 10, 20, 50, 100, 200, 500];

  const render = (value: string | number) => (cashRegisterDetailsLoading ? <CircularProgress color="inherit" size={10} /> : value);

  const DrawerCalculator = ({ currencyNotes }: { currencyNotes: number[] }) => {
    const { values, setFieldValue } = useFormikContext<PosCashRegisterFormInitialValues>();

    const getAmount = (note: number) => (Number(values.denominations?.[note]) || 0) * note;

    const totalAmount = currencyNotes.reduce((sum, note) => sum + getAmount(note), 0);

    const totalCashLeftInDrawer = (summary?.openingCash || 0) + (summary?.cashPayment || 0) - (summary?.cashRefund || 0);
    const totalCash = totalCashLeftInDrawer - Number(values.bankTransferAmount || 0);

    useEffect(() => {
      setFieldValue("physicalDrawerCash", totalAmount?.toFixed(2));
      setFieldValue("totalCashLeftInDrawer", totalCash?.toFixed(2));
      setFieldValue("cashFlow", totalCash?.toFixed(2));
    }, [totalAmount, totalCash, setFieldValue]);

    return null;
  };

  const handleSubmit = async (values: PosCashRegisterFormInitialValues) => {
    const { bankAccountId, bankTransferAmount, ...rest } = values;
    const denominations = Object.entries(values.denominations || {})
      .filter(([, v]) => Number(v) > 0)
      .map(([k, v]) => ({ currency: Number(k), count: Number(v), amount: Number(k) * Number(v) }));
    const payload = {
      ...rest,
      ...summary,
      ...(denominations?.length && { denominations }),
      ...(bankAccountId && {
        bankAccountId,
        bankTransferAmount: Number(bankTransferAmount) || 0,
      }),
    };
    const posPayload = RemoveEmptyFields(payload) as PosCashRegisterValues;
    await editPosCashRegister(
      { ...posPayload, posCashRegisterId: cashRegisterDetails?.data?.registerId || "" },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Tooltip title="Open Cash Drawer/Close Register">
        <div onClick={() => setOpen(!open)} className="head-icon">
          <CloseIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonModal isOpen={open} onClose={() => setOpen(!open)} title={`Current Register (${createdAt} - ${updatedAt})`} className="max-w-[1100px] m-2 sm:m-5">
        <div className="flex flex-col items-center text-center pt-1">
          <Formik<PosCashRegisterFormInitialValues> initialValues={initialValues} enableReinitialize validationSchema={CurrentRegisterSchema} onSubmit={handleSubmit}>
            {({ values, dirty }) => {
              const getAmount = (note: number) => (Number(values.denominations?.[note]) || 0) * note;
              const totalAmount = currencyNotes.reduce((sum, note) => sum + getAmount(note), 0);

              const totalCashLeftInDrawer = (Number(values?.totalCashLeftInDrawer) || 0) - (Number(values?.physicalDrawerCash) || 0);
              const cashFlow = Number(values?.physicalDrawerCash) - (Number(values?.totalCashLeftInDrawer) || 0);

              return (
                <Form noValidate className="flex flex-col gap-5">
                  <DrawerCalculator currencyNotes={currencyNotes} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody>
                          {Sales.map((item, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 odd:bg-gray-50 dark:odd:bg-gray-dark">
                              <th className="px-3 py-2 text-start font-medium text-gray-600 dark:text-gray-300">{item.label}</th>
                              <td className="px-3 py-2 text-right font-medium dark:text-gray-100">{render(item?.value?.toFixed(2) || "0.00")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                      <table className="w-full text-sm h-full">
                        <thead className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left">Currency</th>
                            <th className="px-3 py-2 w-30">Nos</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currencyNotes.map((note) => (
                            <tr key={note} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark">
                              <td className="px-3 py-2 text-start font-medium text-gray-600 dark:text-gray-300">₹{note}</td>
                              <td className="px-3">
                                <CommonValidationTextField name={`denominations.${note}`} type="number" placeholder="0" maxDigits={5} />
                              </td>
                              <td className="px-3 py-2 text-right dark:text-gray-100">{getAmount(note)?.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="font-semibold bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
                            <th className="px-3 py-2 text-start" colSpan={2}>
                              Total
                            </th>
                            <td className="px-3 py-2 text-right">{(Number(totalAmount) || 0).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-3 text-sm">
                      <Grid container spacing={2}>
                        <CommonValidationSelect name="bankAccountId" label="Bank Account" options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} grid={{ xs: 12 }} />
                        <CommonValidationTextField name="bankTransferAmount" label="Bank Transfer" type="number" grid={{ xs: 12 }} disabled={!values.bankAccountId} required={!!values.bankAccountId} />
                        <CommonValidationTextField name="cashFlow" label="Cash Flow" grid={{ xs: 12 }} />
                        <CommonValidationTextField name="totalCashLeftInDrawer" label="Total Cash Left In Drawer" grid={{ xs: 12 }} disabled />
                        <CommonValidationTextField name="physicalDrawerCash" label="Physical Drawer" type="number" grid={{ xs: 12 }} required />
                        <Grid size={{ xs: 12 }} className="flex justify-start">
                          {totalCashLeftInDrawer > 0 ? <p className="text-red-500 text-base">Short : {totalCashLeftInDrawer.toFixed(2)} ₹</p> : <p className="text-green-500 text-base">Extra : {cashFlow.toFixed(2)} ₹</p>}
                        </Grid>
                        <CommonValidationTextField name="closingNote" label="Closing Note" grid={{ xs: 12 }} rows={3} multiline />
                      </Grid>
                    </div>
                  </div>
                  <CommonButton type="submit" variant="contained" title="Close Register" size="medium" disabled={!dirty} loading={editPosCashRegisterLoading} grid={"auto"} />
                </Form>
              );
            }}
          </Formik>
        </div>
      </CommonModal>
    </>
  );
};

export default CurrentRegister;
