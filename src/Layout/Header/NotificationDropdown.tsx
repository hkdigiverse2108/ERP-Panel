import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
  const notifications = [
    {
      img: "/images/user/user-02.jpg",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-03.jpg",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-02.jpg",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-03.jpg",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-02.jpg",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-03.jpg",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-02.jpg",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-03.jpg",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "/images/user/user-04.jpg",
      name: "Jocelyn Kenter",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "15 min ago",
      status: "success",
    },
  ];

  return (
    <Box className="relative group">
      {/* ICON BUTTON */}
      <IconButton className="relative flex items-center justify-center text-gray-500 transition-colors max-xsm:h-9 max-xsm:w-9 bg-white border! border-gray-200! rounded-full dark:border-gray-800! dark:bg-gray-900! dark:text-gray-400! dark:hover:bg-gray-800! dark:hover:text-white cursor-pointer">
        <Badge color="warning" variant="dot">
          <NotificationsNoneIcon sx={{ fontSize: { xs: 20, md: 22 } }}/>
        </Badge>
      </IconButton>

      {/* DROPDOWN */}
      <div className="fixed lg:absolute max-lg:left-1 max-lg:right-1 lg:right-0 mt-3 flex max-h-[480px] min-w-[285px] md:min-w-[330px] max-w-[350px] flex-col rounded-xl border border-gray-50 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-dark z-50 opacity-0 invisible scale-95 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0">
        {/* HEADER */}
        <div className="flex items-center justify-center p-3 mb-3 border-b border-gray-300 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification</h5>
        </div>

        {/* LIST */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar px-3">
          {notifications.map((notification, index) => (
            <li key={index}>
              <div className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
                <span className="relative block w-10 h-10 rounded-full">
                  <img src={notification.img} alt="User" className="w-full h-full rounded-full" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                </span>

                <span className="block">
                  <span className="mb-1.5 text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">{notification.name}</span>
                    <span>{notification.text}</span>
                  </span>

                  <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                    <span>Project</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{notification.time}</span>
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <Link to="/" className="block px-4 py-2 m-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
          View All Notifications
        </Link>
      </div>
    </Box>
  );
};

export default NotificationDropdown;
