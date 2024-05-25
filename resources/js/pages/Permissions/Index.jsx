import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";

// @mui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  FormHelperText, FormLabel,
  IconButton,
} from "@mui/material";

// components
import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";

// third party
import { useFormik } from "formik";

// icons
import {Settings} from "@mui/icons-material";
import Grid from "@mui/material/Grid";

const PermissionPage = ({ results, option, permissions, user_auth,  user_permissions }) => {
  // Datatables
  const header = [
    { id: "id", label: "ID", alignRight: false, sortable: true },
    { id: "slug", label: "Slug", alignRight: false, sortable: true },
    { id: "name", label: "Name", alignRight: false, sortable: true },
  ];
  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['permissions.update'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || "");
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route("permissions.index");

  const handleSort = (property) => {
    const isAsc = sort === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setSort(property);
    setOrder(newOrder);
    router.get(url, { sort: property, order: newOrder, search ,limit, page: page + 1 });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    router.get(url, { sort, order,search, limit, page: newPage + 1 });
  };
  const handleSearch = () => {
    router.get(url, { search, sort, order,limit, page: 1 });
  };
  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
    router.get(url, { sort, order, search, limit: newLimit, page: 1 });
  };
  // Edit Function
  const [selectedRole, setSelectedRole] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEditModalOpen = (role) => {
    setSelectedRole(role);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setSelectedRole(null);
    setOpenEditModal(false);
  };

  const handleEditPermission = async (updatedPermission) => {
    try {
      await router.post(window.route("permissions.update", selectedRole.id), updatedPermission);
      handleEditModalClose();
    } catch (error) {
      console.error("Failed to update Role:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Permission</title>
        <meta name="description" content="List of Roles" />
      </Head>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="center">
          <Grid item justifyContent="flex-start" >

          </Grid>
          <Grid item justifyContent="flex-end">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{marginRight: '8px'}}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table size={'small'} sx={{ minWidth: 650 }} aria-label="Roles table">
            <TableHead>
              <TableRow>
                {updatedHeader.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={sort === headCell.id}
                        direction={sort === headCell.id ? order : "asc"}
                        onClick={() => handleSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.data.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.slug}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  {
                    (user_auth.role.slug === "admin" || user_permissions.includes("permissions.update")) && (
                      <TableCell>
                        <IconButton variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(role)}>
                          <Settings />
                        </IconButton>
                      </TableCell>
                    )
                  }

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={results.total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MainCard>
      <EditRoleDialog
        open={openEditModal}
        close={handleEditModalClose}
        selectedRole={selectedRole}
        handleEditPermission={handleEditPermission}
        permissions={permissions}
      />
    </div>
  );
};

const EditRoleDialog = ({ open, close, selectedRole, handleEditPermission, permissions }) => {
  const formik = useFormik({
    initialValues: {
      id: selectedRole ? selectedRole.id : "",
      name: selectedRole ? selectedRole.name : "",
      permissions: selectedRole ? selectedRole.permissions.map((p) => p.id) : [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedRole = {
        ...selectedRole,
        id: values.id,
        name: values.name,
        permissions: values.permissions,
      };
      handleEditPermission(updatedRole);
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={close}>
      <DialogTitle>Edit Permission</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            variant="outlined"
            disabled
            {...formik.getFieldProps("name")}
          />
          {permissions.map((permission) => (
            <div key={permission.id}>
            <FormControlLabel

              control={
                <Checkbox
                  checked={formik.values.permissions.includes(permission.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue("permissions", [...formik.values.permissions, permission.id]);
                    } else {
                      formik.setFieldValue("permissions", formik.values.permissions.filter((id) => id !== permission.id));
                    }
                  }}
                />
              }
              label={
              <>
                <FormLabel>{permission.cid}</FormLabel>
                <FormHelperText>{permission.info}</FormHelperText>
              </>
              }
            />

            </div>
          ))}
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

PermissionPage.layout = (page) => <MainLayout>{page}</MainLayout>;

export default PermissionPage;
