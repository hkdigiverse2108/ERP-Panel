import { Box, Button, Divider, List, ListItemButton, ListItemText, Popover, TextField } from "@mui/material";
import { DateRangeCalendar, type DateRange } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import { useState, type FC } from "react";
import type { CommonDateRangeSelectorProps } from "../../Types";

const ranges = ["Today", "Yesterday", "This Week", "This Month", "Last 15 Days", "Last 30 Days", "This Quarter", "Last Quarter", "This Financial Year", "Last Financial Year"];

const CommonDateRangeSelector: FC<CommonDateRangeSelectorProps> = ({ value, onChange, BoxClassName ,active}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [selectedRange, setSelectedRange] = useState<string>(active ?? "");
  const [tempRange, setTempRange] = useState<DateRange<Dayjs>>([value.start, value.end]);

  const handleOpen = (e: any) => setAnchorEl(e.currentTarget);

  const closeMenu = () => setAnchorEl(null);

  const handleRangeSelect = (label: string) => {
     setSelectedRange(label);
    const today = dayjs();
    let start = today;
    let end = today;

    switch (label) {
      case "Today":
        break;

      case "Yesterday":
        start = today.subtract(1, "day");
        end = start;
        break;

      case "This Week":
        start = today.startOf("week");
        end = today.endOf("week");
        break;

      case "This Month":
        start = today.startOf("month");
        end = today.endOf("month");
        break;

      case "Last 15 Days":
        start = today.subtract(15, "day");
        break;

      case "Last 30 Days":
        start = today.subtract(30, "day");
        break;

      case "This Quarter": {
        const month = today.month();
        const year = today.year();
        if (month < 3) {
          start = dayjs(`${year}-01-01`);
          end = dayjs(`${year}-03-31`);
        } else if (month < 6) {
          start = dayjs(`${year}-04-01`);
          end = dayjs(`${year}-06-30`);
        } else if (month < 9) {
          start = dayjs(`${year}-07-01`);
          end = dayjs(`${year}-09-30`);
        } else {
          start = dayjs(`${year}-10-01`);
          end = dayjs(`${year}-12-31`);
        }
        break;
      }

      case "Last Quarter": {
        const month = today.month();
        const year = today.year();
        if (month < 3) {
          start = dayjs(`${year - 1}-10-01`);
          end = dayjs(`${year - 1}-12-31`);
        } else if (month < 6) {
          start = dayjs(`${year}-01-01`);
          end = dayjs(`${year}-03-31`);
        } else if (month < 9) {
          start = dayjs(`${year}-04-01`);
          end = dayjs(`${year}-06-30`);
        } else {
          start = dayjs(`${year}-07-01`);
          end = dayjs(`${year}-09-30`);
        }
        break;
      }

      case "This Financial Year":
        start = dayjs(`${today.year()}-04-01`);
        end = dayjs(`${today.year() + 1}-03-31`);
        break;

      case "Last Financial Year":
        start = dayjs(`${today.year() - 1}-04-01`);
        end = dayjs(`${today.year()}-03-31`);
        break;
    }

    // 🔥 Update calendar highlight
    setTempRange([start, end]);
  };

  const applyCustom = () => {
    if (tempRange[0] && tempRange[1]) {
      onChange({ start: tempRange[0], end: tempRange[1] });
      closeMenu();
    }
  };

  return (
    <Box className={BoxClassName}>
      <TextField value={`${value.start.format("DD/MM/YYYY")} - ${value.end.format("DD/MM/YYYY")}`} onClick={handleOpen} fullWidth size="small" inputProps={{ style: { cursor: "pointer" } }} />

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: "100vw", md: "none" },
          }}
        >
          {/* LEFT LIST */}
          <List dense sx={{ width: { xs: "100%", md: 200 }, borderRight: { md: "1px solid #ddd" },borderBottom: { xs: "1px solid #ddd", md: "none" } }}>
            {ranges.map((item) => (
              <ListItemButton key={item} selected={selectedRange === item}  onClick={() => handleRangeSelect(item)}>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>

          {/* RIGHT CALENDAR */}
          <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 300 } , display: "flex", flexDirection: "column", justifyContent: "center" , alignItems: "center"}}>
            <DateRangeCalendar value={tempRange} onChange={(newValue) => setTempRange(newValue)} calendars={1} />

            <Divider sx={{ my: 2 }} />

            <Box sx={{width: "100%",  display: "flex" ,flexDirection:{ xs: "column", md: "row"}, justifyContent: "space-between", alignItems: "center", pb: 2, px:2 ,gap:{xs: 1, md: 0}}}>
              <Box>{tempRange[0] && tempRange[1] ? `${tempRange[0].format("DD/MM/YYYY")} - ${tempRange[1].format("DD/MM/YYYY")}` : ""}</Box>

              <Box sx={{ display: "flex", gap: 1 ,pl: 2}}>
                <Button variant="outlined" onClick={closeMenu}>Cancel</Button>
                <Button variant="contained" onClick={applyCustom}>
                  Apply
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default CommonDateRangeSelector;
