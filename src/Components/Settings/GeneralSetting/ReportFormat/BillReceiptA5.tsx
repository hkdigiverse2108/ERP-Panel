import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";
import { FormatDate, FormatDateTime, FormatPayment } from "../../../../Utils";

const BillReceiptA5 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getTaxPercent = (item: PosOrderBase["items"][number]) => {
        return item?.productId?.salesTaxId?.percentage || 0;
    };

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return null;

        const parts = [addr.address, addr.city?.name, addr.state?.name].filter(Boolean);

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

        const taxAmount = item.productId?.isSalesTaxIncluding ? 0 : (net * taxPercent) / 100;
        acc[taxPercent].cgst += taxAmount / 2;
        acc[taxPercent].sgst += taxAmount / 2;

        return acc;
    }, {});

    const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
    const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;
    const totalTax = Object.values(taxSummary).reduce((acc: number, tax: any) => acc + tax.cgst + tax.sgst + tax.igst + tax.cess, 0);

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[148mm] bg-white text-black p-6 font-mono text-[14px] leading-relaxed">
            {/* Header */}
            <div className="text-center mb-6">
                {/* Logo is kept here as per the template, but we can make it conditional or remove if needed */}
                <div className="h-20 w-20 mx-auto mb-3 border border-black flex items-center justify-center font-bold text-3xl">
                    {company?.name?.substring(0, 2).toUpperCase() || "JK"}
                </div>

                <h2 className="font-bold capitalize text-[18px]">{company?.name || "Vasy ERP Solutions Private Limited"}</h2>
                <div className="text-[12px] mt-2 font-bold">
                    {getCompanyAddress() && <div>{getCompanyAddress()}</div>}
                    <div className="mt-1">
                        {company?.email && <span>Email : {company.email} | </span>}
                        {company?.phoneNo && <span>Contact No. : {company.phoneNo.phoneNo}</span>}
                    </div>
                    {company?.address?.state?.name && <div className="mt-1">State : {company.address.state.name} ({company?.address?.state?.code || "24"})</div>}
                </div>
            </div>

            {/* Customer Meta */}
            <div className="flex justify-between mb-4 text-[13px] font-bold">
                <div className="flex flex-col gap-1 w-1/2">
                    <div className="flex">
                        <span className="w-24 inline-block">Name</span>
                        <span>: {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Walk In Customer"}</span>
                    </div>
                    <div className="flex">
                        <span className="w-24 inline-block">Invoice No.</span>
                        <span>: {bill.orderNo}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-1/2 text-right">
                    <div className="flex justify-end">
                        <span className="text-left w-16 inline-block">Date</span>
                        <span>: {FormatDate(bill.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Product Table */}
            <table className="w-full text-[13px] border-t border-b border-dashed border-black mb-2">
                <thead>
                    <tr className="border-b border-dashed border-black">
                        <th className="text-left py-2 w-[5%] font-bold">Sr.</th>
                        <th className="text-left py-2 w-[45%] font-bold">Item Name</th>
                        <th className="text-center py-2 w-[12%] font-bold">Qty</th>
                        <th className="text-center py-2 w-[18%] font-bold">Amount</th>
                        <th className="text-right py-2 w-[20%] font-bold">Net Amt.</th>
                    </tr>
                </thead>
                <tbody>
                    {bill?.items?.map((item, index) => {
                        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);

                        return (
                            <React.Fragment key={index}>
                                <tr className="align-top font-bold">
                                    <td className="py-2">{index + 1}</td>
                                    <td className="py-2">
                                        <div>{item.productId?.name}</div>
                                    </td>
                                    <td className="text-center py-2">{Number(item.qty || 0).toFixed(3)}</td>
                                    <td className="text-center py-2">{Number(item.mrp || 0).toFixed(2)}</td>
                                    <td className="text-right py-2">{Number(item.netAmount || 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="pl-6 text-[11px] italic font-semibold pb-2 border-b border-dashed border-gray-300">
                                        {discAmt > 0 && <div>Disc : {Number(discAmt.toFixed(2))}</div>}
                                        {item.productId?.description && <div className="text-gray-600 font-normal">Description : {item.productId.description}</div>}
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            {/* Additional Charges inline */}
            {bill.additionalCharges?.length > 0 && (
                <div className="text-[13px] font-bold mb-2 border-b border-dashed border-black pb-2 pt-1">
                    <div className="flex justify-between">
                        <span className="w-1/2">Test Additional Charge</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(bill.additionalCharges?.reduce((acc, charge) => acc + (charge.totalAmount || 0), 0)?.toFixed(2) || 0)}</span>
                    </div>
                    <div className="text-[11px] italic font-semibold mt-1">HSN:213 GST 1.0</div>
                </div>
            )}

            {/* Totals */}
            <div className="mb-4 text-[13px] font-bold border-b border-dashed border-black pb-3 pt-1">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between w-full">
                        <span className="w-1/2 uppercase">TOTAL</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(bill.totalAmount?.toFixed(2) || 0)}</span>
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="w-1/2 uppercase">TOTAL TAX</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(totalTax.toFixed(2))}</span>
                    </div>
                    {bill.roundOff > 0 && (
                        <div className="flex justify-between w-full">
                            <span className="w-1/2 uppercase">ROUND OFF</span>
                            <span>:</span>
                            <span className="w-24 text-right">{Number(bill.roundOff?.toFixed(2) || 0)}</span>
                        </div>
                    )}
                    {bill.multiplePayments?.map((payment, index) => (
                        <div className="flex justify-between w-full" key={index}>
                            <span className="uppercase w-1/2">BY {FormatPayment(payment.method)}</span>
                            <span>:</span>
                            <span className="w-24 text-right">{Number(payment.amount?.toFixed(2) || 0)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="text-center font-bold text-[13px] mb-4 leading-relaxed border-b border-dashed border-black pb-3">
                <div>PIECES PURCHASED : {Number(totalQty.toFixed(0))}</div>
                <div>DISCOUNT ITEMS : {Number(totalDiscount.toFixed(0))}</div>
                <div>TOTAL SAVINGS : {Number((bill.totalDiscount + bill.flatDiscountAmount).toFixed(2))}</div>
                <div>YOUR EXTRA SAVINGS : {Number(0).toFixed(2)}</div>
            </div>

            {/* Tax Summary */}
            <div className="mb-4 border-b border-dashed border-black pb-3">
                <table className="w-full text-[12px] text-center font-bold">
                    <thead>
                        <tr className="border-b border-dashed border-black">
                            <th className="p-2">TAXABLE VALUE</th>
                            <th className="p-2">CGST</th>
                            <th className="p-2">SGST</th>
                            <th className="p-2">CESS</th>
                            <th className="p-2">IGST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(taxSummary).length > 0 ? (
                            Object.keys(taxSummary).map((taxP) => (
                                <tr key={taxP}>
                                    <td className="p-2">{Number(taxSummary[taxP].taxableValue || 0).toFixed(2)}</td>
                                    <td className="p-2">{Number(taxSummary[taxP].cgst || 0).toFixed(2)}</td>
                                    <td className="p-2">{Number(taxSummary[taxP].sgst || 0).toFixed(2)}</td>
                                    <td className="p-2">N/A</td>
                                    <td className="p-2">N/A</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-2 italic">No taxes applied</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Customer Details */}
            <div className="text-[13px] mb-4 font-bold border-b border-dashed border-black pb-3">
                <div className="mb-1">Customer Details</div>
                <div>
                    Address : {bill?.customerId?.address && bill.customerId.address.length > 0 ? `${bill.customerId.address[0]?.addressLine1 || ""}, ${bill.customerId.address[0]?.city?.name || ""}` : "Aadityana"}
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="text-[12px] mb-6 font-bold border-b border-dashed border-black pb-5">
                <div className="mb-2">T&C</div>
                <div className="mb-1">Terms And Conditions</div>
                <div className="mb-1">Terms And Conditions two</div>
                <div className="mb-1">Terms And Conditions Three</div>

                <div className="text-center mt-6 text-[13px]">
                    Thank you for shopping at {bill?.companyId?.name || company?.name}
                </div>

                {/* Barcode Placeholder */}
                <div className="flex justify-center mt-4 overflow-hidden">
                    <div className="h-10 border-x-4 border-l-black border-r-black border-dashed flex items-end px-6 gap-2">
                        <div className="w-1 h-full bg-black"></div>
                        <div className="w-2 h-full bg-black"></div>
                        <div className="w-1 h-full bg-black"></div>
                        <div className="w-4 h-full bg-black"></div>
                        <div className="w-2 h-full bg-black"></div>
                        <div className="w-3 h-full bg-black"></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between text-[11px] font-bold">
                <span>Printed On: {FormatDateTime(new Date())}</span>
                <span>E & O.E.</span>
            </div>
        </div>
    );
});

export default BillReceiptA5;
