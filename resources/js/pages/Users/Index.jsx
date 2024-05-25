import React, {useEffect, useState} from "react";
import { Head, router } from "@inertiajs/react";

//@mui
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
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

//components
import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";

//utils
import { formatDate } from "@/utils/dateId";

//third party
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UsersPage = ({ results, option , roles, user_auth,  user_permissions }) => {


  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'username', label: 'Username', alignRight: false ,sortable: true},
    { id: 'name', label: 'Name', alignRight: false ,sortable: true},
    { id: 'email', label: 'Email', alignRight: false ,sortable: true},
    { id: 'api_key', label: 'Api Key', alignRight: false ,sortable: false},
    { id: 'api_active', label: 'Api Active', alignRight: false ,sortable: false},
    { id: 'created_at', label: 'Created At', alignRight: false ,sortable: true},
    { id: 'updated_at', label: 'Updated At', alignRight: false ,sortable: true},
  ]

  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['users.update', 'users.delete'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('users.index');
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEditModalOpen = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setSelectedUser(null);
    setOpenEditModal(false);
  };
  const handleEditUser = async(updatedUser) => {
    try {
      await router.post(window.route("users.update", selectedUser.id), updatedUser);
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    handleEditModalClose();
  };

  //Delete Function
  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (user) => {
    setSelectedDeleteUser(user);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedDeleteUser(null);
    setOpenDeleteModal(false);
  };
  const handleDeleteUser = async (deleteUser) => {
    try {
      await router.delete(window.route("users.delete", deleteUser.id));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
    handleDeleteModalClose();
  };

  //Add Function
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleAddUser = async(addUser ) => {
    try {
      await router.post(window.route("users.store"), addUser);
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add user:', error);
    }
    handleAddModalClose();
  };

  return (
    <div>
      <Head>
        <title>Users</title>
        <meta name="description" content="List of users" />
      </Head>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2} alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || user_permissions.includes("users.store")) && (
              <Button variant="outlined" color="primary" onClick={() => handleAddModalOpen()}>Add Users</Button>
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
          <Table size={'small'} sx={{minWidth: 650}} aria-label="users table">
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
              {results.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.api_key}</TableCell>
                  <TableCell>{user.api_active ? <Chip color="success" label="Yes"/> :
                    <Chip color="error" label="No"/>}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.updated_at)}</TableCell>
                  {(user_auth.role.slug === "admin" || ['users.update', 'users.delete'].some(element => user_permissions.includes(element))) && (
                    <TableCell>
                      {(user_auth.role.slug === "admin" || user_permissions.includes("users.update")) && (
                        <Button variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(user)}>Edit</Button>
                      )}{" "}
                      {(user_auth.role.slug === "admin" || user_permissions.includes("users.delete")) && (
                        <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteModalOpen(user)}>Delete</Button>
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
      <EditUserDialog open={openEditModal} close={handleEditModalClose} selectedUser={selectedUser} handleEditUser={handleEditUser} roles={roles}/>
      <AddUserDialog open={openAddModal} close={handleAddModalClose} handleAddUser={handleAddUser} roles={roles} />
      <DeleteUserDialog open={openDeleteModal} close={handleDeleteModalClose} selectedUser={selectedDeleteUser} handleDeleteUser={handleDeleteUser} />

    </div>
  );
};


const validationEditSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  role_id: Yup.string().required('Role ID is required'),
});


const validationAddSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
  role_id: Yup.string().required('Role ID is required'),
});

const EditUserDialog = ({ open, close, selectedUser, handleEditUser , roles}) => {

  const [showEditPassword, setShowEditPassword] = useState(false);
  const handleClickShowEditPassword = () => {
    setShowEditPassword(!showEditPassword);
  };

  const handleMouseDownEditPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      api_active: false,
      api_key: '',
      role_id: '',
    },
    validationSchema: validationEditSchema,
    onSubmit: (values) => {
      handleEditUser(values);
    },
  });
  useEffect(() => {
    if (selectedUser) {
      formik.setValues({
        name: selectedUser.name || '',
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        password: '',
        api_active: Boolean(selectedUser.api_active),
        api_key: selectedUser.api_key || '',
        role_id: selectedUser.role_id || '',
      });
    }
  }, [selectedUser]);
  const generateApiKey = () => {
    const length = 32;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
      apiKey += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    formik.setFieldValue('api_key', apiKey);
  };
  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Username"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('username')}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <FormControl
            fullWidth
            sx={{my: 2}}
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel size="small" htmlFor='outlined-adornment-password-login'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password-login'
              type={showEditPassword ? 'text' : 'password'}
              value={formik.values.password}
              name='password'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowEditPassword}
                    onMouseDown={handleMouseDownEditPassword}
                    edge='end'
                    size='large'
                  >
                    {showEditPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText
                error
                id='standard-weight-helper-text-password-login'
              >
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.api_active}
                {...formik.getFieldProps('api_active')}
              />
            }
            label="API Active"
          />
          <TextField
            label="API Key"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('api_key')}
            error={formik.touched.api_key && Boolean(formik.errors.api_key)}
            helperText={formik.touched.api_key && formik.errors.api_key}
          />
          <Button onClick={generateApiKey} variant="contained" color="secondary" style={{ marginTop: '8px', marginBottom: '16px' }}>
            Generate API Key
          </Button>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Role ID</InputLabel>
            <Select
              label="Role ID"
              value={formik.values.role_id}
              onChange={formik.handleChange}
              name="role_id"
              error={formik.touched.role_id && Boolean(formik.errors.role_id)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.role_id && formik.errors.role_id && (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.role_id}</div>
            )}
          </FormControl>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddUserDialog = ({open, close, handleAddUser , roles}) => {
  const [showAddPassword, setShowAddPassword] = useState(false);
  const handleClickShowAddPassword = () => {
    setShowAddPassword(!showAddPassword);
  };

  const handleMouseDownAddPassword = (event) => {
    event.preventDefault();
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      api_active: false,
      api_key: '',
      role_id: '',
    },
    validationSchema: validationAddSchema,
    onSubmit: (values,{ resetForm }) => {
      handleAddUser(values );
      resetForm();
    },
  });

  const generateApiKey = () => {
    const length = 32;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
      apiKey += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    formik.setFieldValue('api_key', apiKey);
  };
  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Username"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('username')}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <FormControl
            fullWidth
            sx={{my: 2}}
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel size="small" htmlFor='outlined-adornment-password-login'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password-login'
              type={showAddPassword ? 'text' : 'password'}
              value={formik.values.password}
              name='password'
              size="small"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowAddPassword}
                    onMouseDown={handleMouseDownAddPassword}
                    edge='end'
                    size='large'
                  >
                    {showAddPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText
                error
                id='standard-weight-helper-text-password-login'
              >
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.api_active}
                {...formik.getFieldProps('api_active')}
              />
            }
            label="API Active"
          />
          <TextField
            label="API Key"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('api_key')}
            error={formik.touched.api_key && Boolean(formik.errors.api_key)}
            helperText={formik.touched.api_key && formik.errors.api_key}
          />
          <Button onClick={generateApiKey} variant="contained" color="secondary" style={{ marginTop: '8px', marginBottom: '16px' }}>
            Generate API Key
          </Button>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Role ID</InputLabel>
            <Select
              label="Role ID"
              value={formik.values.role_id}
              onChange={formik.handleChange}
              name="role_id"
              error={formik.touched.role_id && Boolean(formik.errors.role_id)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.role_id && formik.errors.role_id && (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.role_id}</div>
            )}
          </FormControl>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DeleteUserDialog = ({open, close, selectedUser, handleDeleteUser }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Delete User</DialogTitle>
      <DialogContent>
          <Typography variant="h5">
            Are you sure you want to delete user {selectedUser ? selectedUser.name : ''}?
          </Typography>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" onClick={ () => handleDeleteUser(selectedUser)} color="error" variant="contained">Delete</Button>
          </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

UsersPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default UsersPage;
