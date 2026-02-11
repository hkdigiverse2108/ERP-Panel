import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../../Attribute";
import { PAYMENT_MODE } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setMultiplePay } from "../../../../../Store/Slices/PosSlice";
import type { CommonTableColumn, MultiplePaymentType, PosProductDataModal } from "../../../../../Types";
import { MultiplePaySchema } from "../../../../../Utils/ValidationSchemas";
import { CommonTable } from "../../../../Common";
import { Queries } from "../../../../../Api";
import { GenerateOptions } from "../../../../../Utils";

interface MultiplePayValues {
  multiplePayments: MultiplePaymentType[];
}

const MultiplePay = () => {
  const dispatch = useAppDispatch();

  const { PosProduct, isPosLoading } = useAppSelector((state) => state.pos);
  const productData = PosProduct.items;

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();

  const initialValues: MultiplePayValues = {
    multiplePayments: [
      {
        amount: PosProduct.totalAmount,
        method: "cash",
        paymentAccountId: "",
        cardHolderName: "",
        cardTransactionNo: "",
        upiId: "",
        bankAccountNo: "",
        chequeNo: "",
      },
    ],
  };

  const handleSubmit = (values: MultiplePayValues) => {
    console.log(values);
  };

  const columns: CommonTableColumn<PosProductDataModal>[] = [
    { key: "sr", header: "Sr No.", headerClass: "text-start", bodyClass: "text-start", render: (_, i) => i + 1 },
    { key: "name", header: "Product", headerClass: "text-start", bodyClass: "text-start", render: (row) => row.name },
    { key: "posQty", header: "Qty", headerClass: "text-end", bodyClass: "text-end", render: (row) => row.posQty },
  ];

  const CommonTableOption = {
    isLoading: isPosLoading,
    data: productData,
    rowKey: (row: PosProductDataModal) => row._id,
    columns: columns,
    getRowClass: () => "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark",
  };

  return (
    <Box className=" p-3 md:p-5">
      {/* LEFT – SUMMARY */}
      <Grid container spacing={2} className="bg-white dark:bg-gray-dark p-3">
        <Grid size={{ xs: 12, lg: 5, xl: 3 }} className="border-b lg:border-e border-gray-200 dark:border-gray-800 py-3 ps-2 pe-2 lg:pe-7 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-medium mb-1 text-gray-600 dark:text-gray-300">Sale Summary</h3>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Customer : </span>
              <span className="text-sm text-brand-500">Walk in Customer</span>
            </div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden my-3">
              <div className="max-h-120 overflow-y-auto custom-scrollbar">
                <CommonTable {...CommonTableOption} />
              </div>
            </div>
          </div>
          <div className="text-base space-y-2 text-gray-800 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Tax Amount</span>
              <span className="dark:text-gray-300">{PosProduct.totalTaxAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="dark:text-gray-300">{PosProduct.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Roundoff</span>
              <span className="dark:text-gray-300">{PosProduct.roundOff}</span>
            </div>
            <div className="flex flex-col items-end font-normal">
              <span className="text-3xl dark:text-gray-300">{PosProduct.totalAmount}</span>
              <span>Payable Amount</span>
            </div>
          </div>
        </Grid>

        {/* RIGHT – PAYMENTS */}
        <Grid size={{ xs: 12, lg: 7, xl: 9 }}>
          <h3 className="font-semibold mb-3 text-gray-600 dark:text-gray-300">Pay</h3>

          <div className="space-y-3">
            <div className="sm:p-3 rounded">
              <Formik enableReinitialize initialValues={initialValues} validationSchema={MultiplePaySchema} onSubmit={handleSubmit}>
                {({ values }) => (
                  <Form>
                    <FieldArray name="multiplePayments">
                      {({ push, remove }) => {
                        const totalAmount = values.multiplePayments.reduce((total, pay) => total + (pay.amount ? Number(pay.amount) : 0), 0);

                        return (
                          <div className="flex flex-col gap-3">
                            <div className="space-y-3 max-h-145! overflow-y-auto custom-scrollbar">
                              {values.multiplePayments.map((pay, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                  <Grid container spacing={2} alignItems="center">
                                    <CommonValidationTextField name={`multiplePayments.${index}.amount`} label="Received Amount" type="number" grid={{ xs: 10, sm: 3 }} />
                                    <CommonValidationSelect name={`multiplePayments.${index}.method`} label="Payment Method" options={PAYMENT_MODE} grid={{ xs: 12, sm: 4 }} />
                                    {!["cash"].includes(pay.method) && <CommonValidationSelect name={`multiplePayments.${index}.paymentAccountId`} label="Payment Account:" options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} grid={{ xs: 12, sm: 4 }} />}
                                    {values.multiplePayments.length > 1 && (
                                      <Grid size={"auto"}>
                                        <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 20 }} onClick={() => remove(index)}>
                                          <CloseIcon />
                                        </CommonButton>
                                      </Grid>
                                    )}
                                    {pay.method === "card" && (
                                      <>
                                        <CommonValidationTextField name={`multiplePayments.${index}.cardHolderName`} label="Card Holder Name" grid={{ xs: 12, sm: 4 }} />
                                        <CommonValidationTextField name={`multiplePayments.${index}.cardTransactionNo`} label="Card Transaction No" grid={{ xs: 12, sm: 4 }} />
                                      </>
                                    )}
                                    {pay.method === "upi" && <CommonValidationTextField name={`multiplePayments.${index}.upiId`} label="UPI ID" grid={{ xs: 12, sm: 4 }} />}
                                    {pay.method === "bank" && <CommonValidationTextField name={`multiplePayments.${index}.bankAccountNo`} label="Bank Account No" grid={{ xs: 12, sm: 4 }} />}
                                    {pay.method === "cheque" && <CommonValidationTextField name={`multiplePayments.${index}.chequeNo`} label="Cheque No" grid={{ xs: 12, sm: 4 }} />}
                                  </Grid>
                                </div>
                              ))}
                            </div>
                            <div>
                              <CommonButton type="button" variant="text" title="➕ Add More Payment" disabled={totalAmount >= PosProduct.totalAmount} onClick={() => push({ amount: "", method: "cash" })} />
                              <p className="my-2 text-lg text-gray-600 dark:text-gray-300">
                                Total Amount :- <span className="font-semibold">{totalAmount}</span>
                              </p>
                              {totalAmount >= PosProduct.totalAmount ?<p className="my-2 text-lg text-gray-600 dark:text-gray-300">
                                Change Amount :- <span className="font-semibold">{totalAmount - PosProduct.totalAmount}</span>
                              </p>  : <p className="text-red-500 my-2 text-base">Note: If you don't pay in full, the remaining amount will be considered as Pay Later.</p>}

                              {/* SUBMIT */}
                              <div className="flex gap-3">
                                <CommonButton variant="outlined" type="submit" title="Back To Sale" startIcon={<KeyboardDoubleArrowLeftIcon />} className="mt-4" onClick={() => dispatch(setMultiplePay())} />
                                <CommonButton variant="contained" type="submit" title="Proceed To Pay" endIcon={<KeyboardDoubleArrowRightIcon />} className="mt-4" />
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </FieldArray>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultiplePay;
