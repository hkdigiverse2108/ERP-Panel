import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge, Box, IconButton } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
 const [open, setOpen] = useState(false);

 const toggle = () => setOpen((prev) => !prev);
 

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
    <Box>
      <IconButton onClick={toggle} className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border! border-gray-200! rounded-full dropdown-toggle dark:border-gray-800! dark:bg-gray-900! dark:text-gray-400! dark:hover:bg-gray-800! dark:hover:text-white!">
        <Badge color="warning" variant="dot" invisible={open}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      {open && (
        <div className="absolute right-0 mt-3 flex max-h-[480px] sm:w-[361px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-dark z-50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification</h5>
            <button onClick={toggle} className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
            {notifications.map((notification, index) => (
              <li key={index}>
                <div className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <img width={40} height={40} src={notification.img} alt="User" className="w-full overflow-hidden rounded-full" />
                    <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                  </span>

                  <span className="block">
                    <span className="mb-1.5 block  text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                      <span className="font-medium text-gray-800 dark:text-white/90">{notification.name}</span>
                      <span>{notification?.text}</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">{notification?.project}</span>
                    </span>

                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span>Project</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{notification?.time}</span>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/" className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            View All Notifications
          </Link>
        </div>
      )}
    </Box>
  );
};

export default NotificationDropdown;
