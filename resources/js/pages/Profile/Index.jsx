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
import {Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, MenuItem, Select} from "@mui/material";
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
import Visibility from "@mui/icons-material/Visibility.js";
import VisibilityOff from "@mui/icons-material/VisibilityOff.js";
import FormHelperText from "@mui/material/FormHelperText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";

const UsersPage = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSaveProfile = async (values) => {
    try {
      await router.post(window.route("profile.update"), values);
    } catch (error) {
      console.error("Failed to update Profile :", error);
    }
  }
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      api_active: false,
      api_key: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSaveProfile(values);
    },
  });

  useEffect(() => {
    formik.setFieldValue('name', user.name);
    formik.setFieldValue('username', user.username);
    formik.setFieldValue('email', user.email);
    formik.setFieldValue('api_active', user.api_active === 1);
    formik.setFieldValue('api_key', user.api_key);
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User Profile" />
      </Head>
      <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="flex-start">

        <Grid item xs={12} md={8} justifyContent="flex-start" >
          <MainCard>
            <Typography variant="h3" color="initial">Profile {user.name}</Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('username')}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                label="Email"
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
                <InputLabel htmlFor='outlined-adornment-password-login'>
                  Password
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password-login'
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  name='password'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                        size='large'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
                    disabled
                    checked={formik.values.api_active}
                    {...formik.getFieldProps('api_active')}
                  />
                }
                label="API Active"
              />
              <TextField
                disabled
                label="API Key"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('api_key')}
                error={formik.touched.api_key && Boolean(formik.errors.api_key)}
                helperText={formik.touched.api_key && formik.errors.api_key}
              />
              <DialogActions>
                <Button type="submit" color="primary" variant="contained">Save Profile</Button>
              </DialogActions>
            </form>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={4} justifyContent="flex-start" >
          <MainCard>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar alt={user.name} sx={{ width: 56, height: 56 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 2 }} />
              <List disablePadding>
                <ListItem disablePadding>
                  <Grid container alignItems="center" justifyContent="flex-start">
                    <Grid item xs={4}>
                      <Typography variant="subtitle1">Name</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="subtitle1">{user.name}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding>
                  <Grid container alignItems="center" justifyContent="flex-start">
                    <Grid item xs={4}>
                      <Typography variant="subtitle1">Username</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="subtitle1">{user.username}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding>
                  <Grid container alignItems="center" justifyContent="flex-start">
                    <Grid item xs={4}>
                      <Typography variant="subtitle1">Api Status</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="subtitle1">{user.api_active === 1 ? (<Chip label="Active" size="small" color="success" />) : (<Chip label="Inactive" size="small" color="error" />)}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding>
                  <Grid container alignItems="center" justifyContent="flex-start">
                    <Grid item xs={4}>
                      <Typography variant="subtitle1">Api Key</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="subtitle1"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      >{user.api_key}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </CardContent>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

UsersPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default UsersPage;
