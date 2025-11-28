import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import type { NavItem } from "../Types";

export const NavItems: NavItem[] = [
  {
    icon: <DashboardRoundedIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <CalendarMonthRoundedIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <PersonRoundedIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <FormatListBulletedRoundedIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableChartRoundedIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <DescriptionRoundedIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];
