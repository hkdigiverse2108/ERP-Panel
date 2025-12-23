import { Grid, IconButton,Button } from "@mui/material";
import { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid, CommonModal, CommonBreadcrumbs } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
import { PAGE_TITLE } from "../../../Constants";

const PaymentList = () => {
  const { paginationModel, setPaginationModel } = useDataGrid({
    page: 0,
    pageSize: 10,
  });

  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const rows = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        paymentNo: `PAY-00${i + 1}`,
        partyName: "ABC Traders",
        paymentMode: "Cash",
        type: "Received",
        date: "2025-01-10",
        amount: 12000,
        status: "Completed",
        createdBy: "Admin",
      })),
    []
  );

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      width: 80,
      renderCell: (params: any) => paginationModel.page * paginationModel.pageSize + params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "paymentNo", headerName: "Payment No", flex: 1 },
    { field: "partyName", headerName: "Party Name", flex: 1 },
    { field: "paymentMode", headerName: "Payment Mode", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params: any) => `₹ ${params.value}`,
    },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: any) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <IconButton color="primary" size="small">
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid size="auto">
            <IconButton color="error" size="small" onClick={() => setRowToDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT.BASE || "Payments"} maxItems={1} />

      <div className="m-4 md:m-6">
        <CommonCard title="Payments">
          <CommonDataGrid columns={columns} rows={rows} rowCount={rows.length} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} pageSizeOptions={[5, 10, 25]} />
        </CommonCard>
      </div>

      {/* ================= Delete Confirmation ================= */}
      <CommonModal isOpen={Boolean(rowToDelete)} onClose={() => setRowToDelete(null)} className="max-w-125 m-2 sm:m-5 pt-0!">
        <p className="text-red-500 text-xl font-semibold mb-3">Confirm Delete</p>
        <p className="my-3">Are you sure you want to delete payment "{rowToDelete?.paymentNo}"?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setRowToDelete(null)}>No</Button>
          <Button color="error">Yes</Button>
        </div>
      </CommonModal>
    </>
  );
};

export default PaymentList;
