// import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
// import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
// import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsIcon from '@mui/icons-material/Settings';
// import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { PAGE_TITLE, ROUTES } from "../Constants";
import PeopleIcon from "@mui/icons-material/People"
import type { NavItem } from "../Types";



export const NavItems: NavItem[] = [
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <PeopleIcon />, name: PAGE_TITLE.EMPLOYEE.LIST, path: ROUTES.EMPLOYEE.LIST },
  { icon: <GridViewRoundedIcon/>, name: PAGE_TITLE.BRANCH.BASE, path:ROUTES.BRANCH.BASE},
  // { icon: <GridViewRoundedIcon />, name: "Contact", path: ROUTES.CONTACT.BASE },
  // { icon: <GridViewRoundedIcon />, name: "Employee", path: ROUTES.EMPLOYEE.BASE },
  { icon: <GridViewRoundedIcon />, name:INVENTORY.PRODUCT, path:ROUTES.INVENTORY.PRODUCT },
  // {
  //   icon: <CalendarMonthRoundedIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <PersonRoundedIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <FormatListBulletedRoundedIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableChartRoundedIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  {
    name: PAGE_TITLE.SETTINGS.BASE,
    icon: <SettingsIcon  />,
    subItems: [
      { name: PAGE_TITLE.SETTINGS.GENERAL, path: ROUTES.SETTINGS.GENERAL, pro: false },
    ],
  },
];

