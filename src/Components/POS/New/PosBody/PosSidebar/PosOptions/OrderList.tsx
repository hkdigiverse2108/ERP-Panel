import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Queries } from "../../../../../../Api";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setOrderModal } from "../../../../../../Store/Slices/ModalSlice";
import type { PosOrderBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";

const OrderList = () => {
  const { isOrderModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: true });

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetPosOrder(params, isOrderModal);
  const allBranches = useMemo(() => branchData?.data?.posOrder_data?.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const columns: GridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Order No", flex: 1 },
    { field: "orderType", headerName: "Order Type", flex: 2 },
  ];
  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <CommonModal title="POS Details" isOpen={isOrderModal} onClose={() => dispatch(setOrderModal())} className="max-w-[1000px]">
      <CommonCard hideDivider>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
    </CommonModal>
  );
};

export default OrderList;
