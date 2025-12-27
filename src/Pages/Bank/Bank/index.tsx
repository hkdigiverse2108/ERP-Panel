import { Grid, IconButton, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid, CommonModal, CommonBreadcrumbs } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
import { KEYS, PAGE_TITLE, ROUTES } from "../../../Constants";
import { Mutations, Queries } from "../../../Api";
import { useQueryClient } from "@tanstack/react-query";
import { BankBreadCrumbs } from "../../../Data";


const Bank = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  const bankParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: filterModel?.quickFilterValues?.[0],
    }),
    [paginationModel, filterModel]
  );

  const queryClient = useQueryClient();  
  const [rowToDelete, setRowToDelete] = useState<any>(null);

   const { data: bankData, isLoading } = Queries.useGetBank(bankParams);

   const { mutate: deleteBankMutate } = Mutations.useDeleteBank(); 

   const allBanks = useMemo(() => {
     return (
       bankData?.data?.bank_data?.map((bank: any) => ({
         ...bank,
        id: bank?._id,
       })) || []
     );
   }, [bankData]);

   const totalRows = bankData?.data?.totalData || 0;
   const handleDelete = () => {
     deleteBankMutate(rowToDelete?._id, {
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [KEYS.BANK.ALL] });
         setRowToDelete(null);
     },
    });
   };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "bankName", headerName: "Bank Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "accountHolderName",
      headerName: "Account Holder Name",
      flex: 1,
    },
    {
      field: "accountNumber",
      headerName: "Account No.",
      flex: 1,
      renderCell: (params: any) => {
        const value = params.value || ""; 
        return `XXXX${value.slice(-4)}`;
      },
    },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <Link to={ROUTES.BANK.ADD_EDIT} state={{ data: params.row }}>
              <IconButton color="primary" size="small">
                <EditIcon />
              </IconButton>
            </Link>
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
    <Grid container spacing={2} alignItems="center">
      <Grid size="auto">
        <Link to={ROUTES.BANK.ADD_EDIT}>
          <Button variant="contained" color="primary" size="large" sx={{ px: 4, fontSize: "0.9rem" }}>
            ADD
          </Button>
        </Link>
      </Grid>
    </Grid>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.BASE} maxItems={1} breadcrumbs={BankBreadCrumbs} />

      <div className="m-4 md:m-6">
        <CommonCard title="Banks" topContent={topContent}>
           <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allBanks} rowCount={totalRows} loading={isLoading} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} /> 
        </CommonCard>

        {/* Delete Confirmation */}
        <CommonModal isOpen={Boolean(rowToDelete)} onClose={() => setRowToDelete(null)} className=" m-2 sm:m-5 pt-0!">
          <p className="text-red-500 text-2xl mb-4 font-semibold">Confirm Delete</p>
          <p className="my-3">Are you sure you want to delete "{rowToDelete?.bankName}"?</p>
          <div className="flex justify-end">
            <Button onClick={() => setRowToDelete(null)}>No</Button>
            <Button color="error" onClick={handleDelete}> 
              Yes
            </Button> 
          </div>
        </CommonModal>
      </div>
    </>
  );
};

export default Bank;
