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
import TextField from "@mui/material/TextField";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select} from "@mui/material";
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
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Search from "@/pages/Tasks/Search.jsx";

const TasksPage = ({ results, option , user_auth,  user_permissions }) => {

  const [selectedData , setSelectedData] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const status  = [
    {
      name :  'accepted',
      label : 'Accepted',
      color : 'success',
      size : 'small'
    },
    {
      name :  'new',
      label : 'New',
      color : 'error',
      size : 'small'
    },
    {
      name :  'archived',
      label : 'Archived',
      color : 'error',
      size : 'small'
    },
    {
      name :  'edited',
      label : 'Edited',
      color : 'warning',
      size : 'small'
    },
    {
      name: 'rejected',
      label: 'Rejected',
      color: 'secondary',
      size: 'small'
    },
    {
      name: 'pending',
      label: 'Pending',
      color: 'primary',
      size: 'small'
    }
  ]

  const getStatusLabel = (name) => {
    return status.find((status) => status.name === name).label;
  };

  const getStatusColor = (name) => {
    return status.find((status) => status.name === name).color ;
  };
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedData([]);
    } else {
      const allTaskIds = results.data.map(task => task.id);
      setSelectedData(allTaskIds);
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleSelectedData = (taskId) => {
    setSelectedData(prevSelected =>
      prevSelected.includes(taskId)
        ? prevSelected.filter(id => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  //Datatables
  const header = [
    { id: 'id', label: 'ID', alignRight: false ,sortable: true},
    { id: 'name', label: 'User Name', alignRight: false ,sortable: true},
    { id: 'category', label: 'Category', alignRight: false ,sortable: true},
    { id: 'subject', label: 'Subject', alignRight: false ,sortable: true},
    { id: 'point', label: 'Point', alignRight: false ,sortable: true},
    { id: 'extra_point', label: 'Extra Point', alignRight: false ,sortable: true},
    // { id: 'description', label: 'Description', alignRight: false ,sortable: true},
    { id: 'status', label: 'Status', alignRight: false ,sortable: true},
    { id: 'created_at', label: 'Created', alignRight: false ,sortable: true},
    { id: 'updated_at', label: 'Updated', alignRight: false ,sortable: true},
  ]

  const additionalHeader = { id: "actions", label: "Actions", alignRight: true, sortable: false };

  const updatedHeader = (user_auth.role.slug === "admin" || ['tasks.all.update', 'tasks.all.delete', 'tasks.all.detail'].some(element => user_permissions.includes(element)))
    ? [...header, additionalHeader]
    : header;

  const [search, setSearch] = useState(option.search || '');
  const [sort, setSort] = useState(option.sort);
  const [order, setOrder] = useState(option.order);
  const [limit, setLimit] = useState(parseInt(option.limit));
  const [page, setPage] = useState(results.current_page - 1);
  const url = window.route('tasks.all.index');
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

  //Delete Function
  const [selectedDeleteTask, setSelectedDeleteTask] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (user) => {
    setSelectedDeleteTask(user);
    setOpenDeleteModal(true);
  };


  const handleDeleteModalClose = () => {
    setSelectedDeleteTask(null);
    setOpenDeleteModal(false);
  };
  const handleDeleteTask = async (deleteTask) => {
    try {
      await router.delete(window.route("tasks.all.delete", deleteTask.id));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete Task:', error);
    }
    handleDeleteModalClose();
  };


  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleUpdateModalOpen = () => {
    setOpenUpdateModal(true)
  }
  const handleUpdateModalClose = () => {
    setOpenUpdateModal(false)
  };

  const handleUpdateTask = async (task) => {
    try {
      await router.post(window.route("tasks.change.status"),task);
      setSelectedData([]);
      // handleSelectAll()
      handleUpdateModalClose();
    } catch (error) {
      console.error('Failed to delete Task:', error);
    }
    handleUpdateModalClose();
  };


  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const handleBulkDeleteModalOpen = () => {
    setOpenBulkDeleteModal(true)
  }
  const handleBulkDeleteModalClose = () => {
    setOpenBulkDeleteModal(false)
  };

  const handleBulkDeleteTask = async (task) => {
    try {
      await router.post(window.route("tasks.bulk.delete"), {ids: task});
      setSelectedData([]);
      // handleSelectAll()
      handleBulkDeleteModalClose();
    } catch (error) {
      console.error('Failed to delete Task:', error);
    }
    handleBulkDeleteModalClose();
  };

// Inside your component
  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };
  return (
    <div>
      <Head>
        <title>Tasks</title>
        <meta name="description" content="List of tasks" />
      </Head>
      <MainCard content={false} sx={{mb : 2}}>
        <Search options={option} search={search} page={page} limit={limit} order={order} sort={sort} url={url} status={status} user_auth={user_auth} user_permissions={user_permissions}/>
      </MainCard>
      <MainCard>
        <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2} alignItems="center">
          <Grid item justifyContent="flex-start" >
            {(user_auth.role.slug === "admin" || (user_permissions.includes("tasks.store") && user_permissions.includes("tasks.add"))) && (
                <Button component={Link} href={window.route('tasks.add')} variant="outlined" color="primary" >Add Tasks</Button>
              )}
            {' '}
            {(user_auth.role.slug === "admin" || (user_permissions.includes("tasks.change.status") )) && (
              <Button onClick={() => handleUpdateModalOpen()} variant="outlined" color="secondary" >Update Tasks</Button>
              )}
            {' '}
            {(user_auth.role.slug === "admin" || (user_permissions.includes("tasks.bulk.delete"))) && (
              <Button onClick={() => handleBulkDeleteModalOpen()} variant="outlined" color="error" >Delete Tasks</Button>
            )}
          </Grid>
          <Grid item justifyContent="flex-end">
            {/*<TextField*/}
            {/*  label="Search"*/}
            {/*  variant="outlined"*/}
            {/*  size="small"*/}
            {/*  value={search}*/}
            {/*  onChange={(e) => setSearch(e.target.value)}*/}
            {/*  style={{marginRight: '8px'}}*/}
            {/*/>*/}
            {/*<Button variant="contained" color="primary" onClick={handleSearch}>*/}
            {/*  Search*/}
            {/*</Button>*/}
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table size="small" sx={{minWidth: 650}} aria-label="Tasks table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedData.length > 0 && selectedData.length < results.data.length}
                    checked={results.data.length > 0 && selectedData.length === results.data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
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
              {results.data.map((task) => (
                <React.Fragment key={task.id}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedData.includes(task.id)}
                        onChange={() => handleSelectedData(task.id)}
                      />
                    </TableCell>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.user.name}</TableCell>
                    <TableCell>{task.category.name}</TableCell>
                    <TableCell>{task.subject}</TableCell>
                    <TableCell>{task.point}</TableCell>
                    <TableCell>{task.extra_point}</TableCell>
                    {/*<TableCell>{task.description}</TableCell>*/}
                    <TableCell>
                      <Chip color={getStatusColor(task.status) ?? "primary"} label={getStatusLabel(task.status)} />
                    </TableCell>
                    <TableCell>{formatDate(task.created_at)}</TableCell>
                    <TableCell>{formatDate(task.updated_at)}</TableCell>
                    {(user_auth.role.slug === "admin" || ['tasks.all.update', 'tasks.all.delete', 'tasks.all.detail'].some(element => user_permissions.includes(element))) && (
                      <TableCell>
                        {(user_auth.role.slug === "admin" || user_permissions.includes("tasks.all.update")) && (
                          <Button component={Link} href={window.route("tasks.all.edit", task.id)} variant="outlined" size="small" color="primary">Edit</Button>
                        )}{" "}
                        {(user_auth.role.slug === "admin" || user_permissions.includes("tasks.all.delete")) && (
                          <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteModalOpen(task)}>Delete</Button>
                        )}{" "}
                        {(user_auth.role.slug === "admin" || user_permissions.includes("tasks.all.detail")) && (
                          <Button variant="outlined" size="small" onClick={() => handleRowClick(task.id)}>
                          {expandedRow === task.id ? "Hide Details" : "View Details"}
                        </Button>
                        )}{" "}
                      </TableCell>
                    )}
                  </TableRow>
                  {expandedRow === task.id && (
                    <ExpandedRow task={task} colSpan={updatedHeader.length + 1}/>
                  )}
                </React.Fragment>
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
      <DeleteTaskDialog open={openDeleteModal} close={handleDeleteModalClose} selectedTask={selectedDeleteTask} handleDeleteTask={handleDeleteTask} />
      <BulkDeleteTaskDialog open={openBulkDeleteModal} close={handleBulkDeleteModalClose} handleBulkDeleteTask={handleBulkDeleteTask} selectedData={selectedData} />
      <BulkUpdateTaskDialog status={status} open={openUpdateModal} close={handleUpdateModalClose} handleUpdateTask={handleUpdateTask} selectedData={selectedData} />
    </div>
  );
};
const ExpandedRow = ({task , colSpan}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ backgroundColor: '#f5f5f5' }}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} alignContent="center">
              <Grid container  >
                {task.attachment ? (
                  <Box border="1px solid" px={2} mx={5} borderColor="grey.300" borderRadius="10px" py={2}>
                    <img style={{ maxHeight: "200px", width: "auto" }} src={task.attachment} alt="Attachment" />
                  </Box>
                ) : (
                  <Box border="1px solid" px={2} mx={5} borderColor="grey.300" borderRadius="10px" py={2}>
                    <Typography variant="h6" color="error" align="center">
                      No Attachment
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} sm={9} md={9}>
              <Grid container spacing={2}>
                {/* Basic Details */}
                <Grid item xs={12}>
                  <List dense={true}>
                    <ListItem>
                      <Typography variant="body2">Subject: {task.subject}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2">Category: {task.category.name}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2">Description: {task.description}</Typography>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{alignItems: 'center', display: 'flex' }}>
                    <Divider sx={{flexGrow: 1}} orientation="horizontal"/>
                  </Box>
                </Grid>

                {/* Field Values */}
                <Grid item xs={12} sm={6}>
                  <List dense={true}>
                    {task.field_values.map((field, index) => (
                      <ListItem key={index}>
                        <Typography variant="body2">{field.field.fieldname}: {field.value}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Option Values */}
                <Grid item xs={12} sm={6}>
                  <List dense={true}>
                    {task.option_values.map((option, index) => (
                      <ListItem key={index}>
                        <Typography variant="body2">{option.form.formname}: {option.option.optionname}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </TableCell>

    </TableRow>
  );
}

const DeleteTaskDialog = ({open, close, selectedTask, handleDeleteTask }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Delete Task</DialogTitle>
      <DialogContent>
          <Typography variant="h5">
            Are you sure you want to delete Task {selectedTask ? selectedTask.id : ''}?
          </Typography>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" onClick={ () => handleDeleteTask(selectedTask)} color="error" variant="contained">Delete</Button>
          </DialogActions>
      </DialogContent>
    </Dialog>
  );
}


const BulkUpdateTaskDialog = ({open, close, handleUpdateTask, selectedData ,status}) => {
  const formik = useFormik({
    initialValues: {
      ids:[],
      status: '',
      extra_point : '',
    },
    onSubmit: (values,{ resetForm }) => {
      handleUpdateTask(values);
      resetForm();
    },
  });

  useEffect(() => {
    formik.setFieldValue('ids', selectedData ? selectedData.map(task => task) : []);
  } , [selectedData])

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Bulk Updated Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to update {selectedData.length} selected Task?
        </DialogContentText>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              name="status"
              error={formik.touched.status && Boolean(formik.errors.status)}
            >
              {status.map((status , index) => (
                <MenuItem key={index} value={status.name}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.status && formik.errors.status && (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.status}</div>
            )}
          </FormControl>
          <TextField
            label="Extra Point"
            size="small"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('extra_point')}
            error={formik.touched.extra_point && Boolean(formik.errors.extra_point)}
            helperText={formik.touched.extra_point && formik.errors.extra_point}
          />
          <Button onClick={close} variant="contained" color="secondary" style={{ marginTop: '8px', marginBottom: '16px' }}>
            Cancel
          </Button>{' '}
          <Button type="submit" disabled={selectedData.length < 1} variant="contained" color="primary" style={{ marginTop: '8px', marginBottom: '16px' }}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const BulkDeleteTaskDialog = ({open, close, handleBulkDeleteTask, selectedData }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={close}>
      <DialogTitle >Bulk Delete Task</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          Are you sure you want to delete total {selectedData.length ? selectedData.length : '0'} Tasks?
        </Typography>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit"  disabled={selectedData.length < 1} onClick={ () => handleBulkDeleteTask(selectedData)} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}


TasksPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default TasksPage;
