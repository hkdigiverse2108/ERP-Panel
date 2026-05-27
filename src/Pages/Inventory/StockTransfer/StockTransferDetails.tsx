import { Box, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonBottomActionBar } from "../../../Components/Common";
import { CommonButton } from "../../../Attribute";
import { BREADCRUMBS, STOCK_TRANSFER_STATUS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import type { StockTransferItem } from "../../../Types";
import { ApproveModal, RejectModal, ConfirmReceiptModal } from "./modals/ActionModals";
import { PAGE_TITLE } from "../../../Constants";

const StockTransferDetails = () => {
  const location = useLocation();
  const id = (location.state as { id?: string })?.id;
  const { user } = useAppSelector((state) => state.auth);
  const [activeModal, setActiveModal] = useState<"approve" | "reject" | "confirm" | null>(null);

  const { data: response, refetch } = Queries.useGetSingleStockTransfer(id);
  const data = response?.data;

  const { mutate: dispatchMutate, isPending } = Mutations.useDispatchStockTransfer();

  const effectiveBranchId = user?.branchId?._id;
  const isSender = data?.requestedToBranchId?._id === effectiveBranchId;
  const isReceiver = data?.requestedByBranchId?._id === effectiveBranchId;

  const canApprove = data?.status === STOCK_TRANSFER_STATUS.PENDING && isSender;
  const canConfirm = data?.status === STOCK_TRANSFER_STATUS.DISPATCHED && isReceiver;
  const canDispatched = (data?.status === STOCK_TRANSFER_STATUS.APPROVED || data?.status === STOCK_TRANSFER_STATUS.PARTIALLY_APPROVED) && isSender;
  const showAction = canApprove || canConfirm || canDispatched;

  const infoItems = [
    { label: "Transfer No", value: data?.transferNo },
    { label: "Status", value: data?.status.toUpperCase(), color: data?.status === "pending" ? "warning.main" : "success.main" },
    { label: "From (Requester)", value: data?.requestedByBranchId?.name },
    { label: "To (Sender)", value: data?.requestedToBranchId?.name },
    { label: "Approved By", value: data?.approvedBy?.fullName || "-" },
    { label: "Received By", value: data?.receivedBy?.fullName || "-" },
    { label: "Request Note", value: data?.requestNote || "-" },
    { label: "Approval Note", value: data?.approvalNote || "-" },
    { label: "Receipt Note", value: data?.receiptNote || "-" },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_TRANSFER.DETAIL} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_TRANSFER.DETAIL} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: showAction ? 10 : 0, display: "grid", gap: 3 }}>
        <CommonCard title="Information">
          <Grid container spacing={3} sx={{ p: 2 }}>
            {infoItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: index >= 6 ? 12 : 6, md: index >= 6 ? 12 : 3 }} key={index}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ color: item.color || "text.primary", fontWeight: 500 }}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CommonCard>

        <CommonCard title="Items">
          <Box sx={{ minWidth: "max-content" }}>
            <div className="border border-gray-200 dark:border-gray-700  overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-3 w-10">#</th>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Req Qty</th>
                    {data?.status !== STOCK_TRANSFER_STATUS.PENDING && <th className="p-3 text-center">Appr Qty</th>}
                    {data ? data.status === STOCK_TRANSFER_STATUS.COMPLETED && <th className="p-3 text-center">Recv Qty</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 ">
                  {(data?.items || []).map((item: StockTransferItem, index: number) => (
                    <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors even:bg-gray-50 dark:even:bg-gray-dark">
                      <td className="p-3 text-gray-500">{index + 1}</td>
                      <td className="p-3 font-medium">{item.productId.name}</td>
                      <td className="p-3 text-right">{item.price.toLocaleString()}</td>
                      <td className="p-3 text-center">{item.requestedQty}</td>
                      {data?.status !== STOCK_TRANSFER_STATUS.PENDING && <td className="p-3 text-center font-semibold text-blue-600">{item.approvedQty}</td>}
                      {data?.status === STOCK_TRANSFER_STATUS.COMPLETED && <td className="p-3 text-center font-semibold text-green-600">{item.receivedQty}</td>}
                    </tr>
                  ))}
                  {(!data?.items || data.items.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Box>
        </CommonCard>

        {showAction && (
          <CommonBottomActionBar>
            <Box sx={{ display: "flex", gap: 2 }}>
              {canApprove && (
                <>
                  <CommonButton onClick={() => setActiveModal("reject")} variant="outlined" color="error" title="Reject" />
                  <CommonButton type="submit" variant="contained" title="Approve" onClick={() => setActiveModal("approve")} />
                </>
              )}
              {canConfirm && (
                <CommonButton onClick={() => setActiveModal("confirm")} color="success" variant="contained">
                  Confirm Receipt
                </CommonButton>
              )}
              {canDispatched && (
                <CommonButton loading={isPending} onClick={() => dispatchMutate({ stockTransferId: data._id || "" }, { onSuccess: () => refetch() })} color="secondary" variant="contained">
                  Dispatched
                </CommonButton>
              )}
            </Box>
          </CommonBottomActionBar>
        )}
      </Box>

      {data && (
        <>
          <ApproveModal open={activeModal === "approve"} data={data} onClose={() => setActiveModal(null)} onSuccess={() => refetch()} />
          <RejectModal open={activeModal === "reject"} data={data} onClose={() => setActiveModal(null)} onSuccess={() => refetch()} />
          <ConfirmReceiptModal open={activeModal === "confirm"} data={data} onClose={() => setActiveModal(null)} onSuccess={() => refetch()} />
        </>
      )}
    </>
  );
};

export default StockTransferDetails;
