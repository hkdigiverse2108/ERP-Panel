import { AccountBalance, GridViewRounded, People, PersonRounded, PointOfSale, Redeem, Settings } from "@mui/icons-material";
import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";

export const NavItems: NavItem[] = [
  { icon: <GridViewRounded />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <People />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USERS.BASE },
  { icon: <PersonRounded />, name: PAGE_TITLE.CONTACT.BASE, path: ROUTES.CONTACT.BASE },
  {
    name: PAGE_TITLE.INVENTORY.BASE,
    icon: <Settings />,
    children: [
      { name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, path: ROUTES.PRODUCT.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.STOCK.BASE, path: ROUTES.STOCK.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.RECIPE.BASE, path: ROUTES.RECIPE.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, path: ROUTES.STOCK_VERIFICATION.BASE },
      { name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, path: ROUTES.BILL_OF_LIVE_PRODUCT.BASE },
      { name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, path: ROUTES.MATERIAL_CONSUMPTION.BASE },
    ],
  },
  {
    name: PAGE_TITLE.BANK_CASH.BASE,
    icon: <AccountBalance />,
    children: [
      { name: PAGE_TITLE.BANK.BASE, path: ROUTES.BANK.BASE },
      { name: PAGE_TITLE.TRANSACTION.BASE, path: ROUTES.TRANSACTION.BASE },
      { name: PAGE_TITLE.PAYMENT.BASE, path: ROUTES.PAYMENT.BASE },
    ],
  },
  {
    name: PAGE_TITLE.POS.BASE,
    icon: <PointOfSale />,
    children: [
      { name: PAGE_TITLE.POS.NEW, path: ROUTES.POS.NEW },
      { name: PAGE_TITLE.POS.ORDER_LIST, path: ROUTES.POS.ORDER_LIST },
    ],
  },
  {
    name: PAGE_TITLE.CRM.BASE,
    icon: <Redeem />,
    children: [
      { name: PAGE_TITLE.CRM.COUPON.BASE, path: ROUTES.COUPON.BASE },
      { name: PAGE_TITLE.CRM.LOYALTY.BASE, path: ROUTES.LOYALTY.BASE },
    ],
  },
  {
    name: PAGE_TITLE.PURCHASE.BASE,
    icon: <Settings />,
    children: [
      { name: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE, path: ROUTES.SUPPLIER_BILL.BASE },
      { name: PAGE_TITLE.PURCHASE.PURCHASE_ORDER.BASE, path: ROUTES.PURCHASE_ORDER.BASE },
    ],
  },
  {
    name: PAGE_TITLE.SETTINGS.BASE,
    icon: <Settings />,
    children: [{ name: PAGE_TITLE.SETTINGS.GENERAL, path: ROUTES.SETTINGS.GENERAL, pro: false }],
  },
];
