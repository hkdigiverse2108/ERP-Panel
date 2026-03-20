 import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PurchaseOrderBase } from "../../../../Types/PurchaseOrder";
import { FormatDate, inWords } from "../../../../Utils";

const PurchaseOrderReport = forwardRef<HTMLDivElement, { bill: PurchaseOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return "ISECON TEMPLE,MUDIYA AHMAD NAGAR,PILIBHIT ROAD,BAREILLY Bhavnagar-605001";

        const parts = [
            addr.address,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name
        ].filter(Boolean);

        let addressStr = parts.join(", ");
        if (addr.pinCode) {
            addressStr += `-${addr.pinCode}`;
        }
        return addressStr;
    };

    const getVendorAddress = () => {
        const addr = bill?.supplierId?.address?.[0];    
        if (!addr) return "G57, CITY CENTER, NEAR IDGH CIRCEL, Anjar, Gujarat(Gujarat), India";
        return [
            addr.addressLine1,
            addr.addressLine2,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name,
            addr.pinCode || ""
        ].filter(Boolean).join(", ");
    };

    const items = bill.items || [];
    const totalQty = items.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
    const netAmount = Number(bill.summary?.netAmount || 0);
    const roundOff = Number(bill.summary?.roundOff || 0);

    // Group items for tax summary if needed, but for now we'll follow the simple table structure
    const taxSummary: Record<string, { taxableValue: number; amount: number }> = {};
    items.forEach(item => {
        const rate = item.taxName ? parseFloat(item.taxName) || 0 : 0;
        const key = rate.toString();
        if (!taxSummary[key]) {
            taxSummary[key] = { taxableValue: 0, amount: 0 };
        }
        taxSummary[key].taxableValue += Number(item.taxableAmount || 0);
        taxSummary[key].amount += Number(item.taxAmount || 0);
    });

    return (
        <div ref={ref} id="purchase-order-print" className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black p-4 font-serif text-[11px] leading-tight">
            <div className="w-full border border-black flex flex-col h-full bg-white relative">
                {/* Header Block */}
                <div className="text-center p-2 border-b border-black">
                    <h1 className="font-bold text-[18px] uppercase tracking-wider">{company?.name || "DISPLAY - VASYERP"}</h1>
                    <div className="font-semibold text-[11px] mt-1">
                        {getCompanyAddress()}
                    </div>
                    <div className="font-semibold text-[10px] mt-0.5 space-x-2">
                        <span>Email : {company?.email || "karan.suthar@vasyerp.com"}</span>
                        <span>|</span>
                        <span>Contact No. : {company?.phoneNo?.phoneNo || "+91-9510476794"}</span>
                        <span>|</span>
                        <span>Fssai No. : 12345678901234</span>
                    </div>
                    <div className="font-semibold text-[10px] mt-0.5 space-x-2 uppercase">
                        <span>GSTIN/UIN : {company?.gstNo || "34AACCC1596Q002"}</span>
                        <span>State : {company?.address?.state?.name || "Gujarat"}(24)</span>
                    </div>
                </div>

                {/* Purchase Order Title */}
                <div className="w-full flex justify-center -mt-3.5 z-10">
                    <div className="bg-white border border-black px-12 py-1 font-bold text-[16px] uppercase shadow-sm">
                        Purchase Order
                    </div>
                </div>

                {/* Meta Section */}
                <div className="flex w-full mt-4 border-b border-black">
                    {/* Buyer (To) info */}
                    <div className="flex-1 border-r border-black p-2 flex flex-col">
                        <div className="font-bold mb-1">To,</div>
                        <div className="font-bold uppercase text-[12px]">{bill.supplierId?.firstName ? `${bill.supplierId.firstName} ${bill.supplierId.lastName || ""}` : "karva enterprise"}</div>
                        <div className="mt-1 text-[10px] leading-snug">
                            {getVendorAddress()}
                        </div>
                        <div className="mt-2 text-[10px] font-bold">
                            Company GSTIN : {bill.supplierId?.address?.[0]?.gstIn || "24ACTPJ9050C1ZL"}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="w-[300px] flex flex-col text-[10px]">
                        <div className="flex border-b border-black">
                            <div className="w-[120px] p-1.5 font-bold border-r border-black">Purchase Order No.</div>
                            <div className="flex-1 p-1.5 font-bold">: {bill.orderNo || "PORD500"}</div>
                        </div>
                        <div className="flex border-b border-black"> 

                            <div className="w-[120px] p-1.5 font-bold border-r border-black">Purchase Order Date</div>
                            <div className="flex-1 p-1.5">: {FormatDate(bill.orderDate || new Date())}</div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="w-[120px] p-1.5 font-bold border-r border-black">Rev. Charge</div>
                            <div className="flex-1 p-1.5">: NO</div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="w-[120px] p-1.5 font-bold border-r border-black">Date of Supply</div>
                            <div className="flex-1 p-1.5">: {FormatDate(bill.date || new Date())}</div>
                        </div>
                        <div className="flex">
                            <div className="w-[120px] p-1.5 font-bold border-r border-black">Place of Supply</div>
                            <div className="flex-1 p-1.5">: {bill.supplierId?.address?.[0]?.state?.name || "Gujarat"}</div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="flex-1 min-h-[400px]">
                    <table className="w-full text-center border-collapse text-[10px]">
                        <thead>
                            <tr className="border-b border-black font-bold">
                                <th className="border-r border-black p-1.5 w-[3%]">#</th>
                                <th className="border-r border-black p-1.5 text-left w-[12%]">Itemcode</th>
                                <th className="border-r border-black p-1.5 text-left w-[25%]">Description</th>
                                <th className="border-r border-black p-1.5 w-[8%]">HSN</th>
                                <th className="border-r border-black p-1.5 w-[8%]">Qty</th>
                                <th className="border-r border-black p-1.5 w-[8%]">UOM</th>
                                <th className="border-r border-black p-1.5 w-[9%]">Rate</th>
                                <th className="border-r border-black p-1.5 w-[9%]">Tax Rate</th>
                                <th className="border-r border-black p-1.5 w-[9%]">Landing</th>
                                <th className="p-1.5 w-[10%]">Total</th>
                            </tr>
                        </thead>
                        <tbody className="align-top">
                            {items.length > 0 ? items.map((item, index) => (
                                <tr key={index} className="border-b border-black border-dotted last:border-black last:border-solid">
                                    <td className="border-r border-black p-1.5">{index + 1}</td>
                                    <td className="border-r border-black p-1.5 text-left font-bold">{item.itemCode || "8901595963409"}</td>
                                    <td className="border-r border-black p-1.5 text-left">
                                        {(item as any).productId?.name || "Ching's Secret Singapore Curry Instant Noodles 60 g"}
                                    </td>
                                    <td className="border-r border-black p-1.5">{(item as any).productId?.hsnCode || ""}</td>
                                    <td className="border-r border-black p-1.5 font-bold">{Number(item.qty || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1.5">{item.unit || "gm"}</td>
                                    <td className="border-r border-black p-1.5 text-right">{Number(item.unitCost || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1.5 text-right">{item.taxName || "0.00"}</td>
                                    <td className="border-r border-black p-1.5 text-right">{Number(item.landingCost || item.unitCost || 0).toFixed(2)}</td>
                                    <td className="p-1.5 text-right font-bold">{Number(item.total || 0).toFixed(2)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center italic text-gray-400">No items added to this purchase order.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals & Summary */}
                <div className="w-full border-t border-black">
                    <table className="w-full text-right border-collapse text-[10px] font-bold">
                        <tbody>
                            <tr className="border-b border-black">
                                <td colSpan={4} className="border-r border-black p-1 px-2 w-[44%]">Total :</td>
                                <td className="border-r border-black p-1 px-2 w-[8%] text-center">{totalQty.toFixed(2)}</td>
                                <td className="border-r border-black p-1 px-2 w-[8%] text-center"></td>
                                <td colSpan={3} className="border-r border-black p-1 px-2 w-[27%]"></td>
                                <td className="p-1 px-2 w-[13%]">{netAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex w-full border-b border-black">
                    <div className="flex-1 border-r border-black flex flex-col">
                        <div className="font-bold text-center border-b border-black p-1">Bank Details</div>
                        <div className="p-2 space-y-1.5 text-[10px]">
                            <div className="flex items-center"><span className="w-24">Bank Name</span><span className="flex-1">:</span></div>
                            <div className="flex items-center"><span className="w-24">Bank Account Number</span><span className="flex-1">:</span></div>
                            <div className="flex items-center"><span className="w-24">Bank Branch IFSC</span><span className="flex-1">:</span></div>
                            <div className="flex items-center"><span className="w-24">Bank Branch Name</span><span className="flex-1">:</span></div>
                        </div>
                    </div>
                    <div className="w-[300px] flex flex-col text-[11px] font-bold">
                        <div className="flex justify-between p-2 pb-1">
                            <span>Round Off</span>
                            <span>: {roundOff.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between p-2 pt-0 text-[13px]">
                            <span>Net Amount</span>
                            <span>: {netAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Tax Summary Block */}
                <div className="w-full border-b border-black">
                    <div className="text-center font-bold p-1 border-b border-black bg-gray-50 uppercase text-[10px]">
                        TAX SUMMARY
                    </div>
                    <table className="w-full text-center border-collapse text-[9px] font-bold uppercase">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="border-r border-black p-1 w-[8%]">Sr. No.</th>
                                <th className="border-r border-black p-1 w-[28%]">HSN / SAC</th>
                                <th className="border-r border-black p-1 w-[16%]">TAXABLE VALUE</th>
                                <th className="border-r border-black p-1 w-[24%]" colSpan={2}>CENTRAL TAX</th>
                                <th className="p-1 w-[24%]" colSpan={2}>STATE TAX</th>
                            </tr>
                            <tr className="border-b border-black">
                                <th className="border-r border-black" colSpan={3}></th>
                                <th className="border-r border-black p-1 w-[12%]">RATE</th>
                                <th className="border-r border-black p-1 w-[12%]">AMOUNT</th>
                                <th className="border-r border-black p-1 w-[12%]">RATE</th>
                                <th className="p-1 w-[12%]">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(taxSummary).length > 0 ? Object.keys(taxSummary).map((rate, idx) => {
                                const r = parseFloat(rate);
                                return (
                                    <tr key={idx} className="border-b border-black last:border-b-0">
                                        <td className="border-r border-black p-1">{idx + 1}</td>
                                        <td className="border-r border-black p-1"></td>
                                        <td className="border-r border-black p-1 text-right">{taxSummary[rate].taxableValue.toFixed(2)}</td>
                                        <td className="border-r border-black p-1">{(r / 2).toFixed(2)}</td>
                                        <td className="border-r border-black p-1 text-right">{(taxSummary[rate].amount / 2).toFixed(2)}</td>
                                        <td className="border-r border-black p-1">{(r / 2).toFixed(2)}</td>
                                        <td className="p-1 text-right">{(taxSummary[rate].amount / 2).toFixed(2)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td className="border-r border-black p-1">1</td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1 text-right">0.00</td>
                                    <td className="border-r border-black p-1">0.00</td>
                                    <td className="border-r border-black p-1 text-right">0.00</td>
                                    <td className="border-r border-black p-1">0.00</td>
                                    <td className="p-1 text-right">0.00</td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>

                <div className="w-full border-b border-black p-1.5 font-bold text-[11px]">
                    Rupees {inWords(Math.round(netAmount))} Only
                </div>

                {/* Footer terms & Signature */}
                <div className="flex w-full min-h-[140px]">
                    <div className="flex-1 border-r border-black p-3 flex flex-col">
                        <div className="font-bold underline text-[12px] mb-2 uppercase">Terms & Conditions</div>
                        <ol className="list-decimal ml-4 text-[10px] space-y-1 font-semibold">
                            {bill.termsAndConditionIds?.map((term: any, id) => (
                                <li key={id}>{term.termsCondition}</li>
                            )) || (
                                <>
                                    <li>demoterm</li>
                                    <li>test</li>
                                </>
                            )}
                        </ol>
                    </div>

                    <div className="flex-1 p-3 flex flex-col justify-between items-end">
                        <div className="font-bold text-[12px] uppercase">
                            For, {company?.name || "DISPLAY - VASYERP"}
                        </div>

                        <div className="w-full flex flex-col items-center mt-auto">
                            <div className="h-12 flex items-center justify-center font-[cursive] text-[20px] opacity-70 italic" style={{ transform: "rotate(-5deg)" }}>
                                {company?.signature ? <img src={company.signature} alt="Signature" className="h-10 object-contain" /> : "Signature"}
                            </div>
                            <div className="border-t border-black w-48 text-center pt-1 font-bold text-[11px] uppercase tracking-tighter mt-1">
                                Authorised Signatory
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom static bar */}
                <div className="w-full flex justify-between items-end text-[9px] p-1 px-2 font-semibold border-t border-black">
                    <div>This is computer generated order.</div>
                    <div>Page 1 of 1</div>
                    <div>E.O.E.</div>
                </div>
            </div>
        </div>
    );
});

PurchaseOrderReport.displayName = "PurchaseOrderReport";

export default PurchaseOrderReport;
