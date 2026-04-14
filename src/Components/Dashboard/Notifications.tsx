import { Box } from "@mui/material";
import { CommonCard } from "../Common";
import { Queries } from "../../Api/Queries";
import { FormatDateTime } from "../../Utils";
import { Mutations } from "../../Api";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";

const Notifications = () => {
  const { data: notificationData } = Queries.useGetNotification({ readFilter: "false" });
  const { mutate: readNotification } = Mutations.useReadNotification();
  const notifications = notificationData?.data?.notification_data || [];
  const unreadCount = notificationData?.data?.unreadCount;
  const handleRead = (id: string) => {
    readNotification(id);
  };

  return (
    <CommonCard title="Notifications : " grid={{ xs: 12, md: 4 }} paperProps={{ className: "relative" }} >
      <span className="absolute top-6 left-30 text-theme-sm text-gray-800 dark:text-gray-200">{unreadCount}</span>
      <Link to={ROUTES.NOTIFICATION.BASE} className="absolute top-6 right-3 text-theme-sm text-gray-800 dark:text-gray-200">
        View All
      </Link>
      {notifications?.length > 0 ? (
        <Box className="flex flex-col max-h-[385px] overflow-y-auto custom-scrollbar">
          {notifications?.map((item, index) => (
            <Box key={index}>
              <div onClick={() => !item.isRead && handleRead(item._id)} className={`relative flex items-center gap-3 border-b border-gray-100 p-3 px-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800   `}>
                <div className="flex flex-col">
                  <span className="mb-1 text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                    <span className="block font-medium text-gray-800 dark:text-white">{item.title}</span>
                    <span>{item.message}</span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{FormatDateTime(item.createdAt)}</span>
                </div>
                {!item.isRead && <span className={`absolute right-1 top-1 w-2 h-2 rounded-full bg-green-700`}></span>}
              </div>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="flex items-center justify-center h-full min-h-[385px]">
          <span className="text-theme-sm text-gray-500 dark:text-gray-400">No notifications</span>
        </Box>
      )}
    </CommonCard>
  );
};

export default Notifications;
