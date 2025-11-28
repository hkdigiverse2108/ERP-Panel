import { Box, Grid, Menu, Stack, Typography } from "@mui/material";
import { useState } from "react";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NoteIcon from "@mui/icons-material/Note";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function QuickActionMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <Typography sx={{ cursor: "pointer", fontWeight: "600" }} onMouseEnter={handleOpen}>
        Quick Action
      </Typography>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { padding: 2, width: 900, borderRadius: 3, boxShadow: 4 },
        }}
      >
        <Grid container spacing={4}>
          {/* SALES */}
          <Grid item xs={12} sm={4} md={2.4}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Sales</Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptLongIcon fontSize="small" /> <Typography>Invoice</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <NoteIcon fontSize="small" /> <Typography>Credit Note</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* BANK / CASH */}
          <Grid item xs={12} sm={4} md={2.4}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Bank / Cash</Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountBalanceIcon fontSize="small" /> <Typography>Bank</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidIcon fontSize="small" /> <Typography>Bank Transaction</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptIcon fontSize="small" /> <Typography>Receipt</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidIcon fontSize="small" /> <Typography>Payment</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* PURCHASE */}
          <Grid item xs={12} sm={4} md={2.4}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Purchase</Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ShoppingCartIcon fontSize="small" /> <Typography>Supplier Bill</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <NoteIcon fontSize="small" /> <Typography>Debit Note</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} sm={4} md={2.4}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Contact</Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" /> <Typography>Contact</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* INVENTORY */}
          <Grid item xs={12} sm={4} md={2.4}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Inventory</Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Inventory2Icon fontSize="small" /> <Typography>Product</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CompareArrowsIcon fontSize="small" /> <Typography>Stock Transfer</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryIcon fontSize="small" /> <Typography>Price Master</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Menu>
    </Box>
  );
}
