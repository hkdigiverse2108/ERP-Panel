import { Grid, IconButton, Button, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid, CommonModal, CommonBreadcrumbs } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
import { PAGE_TITLE } from "../../../Constants";

const BankTransaction = () => {
  const { paginationModel, setPaginationModel } = useDataGrid({
    page: 0,
    pageSize: 10,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const rows = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        voucherNo: `VCH-00${i + 1}`,
        transactionDate: "2025-01-10",
        fromAccount: "HDFC Bank",
        toAccount: "ICICI Bank",
        amount: 15000,
        createdBy: "Admin",
        location: "Mumbai",
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
    { field: "voucherNo", headerName: "Voucher No", flex: 1 },
    { field: "transactionDate", headerName: "Transaction Date", flex: 1 },
    { field: "fromAccount", headerName: "From Account", flex: 1 },
    { field: "toAccount", headerName: "To Account", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params: any) => `₹ ${params.value}`,
    },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: any) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <IconButton color="primary" size="small" onClick={() => setOpenDialog(true)}>
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

  const topContent = (
    <Button variant="contained" size="large" onClick={() => setOpenDialog(true)}>
      ADD
    </Button>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTION.BASE || "Bank Transactions"} maxItems={1} />

      <div className="m-4 md:m-6">
        <CommonCard title="Bank Transactions" topContent={topContent}>
          <CommonDataGrid columns={columns} rows={rows} rowCount={rows.length} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} pageSizeOptions={[5, 10, 25]} />
        </CommonCard>
      </div>

      {/* ================= Add Transaction Dialog ================= */}
      <AddTransactionDialog open={openDialog} onClose={() => setOpenDialog(false)} />

      {/* ================= Delete Confirmation ================= */}
      <CommonModal isOpen={Boolean(rowToDelete)} onClose={() => setRowToDelete(null)} className="max-w-125 m-2 sm:m-5 pt-0!">
        <p className="text-red-500 text-xl font-semibold mb-3">Confirm Delete</p>
        <p className="my-3">Are you sure you want to delete voucher "{rowToDelete?.voucherNo}"?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setRowToDelete(null)}>No</Button>
          <Button color="error">Yes</Button>
        </div>
      </CommonModal>
    </>
  );
};
const AddTransactionDialog = ({ open, onClose }: any) => {
  return (
    <CommonModal isOpen={open} onClose={onClose} className="max-w-xl">
      <p className="text-xl font-semibold mb-4">Add Bank Transaction</p>

      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField fullWidth label="From Account" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="To Account" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="Amount" type="number" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="Transaction Date" type="date" InputLabelProps={{ shrink: true }} />
        </Grid>

        <Grid size={12}>
          <TextField fullWidth label="Description" multiline rows={3} />
        </Grid>
      </Grid>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </div>
    </CommonModal>
  );
};

export default BankTransaction;
