import React, {useEffect, useState} from "react";
import { Head, router, Link } from "@inertiajs/react";
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
import MuiLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
//icons
import PostAddIcon from '@mui/icons-material/PostAdd';
import TuneIcon from '@mui/icons-material/Tune';
import {Settings} from "@mui/icons-material";

//component
import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";
//third party
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CategoriesPage = ({ results, option, roles, user_auth,  user_permissions }) => {
  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'name', label: 'Name', alignRight: false ,sortable: true},
    { id: 'info', label: 'Info', alignRight: false ,sortable: true},
    { id: 'default_point', label: 'Default Point', alignRight: false ,sortable: true},
    { id: 'roles', label: 'Roles', alignRight: false ,sortable: false},
  ]
  const actionHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };
  const configFieldHeader = { id: "config-fields", label: "Config Fields", alignRight: true, sortable: false };
  const configOptionHeader = { id: "config-options", label: "Config Options", alignRight: true, sortable: false };

  const addActionHeader = (user_auth.role.slug === "admin" || ['categories.update', 'categories.delete'].some(element => user_permissions.includes(element)))
    ? [...header, actionHeader]
    : header;

  const addFieldHeader = (user_auth.role.slug === "admin" || ['config.field.index'].some(element => user_permissions.includes(element)))
    ? [...addActionHeader, configFieldHeader]
    : addActionHeader;

  const updatedHeader = (user_auth.role.slug === "admin" || ['config.option.index'].some(element => user_permissions.includes(element)))
    ? [...addFieldHeader, configOptionHeader]
    : addFieldHeader;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('categories.index');
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEditModalOpen = (category) => {
    setSelectedCategory(category);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setSelectedCategory(null);
    setOpenEditModal(false);
  };
  const handleEditCategory = async(updatedCategory) => {
    try {
      await router.post(window.route("categories.update", selectedCategory.id), updatedCategory);
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update Category:', error);
    }
    handleEditModalClose();
  };

  //Delete Function
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (category) => {
    setSelectedDeleteCategory(category);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedDeleteCategory(null);
    setOpenDeleteModal(false);
  };
  const handleDeleteCategory = async (deleteCategory) => {
    try {
      await router.delete(window.route("categories.delete", deleteCategory.id));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete Category:', error);
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

  const handleAddCategory = async(addCategory ) => {
    try {
      await router.post(window.route("categories.store"), addCategory);
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add Category:', error);
    }
    handleAddModalClose();
  };

  return (
    <div>
      <Head>
        <title>Categories</title>
        <meta name="description" content="List of Categories" />
      </Head>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || user_permissions.includes("categories.store")) && (
              <Button variant="outlined" color="primary" onClick={() => handleAddModalOpen()}>Add Category</Button>
            )}
          </Grid>
          <Grid item  justifyContent="flex-end">
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
          <Table size="small" sx={{minWidth: 650}} aria-label="Categories table">
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
              {results.data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.info}</TableCell>
                  <TableCell>{category.default_point}</TableCell>
                  <TableCell>{category.roles.map((role) => (<span key={role.id}><Chip color="primary" label={role.name} />{" "}</span>))}</TableCell>
                  {(user_auth.role.slug === "admin" || ['categories.update', 'categories.delete'].some(element => user_permissions.includes(element))) && (
                    <TableCell>
                      {(user_auth.role.slug === "admin" || user_permissions.includes("categories.update")) && (
                        <Button variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(category)}>Edit</Button>
                      )}{" "}
                      {(user_auth.role.slug === "admin" || user_permissions.includes("categories.delete")) && (
                        <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteModalOpen(category)}>Delete</Button>
                      )}
                    </TableCell>
                  )}
                  {(user_auth.role.slug === "admin" || ['config.field.index', 'config.option.index'].some(element => user_permissions.includes(element))) && (
                    <>
                    {(user_auth.role.slug === "admin" || user_permissions.includes("config.field.index")) && (
                    <TableCell>
                        <IconButton component={Link} href={window.route("config.field.index", category.id)} color="primary" size="small">
                          <Settings/>
                        </IconButton>
                    </TableCell>
                    )}
                    {(user_auth.role.slug === "admin" || user_permissions.includes("config.option.index")) && (
                    <TableCell>
                        <IconButton component={Link} href={`${window.route("config.option.index", category.id)}`} color="primary" size="small">
                          <Settings/>
                        </IconButton>
                    </TableCell>
                    )}
                    </>
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
      <EditCategoryDialog open={openEditModal} close={handleEditModalClose} roles={roles} selectedCategory={selectedCategory} handleEditCategory={handleEditCategory} />
      <AddCategoryDialog open={openAddModal} close={handleAddModalClose} roles={roles} handleAddCategory={handleAddCategory}  />
      <DeleteCategoryDialog open={openDeleteModal} close={handleDeleteModalClose} selectedCategory={selectedDeleteCategory} handleDeleteCategory={handleDeleteCategory} />
    </div>
  );
};


const validationEditSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  default_point: Yup.number().required('Default Point is required'),
});


const validationAddSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  default_point: Yup.number().required('Default Point is required'),
});

const EditCategoryDialog = ({ open, close, roles ,selectedCategory, handleEditCategory }) => {
  const formik = useFormik({
    initialValues: {
      id:  '',
      name: '',
      info: '',
      roles: [],
      default_point: 0,
    },
    enableReinitialize: true,
    validationSchema: validationEditSchema,
    onSubmit: (values) => {
      const updatedRole = {
        ...selectedCategory,
        id: values.id,
        name: values.name,
        info: values.info,
        roles: values.roles,
      };
      handleEditCategory(updatedRole);
    },
  });
  useEffect(() => {
    if (selectedCategory) {
      formik.setValues({
        id: selectedCategory ? selectedCategory.id : '',
        name: selectedCategory.name ? selectedCategory.name : '',
        info: selectedCategory.info ? selectedCategory.info : '',
        roles: selectedCategory ? selectedCategory.roles.map((r) => r.id) : [],
        default_point: parseInt(selectedCategory.default_point) ? parseInt(selectedCategory.default_point) : 0,
      });
    }
  }, [selectedCategory]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Edit Category</DialogTitle>
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
            label="Info"
            size="small"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('info')}
            error={formik.touched.info && Boolean(formik.errors.info)}
            helperText={formik.touched.info && formik.errors.info}
          />
          <TextField
            label="Default Point"
            size="small"
            fullWidth
            type="number"
            margin="normal"
            {...formik.getFieldProps('default_point')}
            error={formik.touched.default_point && Boolean(formik.errors.default_point)}
            helperText={formik.touched.default_point && formik.errors.default_point}
          />
          <Grid container spacing={2}>
              {roles.map((role) => (
                <Grid item xs={3} key={role.id}>
                  <FormControlLabel

                    control={
                      <Checkbox
                        checked={formik.values.roles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue("roles", [...formik.values.roles, role.id]);
                          } else {
                            formik.setFieldValue("roles", formik.values.roles.filter((id) => id !== role.id));
                          }
                        }}
                      />
                    }
                    label={
                        <FormLabel>{role.name}</FormLabel>
                    }
                  />

                </Grid>
              ))}
          </Grid>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddCategoryDialog = ({open, close, roles,handleAddCategory }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      info: '',
      roles: [],
      default_point: 0,
    },
    enableReinitialize: true,
    validationSchema: validationAddSchema,
    onSubmit: (values,{ resetForm }) => {
      const updatedRole = {
        name: values.name,
        info: values.info,
        roles: values.roles,
        default_point: values.default_point,
      };
      handleAddCategory(updatedRole);
      resetForm();
    },
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Add Category</DialogTitle>
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
            label="Info"
            size="small"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('info')}
            error={formik.touched.info && Boolean(formik.errors.info)}
            helperText={formik.touched.info && formik.errors.info}
          />
          <TextField
            label="Default Point"
            size="small"
            fullWidth
            type="number"
            margin="normal"
            {...formik.getFieldProps('default_point')}
            error={formik.touched.default_point && Boolean(formik.errors.default_point)}
            helperText={formik.touched.default_point && formik.errors.default_point}
          />
          <Grid container spacing={2}>
            {roles.map((role) => (
              <Grid item xs={3} key={role.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("roles", [...formik.values.roles, role.id]);
                        } else {
                          formik.setFieldValue("roles", formik.values.roles.filter((id) => id !== role.id));
                        }
                      }}
                    />
                  }
                  label={
                      <FormLabel>{role.name}</FormLabel>
                  }
                />
              </Grid>
            ))}
          </Grid>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DeleteCategoryDialog = ({open, close, selectedCategory, handleDeleteCategory }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Delete Category</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          Are you sure you want to delete Category {selectedCategory ? selectedCategory.name : ''}?
        </Typography>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit" onClick={ () => handleDeleteCategory(selectedCategory)} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

CategoriesPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default CategoriesPage;
