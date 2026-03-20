import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Queries } from "../../../Api";
import { CommonDateRangeSelector } from "../../../Attribute";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import type { PosCashRegisterBase, PosCashRegisterValues } from "../../../Types/PosCashRegister";
import { CreateFilter, DateConfig, FormatDate, FormatTime, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { useReactToPrint } from "react-to-print";
import CloseBillRegister from "../../../Components/POS/New/PosHeader/CloseRegister";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const SalesRegister = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });
  const [printData, setPrintData] = useState<PosCashRegisterValues | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState({ start: DateConfig.utc().startOf("month"), end: DateConfig.utc().endOf("month") });
  const queryParams = useMemo(() => ({ startDate: dateRange.start.toISOString(), endDate: dateRange.end.toISOString() }), [dateRange]);
  const { data: userDropdown, isLoading: userDropdownLoading } = Queries.useGetUserDropdown();

  const { data, isLoading, isFetching } = Queries.useGetPosCashRegister({ ...params, ...queryParams });

  const rows = useMemo(() => {
    const apiData = data?.data?.posCashRegister_data;
    return apiData?.map((r: PosCashRegisterBase) => ({ ...r, id: r._id, shortExceed: (r.physicalDrawerCash || 0) - (r.totalCashInDrawer || 0) })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(rows, ["openingCash", "cashPayment", "cardPayment", "upiPayment", "payLater", "totalSales", "creditAdvanceRedeemed", "salesReturn", "physicalDrawerCash", "shortExceed"]);
  }, [rows]);

  const salesmanOptions = useMemo(() => {
    return userDropdown?.data?.map((user) => ({ ...user, name: user.fullName || user.username || "Unnamed" })) || [];
  }, [userDropdown]);

  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      setPrintData(null);
    },
  });

  useEffect(() => {
    if (printData && contentRef.current) {
      handlePrint();
    }
  }, [printData, handlePrint]);
  const handlePrintBtn = (row: PosCashRegisterBase) => {
    const printPayload = {
      ...row,
      startDate: FormatDate(row?.createdAt),
      startTime: FormatTime(row?.createdAt),
      endDate: FormatDate(row?.updatedAt),
      endTime: FormatTime(row?.updatedAt),
    };
    setPrintData(printPayload as PosCashRegisterValues);
  };

  const columns: AppGridColDef<PosCashRegisterBase>[] = [
    CommonObjectPropertyColumn<PosCashRegisterBase>("salesManId", "salesManId", ["fullName"], { headerName: "Sales Man", width: 150 }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("created", "createdAt", [], { headerName: "From Date", width: 100, type: "date" }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("updated", "updatedAt", [], { headerName: "To Date", width: 100, type: "date" }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("status", "status", [], { headerName: "Status", width: 100, type: "status" }),
    { field: "openingCash", headerName: "Cash In Hand", width: 100 },
    { field: "cashPayment", headerName: "Cash", width: 100 },
    { field: "cardPayment", headerName: "Card", width: 100 },
    { field: "upiPayment", headerName: "UPI", width: 100 },
    { field: "payLater", headerName: "Pay Later", width: 100 },
    { field: "totalSales", headerName: "Total Sales", width: 130 },
    { field: "creditAdvanceRedeemed", headerName: "Credit / Advance Redeemed", width: 190 },
    { field: "salesReturn", headerName: "Sales Return Amount", width: 160 },
    { field: "bankTransferAmount", headerName: "Cash Transfered To HO", width: 180 },
    { field: "physicalDrawerCash", headerName: "Closing Amount", width: 150 },
    { field: "shortExceed", headerName: "Short / Exceed", width: 140 },
    CommonActionColumn<PosCashRegisterBase>({
      onPrint: { handlePrint: (row) => handlePrintBtn(row), isPermission: (row) => row.status !== "closed" },
    }),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: "Sales Register",
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [CreateFilter("Select Salesman", "salesManId", advancedFilter, updateAdvancedFilter, GenerateOptions(salesmanOptions), userDropdownLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.SALES_REGISTER} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_REGISTER.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} defaultExpanded>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CommonDateRangeSelector value={dateRange} onChange={setDateRange} />
          </Grid>
        </AdvancedSearch>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
      </Box>
      <div className="hidden">{printData && <CloseBillRegister ref={contentRef} data={printData} />}</div>
    </>
  );
};

export default SalesRegister;
