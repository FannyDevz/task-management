import React, {useEffect, useState} from "react";
import { Head, router } from "@inertiajs/react";

// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
//components
import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";
// third party
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from "@mui/material/Grid";

const RolesPage = ({ results, option, user_auth,  user_permissions }) => {
  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'slug', label: 'Slug', alignRight: false ,sortable: true},
    { id: 'name', label: 'Name', alignRight: false ,sortable: true},
  ]
  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['roles.update', 'roles.delete'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('roles.index');
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
  const handleEditRole = async(updatedRole) => {
    try {
      await router.post(window.route("roles.update", selectedRole.id), updatedRole);
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update Role:', error);
    }
    handleEditModalClose();
  };

  //Delete Function
  const [selectedDeleteRole, setSelectedDeleteRole] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (role) => {
    setSelectedDeleteRole(role);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedDeleteRole(null);
    setOpenDeleteModal(false);
  };
  const handleDeleteRole = async (deleteRole) => {
    try {
      await router.delete(window.route("roles.delete", deleteRole.id));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete Role:', error);
    }
    handleEditModalClose();
  };

  //Add Function
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleAddRole = async(addRole ) => {
    try {
      await router.post(window.route("roles.store"), addRole);
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add Role:', error);
    }
    handleAddModalClose();
  };

  return (
    <div>
      <Head>
        <title>Roles</title>
        <meta name="description" content="List of Roles" />
      </Head>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || user_permissions.includes("roles.store")) && (
              <Button variant="outlined" color="primary" onClick={() => handleAddModalOpen()}>Add Roles</Button>
            )}
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
          <Table  size={'small'} sx={{minWidth: 650}} aria-label="Roles table">
            <TableHead>
              <TableRow>
                {updatedHeader.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={sort === headCell.id}
                        direction={sort === headCell.id ? order : 'asc'}
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
                  {(user_auth.role.slug === "admin" || ['roles.update', 'roles.delete'].some(element => user_permissions.includes(element))) && (
                    <TableCell>
                      {(user_auth.role.slug === "admin" || user_permissions.includes("roles.update")) && (
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(role)}>Edit</Button>
                      )}{" "}
                      {(user_auth.role.slug === "admin" || user_permissions.includes("roles.delete")) && (
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteModalOpen(role)}>Delete</Button>
                      )}
                    </TableCell>
                    )}
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
      <EditRoleDialog open={openEditModal} close={handleEditModalClose} selectedRole={selectedRole} handleEditRole={handleEditRole} />
      <AddRoleDialog open={openAddModal} close={handleAddModalClose} handleAddRole={handleAddRole}  />
      <DeleteRoleDialog open={openDeleteModal} close={handleDeleteModalClose} selectedRole={selectedDeleteRole} handleDeleteRole={handleDeleteRole} />
    </div>
  );
};


const validationEditSchema = Yup.object({
  slug: Yup.string().required('Slug is required'),
  name: Yup.string().required('Name is required'),
});


const validationAddSchema = Yup.object({
  slug: Yup.string().required('Slug is required'),
  name: Yup.string().required('Name is required'),
});

const EditRoleDialog = ({ open, close, selectedRole, handleEditRole }) => {
  const formik = useFormik({
    initialValues: {
      slug: '',
      name: '',
    },
    validationSchema: validationEditSchema,
    onSubmit: (values) => {
      handleEditRole(values);
    },
  });
  useEffect(() => {
    if (selectedRole) {
      formik.setValues({
        slug: selectedRole.slug || '',
        name: selectedRole.name || '',
      });
    }
  }, [selectedRole]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Edit Role</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Slug"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('slug')}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}
          />
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddRoleDialog = ({open, close, handleAddRole }) => {
  const formik = useFormik({
    initialValues: {
      slug: '',
      name: '',
    },
    validationSchema: validationAddSchema,
    onSubmit: (values,{ resetForm }) => {
      handleAddRole(values );
      resetForm();
    },
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Slug"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('slug')}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}
          />
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DeleteRoleDialog = ({open, close, selectedRole, handleDeleteRole }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Delete Role</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          Are you sure you want to delete Role {selectedRole ? selectedRole.name : ''}?
        </Typography>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit" onClick={ () => handleDeleteRole(selectedRole)} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

RolesPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default RolesPage;
