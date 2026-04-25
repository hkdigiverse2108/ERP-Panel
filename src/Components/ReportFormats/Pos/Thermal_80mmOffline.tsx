import { forwardRef, Fragment } from "react";
import { useAppSelector } from "../../../Store/hooks";
import type { PosOrderBase } from "../../../Types";
import { FormatDate, FormatDateTime, FormatPayment } from "../../../Utils";
import { Divider } from "@mui/material";

const Thermal_80mmOffline = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const getTaxPercent = (item: PosOrderBase["items"][number]) => {
    return item?.productId?.salesTaxId?.percentage || 0;
  };

  const getCompanyAddress = () => {
    const addr = company?.address;
    if (!addr) return null;

    const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

    let addressStr = parts.join(", ");
    if (addr.pinCode) {
      addressStr += ` - ${addr.pinCode}`;
    }

    return addressStr;
  };

  // Tax calculations
  const taxSummary = bill.items?.reduce((acc: Record<string, any>, item) => {
    const taxPercent = getTaxPercent(item);
    if (!acc[taxPercent]) {
      acc[taxPercent] = { taxableValue: 0, cgst: 0, sgst: 0, igst: 0, cess: 0 };
    }
    const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
    const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);

    acc[taxPercent].taxableValue += net;

    // Assuming intra-state for now (CGST/SGST split).
    // You could adjust logic based on actual user state versus company state if igst is needed.
    const taxAmount = item.productId?.isSalesTaxIncluding ? 0 : (net * taxPercent) / 100;
    acc[taxPercent].cgst += taxAmount / 2;
    acc[taxPercent].sgst += taxAmount / 2;

    return acc;
  }, {});

  const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
  const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;

  return (
    <div ref={ref} id="last-bill-print" className="mx-auto w-[80mm] bg-white text-black p-4 font-mono text-[12px] leading-tight">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-bold capitalize text-[14px]">{company?.name || "Vasy ERP Solutions Private Limited"}</h2>
        <div className="text-[10px] mt-1">
          {getCompanyAddress() && <div>{getCompanyAddress()}</div>}
          {company?.phoneNo && (
            <div>
              Ph: {company.phoneNo.countryCode}-{company.phoneNo.phoneNo}
            </div>
          )}
        </div>
        <h3 className="mt-3 font-bold text-[13px]">Tax Invoice</h3>
      </div>

      {/* Customer Meta */}
      <div className="flex justify-between mb-2 text-[11px]">
        <div className="flex flex-col">
          <div className="flex gap-1">
            <span className="font-bold w-14">Name</span>
            <span>: {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Walk In Customer"}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold w-14">Mob No.</span>
            <span>
              : {bill?.customerId?.phoneNo?.countryCode ? `${bill?.customerId?.phoneNo?.countryCode}-` : ""}
              {bill?.customerId?.phoneNo?.phoneNo || "-"}
            </span>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex gap-1 justify-end">
            <span className="font-bold">Date</span>
            <span>: {FormatDate(bill.createdAt)}</span>
          </div>
          <div className="flex gap-1 justify-end">
            <span className="font-bold">Invoice No.</span>
            <span>: {bill.orderNo}</span>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <table className="w-full text-[11px] border-t border-b border-dashed border-black mb-2">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-left py-1 w-[5%]">#</th>
            <th className="text-left py-1 w-[45%]">Item</th>
            <th className="text-center py-1 w-[12%]">Qty</th>
            <th className="text-center py-1 w-[18%]">MRP</th>
            <th className="text-right py-1 w-[20%]">Net Amt.</th>
          </tr>
        </thead>
        <tbody>
          {bill?.items?.map((item, index) => {
            const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);

            return (
              <Fragment key={index}>
                <tr className="align-top">
                  <td className="py-1">{index + 1}</td>
                  <td className="py-1">
                    <div className="font-bold">{item.productId?.name}</div>
                    {item.productId?.variant && <div className="text-[10px]">{item.productId.variant}</div>}
                  </td>
                  <td className="text-center py-1">{Number(item.qty || 0).toFixed(3)}</td>
                  <td className="text-center py-1">{Number(item.mrp || 0).toFixed(2)}</td>
                  <td className="text-right py-1">{Number(item.netAmount || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="pl-6 text-[9px] italic font-semibold pb-1">
                    HSN: {item.productId?.hsnCode || "-"} GST@{getTaxPercent(item)}%{discAmt > 0 && ` || Discount: ${Number(discAmt.toFixed(2))}`}
                    {item.productId?.description && <div className="text-gray-600 font-normal">Description : {item.productId.description}</div>}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-2 text-[11px]">
        {bill.additionalCharges?.length > 0 && (
          <div className="flex justify-between border-b border-dashed border-black pb-1 mb-1">
            <span className="font-bold">Test Additional Charge</span>
            <span>
              : <span className="inline-block w-16 text-right font-bold">{Number(bill.additionalCharges?.reduce((acc, charge) => acc + (charge.totalAmount || 0), 0)?.toFixed(2) || 0)}</span>
            </span>
          </div>
        )}

        <div className="flex flex-col items-end pr-2 font-bold">
          <div className="flex justify-between w-[50%]">
            <span>TOTAL</span>
            <span>
              : <span className="inline-block w-16 text-right">{Number(bill.totalAmount?.toFixed(2) || 0)}</span>
            </span>
          </div>
          {bill.roundOff > 0 && (
            <div className="flex justify-between w-[50%]">
              <span>ROUND OFF</span>
              <span>
                : <span className="inline-block w-16 text-right">{Number(bill.roundOff?.toFixed(2) || 0)}</span>
              </span>
            </div>
          )}
          {bill.multiplePayments?.map((payment, index) => (
            <div className="flex justify-between w-[50%]" key={index}>
              <span className="uppercase">BY {FormatPayment(payment.method)}</span>
              <span>
                : <span className="inline-block w-16 text-right">{Number(payment.amount?.toFixed(2) || 0)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <Divider className="my-2! border-dashed! border-black!" />

      {/* Summary */}
      <div className="text-center font-bold text-[11px] mb-2 leading-relaxed">
        <div>PIECES PURCHASED : {Number(totalQty.toFixed(2))}</div>
        <div>DISCOUNT ITEMS : {Number(totalDiscount.toFixed(2))}</div>
        <div>TOTAL SAVINGS : {Number((bill.totalDiscount + bill.flatDiscountAmount).toFixed(2))}</div>
      </div>

      <Divider className="my-2! border-dashed! border-black!" />

      {/* Tax Summary */}
      <div className="mb-2">
        <div className="text-center font-bold text-[11px] mb-1">TAX SUMMARY</div>
        <table className="w-full text-[10px] border border-black text-center">
          <thead>
            <tr className="border-b border-black font-bold">
              <th className="border-r border-black p-1">
                TAXABLE
                <br />
                VALUE
              </th>
              <th className="border-r border-black p-1">CGST</th>
              <th className="border-r border-black p-1">SGST</th>
              <th className="border-r border-black p-1">Cess</th>
              <th className="p-1">IGST</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(taxSummary).length > 0 ? (
              Object.keys(taxSummary).map((taxP) => (
                <tr key={taxP}>
                  <td className="border-r border-black p-1 font-bold">{Number(taxSummary[taxP].taxableValue || 0).toFixed(2)}</td>
                  <td className="border-r border-black p-1 font-bold">{Number(taxSummary[taxP].cgst || 0).toFixed(2)}</td>
                  <td className="border-r border-black p-1 font-bold">{Number(taxSummary[taxP].sgst || 0).toFixed(2)}</td>
                  <td className="border-r border-black p-1 font-bold text-gray-500">N/A</td>
                  <td className="p-1 font-bold text-gray-500">N/A</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-1 font-bold italic">
                  No taxes applied
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Divider className="my-2! border-dashed! border-black!" />

      {/* Terms and Conditions */}
      <div className="text-[10px] mb-2">
        <div className="font-bold">T&C</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
      </div>

      <Divider className="my-2! border-dashed! border-black!" />

      {/* Customer Details */}
      <div className="text-[11px] mb-2">
        <div className="font-bold">Customer Details</div>
        <div className="font-bold mt-1">Address : {bill?.customerId?.address && bill.customerId.address.length > 0 ? `${bill.customerId.address[0]?.addressLine1 || ""}, ${bill.customerId.address[0]?.city?.name || ""}` : "-"}</div>
      </div>

      <Divider className="my-2! border-dashed! border-black!" />

      {/* Footer */}
      <div className="text-center font-bold text-[11px] mb-3">Thank You For Shopping At {bill?.companyId?.name || company?.name}</div>

      {/* Barcode Placeholder */}
      {/* <div className="flex justify-center mb-4 overflow-hidden">
        <div className="h-10 border-x-4 border-l-black border-r-black border-dashed flex items-end px-4 gap-1">
          <div className="w-1 h-full bg-black"></div>
          <div className="w-2 h-full bg-black"></div>
          <div className="w-1 h-full bg-black"></div>
          <div className="w-3 h-full bg-black"></div>
          <div className="w-1 h-full bg-black"></div>
          <div className="w-2 h-full bg-black"></div>
        </div>
      </div> */}

      <div className="flex justify-between text-[10px] font-bold">
        <span>Printed On: {FormatDateTime(new Date())}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default Thermal_80mmOffline;
