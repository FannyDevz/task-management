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
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {Delete, RemoveCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const CategoriesPage = ({ results, option , category ,user_auth,  user_permissions }) => {

  const fieldtype = [
    { id: 'dropdown', label: 'Dropdown' },
    { id: 'boolean', label: 'Yes/No' },
    { id: 'radio', label: 'Radio' },
    // { id: 'number-range', label: 'Number Range' },
  ]
  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'formname', label: 'Name', alignRight: false ,sortable: true},
    { id: 'formtype', label: 'Type', alignRight: false ,sortable: true},
    { id: 'detail', label: 'Detail', alignRight: false ,sortable: true},
    { id: 'order', label: 'Order', alignRight: false ,sortable: true},
    { id: 'hidden', label: 'Hidden', alignRight: false ,sortable: true},
    { id: 'required', label: 'Required', alignRight: false ,sortable: true},
  ]
  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['config.option.update', 'config.option.delete'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('config.option.index' , category.id);
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
      await router.post(window.route("config.option.update", category.id), updatedConfig);
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
      await router.delete(window.route("config.option.delete",deleteConfig.id));
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
      await router.post(window.route("config.option.store", category.id), addConfig);
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add Config:', error);
    }
    handleAddModalClose();
  };

  return (
    <div>
      <Head>
        <title>Config Options</title>
        <meta name="description" content="List of Config Options" />
      </Head>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || user_permissions.includes("config.option.store")) && (
              <Button variant="outlined" color="primary" onClick={() => handleAddModalOpen()}>Add Config Option</Button>
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
          <Table size={'small'} sx={{minWidth: 650}} aria-label="Categories table">
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
                  <TableCell>{config.formname}</TableCell>
                  <TableCell>
                    {fieldtype.find(type => type.id === config.formtype)?.label ?? config.formtype}
                  </TableCell>
                  <TableCell>{config.detail}</TableCell>
                  <TableCell>{config.order}</TableCell>
                  <TableCell>{config.hidden === 1 ? (<Chip color="primary" label="Yes" />) : (<Chip color="error" label="No" />)}</TableCell>
                  <TableCell>{config.required === 1 ? (<Chip color="primary" label="Yes" />) : (<Chip color="error" label="No" />)}</TableCell>
                  {(user_auth.role.slug === "admin" || ['config.option.update', 'config.option.delete'].some(element => user_permissions.includes(element))) && (
                    <TableCell>
                      {(user_auth.role.slug === "admin" || user_permissions.includes("config.option.update")) && (
                        <Button variant="outlined" size="small" color="primary" onClick={() => handleEditModalOpen(config)}>Edit</Button>
                      )}{" "}
                      {(user_auth.role.slug === "admin" || user_permissions.includes("config.option.delete")) && (
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
  const [options, setOptions] = useState(selectedConfig?.options ?? [
    {
      optionname: '',
      order: 1,
      hidden: false,
    },
  ]);

  const validationEditSchema = Yup.object({
    formname: Yup.string().required('Name is required'),
    formtype: Yup.string().required('Type is required'),
    order: Yup.number().required('Order is required'),
  });

  const formik = useFormik({
    initialValues: {
      id : 0,
      formname: '',
      formtype: 'dropdown',
      detail: '',
      order: 1,
      hidden: false,
      required: false,
    },
    enableReinitialize: true,
    validationSchema: validationEditSchema,
    onSubmit: (values) => {
      handleEditConfig({ ...values , options });
    },
  });
  useEffect(() => {
    if (selectedConfig ) {
      formik.setValues({
        id: selectedConfig.id || 0,
        formname: selectedConfig.formname || '',
        formtype: selectedConfig.formtype || 'dropdown',
        detail: selectedConfig.detail ?? '',
        order: selectedConfig.order || 1,
        hidden: selectedConfig.hidden === 1,
        required: selectedConfig.hidden === 1,
      });
      setOptions(selectedConfig?.options ?? [
        {
          optionname: '',
          order: 1,
          hidden: false,
        },
      ]);
    }
  }, [selectedConfig]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        optionname: '',
        order: 1,
        hidden: false,
      },
    ]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].optionname = value;
    setOptions(newOptions);
  };
  const handleOptionOrderChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].order = value;
    setOptions(newOptions);
  };

  const handleOptionHiddenChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].hidden = value;
    setOptions(newOptions);
  };

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

            {...formik.getFieldProps('formname')}
            error={formik.touched.formname && Boolean(formik.errors.formname)}
            helperText={formik.touched.formname && formik.errors.formname}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              size="small"
              name="formtype"

              value={formik.values.formtype}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue("formtype", e.target.value);
              }}
              error={formik.touched.formtype && Boolean(formik.errors.formtype)}
            >
              {fieldtype.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
              ))}
            </Select>
            {formik.touched.formtype && formik.errors.formtype && (
              <FormHelperText error>{formik.errors.formtype}</FormHelperText>
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
            placeholder="1"
            {...formik.getFieldProps('order')}
            error={formik.touched.order && Boolean(formik.errors.order)}
            helperText={formik.touched.order && formik.errors.order}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...formik.getFieldProps('hidden')}
                checked={formik.values.hidden}
              />
            }
            label={<FormLabel>Hidden</FormLabel>}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...formik.getFieldProps('required')}
                checked={formik.values.required}
              />
            }
            label={<FormLabel>Required</FormLabel>}
          />
          <Grid item xs={12}>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
              <Button
                variant="outlined"
                disableRipple
                disabled
              >
                Configuration
              </Button>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            </Box>
          </Grid>
          {formik.values.formtype === 'dropdown' || formik.values.formtype === 'radio' ? (
            <div>
              <Button onClick={handleAddOption}>Add Option</Button>
              {options.map((option, index) => (

                <Grid  key={index} container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label={`Option ${index + 1}`}
                      size="small"
                      fullWidth
                      required
                      placeholder="Option 1"
                      margin="normal"
                      value={option.optionname || ''}
                      onChange={(e) => handleOptionNameChange(index, e.target.value, 'optionname')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label={`Order ${index + 1}`}
                      size="small"
                      type="number"
                      required
                      fullWidth
                      placeholder="1"
                      margin="normal"
                      value={option.order || ''}
                      onChange={(e) => handleOptionOrderChange(index, e.target.value, 'order')}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={option.hidden === 1}
                          onChange={(e) => handleOptionHiddenChange(index, e.target.checked, 'hidden')}
                        />
                      }
                      label={<FormLabel>Hidden</FormLabel>}
                    /> </Grid>
                  <Grid item xs={6} md={1}>
                    <IconButton onClick={() => handleRemoveOption(index)} size="small" color="error"><Delete/></IconButton>
                  </Grid>
                </Grid>

              ))}
            </div>
          ) : null}
          {formik.values.formtype === 'boolean' ? (
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Yes Value"
                  placeholder="Yes"
                  size="small"
                  required
                  fullWidth
                  margin="normal"
                  value={options?.[0]?.optionname || ''}
                  onChange={(e) => handleOptionNameChange(0, e.target.value, 'optionname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="No Value"
                  required
                  size="small"
                  placeholder="No"
                  fullWidth
                  margin="normal"
                  value={options?.[1]?.optionname || ''}
                  onChange={(e) => handleOptionNameChange(1, e.target.value, 'optionname')}
                />
              </Grid>
            </Grid>
          ) : null}
          {formik.values.formtype === 'number-range' ? (
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>

                <TextField
                  label="Start Value"
                  size="small"
                  required
                  fullWidth
                  placeholder="1"
                  margin="normal"
                  type="number"
                  value={options?.[0]?.optionname || ''}
                  onChange={(e) => handleOptionNameChange(0, e.target.value, 'optionname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Value"
                  size="small"
                  fullWidth
                  placeholder="1000"
                  required
                  margin="normal"
                  type="number"
                  value={options?.[1]?.optionname || ''}
                  onChange={(e) => handleOptionNameChange(1, e.target.value, 'optionname')}
                />
              </Grid>
            </Grid>
          ) : null}
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

  const [options, setOptions] = useState([
    {
      optionname: '',
      order: '',
      hidden: false,
    },
  ]);

  const validationAddSchema = Yup.object({
    formname: Yup.string().required('Name is required'),
    formtype: Yup.string().required('Type is required'),
    order: Yup.number().required('Order is required'),
  });

  const formik = useFormik({
    initialValues: {
      formname: '',
      formtype: 'dropdown',
      detail: '',
      order: 1,
      hidden: false,
      required: false,
    },
    enableReinitialize: true,
    validationSchema: validationAddSchema,
    onSubmit: (values, { resetForm }) => {
      handleAddConfig({ ...values , options });
      resetForm();
    },
  });

  useEffect(() => {
    if (formik.values.formtype === 'dropdown' || formik.values.formtype === 'radio') {
      setOptions([
        { optionname: '', order: 1, hidden: false }
      ]);
    } else if (formik.values.formtype === 'number-range') {
      setOptions([
        { optionname: '', order: 1, hidden: false },
        { optionname: '', order: 2, hidden: false },
      ]);
    } else if (formik.values.formtype === 'boolean') {
      setOptions([
        { optionname: '', order: 1, hidden: false },
        { optionname: '', order: 2, hidden: false },
      ]);
    } else {
      setOptions([]);
    }
  }, [formik.values.formtype]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        optionname: '',
        order: options.length + 1,
        hidden: false,
      },
    ]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].optionname = value;
    setOptions(newOptions);
  };
  const handleOptionOrderChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].order = value;
    setOptions(newOptions);
  };

  const handleOptionHiddenChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].hidden = value;
    setOptions(newOptions);
  };

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
            {...formik.getFieldProps('formname')}
            error={formik.touched.formname && Boolean(formik.errors.formname)}
            helperText={formik.touched.formname && formik.errors.formname}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              size="small"

              name="formtype"
              value={formik.values.formtype}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue("formtype", e.target.value);
              }}
              error={formik.touched.formtype && Boolean(formik.errors.formtype)}
            >
              {fieldtype.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
              ))}
            </Select>
            {formik.touched.formtype && formik.errors.formtype && (
              <FormHelperText error>{formik.errors.formtype}</FormHelperText>
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
                {...formik.getFieldProps('hidden')}
                checked={formik.values.hidden}
              />
            }
            label={<FormLabel>Hidden</FormLabel>}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...formik.getFieldProps('required')}
                checked={formik.values.required}
              />
            }
            label={<FormLabel>Required</FormLabel>}
          />
          <Grid item xs={12}>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                <Button
                  variant="outlined"
                  disableRipple
                  disabled
                >
                  Configuration
                </Button>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            </Box>
          </Grid>
          {formik.values.formtype === 'dropdown' || formik.values.formtype === 'radio' ? (
            <div>
              <Button onClick={handleAddOption}>Add Option</Button>
              {options.map((option, index) => (

                  <Grid  key={index} container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label={`Option ${index + 1}`}
                        size="small"
                        fullWidth
                        required
                        placeholder={`Option ${index + 1}`}
                        margin="normal"
                        value={option.optionname || ''}
                        onChange={(e) => handleOptionNameChange(index, e.target.value, 'optionname')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label={`Order ${index + 1}`}
                        size="small"
                        type="number"
                        fullWidth
                        required
                        placeholder="1"
                        margin="normal"
                        value={option.order || 1}
                        onChange={(e) => handleOptionOrderChange(index, e.target.value, 'order')}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={option.hidden}
                            onChange={(e) => handleOptionHiddenChange(index, e.target.checked, 'hidden')}
                          />
                        }
                        label={<FormLabel>Hidden</FormLabel>}
                      /> </Grid>
                    <Grid item xs={6} md={1}>
                      <IconButton onClick={() => handleRemoveOption(index)} size="small" color="error"><Delete/></IconButton>
                    </Grid>
                  </Grid>

              ))}
            </div>
          ) : null}
          {formik.values.formtype === 'boolean' ? (
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>
              <TextField
                label="Yes Value"
                placeholder="Yes"
                size="small"
                fullWidth
                required
                margin="normal"
                value={options?.[0]?.optionname || ''}
                onChange={(e) => handleOptionNameChange(0, e.target.value, 'optionname')}
               />
              </Grid>
              <Grid item xs={12} md={6}>
              <TextField
                label="No Value"
                size="small"
                placeholder="No"
                fullWidth
                required
                margin="normal"
                value={options?.[1]?.optionname || ''}
                onChange={(e) => handleOptionNameChange(1, e.target.value, 'optionname')}
               />
              </Grid>
            </Grid>
          ) : null}
          {formik.values.formtype === 'number-range' ? (
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>

              <TextField
                label="Start Value"
                size="small"
                fullWidth
                placeholder="1"
                margin="normal"
                type="number"
                required
                value={options?.[0]?.optionname || ''}
                onChange={(e) => handleOptionNameChange(0, e.target.value, 'optionname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                label="End Value"
                size="small"
                fullWidth
                placeholder="1000"
                margin="normal"
                type="number"
                required
                value={options?.[1]?.optionname || ''}
                onChange={(e) => handleOptionNameChange(1, e.target.value, 'optionname')}
                />
              </Grid>
            </Grid>
          ) : null}
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

CategoriesPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default CategoriesPage;
