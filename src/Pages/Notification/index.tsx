import { useMemo } from "react";
import { Queries } from "../../Api";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import type { AppGridColDef } from "../../Types";
import { BREADCRUMBS } from "../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";
import type { NotificationBase } from "../../Types/Notification";

const Notification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetNotification({}, false);
  const { data: notificationData, isLoading: notificationLoading, isFetching: notificationFetching } = Queries.useGetNotification(params);

  const allNotifications = useMemo(
    () =>
      notificationData?.data?.notification_data?.map((item) => ({
        ...item,
        id: item._id,
        isActive: !item.isRead,
      })) || [],
    [notificationData],
  );

  const totalRows = notificationData?.data?.totalData || 0;

  const columns: AppGridColDef<NotificationBase>[] = [
    { field: "title", headerName: "Title", flex: 1, minWidth: 200 },
    { field: "message", headerName: "Message", flex: 2, minWidth: 250 },
    CommonObjectPropertyColumn<NotificationBase>("meta.type", "meta", ["type"], { headerName: "Type", width: 120 }),
    CommonObjectPropertyColumn<NotificationBase>("meta.action", "meta", ["action"], { headerName: "Action", width: 120 }),
    CommonObjectPropertyColumn<NotificationBase>("meta.text", "meta", ["text"], { headerName: "Meta Text", flex: 1, minWidth: 150 }),
    {
      field: "isRead",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <span className={`status-${params.value ? "success" : "warning"}`}>{params.value ? "Read" : "Unread"}</span>,
    },
    CommonObjectPropertyColumn<NotificationBase>("createdAt", "createdAt", [], { headerName: "Date", flex: 1, minWidth: 150, type: "datetime" }),

    // CommonActionColumn<NotificationBase>({
    //   active: (row) => !row.isRead && readNotification(row._id as string),
    // }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allNotifications,
    rowCount: totalRows,
    loading: notificationLoading || notificationFetching,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.NOTIFICATION,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.NOTIFICATION} maxItems={1} breadcrumbs={BREADCRUMBS.NOTIFICATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default Notification;
