import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import { setPrefixModal } from "../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PrefixBase } from "../../../../Types";
import { useDataGrid } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid } from "../../../Common";
import PrefixForm from "./PrefixForm";
import { CommonObjectPropertyColumn } from "../../../Common/CommonDataGrid/CommonColumns";

const Prefix = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid();

  const dispatch = useDispatch();

  const { data: prefixData, isLoading: prefixDataLoading, isFetching: prefixDataFetching } = Queries.useGetPrefix(params);

  const allRows = useMemo(() => prefixData?.data?.prefix_data.map((item) => ({ ...item, id: item?._id })) || [], [prefixData]);
  const totalRows = prefixData?.data?.totalData || 0;

  const handleEdit = (row: PrefixBase) => dispatch(setPrefixModal({ open: true, data: row }));

  const columns: AppGridColDef<PrefixBase>[] = [
    { field: "prefixType", headerName: "Prefix Type", flex: 1, minWidth: 200, valueGetter: (_value, row) => row.prefixType?.split("_").join(" ") },
    { field: "prefix", headerName: "Prefix", flex: 1, minWidth: 200 },
    { field: "sequenceNumber", headerName: "Sequence No.", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<PrefixBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    CommonActionColumn<PrefixBase>({
      onEdit: { handleEdit: (row) => handleEdit(row) },
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: prefixDataLoading || prefixDataFetching,
    paginationModel,
    isExport: false,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.PREFIX.BASE,
  };

  return (
    <Box sx={{ display: "grid" }}>
      <CommonCard title={PAGE_TITLE.SETTINGS.PREFIX.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <PrefixForm />
    </Box>
  );
};

export default Prefix;
