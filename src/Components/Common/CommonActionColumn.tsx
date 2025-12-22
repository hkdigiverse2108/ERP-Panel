import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

interface CommonActionColumnProps<T> {
  editRoute?: string;
  onDelete?: (row: T) => void;
}

const CommonActionColumn = <T extends { _id?: string }>({ editRoute, onDelete }: CommonActionColumnProps<T>): GridColDef<T> => ({
  field: "actions",
  headerName: "Actions",
  width: 120,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <Grid container spacing={1}>
      {editRoute && (
        <Grid size="auto">
          <Link to={editRoute} state={{ data: params.row }}>
            <IconButton color="primary" size="small">
              <EditIcon />
            </IconButton>
          </Link>
        </Grid>
      )}
      {onDelete && (
        <Grid size="auto">
          <IconButton color="error" size="small" onClick={() => onDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  ),
});

export default CommonActionColumn;
