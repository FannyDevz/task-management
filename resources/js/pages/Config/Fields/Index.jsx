import React, {useEffect, useState} from "react";
import { Head, router } from "@inertiajs/react";
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
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormHelperText,
  FormLabel,
  MenuItem,
  Select
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";

import { formatDate } from "@/utils/dateId";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {bool, boolean} from "yup";

const ConfigFieldPage = ({ results, option , category ,user_auth,  user_permissions }) => {

  const fieldtype = [
    { id: 'text', label: 'Text' },
    { id: 'textarea', label: 'Textarea' },
    { id: 'number', label: 'Number' },
    { id: 'date', label: 'Date' },
  ]
  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'fieldname', label: 'Name', alignRight: false ,sortable: true},
    { id: 'fieldtype', label: 'Type', alignRight: false ,sortable: true},
    { id: 'detail', label: 'Detail', alignRight: false ,sortable: true},
    { id: 'order', label: 'Order', alignRight: false ,sortable: true},
    { id: 'hidden', label: 'Hidden', alignRight: false ,sortable: true},
    { id: 'required', label: 'Required', alignRight: false ,sortable: true},
  ]
  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['config.field.update', 'config.field.delete'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('config.field.index' , category.id);
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
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEditModalOpen = (config) => {
    setSelectedConfig(config);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setSelectedConfig(null);
    setOpenEditModal(false);
  };
  const handleEditConfig = async(updatedConfig) => {
    try {
      await router.post(window.route("config.field.update", category.id), updatedConfig);
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update Config:', error);
    }
    handleEditModalClose();
  };

  //Delete Function
  const [selectedDeleteConfig, setSelectedDeleteConfig] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (config) => {
    setSelectedDeleteConfig(config);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedDeleteConfig(null);
    setOpenDeleteModal(false);
  };
  const handleDeleteConfig = async (deleteConfig) => {
    try {
      await router.delete(window.route("config.field.delete",deleteConfig.id));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete Config:', error);
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

  const handleAddConfig = async(addConfig ) => {
    try {
      await router.post(window.route("config.field.store", category.id), addConfig);
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add Config:', error);
    }
    handleAddModalClose();
  };
  return (
    <div>
      <Head>
        <title>Config Fields </title>
        <meta name="description" content="List of Config Fields" />
      </Head>

      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || user_permissions.includes("config.field.store")) && (
              <Button variant="outlined" color="primary" onClick={() => handleAddModalOpen()}>Add Config Field</Button>
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
          <Table  size={'small'} sx={{minWidth: 650}} aria-label="Categories table">
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
              {results.data.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.id}</TableCell>
                  <TableCell>{config.fieldname}</TableCell>
                  <TableCell>
                    {fieldtype.find(type => type.id === config.fieldtype)?.label ?? config.fieldtype}
                  </TableCell>
                  <TableCell>{config.detail}</TableCell>
                  <TableCell>{config.order}</TableCell>
                  <TableCell>{config.hidden === 1 ? (<Chip color="primary" label="Yes" />) : (<Chip color="error" label="No" />)}</TableCell>
                  <TableCell>{config.required === 1 ? (<Chip color="primary" label="Yes" />) : (<Chip color="error" label="No" />)}</TableCell>
                   {(user_auth.role.slug === "admin" || ['config.field.update', 'config.field.delete'].some(element => user_permissions.includes(element))) && (
                    <TableCell>
                      {(user_auth.role.slug === "admin" || user_permissions.includes("config.field.update")) && (
                        <Button variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(config)}>Edit</Button>
                      )}{" "}
                      {(user_auth.role.slug === "admin" || user_permissions.includes("config.field.delete")) && (
                        <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteModalOpen(config)}>Delete</Button>
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
      <EditConfigDialog open={openEditModal} close={handleEditModalClose}  fieldtype={fieldtype}  selectedConfig={selectedConfig} handleEditConfig={handleEditConfig} />
      <AddConfigDialog open={openAddModal} close={handleAddModalClose} fieldtype={fieldtype} handleAddConfig={handleAddConfig}  />
      <DeleteConfigDialog open={openDeleteModal} close={handleDeleteModalClose} selectedConfig={selectedDeleteConfig} handleDeleteConfig={handleDeleteConfig} />
    </div>
  );
};




const EditConfigDialog = ({ open, close , fieldtype ,selectedConfig, handleEditConfig }) => {

  const validationEditSchema = Yup.object({
    fieldname: Yup.string().required('Name is required'),
    fieldtype: Yup.string().required('Type is required'),
    order: Yup.number().required('Order is required'),
  });

  const formik = useFormik({
    initialValues: {
      id : 0,
      fieldname: '',
      fieldtype: 'text',
      detail: '',
      order: '',
      hidden: false,
      required: false,
    },
    enableReinitialize: true,
    validationSchema: validationEditSchema,
    onSubmit: (values) => {
      handleEditConfig(values);
    },
  });
  useEffect(() => {
    if (selectedConfig) {
      formik.setValues({
        id: selectedConfig.id || 0,
        fieldname: selectedConfig.fieldname || '',
        fieldtype: selectedConfig.fieldtype || 'text',
        detail: selectedConfig.detail ?? '',
        order: selectedConfig.order || '',
        hidden: selectedConfig.hidden || false,
        required: selectedConfig.required || false,
      });
    }
  }, [selectedConfig]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Edit Config</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('fieldname')}
            error={formik.touched.fieldname && Boolean(formik.errors.fieldname)}
            helperText={formik.touched.fieldname && formik.errors.fieldname}
          />
          <FormControl fullWidth sx={{mt:2}}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              size="small"
              value={formik.values.fieldtype}
              onChange={formik.handleChange}
              error={formik.touched.fieldtype && Boolean(formik.errors.fieldtype)}
            >
              {fieldtype.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
              ))}
            </Select>
            {formik.touched.fieldtype && formik.errors.fieldtype && (
              <FormHelperText error>{formik.errors.fieldtype}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Detail"
            size="small"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('detail')}
            error={formik.touched.detail && Boolean(formik.errors.detail)}
            helperText={formik.touched.detail && formik.errors.detail}
          />
          <TextField
            label="Order"
            size="small"
            fullWidth
            type="number"
            margin="normal"
            {...formik.getFieldProps('order')}
            error={formik.touched.order && Boolean(formik.errors.order)}
            helperText={formik.touched.order && formik.errors.order}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("hidden", true);
                  } else {
                    formik.setFieldValue( "hidden", false);
                  }
                }}
              />
            }
            label={
              <FormLabel>Hidden</FormLabel>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("required", true);
                  } else {
                    formik.setFieldValue( "required", false);
                  }
                }}
              />
            }
            label={
              <FormLabel>Required</FormLabel>
            }
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

const AddConfigDialog = ({open, close ,fieldtype, handleAddConfig }) => {

  const validationAddSchema = Yup.object({
    fieldname: Yup.string().required('Name is required'),
    fieldtype: Yup.string().required('Type is required'),
    order: Yup.number().required('Order is required'),
  });

  const formik = useFormik({
    initialValues: {
      fieldname: '',
      fieldtype: 'text',
      detail: '',
      order: '',
      hidden: false,
      required: false,
    },
    enableReinitialize: true,
    validationSchema: validationAddSchema,
    onSubmit: (values,{ resetForm }) => {
      handleAddConfig(values);
      resetForm();
    },
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
      <DialogTitle>Add Config</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('fieldname')}
            error={formik.touched.fieldname && Boolean(formik.errors.fieldname)}
            helperText={formik.touched.fieldname && formik.errors.fieldname}
          />
          <FormControl fullWidth sx={{mt:2}}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              size="small"
              value={formik.values.fieldtype}
              onChange={formik.handleChange}
              error={formik.touched.fieldtype && Boolean(formik.errors.fieldtype)}
            >
              {fieldtype.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
              ))}
            </Select>
            {formik.touched.fieldtype && formik.errors.fieldtype && (
              <FormHelperText error>{formik.errors.fieldtype}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Detail"
            size="small"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('detail')}
            error={formik.touched.detail && Boolean(formik.errors.detail)}
            helperText={formik.touched.detail && formik.errors.detail}
          />
          <TextField
            label="Order"
            size="small"
            fullWidth
            placeholder="1"
            type="number"
            margin="normal"
            {...formik.getFieldProps('order')}
            error={formik.touched.order && Boolean(formik.errors.order)}
            helperText={formik.touched.order && formik.errors.order}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("hidden", true);
                  } else {
                    formik.setFieldValue( "hidden", false);
                  }
                }}
              />
            }
            label={
              <FormLabel>Hidden</FormLabel>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("required", true);
                  } else {
                    formik.setFieldValue( "required", false);
                  }
                }}
              />
            }
            label={
              <FormLabel>Required</FormLabel>
            }
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

const DeleteConfigDialog = ({open, close, selectedConfig, handleDeleteConfig }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Delete Config</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          Are you sure you want to delete Config {selectedConfig ? selectedConfig.name : ''}?
        </Typography>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit" onClick={ () => handleDeleteConfig(selectedConfig)} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

ConfigFieldPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default ConfigFieldPage;
