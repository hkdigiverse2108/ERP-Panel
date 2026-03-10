import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";
import { FormatDateTime, FormatPayment } from "../../../../Utils";

const BillReceipt80mmType2 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
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

        const taxAmount = item.productId?.isSalesTaxIncluding ? 0 : (net * taxPercent) / 100;
        acc[taxPercent].cgst += taxAmount / 2;
        acc[taxPercent].sgst += taxAmount / 2;

        return acc;
    }, {});

    const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
    const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;

    const getItemTax = (item: PosOrderBase["items"][number]) => {
        const taxPercent = getTaxPercent(item);
        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
        const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);
        let taxAmt = 0;
        if (item.productId?.isSalesTaxIncluding) {
            taxAmt = net - (net / (1 + (taxPercent / 100)));
        } else {
            taxAmt = (net * taxPercent) / 100;
        }
        return taxAmt;
    };

    const tendered = bill.multiplePayments?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
    const change = Math.max(0, tendered - (bill.totalAmount || 0));

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[80mm] bg-white text-black p-4 font-mono text-[12px] leading-tight flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-4 w-full">
                <h2 className="font-bold text-[15px]">{company?.name || "DMART company"}</h2>
                <div className="text-[11px] mt-1 mb-1 font-semibold flex flex-col items-center">
                    {getCompanyAddress() ? <div>{getCompanyAddress()}</div> : <div>A-5, Vasyerp solutions, The<br />FirstAhmedabad, Gujarat, India</div>}
                    {company?.phoneNo ? (
                        <div>
                            Telephone No.: {company.phoneNo.countryCode}{company.phoneNo.phoneNo}
                        </div>
                    ) : (
                        <div>Telephone No.: 7874972830</div>
                    )}
                </div>

                <div className="font-bold text-[12px] mt-2">
                    GSTIN: {company?.gstin || "27AACCA8432H2ZP"}
                </div>
                <h3 className="font-bold text-[14px] mt-1">Tax Invoice</h3>
                <div className="font-bold text-[12px]">Date: {FormatDateTime(bill.createdAt)}</div>
            </div>

            {/* Customer Meta */}
            <div className="flex flex-col mb-3 text-[12px] font-bold w-full">
                <div className="flex">
                    <div className="w-20">Name:</div>
                    <div>{bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "dinein"}</div>
                </div>
                <div className="flex">
                    <div className="w-20">Mob No. :</div>
                    <div>{bill?.customerId?.phoneNo?.phoneNo || "-"}</div>
                </div>
                <div className="flex">
                    <div className="w-20">Bill No. :</div>
                    <div>{bill.orderNo}</div>
                </div>
            </div>

            {/* Product Table */}
            <table className="w-full text-[11px] border-y border-dashed border-black mb-2 font-bold">
                <thead>
                    <tr className="border-b border-dashed border-black">
                        <th className="text-left py-1 w-[5%] p-0">#</th>
                        <th className="text-left py-1 w-[35%] p-0 pl-1">Item</th>
                        <th className="text-center py-1 w-[15%] p-0">Qty.</th>
                        <th className="text-center py-1 w-[15%] p-0">MRP</th>
                        <th className="text-center py-1 w-[15%] p-0">Dis</th>
                        <th className="text-right py-1 w-[15%] p-0 pr-1">Net Amt</th>
                    </tr>
                </thead>
                <tbody>
                    {bill?.items?.map((item, index) => {
                        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
                        const taxPercent = getTaxPercent(item);
                        const taxAmt = getItemTax(item);

                        return (
                            <React.Fragment key={index}>
                                <tr className="align-top">
                                    <td className="py-1 p-0">{index + 1}</td>
                                    <td className="py-1 p-0 pl-1">
                                        <div>{item.productId?.name}</div>
                                        {taxAmt > 0 && <div className="text-[9px] font-semibold text-gray-700">GST ({taxPercent}%) RS <br />{taxAmt.toFixed(4)}</div>}
                                    </td>
                                    <td className="text-center py-1 p-0">{Number(item.qty || 0).toString()}</td>
                                    <td className="text-center py-1 p-0">{Number(item.mrp || 0).toFixed(4)}</td>
                                    <td className="text-center py-1 p-0">{Number(discAmt).toFixed(4)}</td>
                                    <td className="text-right py-1 p-0 pr-1">{Number(item.netAmount || 0).toFixed(4)}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            {/* Totals */}
            <div className="mb-2 text-[11px] font-bold border-b border-dashed border-black pb-1 w-full">
                <div className="flex justify-between">
                    <span>Total</span>
                    <span>{Number(bill.totalAmount?.toFixed(4) || 0).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Additional Discount</span>
                    <span>{Number(bill.totalDiscount || 0).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Roundoff</span>
                    <span>{Number(bill.roundOff || 0).toFixed(4)}</span>
                </div>
                {bill.multiplePayments?.map((payment, index) => (
                    <div className="flex justify-between" key={index}>
                        <span className="uppercase">By {FormatPayment(payment.method)}</span>
                        <span>{Number(payment.amount?.toFixed(4) || 0).toFixed(4)}</span>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="text-center font-bold text-[11px] mb-2 leading-tight w-full flex flex-col items-center">
                <div className="flex justify-between w-40"><span>Pieces Purchased</span><span>: {Number(totalQty.toFixed(2))}</span></div>
                <div className="flex justify-between w-40"><span>Discount Items</span><span>: {Number(totalDiscount.toFixed(2))}</span></div>
                <div className="flex justify-between w-40"><span>Total Discount</span><span>: {Number((bill.totalDiscount + bill.flatDiscountAmount).toFixed(4))}</span></div>
                <div className="flex justify-between w-40"><span>Tendered</span><span>: {Number(tendered.toFixed(4))}</span></div>
                <div className="flex justify-between w-40"><span>Change</span><span>: {Number(change.toFixed(4))}</span></div>
            </div>

            {/* Tax Summary */}
            <div className="mb-2 w-full">
                <div className="text-center font-bold text-[11px] mb-1">Tax Summary</div>
                <table className="w-full text-[10px] border border-dashed border-black text-center font-bold">
                    <thead>
                        <tr className="border-b border-dashed border-black">
                            <th className="p-1 border-r border-dashed border-black">TAX RATE</th>
                            <th className="p-1 border-r border-dashed border-black">TAXABLE<br />VALUE</th>
                            <th className="p-1 border-r border-dashed border-black">SGST</th>
                            <th className="p-1">CGST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(taxSummary).length > 0 ? (
                            Object.keys(taxSummary).map((taxP) => (
                                <tr key={taxP}>
                                    <td className="border-r border-dashed border-black p-1">{taxP}%</td>
                                    <td className="border-r border-dashed border-black p-1">{Number(taxSummary[taxP].taxableValue || 0).toFixed(4)}</td>
                                    <td className="border-r border-dashed border-black p-1">{Number(taxSummary[taxP].sgst || 0).toFixed(4)}</td>
                                    <td className="p-1">{Number(taxSummary[taxP].cgst || 0).toFixed(4)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-1 font-bold italic">No taxes applied</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Terms and Conditions */}
            <div className="text-[10px] font-bold mb-2 w-full px-1">
                <div>T & C</div>
                <ul className="list-disc pl-3 m-0">
                    <li>Any additional charges (processing fees, *late payment fees, or service charges) will be mentioned separately on the invoice.</li>
                    <li>All applicable taxes (GST, VAT, etc.) will be included in the invoice as per government regulations.</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="text-center font-bold text-[11px] mb-3 w-full">
                Thank you for shopping at {company?.name || "DMART company"}
            </div>

            {/* Barcode Placeholder */}
            <div className="flex flex-col items-center mb-4 w-full">
                <div className="h-10 border-x-4 border-l-black border-r-black flex items-end px-4 gap-1">
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-3 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                </div>
                <div className="font-bold text-[14px] tracking-widest mt-1">{bill.orderNo}</div>
            </div>

            <div className="flex justify-between text-[10px] font-bold w-full">
                <span>Printed On: {FormatDateTime(new Date())}</span>
                <span>E & O E.</span>
            </div>
        </div>
    );
});

export default BillReceipt80mmType2;
