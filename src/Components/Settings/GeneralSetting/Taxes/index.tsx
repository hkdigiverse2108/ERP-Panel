import { useDataGrid } from "../../../../Utils/Hooks";
import { Queries } from "../../../../Api";
import type { TaxBase, AppGridColDef } from "../../../../Types";
import { CommonCard, CommonDataGrid } from "../../../Common";

const Taxes = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();
    const { data: tax_data, isLoading: taxDataLoading, isFetching: taxDataFetching } = Queries.useGetTax(params);

    const allRows = tax_data?.data?.tax_data?.map((tax: TaxBase) => ({ ...tax, id: tax._id })) || [];
    const totalRows = tax_data?.data?.totalData || 0;

    const columns: AppGridColDef<TaxBase>[] = [
        { field: "name", headerName: "Tax Name", flex: 1 },
        { field: "percentage", headerName: "Percentage (%)", flex: 1 },
        // { field: "isActive", headerName: "Status", width: 150, valueGetter: (_v, row) => (row.isActive ? "Active" : "Inactive") },
    ];

    const CommonDataGridOption = {
        columns,
        rows: allRows,
        rowCount: totalRows,
        loading: taxDataLoading || taxDataFetching,
        isActive,
        setActive,
        paginationModel,
        isExport: false,
        onPaginationModelChange: setPaginationModel,
        sortModel,
        onSortModelChange: setSortModel,
        filterModel,
        onFilterModelChange: setFilterModel,
    };

    return (
        <CommonCard title="Taxes">
            <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
    );
};

export default Taxes;
