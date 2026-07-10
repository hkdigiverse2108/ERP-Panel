import { CheckCircle, FacebookRounded, MessageRounded, Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button, Grid, Tab, Tabs, TextField, Typography, Chip, Card, CardContent, IconButton, Tooltip, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { Queries, Mutations } from "../../../Api";
import type { MessengerTemplate } from "../../../Types";

const ConfigTab = () => {
  const { data: configData, isLoading: configLoading } = Queries.useGetMessengerConfig();
  const saveConfig = Mutations.useSaveMessengerConfig();
  const config = configData?.data;

  const [form, setForm] = useState({
    pageId: config?.pageId || "",
    pageAccessToken: config?.pageAccessToken || "",
    appSecret: config?.appSecret || "",
    verifyToken: config?.verifyToken || "",
  });

  const handleSave = () => {
    saveConfig.mutate(form);
  };

  if (configLoading) return <CircularProgress />;

  return (
    <Box>
      {config?.isConnected && (
        <Alert severity="success" sx={{ mb: 2 }}>Connected to Facebook Page: {config.pageId}</Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Page ID" value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Page Access Token" type="password" value={form.pageAccessToken} onChange={(e) => setForm({ ...form, pageAccessToken: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="App Secret" type="password" value={form.appSecret} onChange={(e) => setForm({ ...form, appSecret: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Verify Token" value={form.verifyToken} onChange={(e) => setForm({ ...form, verifyToken: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button variant="contained" startIcon={<FacebookRounded />} onClick={handleSave} disabled={saveConfig.isPending}>
            {saveConfig.isPending ? "Saving..." : config?.isConnected ? "Update Connection" : "Connect Facebook Page"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const TemplatesTab = () => {
  const { data: templatesData, isLoading, refetch } = Queries.useGetMessengerTemplate();
  const createTemplate = Mutations.useCreateMessengerTemplate();
  const deleteTemplate = Mutations.useDeleteMessengerTemplate();
  const refreshTemplate = Mutations.useRefreshMessengerTemplate();

  const [form, setForm] = useState({ name: "", language: "en", bodyText: "", variables: "", buttons: "" });
  const [showForm, setShowForm] = useState(false);

  const templates = templatesData?.data?.template_data || [];

  const handleCreate = () => {
    const variables = form.variables ? form.variables.split(",").map((v) => ({ paramName: v.trim(), exampleValue: v.trim() })) : [];
    createTemplate.mutate(
      { name: form.name, language: form.language, bodyText: form.bodyText, variables },
      { onSuccess: () => { setShowForm(false); setForm({ name: "", language: "en", bodyText: "", variables: "", buttons: "" }); refetch(); } },
    );
  };



  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create Template"}</Button>
        <Button variant="outlined" onClick={() => refreshTemplate.mutate({}, { onSuccess: () => refetch() })}>Refresh All</Button>
      </Box>

      {showForm && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Language (e.g. en)" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={4} label="Body Text (use {{variable}} placeholders)" value={form.bodyText} onChange={(e) => setForm({ ...form, bodyText: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Variables (comma-separated, e.g. customer_name,order_id)" value={form.variables} onChange={(e) => setForm({ ...form, variables: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" onClick={handleCreate} disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? "Submitting..." : "Submit Template to Meta"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No templates found. Create your first template above.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((row: MessengerTemplate) => (
                <TableRow key={row._id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={row.status === "APPROVED" ? "success" : row.status === "REJECTED" ? "error" : "warning"} size="small" />
                  </TableCell>
                  <TableCell>{row.language}</TableCell>
                  <TableCell>
                    {row.rejectionReason ? <Tooltip title={row.rejectionReason}><Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>{row.rejectionReason}</Typography></Tooltip> : null}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Refresh Status">
                      <IconButton size="small" onClick={() => refreshTemplate.mutate({ id: row._id }, { onSuccess: () => refetch() })}><CheckCircle fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteTemplate.mutate({ id: row._id }, { onSuccess: () => refetch() })}><DeleteIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

const MessengerSetting = () => {
  const [value, setValue] = useState(0);
  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.MESSENGER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MESSENGER?.BASE || [{ label: PAGE_TITLE.MESSENGER.BASE }]} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, lg: 3, xl: 2 }}>
            <Box className="rounded-lg py-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
              <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
                <Tab icon={<FacebookRounded />} label="Configuration" value={0} iconPosition="start" className="capitalize" />
                <Tab icon={<MessageRounded />} label="Templates" value={1} iconPosition="start" className="capitalize" />
              </Tabs>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9, xl: 10 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
            {value === 0 && <ConfigTab />}
            {value === 1 && <TemplatesTab />}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default MessengerSetting;
